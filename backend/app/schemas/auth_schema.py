from pydantic import BaseModel, EmailStr, Field


class LoginRequest(BaseModel):

    username: str
    password: str


class TokenResponse(BaseModel):

    access_token: str
    token_type: str
    full_access: bool = False


class ForgotPasswordRequest(BaseModel):
    email: EmailStr


class ResetPasswordRequest(BaseModel):
    token: str = Field(..., min_length=10)
    new_password: str = Field(..., min_length=6, max_length=128)