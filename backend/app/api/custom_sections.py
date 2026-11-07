from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.models.models import CustomSection, User
from app.schemas.schemas import (
    CustomSectionOut, CustomSectionCreate, CustomSectionUpdate
)
from app.api.deps import get_current_active_admin

router = APIRouter(prefix="/custom-sections", tags=["Custom Sections"])


@router.get("", response_model=List[CustomSectionOut])
def get_custom_sections(db: Session = Depends(get_db)):
    return db.query(CustomSection).filter(CustomSection.is_visible == True).order_by(CustomSection.display_order.asc()).all()


@router.get("/all", response_model=List[CustomSectionOut])
def get_all_custom_sections_admin(
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_active_admin),
):
    return db.query(CustomSection).order_by(CustomSection.display_order.asc()).all()


@router.get("/{slug_or_id}", response_model=CustomSectionOut)
def get_custom_section(slug_or_id: str, db: Session = Depends(get_db)):
    section = (
        db.query(CustomSection)
        .filter((CustomSection.slug == slug_or_id) | (CustomSection.id == slug_or_id))
        .first()
    )
    if not section:
        raise HTTPException(status_code=404, detail="Custom section not found")
    return section


@router.post("", response_model=CustomSectionOut, status_code=status.HTTP_201_CREATED)
def create_custom_section(
    section_in: CustomSectionCreate,
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_active_admin),
):
    existing = db.query(CustomSection).filter(CustomSection.slug == section_in.slug).first()
    if existing:
        raise HTTPException(status_code=400, detail="A section with this slug already exists")
    section = CustomSection(**section_in.model_dump())
    db.add(section)
    db.commit()
    db.refresh(section)
    return section


@router.put("/{section_id}", response_model=CustomSectionOut)
def update_custom_section(
    section_id: str,
    section_in: CustomSectionUpdate,
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_active_admin),
):
    section = db.query(CustomSection).filter(CustomSection.id == section_id).first()
    if not section:
        raise HTTPException(status_code=404, detail="Custom section not found")
    
    update_data = section_in.model_dump(exclude_unset=True)
    if "slug" in update_data and update_data["slug"] != section.slug:
        existing = db.query(CustomSection).filter(CustomSection.slug == update_data["slug"]).first()
        if existing:
            raise HTTPException(status_code=400, detail="A section with this slug already exists")
            
    for field, value in update_data.items():
        setattr(section, field, value)
        
    db.commit()
    db.refresh(section)
    return section


@router.delete("/{section_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_custom_section(
    section_id: str,
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_active_admin),
):
    section = db.query(CustomSection).filter(CustomSection.id == section_id).first()
    if not section:
        raise HTTPException(status_code=404, detail="Custom section not found")
    db.delete(section)
    db.commit()
    return None
