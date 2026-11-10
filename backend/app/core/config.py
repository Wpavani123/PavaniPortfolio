import json
import os
from pathlib import Path
from typing import List
from pydantic import AnyHttpUrl, field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


DEFAULT_DATABASE_PATH = Path(__file__).resolve().parents[2] / "portfolio.db"


class Settings(BaseSettings):
    PROJECT_NAME: str = "Nimmana Pavani Portfolio & Career CMS API"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api"

    # Security
    SECRET_KEY: str = "replace-with-a-random-secret-before-deployment"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7  # 7 days

    # Database
    DATABASE_URL: str = f"sqlite:///{DEFAULT_DATABASE_PATH.as_posix()}"

    @field_validator("DATABASE_URL", mode="before")
    @classmethod
    def normalize_database_url(cls, value):
        if isinstance(value, str) and value.startswith("postgres://"):
            return value.replace("postgres://", "postgresql+psycopg2://", 1)
        if isinstance(value, str) and value.startswith("postgresql://"):
            return value.replace("postgresql://", "postgresql+psycopg2://", 1)
        return value

    # CORS
    BACKEND_CORS_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:8000",
        "http://127.0.0.1:8000",
        "https://pavaniportfoio.netlify.app",
    ]
    BACKEND_CORS_ORIGIN_REGEX: str | None = None

    @field_validator("BACKEND_CORS_ORIGINS", mode="before")
    @classmethod
    def parse_cors_origins(cls, value):
        if value is None:
            return []
        if isinstance(value, str):
            try:
                parsed_value = json.loads(value)
            except json.JSONDecodeError:
                parsed_value = None
            if isinstance(parsed_value, list):
                return parsed_value
            return [item.strip() for item in value.split(",") if item.strip()]
        return value

    # File Uploads
    UPLOAD_DIR: str = os.path.abspath(os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), "uploads"))
    MAX_FILE_SIZE_MB: int = 15
    ALLOWED_IMAGE_TYPES: List[str] = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/svg+xml"]
    ALLOWED_DOC_TYPES: List[str] = ["application/pdf", "image/jpeg", "image/png"]
    STORAGE_TYPE: str = "local"  # "local", "s3", or "r2"

    # Initial Admin Credentials
    ADMIN_EMAIL: str = "your-email@example.com"
    ADMIN_USERNAME: str = "admin"
    ADMIN_INITIAL_PASSWORD: str = "replace-with-a-strong-password"
    ADMIN_NAME: str | None = None

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=True,
        extra="allow",
    )


settings = Settings()

# Ensure uploads directory exists
os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
os.makedirs(os.path.join(settings.UPLOAD_DIR, "profiles"), exist_ok=True)
os.makedirs(os.path.join(settings.UPLOAD_DIR, "projects"), exist_ok=True)
os.makedirs(os.path.join(settings.UPLOAD_DIR, "certificates"), exist_ok=True)
os.makedirs(os.path.join(settings.UPLOAD_DIR, "resumes"), exist_ok=True)
os.makedirs(os.path.join(settings.UPLOAD_DIR, "achievements"), exist_ok=True)
os.makedirs(os.path.join(settings.UPLOAD_DIR, "common"), exist_ok=True)
