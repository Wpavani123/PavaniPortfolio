from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.models.models import Skill, SkillProgress, User
from app.schemas.schemas import (
    SkillOut, SkillCreate, SkillUpdate,
    SkillProgressOut, SkillProgressCreate, SkillProgressBase
)
from app.api.deps import get_current_active_admin

router = APIRouter(prefix="/skills", tags=["Skills & Progress"])


# --- Skills ---
@router.get("", response_model=List[SkillOut])
def get_skills(
    category: Optional[str] = Query(None, description="Filter by skill category"),
    featured: Optional[bool] = Query(None, description="Filter by featured flag"),
    db: Session = Depends(get_db),
):
    query = db.query(Skill)
    if category:
        query = query.filter(Skill.category == category)
    if featured is not None:
        query = query.filter(Skill.is_featured == featured)
    return query.order_by(Skill.category.asc(), Skill.display_order.asc(), Skill.name.asc()).all()


@router.post("", response_model=SkillOut, status_code=status.HTTP_201_CREATED)
def create_skill(
    skill_in: SkillCreate,
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_active_admin),
):
    skill = Skill(**skill_in.model_dump())
    db.add(skill)
    db.commit()
    db.refresh(skill)
    return skill


@router.get("/{skill_id}", response_model=SkillOut)
def get_skill(skill_id: str, db: Session = Depends(get_db)):
    skill = db.query(Skill).filter(Skill.id == skill_id).first()
    if not skill:
        raise HTTPException(status_code=404, detail="Skill not found")
    return skill


@router.put("/{skill_id}", response_model=SkillOut)
def update_skill(
    skill_id: str,
    skill_in: SkillUpdate,
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_active_admin),
):
    skill = db.query(Skill).filter(Skill.id == skill_id).first()
    if not skill:
        raise HTTPException(status_code=404, detail="Skill not found")
    for field, value in skill_in.model_dump(exclude_unset=True).items():
        setattr(skill, field, value)
    db.commit()
    db.refresh(skill)
    return skill


@router.delete("/{skill_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_skill(
    skill_id: str,
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_active_admin),
):
    skill = db.query(Skill).filter(Skill.id == skill_id).first()
    if not skill:
        raise HTTPException(status_code=404, detail="Skill not found")
    db.delete(skill)
    db.commit()
    return None


# --- Skill Daily Progress Tracking ---
@router.get("/progress/all", response_model=List[SkillProgressOut])
def get_all_progress(
    limit: int = 50,
    db: Session = Depends(get_db),
):
    return (
        db.query(SkillProgress)
        .order_by(SkillProgress.progress_date.desc(), SkillProgress.created_at.desc())
        .limit(limit)
        .all()
    )


@router.get("/{skill_id}/progress", response_model=List[SkillProgressOut])
def get_skill_progress(skill_id: str, db: Session = Depends(get_db)):
    return (
        db.query(SkillProgress)
        .filter(SkillProgress.skill_id == skill_id)
        .order_by(SkillProgress.progress_date.desc())
        .all()
    )


@router.post("/{skill_id}/progress", response_model=SkillProgressOut, status_code=status.HTTP_201_CREATED)
def add_skill_progress(
    skill_id: str,
    progress_in: SkillProgressBase,
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_active_admin),
):
    skill = db.query(Skill).filter(Skill.id == skill_id).first()
    if not skill:
        raise HTTPException(status_code=404, detail="Skill not found")
    
    progress = SkillProgress(
        skill_id=skill_id,
        progress_date=progress_in.progress_date,
        status=progress_in.status,
        progress_percentage=progress_in.progress_percentage,
        learning_note=progress_in.learning_note,
        resources=progress_in.resources,
    )
    db.add(progress)
    db.commit()
    db.refresh(progress)
    return progress


@router.delete("/progress/{progress_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_skill_progress(
    progress_id: str,
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_active_admin),
):
    progress = db.query(SkillProgress).filter(SkillProgress.id == progress_id).first()
    if not progress:
        raise HTTPException(status_code=404, detail="Skill progress log not found")
    db.delete(progress)
    db.commit()
    return None
