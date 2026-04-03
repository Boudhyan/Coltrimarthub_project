from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session

from app.database.session import SessionLocal
from app.models.user import User
from app.schemas.auth_schema import LoginRequest, TokenResponse
from app.utils.security import verify_password, create_access_token
from app.utils.db import get_db

router = APIRouter(
    prefix="/auth",
    tags=["Authentication"]
)


@router.post("/login")
def login(
    data: LoginRequest,
    db: Session = Depends(get_db)   # ✅ HERE (parameter)
):
    user = db.query(User).filter(
        User.username == data.username
    ).first()

    if not user:
        raise HTTPException(
            status_code=401,
            detail="Invalid username or password"
        )

    if not verify_password(data.password, user.password_hash):
        raise HTTPException(
            status_code=401,
            detail="Invalid username or password"
        )

    if not user.is_active:
        raise HTTPException(
            status_code=403,
            detail="User is disabled"
        )
    token = create_access_token(
        data={
            "user_id": user.id,
            "username": user.username
        }
    )
    # token = create_access_token(
    #     data={"sub": user.username}
    # )

    return {
        "access_token": token,
        "token_type": "bearer"
    }