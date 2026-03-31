from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.session import SessionLocal
from app.models.role import Role
from app.models.permission import Permission
from app.models.role_permission import RolePermission
from app.schemas.role_schema import RoleCreate, RoleResponse, RolePermissionUpdate
from app.utils.permissions import require_permission

router = APIRouter(
    prefix="/roles",
    tags=["Roles"]
)

@router.get("/", response_model=list[RoleResponse])
def get_roles():

    db: Session = SessionLocal()

    roles = db.query(Role).all()

    return roles

@router.post("/", response_model=RoleResponse)
def create_role(
    data: RoleCreate,
    permission=Depends(require_permission("user_create"))
):

    db: Session = SessionLocal()

    existing = db.query(Role).filter(
        Role.name == data.name
    ).first()

    if existing:
        raise HTTPException(
            status_code=400,
            detail="Role already exists"
        )

    role = Role(name=data.name)

    db.add(role)
    db.commit()
    db.refresh(role)

    return role

@router.get("/permissions")
def get_permissions():

    db: Session = SessionLocal()

    permissions = db.query(Permission).all()

    return permissions

@router.post("/{role_id}/permissions")
def update_role_permissions(
    role_id: int,
    data: RolePermissionUpdate
):

    db: Session = SessionLocal()

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