from fastapi import APIRouter, HTTPException
from sqlalchemy.orm import Session

from app.database.session import SessionLocal
from app.models.designation import Designation
from app.schemas.designation_schema import DesignationCreate, DesignationResponse
from fastapi import Depends
from app.utils.permissions import require_permission

router = APIRouter(
    prefix="/designations",
    tags=["Designations"]
)

@router.post("/", response_model=DesignationResponse)
def create_designation(
    data: DesignationCreate,
    permission=Depends(require_permission("designation_create"))
):

    db: Session = SessionLocal()

    existing = db.query(Designation).filter(
        Designation.name == data.name
    ).first()

    if existing:
        raise HTTPException(
            status_code=400,
            detail="Designation already exists"
        )

    designation = Designation(name=data.name)

    db.add(designation)
    db.commit()
    db.refresh(designation)

    return designation

@router.get("/", response_model=list[DesignationResponse])
def get_designations(
    permission=Depends(require_permission("designation_read"))
):

    db: Session = SessionLocal()

    return db.query(Designation).all()

@router.put("/{designation_id}")
def update_designation(
    designation_id: int,
    data: DesignationCreate,
    permission=Depends(require_permission("designation_update"))
):

    db: Session = SessionLocal()

    designation = db.query(Designation).filter(
        Designation.id == designation_id
    ).first()

    if not designation:
        raise HTTPException(
            status_code=404,
            detail="Designation not found"
        )

    designation.name = data.name

    db.commit()

    return {"message": "Designation updated"}

@router.delete("/{designation_id}")
def delete_designation(
    designation_id: int,
    permission=Depends(require_permission("designation_delete"))
):

    db: Session = SessionLocal()

    designation = db.query(Designation).filter(
        Designation.id == designation_id
    ).first()

    if not designation:
        raise HTTPException(
            status_code=404,
            detail="Designation not found"
        )

    db.delete(designation)
    db.commit()

    return {"message": "Designation deleted"}