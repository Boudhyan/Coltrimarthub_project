from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.utils.db import get_db
from app.models.designation import Designation
from app.schemas.designation_schema import DesignationCreate, DesignationResponse
from app.utils.permissions import require_permission

router = APIRouter(
    prefix="/designations",
    tags=["Designations"]
)


@router.get("", response_model=list[DesignationResponse])
def get_designations(
    db: Session = Depends(get_db),
    permission=Depends(require_permission("designation_read"))
):
    return db.query(Designation).all()


@router.get("/{designation_id}", response_model=DesignationResponse)
def get_designation(
    designation_id: int,
    db: Session = Depends(get_db),
    permission=Depends(require_permission("designation_read"))
):
    designation = db.query(Designation).filter(Designation.id == designation_id).first()

    if not designation:
        raise HTTPException(status_code=404, detail="Designation not found")

    return designation


@router.post("", response_model=DesignationResponse)
def create_designation(
    data: DesignationCreate,
    db: Session = Depends(get_db),
    permission=Depends(require_permission("designation_create"))
):
    existing = db.query(Designation).filter(Designation.name == data.name).first()

    if existing:
        raise HTTPException(status_code=400, detail="Designation already exists")

    designation = Designation(name=data.name)

    db.add(designation)
    db.commit()
    db.refresh(designation)

    return designation


@router.put("/{designation_id}")
def update_designation(
    designation_id: int,
    data: DesignationCreate,
    db: Session = Depends(get_db),
    permission=Depends(require_permission("designation_update"))
):
    designation = db.query(Designation).filter(Designation.id == designation_id).first()

    if not designation:
        raise HTTPException(status_code=404, detail="Designation not found")

    designation.name = data.name
    db.commit()

    return {"message": "Designation updated"}


@router.delete("/{designation_id}")
def delete_designation(
    designation_id: int,
    db: Session = Depends(get_db),
    permission=Depends(require_permission("designation_delete"))
):
    designation = db.query(Designation).filter(Designation.id == designation_id).first()

    if not designation:
        raise HTTPException(status_code=404, detail="Designation not found")

    db.delete(designation)
    db.commit()

    return {"message": "Designation deleted"}