from fastapi import Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.session import SessionLocal
from app.models.role_permission import RolePermission
from app.models.permission import Permission
from app.utils.dependencies import get_current_user
from app.utils.privileged import user_has_full_access


def require_permission(permission_code: str):

    def permission_checker(user=Depends(get_current_user)):

        db: Session = SessionLocal()
        try:
            if user_has_full_access(db, user):
                return True

            permission = db.query(Permission).filter(
                Permission.code == permission_code
            ).first()

            if not permission:

                raise HTTPException(
                    status_code=403,
                    detail="Permission not defined"
                )

            role_permission = db.query(RolePermission).filter(
                RolePermission.role_id == user.role_id,
                RolePermission.permission_id == permission.id
            ).first()

            if not role_permission:

                raise HTTPException(
                    status_code=403,
                    detail="Permission denied"
                )

            return True
        finally:
            db.close()

    return permission_checker
