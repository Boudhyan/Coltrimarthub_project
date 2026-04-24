"""Effective permission codes for the current user (for UI + auth/me)."""
from __future__ import annotations

from typing import TYPE_CHECKING

from sqlalchemy.orm import Session

from app.models.permission import Permission
from app.models.role_permission import RolePermission
from app.utils.privileged import user_has_full_access

if TYPE_CHECKING:
    from app.models.user import User


def get_effective_permission_codes(db: Session, user: "User") -> list[str]:
    """All permission codes this user may use (full-access users get every defined code)."""
    if user_has_full_access(db, user):
        rows = db.query(Permission.code).order_by(Permission.code).all()
        return [r[0] for r in rows]
    if user.role_id is None:
        return []
    rows = (
        db.query(Permission.code)
        .join(RolePermission, RolePermission.permission_id == Permission.id)
        .filter(RolePermission.role_id == user.role_id)
        .order_by(Permission.code)
        .all()
    )
    return [r[0] for r in rows]
