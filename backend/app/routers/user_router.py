from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.models.department import Department
from app.models.designation import Designation
from app.schemas.user_schema import UserCreate, UserUpdate, UserResponse

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
    permission=Depends(require_permission("user_create"))
):

    db: Session = SessionLocal()
  

    existing_user = db.query(User).filter(
        User.username == data.username
    ).first()

    if existing_user:
        raise HTTPException(
            status_code=400,
            detail="Username already exists"
        )

    role = None
    department = None
    designation = None

    if data.role_name:
        role = db.query(Role).filter(
            Role.name == data.role_name
        ).first()

        if not role:
            raise HTTPException(
                status_code=400,
                detail="Role not found"
            )

    if data.department_name:
        department = db.query(Department).filter(
            Department.name == data.department_name
        ).first()

        if not department:
            raise HTTPException(
                status_code=400,
                detail="Department not found"
            )

    if data.designation_name:
        designation = db.query(Designation).filter(
            Designation.name == data.designation_name
        ).first()

        if not designation:
            raise HTTPException(
                status_code=400,
                detail="Designation not found"
            )

    user = User(
        username=data.username,
        password_hash=hash_password(data.password),
        role_id=role.id if role else None,
        department_id=department.id if department else None,
        designation_id=designation.id if designation else None
    )

    db.add(user)
    db.commit()
    db.refresh(user)

    return {
        "id": user.id,
        "username": user.username,
        "role_name": role.name if role else None,
        "department_name": department.name if department else None,
        "designation_name": designation.name if designation else None,
        "is_active": user.is_active
    }


@router.get("/", response_model=list[UserResponse])
def get_users(
    permission=Depends(require_permission("user_read"))
):

    db: Session = SessionLocal()

    users = db.query(User).all()

    response = []

    for user in users:

        role = db.query(Role).filter(Role.id == user.role_id).first()
        department = db.query(Department).filter(Department.id == user.department_id).first()
        designation = db.query(Designation).filter(Designation.id == user.designation_id).first()

        response.append({
            "id": user.id,
            "username": user.username,
            "role_name": role.name if role else None,
            "department_name": department.name if department else None,
            "designation_name": designation.name if designation else None,
            "is_active": user.is_active
        })

    return response
@router.get("/{user_id}", response_model=UserResponse)
def get_user(
    user_id: int,
    permission=Depends(require_permission("user_read"))
):

    db: Session = SessionLocal()

    user = db.query(User).filter(
        User.id == user_id
    ).first()

    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    role = db.query(Role).filter(Role.id == user.role_id).first()
    department = db.query(Department).filter(Department.id == user.department_id).first()
    designation = db.query(Designation).filter(Designation.id == user.designation_id).first()

    return {
        "id": user.id,
        "username": user.username,
        "role_name": role.name if role else None,
        "department_name": department.name if department else None,
        "designation_name": designation.name if designation else None,
        "is_active": user.is_active
    }

@router.put("/{user_id}")
def update_user(
    user_id: int,
    data: UserUpdate,
    permission=Depends(require_permission("user_update"))
):

    db: Session = SessionLocal()

    user = db.query(User).filter(
        User.id == user_id
    ).first()

    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    role = None
    department = None
    designation = None

    if data.role_name:
        role = db.query(Role).filter(
            Role.name == data.role_name
        ).first()

        if not role:
            raise HTTPException(
                status_code=400,
                detail="Role not found"
            )

    if data.department_name:
        department = db.query(Department).filter(
            Department.name == data.department_name
        ).first()

        if not department:
            raise HTTPException(
                status_code=400,
                detail="Department not found"
            )

    if data.designation_name:
        designation = db.query(Designation).filter(
            Designation.name == data.designation_name
        ).first()

        if not designation:
            raise HTTPException(
                status_code=400,
                detail="Designation not found"
            )

    user.username = data.username
    user.role_id = role.id if role else None
    user.department_id = department.id if department else None
    user.designation_id = designation.id if designation else None

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

# from fastapi import APIRouter, Depends, HTTPException
# from sqlalchemy.orm import Session, joinedload

# from app.database.session import get_db
# from app.models.user import User
# from app.models.role import Role
# from app.models.department import Department
# from app.models.designation import Designation

# from app.schemas.user_schema import UserCreate, UserUpdate, UserResponse
# from app.utils.security import hash_password
# from app.utils.permissions import require_permission

# router = APIRouter(
#     prefix="/users",
#     tags=["Users"]
# )


# # ✅ CREATE USER
# @router.post("/", response_model=UserResponse)
# def create_user(
#     data: UserCreate,
#     db: Session = Depends(get_db),
#     permission=Depends(require_permission("user_create"))
# ):
#     existing_user = db.query(User).filter(
#         User.username == data.username
#     ).first()

#     if existing_user:
#         raise HTTPException(status_code=400, detail="Username already exists")

#     role = None
#     department = None
#     designation = None

#     if data.role_name:
#         role = db.query(Role).filter(Role.name == data.role_name).first()
#         if not role:
#             raise HTTPException(status_code=400, detail="Role not found")

#     if data.department_name:
#         department = db.query(Department).filter(Department.name == data.department_name).first()
#         if not department:
#             raise HTTPException(status_code=400, detail="Department not found")

#     if data.designation_name:
#         designation = db.query(Designation).filter(Designation.name == data.designation_name).first()
#         if not designation:
#             raise HTTPException(status_code=400, detail="Designation not found")

#     user = User(
#         username=data.username,
#         password_hash=hash_password(data.password),
#         role_id=role.id if role else None,
#         department_id=department.id if department else None,
#         designation_id=designation.id if designation else None
#     )

#     db.add(user)
#     db.commit()
#     db.refresh(user)

#     return {
#         "id": user.id,
#         "username": user.username,
#         "role_name": role.name if role else None,
#         "department_name": department.name if department else None,
#         "designation_name": designation.name if designation else None,
#         "is_active": user.is_active
#     }


# # ✅ GET ALL USERS (OPTIMIZED 🚀)
# @router.get("/", response_model=list[UserResponse])
# def get_users(
#     db: Session = Depends(get_db),
#     permission=Depends(require_permission("user_read"))
# ):
#     users = db.query(User).options(
#         joinedload(User.role),
#         joinedload(User.department),
#         joinedload(User.designation)
#     ).all()

#     return [
#         {
#             "id": user.id,
#             "username": user.username,
#             "role_name": user.role.name if user.role else None,
#             "department_name": user.department.name if user.department else None,
#             "designation_name": user.designation.name if user.designation else None,
#             "is_active": user.is_active
#         }
#         for user in users
#     ]


# # ✅ GET SINGLE USER
# @router.get("/{user_id}", response_model=UserResponse)
# def get_user(
#     user_id: int,
#     db: Session = Depends(get_db),
#     permission=Depends(require_permission("user_read"))
# ):
#     user = db.query(User).options(
#         joinedload(User.role),
#         joinedload(User.department),
#         joinedload(User.designation)
#     ).filter(User.id == user_id).first()

#     if not user:
#         raise HTTPException(status_code=404, detail="User not found")

#     return {
#         "id": user.id,
#         "username": user.username,
#         "role_name": user.role.name if user.role else None,
#         "department_name": user.department.name if user.department else None,
#         "designation_name": user.designation.name if user.designation else None,
#         "is_active": user.is_active
#     }


# # ✅ UPDATE USER
# @router.put("/{user_id}")
# def update_user(
#     user_id: int,
#     data: UserUpdate,
#     db: Session = Depends(get_db),
#     permission=Depends(require_permission("user_update"))
# ):
#     user = db.query(User).filter(User.id == user_id).first()

#     if not user:
#         raise HTTPException(status_code=404, detail="User not found")

#     role = None
#     department = None
#     designation = None

#     if data.role_name:
#         role = db.query(Role).filter(Role.name == data.role_name).first()
#         if not role:
#             raise HTTPException(status_code=400, detail="Role not found")

#     if data.department_name:
#         department = db.query(Department).filter(Department.name == data.department_name).first()
#         if not department:
#             raise HTTPException(status_code=400, detail="Department not found")

#     if data.designation_name:
#         designation = db.query(Designation).filter(Designation.name == data.designation_name).first()
#         if not designation:
#             raise HTTPException(status_code=400, detail="Designation not found")

#     user.username = data.username
#     user.role_id = role.id if role else None
#     user.department_id = department.id if department else None
#     user.designation_id = designation.id if designation else None

#     db.commit()

#     return {"message": "User updated"}


# # ✅ DELETE USER
# @router.delete("/{user_id}")
# def delete_user(
#     user_id: int,
#     db: Session = Depends(get_db),
#     permission=Depends(require_permission("user_delete"))
# ):
#     user = db.query(User).filter(User.id == user_id).first()

#     if not user:
#         raise HTTPException(status_code=404, detail="User not found")

#     db.delete(user)
#     db.commit()

#     return {"message": "User deleted"}


# # ✅ DISABLE USER
# @router.patch("/{user_id}/disable")
# def disable_user(
#     user_id: int,
#     db: Session = Depends(get_db),
#     permission=Depends(require_permission("user_disable"))
# ):
#     user = db.query(User).filter(User.id == user_id).first()

#     if not user:
#         raise HTTPException(status_code=404, detail="User not found")

#     user.is_active = False
#     db.commit()

#     return {"message": "User disabled"}