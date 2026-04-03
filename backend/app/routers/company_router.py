# from fastapi import APIRouter, HTTPException, Depends
# from sqlalchemy.orm import Session

# from app.database.session import SessionLocal
# from app.models.company import Company
# from app.schemas.company_schema import CompanyCreate, CompanyResponse
# from fastapi import Depends
# from app.utils.permissions import require_permission
# from app.utils.db import get_db
# router = APIRouter(
#     prefix="/companies",
#     tags=["Companies"]
# )

# @router.post("/", response_model=CompanyResponse)
# def create_company(
#     data: CompanyCreate,
#     permission=Depends(require_permission("company_create"))
# ):

#     db: Session = Depends(get_db)

#     existing = db.query(Company).filter(
#         Company.name == data.name
#     ).first()

#     if existing:
#         raise HTTPException(
#             status_code=400,
#             detail="Company already exists"
#         )

#     company = Company(**data.dict())

#     db.add(company)
#     db.commit()
#     db.refresh(company)

#     return company

# @router.get("/", response_model=list[CompanyResponse])
# def get_companies(
#     permission=Depends(require_permission("company_read"))
# ):

#     db: Session = Depends(get_db)

#     return db.query(Company).all()

# @router.put("/{company_id}")
# def update_company(
#     company_id: int,
#     data: CompanyCreate,
#     permission=Depends(require_permission("company_update"))
# ):

#     db: Session = Depends(get_db)

#     company = db.query(Company).filter(
#         Company.id == company_id
#     ).first()

#     if not company:
#         raise HTTPException(
#             status_code=404,
#             detail="Company not found"
#         )

#     company.name = data.name
#     company.address = data.address
#     company.phone = data.phone
#     company.email = data.email

#     db.commit()

#     return {"message": "Company updated"}

# @router.delete("/{company_id}")
# def delete_company(
#     company_id: int,
#     permission=Depends(require_permission("company_delete"))
# ):

#     db: Session = Depends(get_db)

#     company = db.query(Company).filter(
#         Company.id == company_id
#     ).first()

#     if not company:
#         raise HTTPException(
#             status_code=404,
#             detail="Company not found"
#         )

#     db.delete(company)
#     db.commit()

#     return {"message": "Company deleted"}
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.utils.db import get_db
from app.models.company import Company
from app.schemas.company_schema import CompanyCreate, CompanyResponse
from app.utils.permissions import require_permission

router = APIRouter(
    prefix="/companies",
    tags=["Companies"]
)


@router.get("/", response_model=list[CompanyResponse])
def get_companies(
    db: Session = Depends(get_db),
    permission=Depends(require_permission("company_read"))
):
    return db.query(Company).all()


@router.get("/{company_id}", response_model=CompanyResponse)
def get_company(
    company_id: int,
    db: Session = Depends(get_db),
    permission=Depends(require_permission("company_read"))
):
    company = db.query(Company).filter(Company.id == company_id).first()

    if not company:
        raise HTTPException(status_code=404, detail="Company not found")

    return company


@router.post("/", response_model=CompanyResponse)
def create_company(
    data: CompanyCreate,
    db: Session = Depends(get_db),
    permission=Depends(require_permission("company_create"))
):
    existing = db.query(Company).filter(Company.name == data.name).first()

    if existing:
        raise HTTPException(status_code=400, detail="Company already exists")

    company = Company(
        name=data.name,
        address=data.address,
        phone=data.phone,
        email=data.email
    )

    db.add(company)
    db.commit()
    db.refresh(company)

    return company


@router.put("/{company_id}")
def update_company(
    company_id: int,
    data: CompanyCreate,
    db: Session = Depends(get_db),
    permission=Depends(require_permission("company_update"))
):
    company = db.query(Company).filter(Company.id == company_id).first()

    if not company:
        raise HTTPException(status_code=404, detail="Company not found")

    company.name = data.name
    company.address = data.address
    company.phone = data.phone
    company.email = data.email

    db.commit()

    return {"message": "Company updated"}


@router.delete("/{company_id}")
def delete_company(
    company_id: int,
    db: Session = Depends(get_db),
    permission=Depends(require_permission("company_delete"))
):
    company = db.query(Company).filter(Company.id == company_id).first()

    if not company:
        raise HTTPException(status_code=404, detail="Company not found")

    db.delete(company)
    db.commit()

    return {"message": "Company deleted"}