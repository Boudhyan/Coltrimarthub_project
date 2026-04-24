"""Who may read/write observation data tied to a service request."""
from __future__ import annotations

from typing import TYPE_CHECKING

from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.models.service_request import ServiceRequest
from app.utils.privileged import user_has_full_access
from app.utils.user_permissions import get_effective_permission_codes

if TYPE_CHECKING:
    from app.models.user import User


def assert_assigned_engineer_may_edit_observations(
    db: Session, user: "User", sr: ServiceRequest
) -> None:
    """
    Writes (PATCH/PUT/POST observation). Assigned engineers may update data even
    after the service request is marked completed (corrections / additions).
    """
    assert_can_write_observation(db, user, sr)


def assert_observation_readable_for_api(
    db: Session, user: "User", sr: ServiceRequest
) -> None:
    """GET observation payloads (workspace, APIs)."""
    assert_can_read_observation(db, user, sr)


def assert_can_read_observation(db: Session, user: "User", sr: ServiceRequest) -> None:
    """
    Full access, assigned engineer, or reviewer with both observation_read and
    service_request_read (typical admin).
    """
    if user_has_full_access(db, user):
        return
    if sr.allotted_to_user_id is not None and sr.allotted_to_user_id == user.id:
        return
    codes = set(get_effective_permission_codes(db, user))
    if "observation_read" in codes and "service_request_read" in codes:
        return
    raise HTTPException(status_code=403, detail="Permission denied")


def assert_can_write_observation(db: Session, user: "User", sr: ServiceRequest) -> None:
    """
    Full access, assigned engineer, or staff with observation_update + service_request_read
    (typical admin / reviewer editing on behalf of the lab).
    """
    if user_has_full_access(db, user):
        return
    if sr.allotted_to_user_id is not None and sr.allotted_to_user_id == user.id:
        return
    codes = set(get_effective_permission_codes(db, user))
    if "observation_update" in codes and "service_request_read" in codes:
        return
    raise HTTPException(
        status_code=403,
        detail="Only the assigned engineer or an authorized admin can edit observations",
    )


def assert_can_finalize_observations(db: Session, user: "User", sr: ServiceRequest) -> None:
    """Mark observations complete: full access, assigned engineer, or admin with update + read."""
    if user_has_full_access(db, user):
        return
    if sr.allotted_to_user_id is not None and sr.allotted_to_user_id == user.id:
        return
    codes = set(get_effective_permission_codes(db, user))
    if "observation_update" in codes and "service_request_read" in codes:
        return
    raise HTTPException(
        status_code=403,
        detail="Only the assigned engineer or an authorized admin can complete observations for this request",
    )


def bump_service_request_status_after_observation_edit(db: Session, sr: ServiceRequest) -> None:
    """Move workflow forward when observation data is saved."""
    if sr.status in ("draft", "submitted", "allotted"):
        sr.status = "in_progress"
    elif sr.status == "completed":
        # Allow engineers to correct sheets after sign-off; queue shows work resumed.
        sr.status = "in_progress"
