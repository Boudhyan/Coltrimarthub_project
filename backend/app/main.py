from fastapi import FastAPI,Depends
from fastapi.middleware.cors import CORSMiddleware
from app.database.session import engine
from app.database.base import Base

import app.models.test_table
import app.models.user
from app.utils.security import hash_password
from app.routers import auth_router
from app.utils.dependencies import get_current_user
import app.models.role
import app.models.permission
import app.models.role_permission
from app.utils.permissions import require_permission
from app.routers import user_router
from app.routers import role_router
import app.models.department
from app.routers import department_router
import app.models.designation
from app.routers import designation_router
import app.models.company
from app.routers import company_router




app = FastAPI(
    title="Lab Testing Backend",
    version="1.0"
)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173","http://127.0.0.1:5173" ],  # frontend origin
    allow_credentials=True,
    allow_methods=["*"],  # allow GET, POST, PUT, DELETE
    allow_headers=["*"],  # allow all headers
)

Base.metadata.create_all(bind=engine)


@app.get("/")
def root():
    return {"message": "Backend is running"}

@app.get("/test-password")
def test_password():

    hashed = hash_password("123456")

    return {"hashed_password": hashed}

app.include_router(auth_router.router)
app.include_router(user_router.router)
app.include_router(role_router.router)
app.include_router(department_router.router)
app.include_router(designation_router.router)
app.include_router(company_router.router)

@app.get("/protected")
def protected_route(user=Depends(get_current_user)):

    return {
        "message": "You are logged in",
        "username": user.username
    }
@app.get("/test-rbac")
def test_rbac(
    permission=Depends(require_permission("user_read"))
):

    return {"message": "RBAC working"}