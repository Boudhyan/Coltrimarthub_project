from pydantic import BaseModel
from typing import List


class RoleCreate(BaseModel):
    name: str
    is_active: bool = True


class RoleUpdate(BaseModel):
    name: str
    is_active: bool = True


class RoleResponse(BaseModel):
    id: int
    name: str
    is_active: bool
    is_superuser: bool = False

    class Config:
        from_attributes = True


class RolePermissionUpdate(BaseModel):

    permissions: List[str]