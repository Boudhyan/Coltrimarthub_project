from sqlalchemy import Column, Integer, String, Boolean, ForeignKey
from app.database.base import Base


class User(Base):

    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)

    username = Column(String(50), unique=True, nullable=False)

    password_hash = Column(String(255), nullable=False)

    role_id = Column(Integer, nullable=True)

    department_id = Column(Integer, nullable=True)

    designation_id = Column(Integer, nullable=True)

    is_active = Column(Boolean, default=True)