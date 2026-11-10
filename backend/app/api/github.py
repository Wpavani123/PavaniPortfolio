from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.models.models import GitHubProfile, User
from app.schemas.schemas import GitHubProfileOut, GitHubProfileUpdate
from app.api.deps import get_current_active_admin

router = APIRouter(prefix="/github", tags=["GitHub"])


@router.get("", response_model=GitHubProfileOut)
def get_github_profile(db: Session = Depends(get_db)):
    profile = db.query(GitHubProfile).first()
    if not profile:
        raise HTTPException(status_code=404, detail="GitHub profile has not been configured")
    return profile


@router.put("", response_model=GitHubProfileOut)
def update_github_profile(
    profile_in: GitHubProfileUpdate,
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_active_admin),
):
    profile = db.query(GitHubProfile).first()
    if not profile:
        profile = GitHubProfile()
        db.add(profile)
    for field, value in profile_in.model_dump(exclude_unset=True).items():
        setattr(profile, field, value)
    db.commit()
    db.refresh(profile)
    return profile
