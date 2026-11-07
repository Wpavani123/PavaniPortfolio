from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.models.models import Profile, User
from app.schemas.schemas import ProfileOut, ProfileUpdate
from app.api.deps import get_current_active_admin

router = APIRouter(prefix="/profile", tags=["Profile"])


@router.get("", response_model=ProfileOut)
def get_profile(db: Session = Depends(get_db)):
    profile = db.query(Profile).first()
    if not profile:
        # Create default profile if not exists
        profile = Profile()
        db.add(profile)
        db.commit()
        db.refresh(profile)
    return profile


@router.put("", response_model=ProfileOut)
def update_profile(
    profile_in: ProfileUpdate,
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_active_admin),
):
    profile = db.query(Profile).first()
    if not profile:
        profile = Profile()
        db.add(profile)

    update_data = profile_in.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(profile, field, value)

    db.commit()
    db.refresh(profile)
    return profile
