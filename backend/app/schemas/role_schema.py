from pydantic import BaseModel
from typing import List


class RoleCreate(BaseModel):

    name: str


class RoleResponse(BaseModel):

    id: int
    name: str


class RolePermissionUpdate(BaseModel):

    permissions: List[str]