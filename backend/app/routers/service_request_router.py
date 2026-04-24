from typing import Any, Dict, List, Optional
import re
from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import Response
from sqlalchemy import select, func
from sqlalchemy.orm import Session

from app.utils.db import get_db
from app.models.service_request import ServiceRequest
from app.models.user import User
from app.models.observation_request import ObservationRequest
from app.models.company import Company
from app.schemas.service_request_schema import (
    ServiceRequestCreate,
    ServiceRequestListOut,
    ServiceRequestOut,
    ServiceRequestUpdate,
)
from app.utils.permissions import require_permission
from app.utils.dependencies import get_current_user
from app.utils.observation_access import (
    assert_can_finalize_observations,
    assert_can_read_observation,
)
from app.utils.email_util import is_smtp_configured, send_email_with_pdf_attachment
from app.utils.observation_pdf import build_observations_pdf_bytes
from app.utils.privileged import user_has_full_access
from app.utils.user_permissions import get_effective_permission_codes

router = APIRouter(prefix="/service-requests", tags=["service-requests"])


def _form_get(fd: Optional[Dict[str, Any]], *keys: str):
    if not fd:
        return None
    for k in keys:
        v = fd.get(k)
        if v is not None and str(v).strip() != "":
            return str(v).strip()
    return None


_CUSTOMER_EMAIL_RE = re.compile(r"^[^\s@]+@[^\s@]+\.[^\s@]+$")


def _customer_email_from_form(fd: Optional[Dict[str, Any]]) -> Optional[str]:
    if not fd:
        return None
    for k in ("customerEmail", "email", "customer_email"):
        v = fd.get(k)
        if v is None:
            continue
        s = str(v).strip()
        if _CUSTOMER_EMAIL_RE.fullmatch(s):
            return s
    return None


def _validate_customer_email_required(fd: Optional[Dict[str, Any]]) -> None:
    """
    When form_data is submitted (intake form), customer email is required.
    Requests created without form_data (e.g. internal quick rows) skip this check.
    """
    if fd is None:
        return
    if not isinstance(fd, dict):
        raise HTTPException(
            status_code=422,
            detail="form_data must be an object with a valid customer email.",
        )
    em = _customer_email_from_form(fd)
    if not em:
        raise HTTPException(
            status_code=422,
            detail="Customer email is required (use customerEmail with a valid address).",
        )


def _validate_contact_or_raise(fd: Optional[Dict[str, Any]]) -> None:
    if not isinstance(fd, dict):
        return
    contact = _form_get(fd, "contact", "phone", "customerPhone")
    if not contact:
        return
    if not re.fullmatch(r"[0-9+\-() ]{7,25}", contact):
        raise HTTPException(
            status_code=422,
            detail="Invalid contact format. Use digits and + - ( ) only.",
        )
    digits = re.sub(r"\D", "", contact)
    if len(digits) < 7 or len(digits) > 15:
        raise HTTPException(
            status_code=422,
            detail="Invalid contact number length.",
        )


def _sync_customer_from_form(db: Session, fd: Optional[Dict[str, Any]]) -> Optional[int]:
    """
    Upsert customer record from service request form_data.
    Keeps customer master in sync when requests are created/updated.
    """
    if not isinstance(fd, dict):
        return None
    name = _form_get(fd, "customerName", "customer_name", "customer")
    if not name:
        return None
    phone = _form_get(fd, "contact", "phone", "customerPhone")
    email = _customer_email_from_form(fd)
    address = _form_get(fd, "customerAddress", "address", "customer_address")

    row = (
        db.query(Company)
        .filter(func.lower(Company.name) == name.strip().lower())
        .first()
    )
    if row:
        # Update known contact fields if newly provided.
        if phone and (not row.phone or str(row.phone).strip() == ""):
            row.phone = phone
        if email and (not row.email or str(row.email).strip() == ""):
            row.email = email
        if address and (not row.address or str(row.address).strip() == ""):
            row.address = address
        db.add(row)
        return row.id

    row = Company(
        name=name.strip(),
        phone=phone,
        email=email,
        address=address,
    )
    db.add(row)
    db.flush()
    return row.id


def _can_view_service_request(db: Session, user: User, row: ServiceRequest) -> bool:
    """Admin/list readers, full access, or engineer assigned to this request."""
    if user_has_full_access(db, user):
        return True
    if row.allotted_to_user_id is not None and row.allotted_to_user_id == user.id:
        return True
    codes = set(get_effective_permission_codes(db, user))
    return "service_request_read" in codes


def _observation_updated_at_map(
    db: Session, service_request_ids: List[int]
) -> dict[int, Optional[datetime]]:
    """Latest observation_requests.updated_at per service request (sheet saves)."""
    if not service_request_ids:
        return {}
    rows = db.execute(
        select(
            ObservationRequest.service_request_id,
            ObservationRequest.updated_at,
        ).where(ObservationRequest.service_request_id.in_(service_request_ids))
    ).all()
    return {int(sid): ts for sid, ts in rows}


def _enrich_service_request_out(db: Session, row: ServiceRequest) -> ServiceRequestOut:
    ts_map = _observation_updated_at_map(db, [row.id])
    base = ServiceRequestOut.model_validate(row)
    return base.model_copy(update={"observation_updated_at": ts_map.get(row.id)})


def _service_request_to_list_out(
    db: Session,
    r: ServiceRequest,
    *,
    has_observation: Optional[bool] = None,
    observation_updated_at: Optional[datetime] = None,
) -> ServiceRequestListOut:
    fd = r.form_data if isinstance(r.form_data, dict) else {}
    engineer = (
        db.get(User, r.allotted_to_user_id) if r.allotted_to_user_id else None
    )
    product = _form_get(fd, "productDetails", "product")
    if product and len(product) > 120:
        product = product[:117] + "…"
    return ServiceRequestListOut(
        id=r.id,
        service_type_key=r.service_type_key,
        status=r.status,
        allotted_to_user_id=r.allotted_to_user_id,
        engineer_name=engineer.username if engineer else None,
        customer_name=_form_get(fd, "customerName", "customer_name"),
        customer_email=_customer_email_from_form(fd),
        contact=_form_get(fd, "contact", "phone"),
        product_summary=product,
        created_at=r.created_at,
        has_observation=has_observation,
        observation_report_emailed_at=r.observation_report_emailed_at,
        observation_updated_at=observation_updated_at,
    )


@router.get("", response_model=list[ServiceRequestListOut])
def list_service_requests(
    db: Session = Depends(get_db),
    _permission=Depends(require_permission("service_request_read")),
):
    rows = (
        db.query(ServiceRequest)
        .order_by(ServiceRequest.created_at.desc())
        .all()
    )
    if not rows:
        return []
    ids = [r.id for r in rows]
    obs_ids = {
        o[0]
        for o in db.execute(
            select(ObservationRequest.service_request_id).where(
                ObservationRequest.service_request_id.in_(ids)
            )
        ).all()
    }
    obs_ts = _observation_updated_at_map(db, ids)
    out: list[ServiceRequestListOut] = []
    for r in rows:
        out.append(
            _service_request_to_list_out(
                db,
                r,
                has_observation=r.id in obs_ids,
                observation_updated_at=obs_ts.get(r.id),
            )
        )
    return out


@router.post("", response_model=ServiceRequestOut)
def create_service_request(
    body: ServiceRequestCreate,
    db: Session = Depends(get_db),
    _permission=Depends(require_permission("service_request_create")),
):
    if body.allotted_to_user_id is not None:
        u = db.get(User, body.allotted_to_user_id)
        if not u:
            raise HTTPException(status_code=400, detail="allotted_to_user_id not found")
    if body.form_data is not None:
        _validate_customer_email_required(body.form_data)
    _validate_contact_or_raise(body.form_data)
    customer_id = _sync_customer_from_form(db, body.form_data)
    row = ServiceRequest(
        service_type_key=body.service_type_key.strip(),
        customer_id=customer_id,
        allotted_to_user_id=body.allotted_to_user_id,
        status=body.status.strip() or "draft",
        form_data=body.form_data,
    )
    db.add(row)
    db.commit()
    db.refresh(row)
    return _enrich_service_request_out(db, row)


@router.get("/assigned-to-me", response_model=list[ServiceRequestListOut])
def list_service_requests_assigned_to_me(
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    """
    Service requests allotted to the current user (engineer work queue).
    Any authenticated user may call this; results are filtered to their assignments only.
    """
    rows = (
        db.query(ServiceRequest)
        .filter(ServiceRequest.allotted_to_user_id == user.id)
        .order_by(ServiceRequest.created_at.desc())
        .all()
    )
    if not rows:
        return []
    obs_ids = {
        o[0]
        for o in db.execute(
            select(ObservationRequest.service_request_id).where(
                ObservationRequest.service_request_id.in_([x.id for x in rows])
            )
        ).all()
    }
    sr_ids = [x.id for x in rows]
    obs_ts = _observation_updated_at_map(db, sr_ids)
    return [
        _service_request_to_list_out(
            db,
            r,
            has_observation=r.id in obs_ids,
            observation_updated_at=obs_ts.get(r.id),
        )
        for r in rows
    ]


@router.get("/{service_request_id}", response_model=ServiceRequestOut)
def get_service_request(
    service_request_id: int,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    row = db.get(ServiceRequest, service_request_id)
    if not row:
        raise HTTPException(status_code=404, detail="Service request not found")
    if not _can_view_service_request(db, user, row):
        raise HTTPException(status_code=403, detail="Permission denied")
    return _enrich_service_request_out(db, row)


@router.put("/{service_request_id}", response_model=ServiceRequestOut)
def update_service_request(
    service_request_id: int,
    body: ServiceRequestUpdate,
    db: Session = Depends(get_db),
    _permission=Depends(require_permission("service_request_update")),
):
    row = db.get(ServiceRequest, service_request_id)
    if not row:
        raise HTTPException(status_code=404, detail="Service request not found")

    data = body.model_dump(exclude_unset=True)
    if "service_type_key" in data and data["service_type_key"] is not None:
        row.service_type_key = data["service_type_key"].strip()
    if "allotted_to_user_id" in data:
        uid = data["allotted_to_user_id"]
        if uid is not None:
            u = db.get(User, uid)
            if not u:
                raise HTTPException(status_code=400, detail="allotted_to_user_id not found")
        row.allotted_to_user_id = uid
    if "status" in data and data["status"] is not None:
        row.status = (data["status"] or "").strip() or row.status
    if "form_data" in data:
        _validate_customer_email_required(data["form_data"])
        _validate_contact_or_raise(data["form_data"])
        row.form_data = data["form_data"]
        row.customer_id = _sync_customer_from_form(db, data["form_data"])

    db.commit()
    db.refresh(row)
    return _enrich_service_request_out(db, row)


@router.post("/{service_request_id}/email-observation-report")
def email_observation_report_pdf(
    service_request_id: int,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
    _perm=Depends(require_permission("observation_read")),
):
    """
    Build a PDF from stored observation JSON and email it to the customer address
    on the service request form (customerEmail / email / customer_email).
    """
    row = db.get(ServiceRequest, service_request_id)
    if not row:
        raise HTTPException(status_code=404, detail="Service request not found")
    assert_can_read_observation(db, user, row)
    obs = (
        db.query(ObservationRequest)
        .filter(ObservationRequest.service_request_id == service_request_id)
        .first()
    )
    if not obs:
        raise HTTPException(
            status_code=400,
            detail="No observation record for this service request",
        )
    data = obs.observations_json if isinstance(obs.observations_json, dict) else {}
    if not data:
        raise HTTPException(
            status_code=400,
            detail="Observation data is empty",
        )
    fd = row.form_data if isinstance(row.form_data, dict) else {}
    to_email = _customer_email_from_form(fd)
    if not to_email:
        raise HTTPException(
            status_code=400,
            detail="No valid customer email on the service request; add customer email on the request form.",
        )
    if not is_smtp_configured():
        raise HTTPException(
            status_code=503,
            detail="Email is not configured (SMTP_HOST). Set SMTP variables on the server.",
        )
    pdf_bytes = build_observations_pdf_bytes(
        row.id,
        (row.service_type_key or "").strip(),
        data,
        observation_data_updated_at=getattr(obs, "updated_at", None),
        service_request_form_data=row.form_data if isinstance(row.form_data, dict) else None,
    )
    fname = f"observations_sr{row.id}.pdf"
    subject = f"Observation report — Service request #{row.id}"
    body = (
        f"Please find attached the observation report for service request #{row.id}.\n\n"
        "This message was sent from the lab system."
    )
    ok = send_email_with_pdf_attachment(
        to_email, subject, body, pdf_bytes, fname
    )
    if not ok:
        raise HTTPException(
            status_code=503,
            detail="Could not send email. Check server logs and SMTP settings.",
        )
    sent_at = datetime.now(timezone.utc).replace(tzinfo=None)
    row.observation_report_emailed_at = sent_at
    db.add(row)
    db.commit()
    return {
        "message": "Report emailed",
        "to": to_email,
        "emailed_at": sent_at.isoformat(),
    }


@router.get("/{service_request_id}/observation-report.pdf")
def download_observation_report_pdf(
    service_request_id: int,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
    _perm=Depends(require_permission("observation_read")),
):
    """
    Download a formatted observation report as PDF (same layout as the emailed report).
    """
    row = db.get(ServiceRequest, service_request_id)
    if not row:
        raise HTTPException(status_code=404, detail="Service request not found")
    assert_can_read_observation(db, user, row)
    obs = (
        db.query(ObservationRequest)
        .filter(ObservationRequest.service_request_id == service_request_id)
        .first()
    )
    if not obs:
        raise HTTPException(
            status_code=404,
            detail="No observation record for this service request",
        )
    data = obs.observations_json if isinstance(obs.observations_json, dict) else {}
    pdf_bytes = build_observations_pdf_bytes(
        row.id,
        (row.service_type_key or "").strip(),
        data,
        observation_data_updated_at=getattr(obs, "updated_at", None),
        service_request_form_data=row.form_data if isinstance(row.form_data, dict) else None,
    )
    fname = f"observations_sr{row.id}.pdf"
    return Response(
        content=pdf_bytes,
        media_type="application/pdf",
        headers={
            "Content-Disposition": f'attachment; filename="{fname}"',
        },
    )


@router.post("/{service_request_id}/complete-observations")
def complete_service_request_observations(
    service_request_id: int,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    """
    Engineer marks observation work finished; sets service request status to completed.
    """
    row = db.get(ServiceRequest, service_request_id)
    if not row:
        raise HTTPException(status_code=404, detail="Service request not found")
    assert_can_finalize_observations(db, user, row)
    obs = (
        db.query(ObservationRequest)
        .filter(ObservationRequest.service_request_id == service_request_id)
        .first()
    )
    if not obs:
        raise HTTPException(
            status_code=400,
            detail="No observation record exists for this service request",
        )
    data = obs.observations_json if isinstance(obs.observations_json, dict) else {}
    if not data:
        raise HTTPException(
            status_code=400,
            detail="Observation data is empty; save at least one page before completing",
        )
    row.status = "completed"
    db.add(row)
    db.commit()
    db.refresh(row)
    return {"message": "Observations marked complete", "status": row.status}
