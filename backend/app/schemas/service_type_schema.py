from pydantic import BaseModel, Field


class ServiceTypeCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)


class ServiceTypeOut(BaseModel):
    id: int
    name: str

    class Config:
        from_attributes = True
