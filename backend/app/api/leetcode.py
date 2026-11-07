from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.models.models import LeetCodeProfile, User
from app.schemas.schemas import LeetCodeProfileOut, LeetCodeProfileUpdate
from app.api.deps import get_current_active_admin

router = APIRouter(prefix="/leetcode", tags=["LeetCode"])


@router.get("", response_model=LeetCodeProfileOut)
def get_leetcode_profile(db: Session = Depends(get_db)):
    profile = db.query(LeetCodeProfile).first()
    if not profile:
        profile = LeetCodeProfile()
        db.add(profile)
        db.commit()
        db.refresh(profile)
    return profile


@router.put("", response_model=LeetCodeProfileOut)
def update_leetcode_profile(
    profile_in: LeetCodeProfileUpdate,
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_active_admin),
):
    profile = db.query(LeetCodeProfile).first()
    if not profile:
        profile = LeetCodeProfile()
        db.add(profile)
    for field, value in profile_in.model_dump(exclude_unset=True).items():
        setattr(profile, field, value)
    db.commit()
    db.refresh(profile)
    return profile
