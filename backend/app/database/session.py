from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, Session


DATABASE_URL = "mysql+pymysql://root:1234@localhost:3306/lab_system"

engine = create_engine(
    DATABASE_URL,
    pool_size=10, 
    max_overflow=20,
    pool_timeout=30,
    echo=True  # You have this in your screenshot, keep it for debugging
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# from sqlalchemy import create_engine
# from sqlalchemy.orm import sessionmaker, declarative_base

# DATABASE_URL = "mysql+pymysql://user:1234@localhost/lab_system"

# engine = create_engine(
#     DATABASE_URL,
#     pool_size=10,
#     max_overflow=20,
#     pool_timeout=30,
#     pool_recycle=1800
# )

# SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base = declarative_base()

# # ✅ THIS IS THE FIX (VERY IMPORTANT)
# def get_db():
#     db = SessionLocal()
#     try:
#         yield db
#     finally:
#         db.close()