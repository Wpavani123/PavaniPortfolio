from typing import List
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, status
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.models.models import ResumeFile, Profile, User
from app.schemas.schemas import ResumeFileOut
from app.core.storage import get_storage
from app.api.deps import get_current_active_admin

router = APIRouter(prefix="/resume", tags=["Resume"])


@router.get("", response_model=ResumeFileOut)
def get_active_resume(db: Session = Depends(get_db)):
    resume = db.query(ResumeFile).filter(ResumeFile.is_active == True).order_by(ResumeFile.uploaded_at.desc()).first()
    if not resume:
        raise HTTPException(status_code=404, detail="No resume has been configured")
    return resume


@router.get("/history", response_model=List[ResumeFileOut])
def get_resume_history(
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_active_admin),
):
    return db.query(ResumeFile).order_by(ResumeFile.uploaded_at.desc()).all()


@router.post("/upload", response_model=ResumeFileOut, status_code=status.HTTP_201_CREATED)
async def upload_resume(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_active_admin),
):
    if not (file.filename or "").lower().endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF resume files are permitted")

    storage = get_storage()
    public_url, relative_path, file_size = await storage.save(file, folder="resumes")

    # Deactivate existing active resumes
    db.query(ResumeFile).update({ResumeFile.is_active: False})

    new_resume = ResumeFile(
        file_name=file.filename or "Nimmana_Pavani_Resume.pdf",
        file_url=public_url,
        file_size=file_size,
        is_active=True,
    )
    db.add(new_resume)

    # Also update profile resume_url
    profile = db.query(Profile).first()
    if profile:
        profile.resume_url = public_url

    db.commit()
    db.refresh(new_resume)
    return new_resume
