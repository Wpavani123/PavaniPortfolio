import os
import shutil
import uuid
from abc import ABC, abstractmethod
from typing import Tuple
from fastapi import UploadFile, HTTPException
from app.core.config import settings


class StorageBackend(ABC):
    @abstractmethod
    async def save(self, file: UploadFile, folder: str = "common") -> Tuple[str, str, int]:
        """Returns (public_url, relative_path, file_size)"""
        pass

    @abstractmethod
    async def delete(self, file_path_or_url: str) -> bool:
        pass


class LocalStorageBackend(StorageBackend):
    def __init__(self, base_dir: str = settings.UPLOAD_DIR):
        self.base_dir = base_dir

    async def save(self, file: UploadFile, folder: str = "common") -> Tuple[str, str, int]:
        target_dir = os.path.join(self.base_dir, folder)
        os.makedirs(target_dir, exist_ok=True)

        original_ext = os.path.splitext(file.filename or "")[1].lower()
        unique_name = f"{uuid.uuid4().hex[:12]}{original_ext}"
        destination = os.path.join(target_dir, unique_name)

        # Write file contents
        size = 0
        with open(destination, "wb") as buffer:
            while chunk := await file.read(1024 * 1024):  # 1MB chunks
                size += len(chunk)
                if size > settings.MAX_FILE_SIZE_MB * 1024 * 1024:
                    os.remove(destination)
                    raise HTTPException(
                        status_code=400,
                        detail=f"File exceeds maximum allowed size of {settings.MAX_FILE_SIZE_MB}MB"
                    )
                buffer.write(chunk)

        relative_path = f"{folder}/{unique_name}".replace("\\", "/")
        public_url = f"/api/uploads/{relative_path}"
        return public_url, relative_path, size

    async def delete(self, file_path_or_url: str) -> bool:
        clean_path = file_path_or_url.replace("/api/uploads/", "").lstrip("/")
        full_path = os.path.join(self.base_dir, clean_path)
        if os.path.exists(full_path):
            try:
                os.remove(full_path)
                return True
            except Exception:
                return False
        return False


def get_storage() -> StorageBackend:
    # Pluggable backend: easily swap with S3StorageBackend when AWS/R2 env vars are supplied
    return LocalStorageBackend()
