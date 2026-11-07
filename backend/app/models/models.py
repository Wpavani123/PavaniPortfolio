import uuid
from datetime import datetime, timezone
from sqlalchemy import (
    Column, String, Text, Boolean, Integer, Float, Date, DateTime, ForeignKey, JSON
)
from sqlalchemy.orm import relationship
from app.database.session import Base


def generate_uuid() -> str:
    return str(uuid.uuid4())


def utc_now() -> datetime:
    return datetime.now(timezone.utc)


class User(Base):
    __tablename__ = "users"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    email = Column(String(255), unique=True, index=True, nullable=False)
    username = Column(String(100), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    role = Column(String(50), default="admin", nullable=False)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=utc_now)
    updated_at = Column(DateTime, default=utc_now, onupdate=utc_now)


class Profile(Base):
    __tablename__ = "profile"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    full_name = Column(String(150), nullable=False, default="Nimmana Pavani")
    professional_title = Column(String(200), default="AWS Certified Cloud & DevOps Engineer")
    headline = Column(String(255), default="AWS | Cloud | DevOps | Python | AI Enthusiast")
    phone = Column(String(50), default="+91-8121082482")
    email = Column(String(255), default="pavaninimmana10@gmail.com")
    location = Column(String(150), default="India")
    short_bio = Column(
        Text,
        default="Cloud-focused Computer Science graduate with hands-on experience in AWS, Linux, Python and DevOps technologies, building secure, scalable and cloud-based solutions."
    )
    long_bio = Column(
        Text,
        default="Passionate technologist with strong foundations in AWS cloud infrastructure, automation, Linux system administration, and modern software development practices. Eager to solve real-world scalability and deployment challenges."
    )
    profile_image = Column(String(500), nullable=True)
    resume_url = Column(String(500), nullable=True)
    created_at = Column(DateTime, default=utc_now)
    updated_at = Column(DateTime, default=utc_now, onupdate=utc_now)


class SocialLink(Base):
    __tablename__ = "social_links"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    platform = Column(String(100), nullable=False)  # LinkedIn, GitHub, YouTube, LeetCode, X
    username = Column(String(150), nullable=True)
    url = Column(String(500), nullable=False)
    icon = Column(String(100), nullable=True)
    display_order = Column(Integer, default=0)
    is_visible = Column(Boolean, default=True)
    created_at = Column(DateTime, default=utc_now)
    updated_at = Column(DateTime, default=utc_now, onupdate=utc_now)


class Skill(Base):
    __tablename__ = "skills"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    name = Column(String(150), nullable=False, index=True)
    category = Column(String(100), nullable=False, index=True)  # Cloud, DevOps, Programming, Data / BI
    level = Column(String(50), default="Intermediate")  # Beginner, Intermediate, Advanced, Expert
    years_experience = Column(Float, default=1.0)
    description = Column(Text, nullable=True)
    icon = Column(String(150), nullable=True)
    display_order = Column(Integer, default=0)
    is_featured = Column(Boolean, default=False)
    created_at = Column(DateTime, default=utc_now)
    updated_at = Column(DateTime, default=utc_now, onupdate=utc_now)

    progress_entries = relationship("SkillProgress", back_populates="skill", cascade="all, delete-orphan")


class SkillProgress(Base):
    __tablename__ = "skill_progress"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    skill_id = Column(String(36), ForeignKey("skills.id", ondelete="CASCADE"), nullable=False, index=True)
    progress_date = Column(Date, nullable=False)
    status = Column(String(100), nullable=False)  # Learning, Practicing, Advanced, Built Project
    progress_percentage = Column(Integer, default=50)  # 0 to 100
    learning_note = Column(Text, nullable=False)
    resources = Column(Text, nullable=True)
    created_at = Column(DateTime, default=utc_now)

    skill = relationship("Skill", back_populates="progress_entries")


class Project(Base):
    __tablename__ = "projects"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    title = Column(String(255), nullable=False)
    slug = Column(String(255), unique=True, index=True, nullable=False)
    short_description = Column(Text, nullable=False)
    full_description = Column(Text, nullable=False)
    category = Column(String(100), default="Cloud / DevOps", index=True)
    technologies = Column(JSON, default=list)  # ["AWS EC2", "VPC", "Linux", "Apache", "CloudWatch"]
    github_url = Column(String(500), nullable=True)
    live_url = Column(String(500), nullable=True)
    demo_url = Column(String(500), nullable=True)
    video_url = Column(String(500), nullable=True)
    image = Column(String(500), nullable=True)
    featured = Column(Boolean, default=False)
    status = Column(String(50), default="Completed")  # Planning, In Progress, Completed, Maintenance
    start_date = Column(Date, nullable=True)
    end_date = Column(Date, nullable=True)
    display_order = Column(Integer, default=0)
    created_at = Column(DateTime, default=utc_now)
    updated_at = Column(DateTime, default=utc_now, onupdate=utc_now)

    images = relationship("ProjectImage", back_populates="project", cascade="all, delete-orphan")


class ProjectImage(Base):
    __tablename__ = "project_images"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    project_id = Column(String(36), ForeignKey("projects.id", ondelete="CASCADE"), nullable=False, index=True)
    image_url = Column(String(500), nullable=False)
    caption = Column(String(255), nullable=True)
    display_order = Column(Integer, default=0)
    created_at = Column(DateTime, default=utc_now)

    project = relationship("Project", back_populates="images")


class Certification(Base):
    __tablename__ = "certifications"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    name = Column(String(255), nullable=False)
    issuer = Column(String(200), nullable=False)
    issue_date = Column(Date, nullable=True)
    expiry_date = Column(Date, nullable=True)
    credential_id = Column(String(255), nullable=True)
    credential_url = Column(String(500), nullable=True)
    certificate_file = Column(String(500), nullable=True)
    certificate_image = Column(String(500), nullable=True)
    description = Column(Text, nullable=True)
    display_order = Column(Integer, default=0)
    featured = Column(Boolean, default=True)
    created_at = Column(DateTime, default=utc_now)
    updated_at = Column(DateTime, default=utc_now, onupdate=utc_now)


class Experience(Base):
    __tablename__ = "experience"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    company = Column(String(255), nullable=False)
    role = Column(String(255), nullable=False)
    type = Column(String(100), default="Training / Simulation")  # Internship, Simulation, Full-time, Contract
    location = Column(String(150), nullable=True)
    start_date = Column(Date, nullable=True)
    end_date = Column(Date, nullable=True)
    description = Column(Text, nullable=False)
    technologies = Column(JSON, default=list)
    logo = Column(String(500), nullable=True)
    certificate = Column(String(500), nullable=True)
    display_order = Column(Integer, default=0)
    created_at = Column(DateTime, default=utc_now)
    updated_at = Column(DateTime, default=utc_now, onupdate=utc_now)


class Education(Base):
    __tablename__ = "education"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    degree = Column(String(255), nullable=False)
    institution = Column(String(255), nullable=False)
    location = Column(String(150), nullable=True)
    start_year = Column(String(50), nullable=False)
    end_year = Column(String(50), nullable=False)
    grade = Column(String(50), nullable=True)
    description = Column(Text, nullable=True)
    display_order = Column(Integer, default=0)
    created_at = Column(DateTime, default=utc_now)
    updated_at = Column(DateTime, default=utc_now, onupdate=utc_now)


class Achievement(Base):
    __tablename__ = "achievements"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    title = Column(String(255), nullable=False)
    organization = Column(String(255), nullable=True)
    date = Column(Date, nullable=True)
    description = Column(Text, nullable=False)
    image = Column(String(500), nullable=True)
    certificate = Column(String(500), nullable=True)
    link = Column(String(500), nullable=True)
    display_order = Column(Integer, default=0)
    created_at = Column(DateTime, default=utc_now)
    updated_at = Column(DateTime, default=utc_now, onupdate=utc_now)


class LeetCodeProfile(Base):
    __tablename__ = "leetcode_profile"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    username = Column(String(100), default="pavani_nimmana")
    profile_url = Column(String(500), default="https://leetcode.com/")
    total_solved = Column(Integer, default=0)
    easy = Column(Integer, default=0)
    medium = Column(Integer, default=0)
    hard = Column(Integer, default=0)
    ranking = Column(Integer, default=0)
    streak = Column(Integer, default=0)
    journey_status = Column(String(255), default="LeetCode Journey Coming Soon")
    last_updated = Column(DateTime, default=utc_now, onupdate=utc_now)


class YouTubeChannel(Base):
    __tablename__ = "youtube_channel"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    channel_name = Column(String(255), default="Nimmana Pavani Tech")
    channel_url = Column(String(500), default="https://youtube.com/")
    subscriber_count = Column(Integer, default=0)
    description = Column(Text, default="YouTube Content Coming Soon - Cloud, DevOps and Tech Tutorials")
    banner_image = Column(String(500), nullable=True)
    created_at = Column(DateTime, default=utc_now)
    updated_at = Column(DateTime, default=utc_now, onupdate=utc_now)

    videos = relationship("YouTubeVideo", back_populates="channel", cascade="all, delete-orphan")


class YouTubeVideo(Base):
    __tablename__ = "youtube_videos"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    channel_id = Column(String(36), ForeignKey("youtube_channel.id", ondelete="CASCADE"), nullable=True)
    title = Column(String(255), nullable=False)
    video_url = Column(String(500), nullable=False)
    thumbnail = Column(String(500), nullable=True)
    description = Column(Text, nullable=True)
    published_date = Column(Date, nullable=True)
    category = Column(String(100), default="Cloud")
    featured = Column(Boolean, default=False)
    display_order = Column(Integer, default=0)
    created_at = Column(DateTime, default=utc_now)
    updated_at = Column(DateTime, default=utc_now, onupdate=utc_now)

    channel = relationship("YouTubeChannel", back_populates="videos")


class GitHubProfile(Base):
    __tablename__ = "github_profile"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    username = Column(String(100), default="Wpavani123")
    profile_url = Column(String(500), default="https://github.com/Wpavani123")
    bio = Column(Text, default="AWS Certified Cloud/DevOps Enthusiast building scalable cloud infrastructure.")
    public_repos = Column(Integer, default=10)
    followers = Column(Integer, default=0)
    following = Column(Integer, default=0)
    avatar_url = Column(String(500), nullable=True)
    pinned_repos = Column(JSON, default=list)
    updated_at = Column(DateTime, default=utc_now, onupdate=utc_now)


class CustomSection(Base):
    __tablename__ = "custom_sections"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    title = Column(String(255), nullable=False)
    slug = Column(String(255), unique=True, index=True, nullable=False)
    description = Column(Text, nullable=True)
    icon = Column(String(100), default="Sparkles")
    cover_image = Column(String(500), nullable=True)
    content = Column(JSON, default=dict)  # structured blocks, items, or markdown
    section_type = Column(String(50), default="cards")  # cards, rich_text, timeline, grid
    display_order = Column(Integer, default=0)
    is_visible = Column(Boolean, default=True)
    created_at = Column(DateTime, default=utc_now)
    updated_at = Column(DateTime, default=utc_now, onupdate=utc_now)


class ContactMessage(Base):
    __tablename__ = "contact_messages"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    name = Column(String(150), nullable=False)
    email = Column(String(255), nullable=False)
    subject = Column(String(255), nullable=False)
    message = Column(Text, nullable=False)
    status = Column(String(50), default="New")  # New, Read, Replied, Archived
    created_at = Column(DateTime, default=utc_now)


class ResumeFile(Base):
    __tablename__ = "resume_files"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    file_name = Column(String(255), nullable=False)
    file_url = Column(String(500), nullable=False)
    file_size = Column(Integer, default=0)
    is_active = Column(Boolean, default=True)
    uploaded_at = Column(DateTime, default=utc_now)


class SiteSetting(Base):
    __tablename__ = "site_settings"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    site_title = Column(String(255), default="Nimmana Pavani | Cloud & DevOps Engineer")
    meta_description = Column(
        Text,
        default="Portfolio and career showcase of Nimmana Pavani, AWS Certified Cloud & DevOps Engineer."
    )
    keywords = Column(String(500), default="AWS, Cloud, DevOps, Linux, Python, CI/CD, Terraform, Docker")
    hero_subheadline = Column(String(255), default="AWS | Cloud | DevOps | Python | AI Enthusiast")
    hero_tagline = Column(
        Text,
        default="Building secure, scalable, and cloud-native solutions with AWS, Linux, and automation."
    )
    allow_contact_form = Column(Boolean, default=True)
    theme_default = Column(String(50), default="dark")
    updated_at = Column(DateTime, default=utc_now, onupdate=utc_now)
