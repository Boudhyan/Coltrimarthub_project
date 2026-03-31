from pydantic import BaseModel


class DesignationCreate(BaseModel):

    name: str


class DesignationResponse(BaseModel):

    id: int
    name: str