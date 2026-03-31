from sqlalchemy import Column, Integer, String
from app.database.base import Base


class Permission(Base):

    __tablename__ = "permissions"

    id = Column(Integer, primary_key=True)

    code = Column(String(100), unique=True)

    module = Column(String(50))

    action = Column(String(50))