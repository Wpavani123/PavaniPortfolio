from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.models.models import ContactMessage, User
from app.schemas.schemas import (
    ContactMessageCreate, ContactMessageUpdate, ContactMessageOut
)
from app.api.deps import get_current_active_admin

router = APIRouter(prefix="/contact", tags=["Contact & Messages"])


@router.post("", response_model=ContactMessageOut, status_code=status.HTTP_201_CREATED)
def submit_contact_message(
    message_in: ContactMessageCreate,
    db: Session = Depends(get_db),
):
    msg = ContactMessage(
        name=message_in.name.strip(),
        email=message_in.email.strip().lower(),
        subject=message_in.subject.strip(),
        message=message_in.message.strip(),
        status="New",
    )
    db.add(msg)
    db.commit()
    db.refresh(msg)
    return msg


@router.get("/messages", response_model=List[ContactMessageOut])
def get_contact_messages(
    status_filter: Optional[str] = Query(None, alias="status"),
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_active_admin),
):
    query = db.query(ContactMessage)
    if status_filter:
        query = query.filter(ContactMessage.status == status_filter)
    return query.order_by(ContactMessage.created_at.desc()).all()


@router.put("/messages/{message_id}/status", response_model=ContactMessageOut)
def update_message_status(
    message_id: str,
    status_update: ContactMessageUpdate,
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_active_admin),
):
    msg = db.query(ContactMessage).filter(ContactMessage.id == message_id).first()
    if not msg:
        raise HTTPException(status_code=404, detail="Message not found")
    msg.status = status_update.status
    db.commit()
    db.refresh(msg)
    return msg


@router.delete("/messages/{message_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_contact_message(
    message_id: str,
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_active_admin),
):
    msg = db.query(ContactMessage).filter(ContactMessage.id == message_id).first()
    if not msg:
        raise HTTPException(status_code=404, detail="Message not found")
    db.delete(msg)
    db.commit()
    return None
