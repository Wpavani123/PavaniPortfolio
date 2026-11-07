from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.models.models import Achievement, User
from app.schemas.schemas import AchievementOut, AchievementCreate, AchievementUpdate
from app.api.deps import get_current_active_admin

router = APIRouter(prefix="/achievements", tags=["Achievements & Activities"])


@router.get("", response_model=List[AchievementOut])
def get_achievements(db: Session = Depends(get_db)):
    return db.query(Achievement).order_by(Achievement.display_order.asc(), Achievement.date.desc()).all()


@router.post("", response_model=AchievementOut, status_code=status.HTTP_201_CREATED)
def create_achievement(
    achieve_in: AchievementCreate,
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_active_admin),
):
    achieve = Achievement(**achieve_in.model_dump())
    db.add(achieve)
    db.commit()
    db.refresh(achieve)
    return achieve


@router.put("/{achieve_id}", response_model=AchievementOut)
def update_achievement(
    achieve_id: str,
    achieve_in: AchievementUpdate,
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_active_admin),
):
    achieve = db.query(Achievement).filter(Achievement.id == achieve_id).first()
    if not achieve:
        raise HTTPException(status_code=404, detail="Achievement not found")
    for field, value in achieve_in.model_dump(exclude_unset=True).items():
        setattr(achieve, field, value)
    db.commit()
    db.refresh(achieve)
    return achieve


@router.delete("/{achieve_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_achievement(
    achieve_id: str,
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_active_admin),
):
    achieve = db.query(Achievement).filter(Achievement.id == achieve_id).first()
    if not achieve:
        raise HTTPException(status_code=404, detail="Achievement not found")
    db.delete(achieve)
    db.commit()
    return None
