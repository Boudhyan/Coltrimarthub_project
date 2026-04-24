from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.utils.db import get_db
from app.models.service_type import ServiceType
from app.schemas.service_type_schema import ServiceTypeCreate, ServiceTypeOut
from app.utils.permissions import require_permission

router = APIRouter(prefix="/service-types", tags=["service-types"])

SUPPORTED_SERVICE_TYPE_NAMES = (
    "Service 14286 - 54 Page Observation",
    "Service 10322",
    "Service 15885",
    "Service 16102",
    "Service 16103",
)


def _normalize_name(value: str) -> str:
    return " ".join((value or "").strip().lower().split())


def _sync_supported_service_types(db: Session) -> None:
    """
    Keep only the supported observation services in the service_types catalog.
    This removes older demo/service entries (e.g. Fan/AC repair) automatically.
    """
    rows = db.query(ServiceType).all()
    by_norm = {_normalize_name(r.name): r for r in rows}
    allowed_norm = {_normalize_name(name) for name in SUPPORTED_SERVICE_TYPE_NAMES}

    changed = False
    for name in SUPPORTED_SERVICE_TYPE_NAMES:
        norm = _normalize_name(name)
        if norm not in by_norm:
            db.add(ServiceType(name=name))
            changed = True

    for row in rows:
        if _normalize_name(row.name) not in allowed_norm:
            db.delete(row)
            changed = True

    if changed:
        db.commit()


@router.get("", response_model=list[ServiceTypeOut])
def list_service_types(
    db: Session = Depends(get_db),
    _permission=Depends(require_permission("service_type_read")),
):
    _sync_supported_service_types(db)
    rows = db.query(ServiceType).all()
    order = {
        _normalize_name(name): idx
        for idx, name in enumerate(SUPPORTED_SERVICE_TYPE_NAMES)
    }
    rows.sort(key=lambda r: order.get(_normalize_name(r.name), 999))
    return rows


@router.post("", response_model=ServiceTypeOut)
def create_service_type(
    body: ServiceTypeCreate,
    db: Session = Depends(get_db),
    _permission=Depends(require_permission("service_type_create")),
):
    _sync_supported_service_types(db)
    name = body.name.strip()
    if not name:
        raise HTTPException(status_code=400, detail="Name is required")
    if _normalize_name(name) not in {
        _normalize_name(x) for x in SUPPORTED_SERVICE_TYPE_NAMES
    }:
        raise HTTPException(
            status_code=400,
            detail="Only configured observation service types are allowed",
        )
    existing = db.query(ServiceType).filter(ServiceType.name == name).first()
    if existing:
        raise HTTPException(status_code=400, detail="Service type already exists")
    row = ServiceType(name=name)
    db.add(row)
    db.commit()
    db.refresh(row)
    return row


@router.put("/{service_type_id}", response_model=ServiceTypeOut)
def update_service_type(
    service_type_id: int,
    body: ServiceTypeCreate,
    db: Session = Depends(get_db),
    _permission=Depends(require_permission("service_type_update")),
):
    _sync_supported_service_types(db)
    row = db.get(ServiceType, service_type_id)
    if not row:
        raise HTTPException(status_code=404, detail="Service type not found")
    name = body.name.strip()
    if not name:
        raise HTTPException(status_code=400, detail="Name is required")
    if _normalize_name(name) not in {
        _normalize_name(x) for x in SUPPORTED_SERVICE_TYPE_NAMES
    }:
        raise HTTPException(
            status_code=400,
            detail="Only configured observation service types are allowed",
        )
    clash = (
        db.query(ServiceType)
        .filter(ServiceType.name == name, ServiceType.id != service_type_id)
        .first()
    )
    if clash:
        raise HTTPException(status_code=400, detail="Another service type has this name")
    row.name = name
    db.commit()
    db.refresh(row)
    return row


@router.delete("/{service_type_id}")
def delete_service_type(
    service_type_id: int,
    db: Session = Depends(get_db),
    _permission=Depends(require_permission("service_type_delete")),
):
    row = db.get(ServiceType, service_type_id)
    if not row:
        raise HTTPException(status_code=404, detail="Service type not found")
    db.delete(row)
    db.commit()
    return {"message": "Service type deleted"}
