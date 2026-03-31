from fastapi import APIRouter, HTTPException
from sqlalchemy.orm import Session

from app.database.session import SessionLocal
from app.models.department import Department
from app.schemas.department_schema import DepartmentCreate, DepartmentResponse
from fastapi import Depends
from app.utils.permissions import require_permission

router = APIRouter(
    prefix="/departments",
    tags=["Departments"]
)

@router.post("/", response_model=DepartmentResponse)
def create_department(
    data: DepartmentCreate,
    permission=Depends(require_permission("department_create"))
):

    db: Session = SessionLocal()

    existing = db.query(Department).filter(
        Department.name == data.name
    ).first()

    if existing:
        raise HTTPException(
            status_code=400,
            detail="Department already exists"
        )

    department = Department(name=data.name)

    db.add(department)
    db.commit()
    db.refresh(department)

    return department


@router.get("/", response_model=list[DepartmentResponse])
def get_departments(
    permission=Depends(require_permission("department_read"))
):

    db: Session = SessionLocal()

    return db.query(Department).all()

@router.put("/{department_id}")
def update_department(
    department_id: int,
    data: DepartmentCreate,
    permission=Depends(require_permission("department_update"))
):

    db: Session = SessionLocal()

    department = db.query(Department).filter(
        Department.id == department_id
    ).first()

    if not department:
        raise HTTPException(
            status_code=404,
            detail="Department not found"
        )

    department.name = data.name

    db.commit()

    return {"message": "Department updated"}

@router.delete("/{department_id}")
def delete_department(
    department_id: int,
    permission=Depends(require_permission("department_delete"))
):

    db: Session = SessionLocal()

    department = db.query(Department).filter(
        Department.id == department_id
    ).first()

    if not department:
        raise HTTPException(
            status_code=404,
            detail="Department not found"
        )

    db.delete(department)
    db.commit()

    return {"message": "Department deleted"}