import hashlib
import logging
import os
import secrets
from datetime import datetime, timedelta

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import func
from sqlalchemy.orm import Session

from app.models.user import User
from app.models.role import Role
from app.models.password_reset_token import PasswordResetToken
from app.schemas.auth_schema import (
    ForgotPasswordRequest,
    LoginRequest,
    ResetPasswordRequest,
)
from app.utils.security import hash_password, verify_password, create_access_token
from app.utils.db import get_db
from app.utils.privileged import user_has_full_access
from app.utils.dependencies import get_current_user
from app.utils.user_permissions import get_effective_permission_codes
from app.utils.email_util import is_smtp_configured, send_password_reset_email

logger = logging.getLogger(__name__)

RESET_TOKEN_HOURS = 1


def _forgot_password_json() -> dict:
    """Same shape for every caller (does not reveal whether the email exists)."""
    return {
        "message": (
            "If an account exists for this email, password reset instructions "
            "have been sent."
        ),
        "smtp_configured": is_smtp_configured(),
    }


def _hash_reset_token(raw: str) -> str:
    return hashlib.sha256(raw.strip().encode("utf-8")).hexdigest()

router = APIRouter(
    prefix="/auth",
    tags=["Authentication"],
)


@router.post("/login")
def login(
    data: LoginRequest,
    db: Session = Depends(get_db),
):
    account = db.query(User).filter(
        User.username == data.username
    ).first()

    if not account:
        raise HTTPException(
            status_code=401,
            detail="Invalid username or password"
        )

    if not verify_password(data.password, account.password_hash):
        raise HTTPException(
            status_code=401,
            detail="Invalid username or password"
        )

    if not account.is_active:
        raise HTTPException(
            status_code=403,
            detail="User is disabled"
        )

    if account.role_id is not None:
        role = db.query(Role).filter(Role.id == account.role_id).first()
        if role is not None and not role.is_active:
            if not user_has_full_access(db, account):
                raise HTTPException(
                    status_code=403,
                    detail="Role is disabled"
                )

    full_access = user_has_full_access(db, account)
    permissions = get_effective_permission_codes(db, account)

    token = create_access_token(
        data={
            "user_id": account.id,
            "username": account.username
        }
    )

    return {
        "access_token": token,
        "token_type": "bearer",
        "user_id": account.id,
        "role_id": account.role_id,
        "full_access": full_access,
        "permissions": permissions,
    }


@router.get("/me")
def auth_me(
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    """Session flags and effective permission codes for sidebar + route guards."""
    return {
        "user_id": user.id,
        "username": user.username,
        "role_id": user.role_id,
        "full_access": user_has_full_access(db, user),
        "permissions": get_effective_permission_codes(db, user),
    }


@router.post("/forgot-password")
def forgot_password(
    data: ForgotPasswordRequest,
    db: Session = Depends(get_db),
):
    """
    Creates a one-time reset token and emails a link (if SMTP is configured).
    Response shape is always the same whether or not the email exists.
    """
    out = _forgot_password_json()
    email_norm = data.email.strip().lower()
    user = (
        db.query(User)
        .filter(func.lower(User.email) == email_norm)
        .first()
    )
    if not user or not user.is_active:
        return out

    db.query(PasswordResetToken).filter(
        PasswordResetToken.user_id == user.id
    ).delete()

    raw_token = secrets.token_urlsafe(32)
    token_hash = _hash_reset_token(raw_token)
    now = datetime.utcnow()
    expires = now + timedelta(hours=RESET_TOKEN_HOURS)

    row = PasswordResetToken(
        user_id=user.id,
        token_hash=token_hash,
        expires_at=expires,
        created_at=now,
    )
    db.add(row)
    db.commit()

    frontend = os.getenv("FRONTEND_URL", "http://localhost:5173")
    reset_link = f"{frontend.rstrip('/')}/reset-password?token={raw_token}"

    sent = send_password_reset_email(user.email, reset_link)

    if os.getenv("LOG_PASSWORD_RESET_LINK", "").lower() in ("1", "true", "yes"):
        logger.warning(
            "LOG_PASSWORD_RESET_LINK is set: reset URL for %s is %s",
            user.email,
            reset_link,
        )
    elif not is_smtp_configured():
        logger.warning(
            "Password reset token stored for user id=%s but no email was sent "
            "(SMTP_HOST unset). Configure SMTP or set LOG_PASSWORD_RESET_LINK=true "
            "to log the link (development only).",
            user.id,
        )
    elif not sent:
        logger.error(
            "Password reset token stored for user id=%s but SMTP send failed — "
            "see exception above in logs.",
            user.id,
        )

    return out


@router.get("/reset-password/validate")
def validate_reset_token(token: str, db: Session = Depends(get_db)):
    """Lightweight check for the reset form (optional UX)."""
    if not token or len(token.strip()) < 10:
        return {"valid": False}
    th = _hash_reset_token(token)
    row = (
        db.query(PasswordResetToken)
        .filter(PasswordResetToken.token_hash == th)
        .first()
    )
    if (
        not row
        or row.used_at is not None
        or row.expires_at < datetime.utcnow()
    ):
        return {"valid": False}
    return {"valid": True}


@router.post("/reset-password")
def reset_password(
    data: ResetPasswordRequest,
    db: Session = Depends(get_db),
):
    th = _hash_reset_token(data.token)
    row = (
        db.query(PasswordResetToken)
        .filter(PasswordResetToken.token_hash == th)
        .first()
    )
    if (
        not row
        or row.used_at is not None
        or row.expires_at < datetime.utcnow()
    ):
        raise HTTPException(
            status_code=400,
            detail="Invalid or expired reset link. Request a new one.",
        )

    user = db.get(User, row.user_id)
    if not user:
        raise HTTPException(
            status_code=400,
            detail="Invalid or expired reset link. Request a new one.",
        )

    user.password_hash = hash_password(data.new_password)
    row.used_at = datetime.utcnow()
    db.commit()

    return {"message": "Password updated. You can sign in now."}
