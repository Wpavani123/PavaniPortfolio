import bcrypt
import hashlib
import hmac
from datetime import datetime, timedelta, timezone
from typing import Any, Union, Optional
from jose import jwt
from app.core.config import settings


def verify_admin_name(candidate: str) -> bool:
    configured_name = settings.ADMIN_NAME
    if not configured_name or not candidate:
        return False

    salt = hashlib.sha256(
        f"portfolio-admin-name:{settings.SECRET_KEY}".encode("utf-8")
    ).digest()
    candidate_hash = hashlib.pbkdf2_hmac(
        "sha256", candidate.encode("utf-8"), salt, 600_000
    )
    configured_hash = hashlib.pbkdf2_hmac(
        "sha256", configured_name.encode("utf-8"), salt, 600_000
    )
    return hmac.compare_digest(candidate_hash, configured_hash)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    try:
        # bcrypt requires bytes and max 72 bytes
        pwd_bytes = plain_password[:72].encode("utf-8")
        hash_bytes = hashed_password.encode("utf-8")
        return bcrypt.checkpw(pwd_bytes, hash_bytes)
    except Exception:
        return False


def get_password_hash(password: str) -> str:
    pwd_bytes = password[:72].encode("utf-8")
    salt = bcrypt.gensalt()
    return bcrypt.hashpw(pwd_bytes, salt).decode("utf-8")


def create_access_token(subject: Union[str, Any], expires_delta: Optional[timedelta] = None) -> str:
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode = {
        "exp": expire,
        "sub": str(subject),
        "auth_method": "admin_name",
    }
    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
    return encoded_jwt


def decode_access_token(token: str) -> Optional[dict]:
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        return payload
    except Exception:
        return None
