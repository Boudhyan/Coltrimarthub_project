from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from starlette.middleware.base import BaseHTTPMiddleware

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
import app.models.service_request
import app.models.service_type
import app.models.observation_request
import app.models.password_reset_token
from app.routers import company_router
from app.routers import observation_router
from app.routers import service_request_router
from app.routers import service_type_router
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from fastapi import Request
from app.utils.dependencies import get_current_user




app = FastAPI(
    title="Lab Testing Backend",
    version="1.0"
)
@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):

    errors = {}

    for err in exc.errors():
        field = err["loc"][-1]
        message = err["msg"]

        if message.startswith("Value error, "):
            message = message.replace("Value error, ", "")

        errors[field] = message

    return JSONResponse(
        status_code=422,
        content={
            "message": "Validation failed",
            "errors": errors
        }
    )
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:5174",
        "http://127.0.0.1:5174",
        "http://localhost:4173",
        "http://127.0.0.1:4173",
    ],
    # Any dev port on localhost / 127.0.0.1 (Vite may pick another port).
    allow_origin_regex=r"^https?://(localhost|127\.0\.0\.1)(:\d+)?$",
    allow_credentials=True,
    allow_methods=["*"],  # allow GET, POST, PUT, DELETE
    allow_headers=["*"],  # allow all headers
)


class ReloadDotenvMiddleware(BaseHTTPMiddleware):
    """Re-read .env on every request so edits apply without restarting uvicorn."""

    async def dispatch(self, request, call_next):
        from app.env_loader import load_backend_dotenv

        load_backend_dotenv(quiet=True)
        return await call_next(request)


app.add_middleware(ReloadDotenvMiddleware)

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
app.include_router(observation_router.router)
app.include_router(service_request_router.router)
app.include_router(service_type_router.router)


@app.get("/protected")
def protected_route(current_user=Depends(get_current_user)):
    return {"message": "You are logged in", "user": current_user.username}
@app.get("/test-rbac")
def test_rbac(
    permission=Depends(require_permission("user_read"))
):

    return {"message": "RBAC working"}