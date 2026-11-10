import secrets
import uuid

from sqlalchemy.orm import Session

from app.core.config import settings
from app.core.security import get_password_hash
from app.models.models import Profile, SiteSetting, User


def ensure_initial_records(db: Session) -> None:
    """Create only missing baseline records without changing existing portfolio data."""
    changed = False

    if db.query(Profile).first() is None:
        db.add(Profile())
        changed = True

    if db.query(SiteSetting).first() is None:
        db.add(SiteSetting())
        changed = True

    if settings.ADMIN_NAME and db.query(User).filter(User.role == "admin").first() is None:
        suffix = uuid.uuid4().hex
        email = settings.ADMIN_EMAIL
        username = settings.ADMIN_USERNAME

        if db.query(User).filter(User.email == email).first():
            email = f"portfolio-admin-{suffix}@invalid.local"
        if db.query(User).filter(User.username == username).first():
            username = f"portfolio-admin-{suffix}"

        db.add(
            User(
                email=email,
                username=username,
                hashed_password=get_password_hash(secrets.token_urlsafe(48)),
                role="admin",
                is_active=True,
            )
        )
        changed = True

    if changed:
        try:
            db.commit()
        except Exception:
            db.rollback()
            raise
