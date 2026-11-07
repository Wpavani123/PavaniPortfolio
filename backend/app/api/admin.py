from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.models.models import (
    Project, Skill, Certification, Achievement,
    ContactMessage, CustomSection, LeetCodeProfile,
    SkillProgress, User
)
from app.schemas.schemas import AdminDashboardStats, ContactMessageOut, SkillProgressOut
from app.api.deps import get_current_active_admin

router = APIRouter(prefix="/admin", tags=["Admin Operations"])


@router.get("/stats", response_model=AdminDashboardStats)
def get_admin_stats(
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_active_admin),
):
    total_projects = db.query(Project).count()
    total_skills = db.query(Skill).count()
    total_certifications = db.query(Certification).count()
    total_achievements = db.query(Achievement).count()
    total_messages = db.query(ContactMessage).count()
    unread_messages = db.query(ContactMessage).filter(ContactMessage.status == "New").count()
    custom_sections_count = db.query(CustomSection).count()

    leetcode = db.query(LeetCodeProfile).first()
    leetcode_solved = leetcode.total_solved if leetcode else 0

    recent_messages = (
        db.query(ContactMessage)
        .order_by(ContactMessage.created_at.desc())
        .limit(5)
        .all()
    )

    recent_progress = (
        db.query(SkillProgress)
        .order_by(SkillProgress.progress_date.desc(), SkillProgress.created_at.desc())
        .limit(5)
        .all()
    )

    return AdminDashboardStats(
        total_projects=total_projects,
        total_skills=total_skills,
        total_certifications=total_certifications,
        total_achievements=total_achievements,
        total_messages=total_messages,
        unread_messages=unread_messages,
        custom_sections_count=custom_sections_count,
        leetcode_solved=leetcode_solved,
        recent_messages=recent_messages,
        recent_progress=recent_progress,
    )
