from fastapi import Depends, HTTPException
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import jwt, JWTError
from sqlalchemy.orm import Session

from app.utils.db import get_db
from app.models.user import User
from app.models.role import Role
from app.utils.privileged import user_has_full_access
from app.utils.security import SECRET_KEY, ALGORITHM


security = HTTPBearer()


def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db)
):
    token = credentials.credentials

    try:
        payload = jwt.decode(
            token,
            SECRET_KEY,
            algorithms=[ALGORITHM]
        )

        user_id = payload.get("user_id")

        if user_id is None:
            raise HTTPException(
                status_code=401,
                detail="Invalid token"
            )

    except JWTError:
        raise HTTPException(
            status_code=401,
            detail="Invalid token"
        )

    user = db.query(User).filter(
        User.id == user_id
    ).first()

    if not user:
        raise HTTPException(
            status_code=401,
            detail="User not found"
        )

    if not user.is_active:
        raise HTTPException(
            status_code=403,
            detail="User is disabled"
        )

    if user.role_id is not None:
        role = db.query(Role).filter(Role.id == user.role_id).first()
        if role is not None and not role.is_active:
            if not user_has_full_access(db, user):
                raise HTTPException(
                    status_code=403,
                    detail="Role is disabled"
                )

    return user