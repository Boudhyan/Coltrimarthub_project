from sqlalchemy import Column, Integer, String, ForeignKey, Boolean
from sqlalchemy.orm import relationship
from app.database.base import Base # Points to your base.py

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(100))
    password_hash = Column(String(255))
    role_id = Column(Integer, ForeignKey("roles.id"))
    department_id = Column(Integer, ForeignKey("departments.id"))
    designation_id = Column(Integer, ForeignKey("designations.id"))
    is_active = Column(Boolean, default=True)

    # Relationships - This is what stops the N+1 query problem
    role = relationship("Role")
    department = relationship("Department")
    designation = relationship("Designation")