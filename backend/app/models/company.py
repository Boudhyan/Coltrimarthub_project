from sqlalchemy import Column, Integer, String
from app.database.base import Base


class Company(Base):

    __tablename__ = "companies"

    id = Column(Integer, primary_key=True)

    name = Column(String(150), unique=True)

    address = Column(String(255))

    phone = Column(String(50))

    email = Column(String(100))