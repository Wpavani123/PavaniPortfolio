from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.models.models import Education, User
from app.schemas.schemas import EducationOut, EducationCreate, EducationUpdate
from app.api.deps import get_current_active_admin

router = APIRouter(prefix="/education", tags=["Education"])


@router.get("", response_model=List[EducationOut])
def get_education(db: Session = Depends(get_db)):
    return db.query(Education).order_by(Education.display_order.asc(), Education.end_year.desc()).all()


@router.post("", response_model=EducationOut, status_code=status.HTTP_201_CREATED)
def create_education(
    edu_in: EducationCreate,
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_active_admin),
):
    edu = Education(**edu_in.model_dump())
    db.add(edu)
    db.commit()
    db.refresh(edu)
    return edu


@router.put("/{edu_id}", response_model=EducationOut)
def update_education(
    edu_id: str,
    edu_in: EducationUpdate,
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_active_admin),
):
    edu = db.query(Education).filter(Education.id == edu_id).first()
    if not edu:
        raise HTTPException(status_code=404, detail="Education record not found")
    for field, value in edu_in.model_dump(exclude_unset=True).items():
        setattr(edu, field, value)
    db.commit()
    db.refresh(edu)
    return edu


@router.delete("/{edu_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_education(
    edu_id: str,
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_active_admin),
):
    edu = db.query(Education).filter(Education.id == edu_id).first()
    if not edu:
        raise HTTPException(status_code=404, detail="Education record not found")
    db.delete(edu)
    db.commit()
    return None
