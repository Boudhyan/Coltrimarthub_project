from pydantic import BaseModel


class UserCreate(BaseModel):

    username: str
    password: str
    role_name: str
    department_id: int | None = None
    designation_id: int | None = None


class UserResponse(BaseModel):

    id: int
    username: str
    role_id: int
    department_id: int | None
    designation_id: int | None
    is_active: bool | None