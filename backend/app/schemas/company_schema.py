from pydantic import BaseModel
from typing import Optional


class CompanyCreate(BaseModel):

    name: str
    address: Optional[str] = None
    phone: Optional[str] = None
    email: Optional[str] = None


class CompanyResponse(BaseModel):

    id: int
    name: str
    address: Optional[str]
    phone: Optional[str]
    email: Optional[str]