"""
Users whose role is marked full-access bypass permission checks and inactive-role blocks.
"""
from __future__ import annotations

from typing import TYPE_CHECKING, Optional

from sqlalchemy.orm import Session

from app.models.role import Role

if TYPE_CHECKING:
    from app.models.user import User

# Normalized role names that always receive full access (case-insensitive, trimmed).
_FULL_ACCESS_ROLE_NAMES = frozenset(
    {
        "admin",
        "administrator",
        "super admin",
        "superadmin",
        "super-admin",
    }
)

# Usernames that always receive full access (primary admin account).
_FULL_ACCESS_USERNAMES = frozenset({"admin", "superadmin"})


def has_full_access(db: Session, role_id: Optional[int]) -> bool:
    """True if this role should bypass RBAC and role-inactive restrictions."""
    if role_id is None:
        return False
    role = db.query(Role).filter(Role.id == role_id).first()
    if not role:
        return False
    if getattr(role, "is_superuser", False):
        return True
    if role.name:
        n = role.name.strip().lower()
        if n in _FULL_ACCESS_ROLE_NAMES:
            return True
    return False


def user_has_full_access(db: Session, user: "User") -> bool:
    """Full access from username (break-glass) or role flags / name."""
    if user.username:
        u = user.username.strip().lower()
        if u in _FULL_ACCESS_USERNAMES:
            return True
    return has_full_access(db, user.role_id)


def role_name_is_full_access_reserved(name: Optional[str]) -> bool:
    """True for Admin / Administrator-style role names (permissions UI excludes these)."""
    if not name or not str(name).strip():
        return False
    return str(name).strip().lower() in _FULL_ACCESS_ROLE_NAMES
