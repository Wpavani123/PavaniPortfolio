from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.models.models import YouTubeChannel, YouTubeVideo, User
from app.schemas.schemas import (
    YouTubeChannelOut, YouTubeChannelUpdate,
    YouTubeVideoOut, YouTubeVideoCreate
)
from app.api.deps import get_current_active_admin

router = APIRouter(prefix="/youtube", tags=["YouTube"])


@router.get("", response_model=YouTubeChannelOut)
def get_youtube_channel(db: Session = Depends(get_db)):
    channel = db.query(YouTubeChannel).first()
    if not channel:
        raise HTTPException(status_code=404, detail="YouTube channel has not been configured")
    return channel


@router.put("/channel", response_model=YouTubeChannelOut)
def update_youtube_channel(
    channel_in: YouTubeChannelUpdate,
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_active_admin),
):
    channel = db.query(YouTubeChannel).first()
    if not channel:
        channel = YouTubeChannel()
        db.add(channel)
    for field, value in channel_in.model_dump(exclude_unset=True).items():
        setattr(channel, field, value)
    db.commit()
    db.refresh(channel)
    return channel


@router.get("/videos", response_model=List[YouTubeVideoOut])
def get_videos(db: Session = Depends(get_db)):
    return db.query(YouTubeVideo).order_by(YouTubeVideo.display_order.asc(), YouTubeVideo.published_date.desc()).all()


@router.post("/videos", response_model=YouTubeVideoOut, status_code=status.HTTP_201_CREATED)
def create_video(
    video_in: YouTubeVideoCreate,
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_active_admin),
):
    channel = db.query(YouTubeChannel).first()
    channel_id = channel.id if channel else None
    video_data = video_in.model_dump()
    if not video_data.get("channel_id"):
        video_data["channel_id"] = channel_id
        
    video = YouTubeVideo(**video_data)
    db.add(video)
    db.commit()
    db.refresh(video)
    return video


@router.delete("/videos/{video_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_video(
    video_id: str,
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_active_admin),
):
    video = db.query(YouTubeVideo).filter(YouTubeVideo.id == video_id).first()
    if not video:
        raise HTTPException(status_code=404, detail="Video not found")
    db.delete(video)
    db.commit()
    return None
