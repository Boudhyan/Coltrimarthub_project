from sqlalchemy import Column, Integer, String

from app.database.base import Base


class ServiceType(Base):
    """Catalog of service offerings (e.g. Ac Repair, Fan Repair)."""

    __tablename__ = "service_types"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    name = Column(String(100), unique=True, nullable=False)
