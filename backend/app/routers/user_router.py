from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.session import SessionLocal
from app.models.user import User
from app.models.role import Role
from app.schemas.user_schema import UserCreate, UserResponse
from app.utils.security import hash_password
from app.utils.permissions import require_permission
from app.database.session import get_db

router = APIRouter(
    prefix="/users",
    tags=["Users"]
)
@router.post("/", response_model=UserResponse)
def create_user(
    data: UserCreate,
    db: Session = Depends(get_db),
    permission=Depends(require_permission("user_create"))
):


    # CHECK IF USERNAME EXISTS
    existing_user = db.query(User).filter(
        User.username == data.username
    ).first()

    if existing_user:
        raise HTTPException(
            status_code=400,
            detail="Username already exists"
        )

    role = db.query(Role).filter(
        Role.name == data.role_name
    ).first()

    if not role:
        raise HTTPException(
            status_code=400,
            detail="Role not found"
        )

    user = User(
        username=data.username,
        password_hash=hash_password(data.password),
        role_id=role.id,
        department_id=data.department_id,
        designation_id=data.designation_id
    )

    db.add(user)
    db.commit()
    db.refresh(user)

    return user


@router.get("/", response_model=list[UserResponse])
def get_users(
    db: Session = Depends(get_db),
    permission=Depends(require_permission("user_read"))
):



    users = db.query(User).all()

    return users

@router.get("/{user_id}", response_model=UserResponse)
def get_user(
    user_id: int,
    db: Session = Depends(get_db),
    permission=Depends(require_permission("user_read"))
):

    

    user = db.query(User).filter(
        User.id == user_id
    ).first()

    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    return user
@router.put("/{user_id}")
def update_user(
    user_id: int,
    data: UserCreate,
    db: Session = Depends(get_db),
    permission=Depends(require_permission("user_update"))
):

    

    user = db.query(User).filter(
        User.id == user_id
    ).first()

    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    role = db.query(Role).filter(
        Role.name == data.role_name
    ).first()

    if not role:
        raise HTTPException(
            status_code=400,
            detail="Role not found"
        )

    user.username = data.username
    user.role_id = role.id
    user.department_id = data.department_id
    user.designation_id = data.designation_id

    db.commit()

    return {"message": "User updated"}
@router.delete("/{user_id}")
def delete_user(
    user_id: int,
    db: Session = Depends(get_db),
    permission=Depends(require_permission("user_delete"))
):

    

    user = db.query(User).filter(
        User.id == user_id
    ).first()

    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    db.delete(user)
    db.commit()

    return {"message": "User deleted"}
@router.patch("/{user_id}/disable")
def disable_user(
    user_id: int,
    db: Session = Depends(get_db),
    permission=Depends(require_permission("user_disable"))
):

    user = db.query(User).filter(
        User.id == user_id
    ).first()

    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    user.is_active = False

    db.commit()

    return {"message": "User disabled"}