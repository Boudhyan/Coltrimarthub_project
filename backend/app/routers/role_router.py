from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.utils.db import get_db
from app.models.permission import Permission
from app.models.role import Role
from app.models.role_permission import RolePermission
from app.schemas.permission_schema import PermissionOut
from app.schemas.role_schema import (
    RoleCreate,
    RolePermissionUpdate,
    RoleResponse,
    RoleUpdate,
)
from app.utils.permissions import require_permission
from app.utils.dependencies import get_current_user
from app.models.user import User
from app.utils.privileged import role_name_is_full_access_reserved

router = APIRouter(
    prefix="/roles",
    tags=["Roles"],
)


@router.get("", response_model=list[RoleResponse])
def get_roles(
    db: Session = Depends(get_db),
    _permission=Depends(require_permission("role_read")),
):
    roles = db.query(Role).all()
    return roles


@router.get("/permissions", response_model=list[PermissionOut])
def get_permissions(
    db: Session = Depends(get_db),
    _permission=Depends(require_permission("role_read")),
):
    return db.query(Permission).order_by(Permission.module, Permission.code).all()


@router.post("", response_model=RoleResponse)
def create_role(
    data: RoleCreate,
    db: Session = Depends(get_db),
    _permission=Depends(require_permission("role_create")),
):
    existing = db.query(Role).filter(Role.name == data.name).first()

    if existing:
        raise HTTPException(status_code=400, detail="Role already exists")

    role = Role(
        name=data.name,
        is_active=data.is_active,
        is_superuser=False,
    )

    db.add(role)
    db.commit()
    db.refresh(role)

    return role


@router.get("/{role_id}", response_model=RoleResponse)
def get_role(
    role_id: int,
    db: Session = Depends(get_db),
    _permission=Depends(require_permission("role_read")),
):
    role = db.query(Role).filter(Role.id == role_id).first()

    if not role:
        raise HTTPException(status_code=404, detail="Role not found")

    return role


@router.get("/{role_id}/permissions", response_model=list[str])
def get_role_permission_codes(
    role_id: int,
    db: Session = Depends(get_db),
    _permission=Depends(require_permission("role_read")),
):
    role = db.query(Role).filter(Role.id == role_id).first()
    if not role:
        raise HTTPException(status_code=404, detail="Role not found")
    rows = (
        db.query(Permission.code)
        .join(RolePermission, RolePermission.permission_id == Permission.id)
        .filter(RolePermission.role_id == role_id)
        .all()
    )
    return [r[0] for r in rows]


@router.put("/{role_id}")
def update_role(
    role_id: int,
    data: RoleUpdate,
    db: Session = Depends(get_db),
    _permission=Depends(require_permission("role_update")),
):
    role = db.query(Role).filter(Role.id == role_id).first()

    if not role:
        raise HTTPException(status_code=404, detail="Role not found")

    existing = db.query(Role).filter(
        Role.name == data.name,
        Role.id != role_id,
    ).first()
    if existing:
        raise HTTPException(status_code=400, detail="Role name already exists")

    role.name = data.name
    role.is_active = data.is_active
    db.commit()

    return {"message": "Role updated"}


@router.delete("/{role_id}")
def delete_role(
    role_id: int,
    db: Session = Depends(get_db),
    _permission=Depends(require_permission("role_delete")),
):
    role = db.query(Role).filter(Role.id == role_id).first()

    if not role:
        raise HTTPException(status_code=404, detail="Role not found")

    db.delete(role)
    db.commit()

    return {"message": "Role deleted"}


@router.post("/{role_id}/permissions")
def update_role_permissions(
    role_id: int,
    data: RolePermissionUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
    _permission=Depends(require_permission("role_update")),
):
    role = db.query(Role).filter(Role.id == role_id).first()

    if not role:
        raise HTTPException(status_code=404, detail="Role not found")

    if role.name and role_name_is_full_access_reserved(role.name):
        raise HTTPException(
            status_code=403,
            detail="Permissions for administrator roles cannot be changed here",
        )

    if current_user.role_id is not None and current_user.role_id == role_id:
        raise HTTPException(
            status_code=403,
            detail="You cannot add or remove permissions for your own role",
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
