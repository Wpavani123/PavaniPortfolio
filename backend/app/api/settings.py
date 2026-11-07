from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.models.models import SiteSetting, User
from app.schemas.schemas import SiteSettingOut, SiteSettingUpdate
from app.api.deps import get_current_active_admin

router = APIRouter(prefix="/settings", tags=["Site Settings"])


@router.get("", response_model=SiteSettingOut)
def get_site_settings(db: Session = Depends(get_db)):
    setting = db.query(SiteSetting).first()
    if not setting:
        setting = SiteSetting()
        db.add(setting)
        db.commit()
        db.refresh(setting)
    return setting


@router.put("", response_model=SiteSettingOut)
def update_site_settings(
    settings_in: SiteSettingUpdate,
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_active_admin),
):
    setting = db.query(SiteSetting).first()
    if not setting:
        setting = SiteSetting()
        db.add(setting)
    for field, value in settings_in.model_dump(exclude_unset=True).items():
        setattr(setting, field, value)
    db.commit()
    db.refresh(setting)
    return setting
