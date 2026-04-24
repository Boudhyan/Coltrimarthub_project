from typing import Optional

from pydantic import BaseModel


class PermissionOut(BaseModel):
    id: int
    code: str
    module: Optional[str] = None
    action: Optional[str] = None

    class Config:
        from_attributes = True
