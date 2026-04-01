from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session, joinedload
from app.database.session import get_db # ✅ Use get_db instead of SessionLocal
from app.models.user import User
from app.models.role import Role
from app.models.department import Department
from app.models.designation import Designation
from app.schemas.user_schema import UserCreate, UserUpdate, UserResponse
from app.utils.security import hash_password
from app.utils.permissions import require_permission

router = APIRouter(
    prefix="/users",
    tags=["Users"]
)

@router.post("/", response_model=UserResponse)
def create_user(
    data: UserCreate,
    db: Session = Depends(get_db), # ✅ Use Dependency Injection
    permission=Depends(require_permission("user_create"))
):
    existing_user = db.query(User).filter(User.username == data.username).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Username already exists")

    # Fetch IDs based on names provided in the request
    role = db.query(Role).filter(Role.name == data.role_name).first() if data.role_name else None
    if data.role_name and not role:
        raise HTTPException(status_code=400, detail="Role not found")

    dept = db.query(Department).filter(Department.name == data.department_name).first() if data.department_name else None
    if data.department_name and not dept:
        raise HTTPException(status_code=400, detail="Department not found")

    desig = db.query(Designation).filter(Designation.name == data.designation_name).first() if data.designation_name else None
    if data.designation_name and not desig:
        raise HTTPException(status_code=400, detail="Designation not found")

    user = User(
        username=data.username,
        password_hash=hash_password(data.password),
        role_id=role.id if role else None,
        department_id=dept.id if dept else None,
        designation_id=desig.id if desig else None
    )

    db.add(user)
    db.commit()
    db.refresh(user)
    return user # FastAPI/Pydantic will handle the mapping to UserResponse

@router.get("/", response_model=list[UserResponse])
def get_users(
    db: Session = Depends(get_db),
    permission=Depends(require_permission("user_read"))
):
    # ✅ FIX: joinedload solves the N+1 problem from your logs
    users = db.query(User).options(
        joinedload(User.role),
        joinedload(User.department),
        joinedload(User.designation)
    ).all()
    
    return users

@router.get("/{user_id}", response_model=UserResponse)
def get_user(
    user_id: int,
    db: Session = Depends(get_db),
    permission=Depends(require_permission("user_read"))
):
    # ✅ FIX: Fetching user and relationships in one go
    user = db.query(User).options(
        joinedload(User.role),
        joinedload(User.department),
        joinedload(User.designation)
    ).filter(User.id == user_id).first()

    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    return user

@router.put("/{user_id}")
def update_user(
    user_id: int,
    data: UserUpdate,
    db: Session = Depends(get_db),
    permission=Depends(require_permission("user_update"))
):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    if data.role_name:
        role = db.query(Role).filter(Role.name == data.role_name).first()
        if not role: raise HTTPException(status_code=400, detail="Role not found")
        user.role_id = role.id

    if data.department_name:
        dept = db.query(Department).filter(Department.name == data.department_name).first()
        if not dept: raise HTTPException(status_code=400, detail="Department not found")
        user.department_id = dept.id

    user.username = data.username
    db.commit()
    return {"message": "User updated"}

@router.delete("/{user_id}")
def delete_user(
    user_id: int,
    db: Session = Depends(get_db),
    permission=Depends(require_permission("user_delete"))
):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    db.delete(user)
    db.commit()
    return {"message": "User deleted"}

@router.patch("/{user_id}/disable")
def disable_user(
    user_id: int,
    db: Session = Depends(get_db),
    permission=Depends(require_permission("user_disable"))
):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    user.is_active = False
    db.commit()
    return {"message": "User disabled"}