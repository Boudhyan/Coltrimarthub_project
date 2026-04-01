from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, Session
from .database import SessionLocal

DATABASE_URL = "mysql+pymysql://root:1234@localhost:3306/lab_system"

engine = create_engine(
    DATABASE_URL,
    echo=True
)

SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)

def get_db():

    db = SessionLocal()

    try:
        yield db
    finally:
        db.close()