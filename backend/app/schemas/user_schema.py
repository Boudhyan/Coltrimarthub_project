from pydantic import BaseModel
from typing import Optional


class UserCreate(BaseModel):

    username: str
    password: str
    role_name: Optional[str] = None
    department_name: Optional[str] = None
    designation_name: Optional[str] = None


class UserUpdate(BaseModel):

    username: str
    role_name: Optional[str] = None
    department_name: Optional[str] = None
    designation_name: Optional[str] = None


class UserResponse(BaseModel):

    id: int
    username: str
    role_name: Optional[str] = None
    department_name: Optional[str] = None
    designation_name: Optional[str] = None
    is_active: bool