"""JWT + bcrypt (native library — avoids passlib vs bcrypt 4.1+ incompatibility)."""
from datetime import datetime, timedelta

import bcrypt
from jose import jwt

SECRET_KEY = "supersecretkey"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_HOURS = 8


def _password_bytes(password: str) -> bytes:
    """Bcrypt accepts at most 72 bytes; truncate UTF-8 safely."""
    b = password.encode("utf-8")
    return b[:72] if len(b) > 72 else b


def hash_password(password: str) -> str:
    return bcrypt.hashpw(
        _password_bytes(password),
        bcrypt.gensalt(),
    ).decode("ascii")


def verify_password(password: str, hashed_password: str) -> bool:
    if not hashed_password:
        return False
    try:
        h = (
            hashed_password.encode("utf-8")
            if isinstance(hashed_password, str)
            else hashed_password
        )
        return bcrypt.checkpw(_password_bytes(password), h)
    except (ValueError, TypeError):
        return False


def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(hours=ACCESS_TOKEN_EXPIRE_HOURS)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt
