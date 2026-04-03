# from fastapi import APIRouter, Depends, HTTPException
# from sqlalchemy.orm import Session

# from app.database.session import SessionLocal
# from app.models.role import Role
from app.models.permission import Permission
from app.models.role_permission import RolePermission
from app.schemas.role_schema import RoleCreate, RoleResponse, RolePermissionUpdate
from app.utils.permissions import require_permission
# from app.utils.db import get_db

# router = APIRouter(
#     prefix="/roles",
#     tags=["Roles"]
# )

# @router.get("/", response_model=list[RoleResponse])
# def get_roles():

#     db: Session = Depends(get_db)

#     roles = db.query(Role).all()

#     return roles

# @router.post("/", response_model=RoleResponse)
# def create_role(
#     data: RoleCreate,
#     permission=Depends(require_permission("user_create"))
# ):

#     db: Session = Depends(get_db)

#     existing = db.query(Role).filter(
#         Role.name == data.name
#     ).first()

#     if existing:
#         raise HTTPException(
#             status_code=400,
#             detail="Role already exists"
#         )

#     role = Role(name=data.name)

#     db.add(role)
#     db.commit()
#     db.refresh(role)

#     return role
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.utils.db import get_db
from app.models.role import Role
from app.schemas.role_schema import RoleCreate, RoleResponse
from app.utils.permissions import require_permission

router = APIRouter(
    prefix="/roles",
    tags=["Roles"]
)


@router.get("/", response_model=list[RoleResponse])
def get_roles(
    db: Session = Depends(get_db),
    permission=Depends(require_permission("role_read"))
):
    roles = db.query(Role).all()
    return roles


@router.get("/{role_id}", response_model=RoleResponse)
def get_role(
    role_id: int,
    db: Session = Depends(get_db),
    permission=Depends(require_permission("role_read"))
):
    role = db.query(Role).filter(Role.id == role_id).first()

    if not role:
        raise HTTPException(status_code=404, detail="Role not found")

    return role


@router.post("/", response_model=RoleResponse)
def create_role(
    data: RoleCreate,
    db: Session = Depends(get_db),
    permission=Depends(require_permission("role_create"))
):
    existing = db.query(Role).filter(Role.name == data.name).first()

    if existing:
        raise HTTPException(status_code=400, detail="Role already exists")

    role = Role(name=data.name)

    db.add(role)
    db.commit()
    db.refresh(role)

    return role


@router.put("/{role_id}")
def update_role(
    role_id: int,
    data: RoleCreate,
    db: Session = Depends(get_db),
    permission=Depends(require_permission("role_update"))
):
    role = db.query(Role).filter(Role.id == role_id).first()

    if not role:
        raise HTTPException(status_code=404, detail="Role not found")

    role.name = data.name
    db.commit()

    return {"message": "Role updated"}


@router.delete("/{role_id}")
def delete_role(
    role_id: int,
    db: Session = Depends(get_db),
    permission=Depends(require_permission("role_delete"))
):
    role = db.query(Role).filter(Role.id == role_id).first()

    if not role:
        raise HTTPException(status_code=404, detail="Role not found")

    db.delete(role)
    db.commit()

    return {"message": "Role deleted"}

@router.get("/permissions")
def get_permissions():

    db: Session = Depends(get_db)

    permissions = db.query(Permission).all()

    return permissions

@router.post("/{role_id}/permissions")
def update_role_permissions(
    role_id: int,
    data: RolePermissionUpdate
):

    db: Session = Depends(get_db)

    role = db.query(Role).filter(
        Role.id == role_id
    ).first()

    if not role:
        raise HTTPException(
            status_code=404,
            detail="Role not found"
        )

    db.query(RolePermission).filter(
        RolePermission.role_id == role_id
    ).delete()

    for code in data.permissions:

        permission = db.query(Permission).filter(
            Permission.code == code
        ).first()

        if permission:

            rp = RolePermission(
                role_id=role_id,
                permission_id=permission.id
            )

            db.add(rp)

    db.commit()

    return {"message": "Permissions updated"}