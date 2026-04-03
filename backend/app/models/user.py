from sqlalchemy import Column, Integer, String, ForeignKey, Boolean
from sqlalchemy.orm import relationship
from app.database.base import Base # Points to your base.py

from sqlalchemy import Column, Integer, String, Boolean
from app.database.base import Base


class User(Base):

    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)

    username = Column(String(50), unique=True, nullable=False)

    email = Column(String(100), unique=True, nullable=False)

    phone = Column(String(20), unique=True, nullable=True)

    password_hash = Column(String(255), nullable=False)

    role_id = Column(Integer,ForeignKey("roles.id"), nullable=True)

    department_id = Column(Integer,ForeignKey("departments.id"), nullable=True)

    designation_id = Column(Integer,ForeignKey("designations.id"), nullable=True)

    is_active = Column(Boolean, default=True)

# class User(Base):
#     __tablename__ = "users"
    

#     id = Column(Integer, primary_key=True, index=True)
#     username = Column(String(100),nullable=False)
#     password_hash = Column(String(255))
#     role_id = Column(Integer, ForeignKey("roles.id"))
#     department_id = Column(Integer, ForeignKey("departments.id"))
#     designation_id = Column(Integer, ForeignKey("designations.id"))
#     is_active = Column(Boolean, default=True)
#     email = Column(String(100), unique=True, nullable=True)
#     phone = Column(String(20), unique=True, nullable=True)

    # Relationships - This is what stops the N+1 query problem
    role = relationship("Role")
    department = relationship("Department")
    designation = relationship("Designation")