from pydantic import BaseModel, EmailStr, field_validator
from typing import Optional


class UserCreate(BaseModel):
    username: str
    password: str
    email: EmailStr
    phone: Optional[str] = None
    role_name: Optional[str] = None
    department_name: Optional[str] = None
    designation_name: Optional[str] = None

    @field_validator("username")
    @classmethod
    def validate_username(cls, value):
        if not value or not value.strip():
            raise ValueError("Username can't be empty")
        return value

    @field_validator("password")
    @classmethod
    def validate_password(cls, value):
        if not value or not value.strip():
            raise ValueError("Password can't be empty")
        return value

    @field_validator("email", mode="before")
    @classmethod
    def validate_email_not_empty(cls, value):
        if not value or not str(value).strip():
            raise ValueError("Email can't be empty")
        return value


class UserUpdate(BaseModel):
    username: str
    email: EmailStr
    phone: Optional[str] = None
    role_name: Optional[str] = None
    department_name: Optional[str] = None
    designation_name: Optional[str] = None

    @field_validator("username")
    @classmethod
    def validate_username(cls, value):
        if not value or not value.strip():
            raise ValueError("Username can't be empty")
        return value

    @field_validator("email", mode="before")
    @classmethod
    def validate_email_not_empty(cls, value):
        if not value or not str(value).strip():
            raise ValueError("Email can't be empty")
        return value


class UserResponse(BaseModel):
    id: int
    username: str
    email: str
    phone: Optional[str] = None
    role_name: Optional[str] = None
    department_name: Optional[str] = None
    designation_name: Optional[str] = None
    is_active: bool


class ChangePasswordRequest(BaseModel):
    new_password: str

    @field_validator("new_password")
    @classmethod
    def validate_new_password(cls, value):
        if not value or not value.strip():
            raise ValueError("New password can't be empty")
        return value