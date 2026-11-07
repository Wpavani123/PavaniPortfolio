from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.models.models import SocialLink, User
from app.schemas.schemas import SocialLinkOut, SocialLinkCreate, SocialLinkUpdate
from app.api.deps import get_current_active_admin

router = APIRouter(prefix="/social-links", tags=["Social Links"])


@router.get("", response_model=List[SocialLinkOut])
def get_social_links(db: Session = Depends(get_db)):
    return db.query(SocialLink).filter(SocialLink.is_visible == True).order_by(SocialLink.display_order.asc()).all()


@router.get("/all", response_model=List[SocialLinkOut])
def get_all_social_links_admin(
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_active_admin),
):
    return db.query(SocialLink).order_by(SocialLink.display_order.asc()).all()


@router.post("", response_model=SocialLinkOut, status_code=status.HTTP_201_CREATED)
def create_social_link(
    link_in: SocialLinkCreate,
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_active_admin),
):
    link = SocialLink(**link_in.model_dump())
    db.add(link)
    db.commit()
    db.refresh(link)
    return link


@router.put("/{link_id}", response_model=SocialLinkOut)
def update_social_link(
    link_id: str,
    link_in: SocialLinkUpdate,
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_active_admin),
):
    link = db.query(SocialLink).filter(SocialLink.id == link_id).first()
    if not link:
        raise HTTPException(status_code=404, detail="Social link not found")
    for field, value in link_in.model_dump(exclude_unset=True).items():
        setattr(link, field, value)
    db.commit()
    db.refresh(link)
    return link


@router.delete("/{link_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_social_link(
    link_id: str,
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_active_admin),
):
    link = db.query(SocialLink).filter(SocialLink.id == link_id).first()
    if not link:
        raise HTTPException(status_code=404, detail="Social link not found")
    db.delete(link)
    db.commit()
    return None
