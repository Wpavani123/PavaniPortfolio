from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.models.models import Experience, User
from app.schemas.schemas import ExperienceOut, ExperienceCreate, ExperienceUpdate
from app.api.deps import get_current_active_admin

router = APIRouter(prefix="/experience", tags=["Experience"])


@router.get("", response_model=List[ExperienceOut])
def get_experience(db: Session = Depends(get_db)):
    return db.query(Experience).order_by(Experience.display_order.asc(), Experience.start_date.desc()).all()


@router.post("", response_model=ExperienceOut, status_code=status.HTTP_201_CREATED)
def create_experience(
    exp_in: ExperienceCreate,
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_active_admin),
):
    exp = Experience(**exp_in.model_dump())
    db.add(exp)
    db.commit()
    db.refresh(exp)
    return exp


@router.put("/{exp_id}", response_model=ExperienceOut)
def update_experience(
    exp_id: str,
    exp_in: ExperienceUpdate,
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_active_admin),
):
    exp = db.query(Experience).filter(Experience.id == exp_id).first()
    if not exp:
        raise HTTPException(status_code=404, detail="Experience record not found")
    for field, value in exp_in.model_dump(exclude_unset=True).items():
        setattr(exp, field, value)
    db.commit()
    db.refresh(exp)
    return exp


@router.delete("/{exp_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_experience(
    exp_id: str,
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_active_admin),
):
    exp = db.query(Experience).filter(Experience.id == exp_id).first()
    if not exp:
        raise HTTPException(status_code=404, detail="Experience record not found")
    db.delete(exp)
    db.commit()
    return None
