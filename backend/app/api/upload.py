import os
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form, status
from pydantic import BaseModel
from app.core.config import settings
from app.core.storage import get_storage
from app.models.models import User
from app.api.deps import get_current_active_admin

router = APIRouter(prefix="/upload", tags=["File Upload"])


class UploadResponse(BaseModel):
    url: str
    relative_path: str
    file_size: int
    filename: str


@router.post("", response_model=UploadResponse, status_code=status.HTTP_201_CREATED)
async def upload_file(
    file: UploadFile = File(...),
    folder: str = Form("common"),
    admin: User = Depends(get_current_active_admin),
):
    safe_folder = folder if folder in ["profiles", "projects", "certificates", "achievements", "common"] else "common"
    
    # Check mime type
    content_type = file.content_type or ""
    valid_image = any(content_type.startswith(t.split("/")[0]) for t in settings.ALLOWED_IMAGE_TYPES)
    valid_pdf = content_type in settings.ALLOWED_DOC_TYPES or file.filename.lower().endswith(".pdf")
    
    if not (valid_image or valid_pdf):
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported file type: {content_type}. Allowed: images (JPG, PNG, WebP, SVG) and PDF."
        )

    storage = get_storage()
    public_url, relative_path, file_size = await storage.save(file, folder=safe_folder)

    return UploadResponse(
        url=public_url,
        relative_path=relative_path,
        file_size=file_size,
        filename=file.filename or "file",
    )
