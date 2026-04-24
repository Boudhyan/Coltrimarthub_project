from typing import Optional
import re

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.orm import Session
from sqlalchemy.orm.attributes import flag_modified

from app.utils.db import get_db
from app.models.observation_request import ObservationRequest
from app.models.service_request import ServiceRequest
from app.models.user import User
from app.schemas.observation_schema import (
    is_allowed_observation_page_key,
    ObservationRequestCreate,
    ObservationRequestOut,
    ObservationPagePatch,
    ObservationFullReplace,
)
from app.utils.dependencies import get_current_user
from app.utils.observation_access import (
    assert_assigned_engineer_may_edit_observations,
    assert_observation_readable_for_api,
    bump_service_request_status_after_observation_edit,
)

router = APIRouter(prefix="/observation-requests", tags=["observation-requests"])

# Canonical page keys are page_02 / page_04; strip legacy duplicates on every write.
_LEGACY_OBSERVATION_KEYS = frozenset({"mqt_06_1_ini", "mqt_19_1"})
_SERVICE_PAGE_KEY_RE = re.compile(r"^svc_(\d{5})_[0-9]{2}$")
_SUPPORTED_SERVICE_IDS = frozenset({"10322", "15885", "16102", "16103"})


def _strip_legacy_observation_keys(obs: dict) -> dict:
    return {k: v for k, v in obs.items() if k not in _LEGACY_OBSERVATION_KEYS}


def _extract_supported_service_id(service_type_key: Optional[str]) -> Optional[str]:
    raw = str(service_type_key or "").strip()
    if not raw:
        return None
    m = re.search(r"(10322|15885|16102|16103)", raw)
    return m.group(1) if m else None


def _assert_page_key_matches_service_profile(sr: ServiceRequest, page_key: str) -> None:
    """
    When using service-specific page keys (svc_<id>_<nn>), enforce that
    <id> matches the service request type to avoid cross-service data pollution.
    """
    m = _SERVICE_PAGE_KEY_RE.fullmatch(page_key or "")
    if not m:
        return
    key_service_id = m.group(1)
    if key_service_id not in _SUPPORTED_SERVICE_IDS:
        raise HTTPException(status_code=400, detail="Unsupported service page key")
    sr_service_id = _extract_supported_service_id(getattr(sr, "service_type_key", ""))
    if sr_service_id != key_service_id:
        raise HTTPException(
            status_code=400,
            detail=(
                "page_key does not match this service request type. "
                f"Expected svc_{sr_service_id}_<nn>."
            ) if sr_service_id else "This service request does not use svc_* observation keys.",
        )


def _get_observation_by_service_request_id(
    db: Session, service_request_id: int
) -> Optional[ObservationRequest]:
    return db.scalars(
        select(ObservationRequest).where(
            ObservationRequest.service_request_id == service_request_id
        )
    ).first()


def _bump_sr_after_observation_save(db: Session, service_request_id: int) -> None:
    sr = db.get(ServiceRequest, service_request_id)
    if sr:
        bump_service_request_status_after_observation_edit(db, sr)
        db.add(sr)


@router.post("", response_model=ObservationRequestOut)
def create_observation_request(
    body: ObservationRequestCreate,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    sr = db.get(ServiceRequest, body.service_request_id)
    if not sr:
        raise HTTPException(status_code=404, detail="Service request not found")
    assert_assigned_engineer_may_edit_observations(db, user, sr)
    if _get_observation_by_service_request_id(db, body.service_request_id):
        raise HTTPException(
            status_code=409,
            detail="Observation row already exists for this service_request_id",
        )
    row = ObservationRequest(
        service_request_id=body.service_request_id,
        observations_json={},
    )
    db.add(row)
    db.commit()
    db.refresh(row)
    return row


@router.get(
    "/by-service-request/{service_request_id}",
    response_model=ObservationRequestOut,
)
def get_observation_by_service_request(
    service_request_id: int,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    sr = db.get(ServiceRequest, service_request_id)
    if not sr:
        raise HTTPException(status_code=404, detail="Service request not found")
    assert_observation_readable_for_api(db, user, sr)
    row = _get_observation_by_service_request_id(db, service_request_id)
    if not row:
        raise HTTPException(
            status_code=404,
            detail="No observation row for this service_request_id",
        )
    return row


@router.put(
    "/by-service-request/{service_request_id}/observations",
    response_model=ObservationRequestOut,
)
def put_observations_full_by_service_request(
    service_request_id: int,
    body: ObservationFullReplace,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    sr = db.get(ServiceRequest, service_request_id)
    if not sr:
        raise HTTPException(status_code=404, detail="Service request not found")
    assert_assigned_engineer_may_edit_observations(db, user, sr)
    row = _get_observation_by_service_request_id(db, service_request_id)
    if not row:
        raise HTTPException(
            status_code=404,
            detail="No observation row for this service_request_id",
        )
    cleaned = _strip_legacy_observation_keys(dict(body.observations_json or {}))
    for pk in cleaned.keys():
        _assert_page_key_matches_service_profile(sr, pk)
    row.observations_json = cleaned
    flag_modified(row, "observations_json")
    db.add(row)
    _bump_sr_after_observation_save(db, service_request_id)
    db.commit()
    db.refresh(row)
    return row


@router.get("/{observation_id}", response_model=ObservationRequestOut)
def get_observation_request(
    observation_id: int,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    row = db.get(ObservationRequest, observation_id)
    if not row:
        raise HTTPException(status_code=404, detail="Observation request not found")
    sr = db.get(ServiceRequest, row.service_request_id)
    if not sr:
        raise HTTPException(status_code=404, detail="Service request not found")
    assert_observation_readable_for_api(db, user, sr)
    return row


@router.patch(
    "/by-service-request/{service_request_id}/page/{page_key}",
    response_model=ObservationRequestOut,
)
def patch_observation_page_by_service_request(
    service_request_id: int,
    page_key: str,
    body: ObservationPagePatch,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    if not is_allowed_observation_page_key(page_key):
        raise HTTPException(
            status_code=400,
            detail=(
                "Unknown page_key. Use page_01-page_54, "
                "svc_<serviceid>_<nn>, or legacy mqt_06_1_ini / mqt_19_1."
            ),
        )
    sr = db.get(ServiceRequest, service_request_id)
    if not sr:
        raise HTTPException(status_code=404, detail="Service request not found")
    assert_assigned_engineer_may_edit_observations(db, user, sr)
    row = _get_observation_by_service_request_id(db, service_request_id)
    if not row:
        raise HTTPException(
            status_code=404,
            detail="No observation row for this service_request_id",
        )
    obs = _strip_legacy_observation_keys(dict(row.observations_json or {}))
    obs[page_key] = body.data
    row.observations_json = obs
    flag_modified(row, "observations_json")
    db.add(row)
    _bump_sr_after_observation_save(db, service_request_id)
    db.commit()
    db.refresh(row)
    return row


@router.patch("/{observation_id}/page/{page_key}", response_model=ObservationRequestOut)
def patch_observation_page(
    observation_id: int,
    page_key: str,
    body: ObservationPagePatch,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    if not is_allowed_observation_page_key(page_key):
        raise HTTPException(
            status_code=400,
            detail=(
                "Unknown page_key. Use page_01-page_54, "
                "svc_<serviceid>_<nn>, or legacy mqt_06_1_ini / mqt_19_1."
            ),
        )
    row = db.get(ObservationRequest, observation_id)
    if not row:
        raise HTTPException(status_code=404, detail="Observation request not found")
    sr = db.get(ServiceRequest, row.service_request_id)
    if not sr:
        raise HTTPException(status_code=404, detail="Service request not found")
    _assert_page_key_matches_service_profile(sr, page_key)
    assert_assigned_engineer_may_edit_observations(db, user, sr)
    obs = _strip_legacy_observation_keys(dict(row.observations_json or {}))
    obs[page_key] = body.data
    row.observations_json = obs
    flag_modified(row, "observations_json")
    db.add(row)
    _bump_sr_after_observation_save(db, row.service_request_id)
    db.commit()
    db.refresh(row)
    return row
