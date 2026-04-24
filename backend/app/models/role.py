from sqlalchemy import Boolean, Column, Integer, String
from app.database.base import Base


class Role(Base):

    __tablename__ = "roles"

    id = Column(Integer, primary_key=True)

    name = Column(String(50), unique=True)

    is_active = Column(Boolean, default=True, nullable=False)

    # When True, this role bypasses all permission checks (same as legacy "Admin" name).
    is_superuser = Column(Boolean, default=False, nullable=False)