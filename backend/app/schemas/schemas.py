from datetime import datetime, date
from typing import Optional, List, Any, Dict
from pydantic import BaseModel, EmailStr, Field, ConfigDict


# --- Common / Auth ---
class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: "UserOut"


class TokenData(BaseModel):
    user_id: Optional[str] = None


class LoginRequest(BaseModel):
    username_or_email: str
    password: str


class UserOut(BaseModel):
    id: str
    email: str
    username: str
    role: str
    is_active: bool
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


# --- Profile ---
class ProfileBase(BaseModel):
    full_name: str
    professional_title: str
    headline: str
    phone: str
    email: str
    location: str
    short_bio: str
    long_bio: str
    profile_image: Optional[str] = None
    resume_url: Optional[str] = None


class ProfileUpdate(BaseModel):
    full_name: Optional[str] = None
    professional_title: Optional[str] = None
    headline: Optional[str] = None
    phone: Optional[str] = None
    email: Optional[str] = None
    location: Optional[str] = None
    short_bio: Optional[str] = None
    long_bio: Optional[str] = None
    profile_image: Optional[str] = None
    resume_url: Optional[str] = None


class ProfileOut(ProfileBase):
    id: str
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


# --- Social Links ---
class SocialLinkBase(BaseModel):
    platform: str
    username: Optional[str] = None
    url: str
    icon: Optional[str] = None
    display_order: int = 0
    is_visible: bool = True


class SocialLinkCreate(SocialLinkBase):
    pass


class SocialLinkUpdate(BaseModel):
    platform: Optional[str] = None
    username: Optional[str] = None
    url: Optional[str] = None
    icon: Optional[str] = None
    display_order: Optional[int] = None
    is_visible: Optional[bool] = None


class SocialLinkOut(SocialLinkBase):
    id: str
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


# --- Skills & Progress ---
class SkillProgressBase(BaseModel):
    progress_date: date
    status: str
    progress_percentage: int = Field(ge=0, le=100)
    learning_note: str
    resources: Optional[str] = None


class SkillProgressCreate(SkillProgressBase):
    skill_id: str


class SkillProgressOut(SkillProgressBase):
    id: str
    skill_id: str
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class SkillBase(BaseModel):
    name: str
    category: str
    level: str = "Intermediate"
    years_experience: float = 1.0
    description: Optional[str] = None
    icon: Optional[str] = None
    display_order: int = 0
    is_featured: bool = False


class SkillCreate(SkillBase):
    pass


class SkillUpdate(BaseModel):
    name: Optional[str] = None
    category: Optional[str] = None
    level: Optional[str] = None
    years_experience: Optional[float] = None
    description: Optional[str] = None
    icon: Optional[str] = None
    display_order: Optional[int] = None
    is_featured: Optional[bool] = None


class SkillOut(SkillBase):
    id: str
    created_at: datetime
    updated_at: datetime
    progress_entries: List[SkillProgressOut] = []

    model_config = ConfigDict(from_attributes=True)


# --- Projects & Screenshots ---
class ProjectImageBase(BaseModel):
    image_url: str
    caption: Optional[str] = None
    display_order: int = 0


class ProjectImageCreate(ProjectImageBase):
    pass


class ProjectImageOut(ProjectImageBase):
    id: str
    project_id: str
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class ProjectBase(BaseModel):
    title: str
    slug: str
    short_description: str
    full_description: str
    category: str = "Cloud / DevOps"
    technologies: List[str] = []
    github_url: Optional[str] = None
    live_url: Optional[str] = None
    demo_url: Optional[str] = None
    video_url: Optional[str] = None
    image: Optional[str] = None
    featured: bool = False
    status: str = "Completed"
    start_date: Optional[date] = None
    end_date: Optional[date] = None
    display_order: int = 0


class ProjectCreate(ProjectBase):
    pass


class ProjectUpdate(BaseModel):
    title: Optional[str] = None
    slug: Optional[str] = None
    short_description: Optional[str] = None
    full_description: Optional[str] = None
    category: Optional[str] = None
    technologies: Optional[List[str]] = None
    github_url: Optional[str] = None
    live_url: Optional[str] = None
    demo_url: Optional[str] = None
    video_url: Optional[str] = None
    image: Optional[str] = None
    featured: Optional[bool] = None
    status: Optional[str] = None
    start_date: Optional[date] = None
    end_date: Optional[date] = None
    display_order: Optional[int] = None


class ProjectOut(ProjectBase):
    id: str
    created_at: datetime
    updated_at: datetime
    images: List[ProjectImageOut] = []

    model_config = ConfigDict(from_attributes=True)


# --- Certifications ---
class CertificationBase(BaseModel):
    name: str
    issuer: str
    issue_date: Optional[date] = None
    expiry_date: Optional[date] = None
    credential_id: Optional[str] = None
    credential_url: Optional[str] = None
    certificate_file: Optional[str] = None
    certificate_image: Optional[str] = None
    description: Optional[str] = None
    display_order: int = 0
    featured: bool = True


class CertificationCreate(CertificationBase):
    pass


class CertificationUpdate(BaseModel):
    name: Optional[str] = None
    issuer: Optional[str] = None
    issue_date: Optional[date] = None
    expiry_date: Optional[date] = None
    credential_id: Optional[str] = None
    credential_url: Optional[str] = None
    certificate_file: Optional[str] = None
    certificate_image: Optional[str] = None
    description: Optional[str] = None
    display_order: Optional[int] = None
    featured: Optional[bool] = None


class CertificationOut(CertificationBase):
    id: str
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


# --- Experience ---
class ExperienceBase(BaseModel):
    company: str
    role: str
    type: str = "Training / Simulation"
    location: Optional[str] = None
    start_date: Optional[date] = None
    end_date: Optional[date] = None
    description: str
    technologies: List[str] = []
    logo: Optional[str] = None
    certificate: Optional[str] = None
    display_order: int = 0


class ExperienceCreate(ExperienceBase):
    pass


class ExperienceUpdate(BaseModel):
    company: Optional[str] = None
    role: Optional[str] = None
    type: Optional[str] = None
    location: Optional[str] = None
    start_date: Optional[date] = None
    end_date: Optional[date] = None
    description: Optional[str] = None
    technologies: Optional[List[str]] = None
    logo: Optional[str] = None
    certificate: Optional[str] = None
    display_order: Optional[int] = None


class ExperienceOut(ExperienceBase):
    id: str
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


# --- Education ---
class EducationBase(BaseModel):
    degree: str
    institution: str
    location: Optional[str] = None
    start_year: str
    end_year: str
    grade: Optional[str] = None
    description: Optional[str] = None
    display_order: int = 0


class EducationCreate(EducationBase):
    pass


class EducationUpdate(BaseModel):
    degree: Optional[str] = None
    institution: Optional[str] = None
    location: Optional[str] = None
    start_year: Optional[str] = None
    end_year: Optional[str] = None
    grade: Optional[str] = None
    description: Optional[str] = None
    display_order: Optional[int] = None


class EducationOut(EducationBase):
    id: str
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


# --- Achievements ---
class AchievementBase(BaseModel):
    title: str
    organization: Optional[str] = None
    date: Optional[date] = None
    description: str
    image: Optional[str] = None
    certificate: Optional[str] = None
    link: Optional[str] = None
    display_order: int = 0


class AchievementCreate(AchievementBase):
    pass


class AchievementUpdate(BaseModel):
    title: Optional[str] = None
    organization: Optional[str] = None
    date: Optional[date] = None
    description: Optional[str] = None
    image: Optional[str] = None
    certificate: Optional[str] = None
    link: Optional[str] = None
    display_order: Optional[int] = None


class AchievementOut(AchievementBase):
    id: str
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


# --- LeetCode Profile ---
class LeetCodeProfileBase(BaseModel):
    username: str = "pavani_nimmana"
    profile_url: str = "https://leetcode.com/"
    total_solved: int = 0
    easy: int = 0
    medium: int = 0
    hard: int = 0
    ranking: int = 0
    streak: int = 0
    journey_status: str = "LeetCode Journey Coming Soon"


class LeetCodeProfileUpdate(BaseModel):
    username: Optional[str] = None
    profile_url: Optional[str] = None
    total_solved: Optional[int] = None
    easy: Optional[int] = None
    medium: Optional[int] = None
    hard: Optional[int] = None
    ranking: Optional[int] = None
    streak: Optional[int] = None
    journey_status: Optional[str] = None


class LeetCodeProfileOut(LeetCodeProfileBase):
    id: str
    last_updated: datetime

    model_config = ConfigDict(from_attributes=True)


# --- YouTube ---
class YouTubeVideoBase(BaseModel):
    title: str
    video_url: str
    thumbnail: Optional[str] = None
    description: Optional[str] = None
    published_date: Optional[date] = None
    category: str = "Cloud"
    featured: bool = False
    display_order: int = 0


class YouTubeVideoCreate(YouTubeVideoBase):
    channel_id: Optional[str] = None


class YouTubeVideoOut(YouTubeVideoBase):
    id: str
    channel_id: Optional[str] = None
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


class YouTubeChannelBase(BaseModel):
    channel_name: str = "Nimmana Pavani Tech"
    channel_url: str = "https://youtube.com/"
    subscriber_count: int = 0
    description: str = "YouTube Content Coming Soon - Cloud, DevOps and Tech Tutorials"
    banner_image: Optional[str] = None


class YouTubeChannelUpdate(BaseModel):
    channel_name: Optional[str] = None
    channel_url: Optional[str] = None
    subscriber_count: Optional[int] = None
    description: Optional[str] = None
    banner_image: Optional[str] = None


class YouTubeChannelOut(YouTubeChannelBase):
    id: str
    created_at: datetime
    updated_at: datetime
    videos: List[YouTubeVideoOut] = []

    model_config = ConfigDict(from_attributes=True)


# --- GitHub ---
class GitHubProfileBase(BaseModel):
    username: str = "Wpavani123"
    profile_url: str = "https://github.com/Wpavani123"
    bio: str = "AWS Certified Cloud/DevOps Enthusiast building scalable cloud infrastructure."
    public_repos: int = 10
    followers: int = 0
    following: int = 0
    avatar_url: Optional[str] = None
    pinned_repos: List[Dict[str, Any]] = []


class GitHubProfileUpdate(BaseModel):
    username: Optional[str] = None
    profile_url: Optional[str] = None
    bio: Optional[str] = None
    public_repos: Optional[int] = None
    followers: Optional[int] = None
    following: Optional[int] = None
    avatar_url: Optional[str] = None
    pinned_repos: Optional[List[Dict[str, Any]]] = None


class GitHubProfileOut(GitHubProfileBase):
    id: str
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


# --- Custom Sections ---
class CustomSectionBase(BaseModel):
    title: str
    slug: str
    description: Optional[str] = None
    icon: str = "Sparkles"
    cover_image: Optional[str] = None
    content: Any = {}
    section_type: str = "cards"  # cards, rich_text, timeline, grid
    display_order: int = 0
    is_visible: bool = True


class CustomSectionCreate(CustomSectionBase):
    pass


class CustomSectionUpdate(BaseModel):
    title: Optional[str] = None
    slug: Optional[str] = None
    description: Optional[str] = None
    icon: Optional[str] = None
    cover_image: Optional[str] = None
    content: Optional[Any] = None
    section_type: Optional[str] = None
    display_order: Optional[int] = None
    is_visible: Optional[bool] = None


class CustomSectionOut(CustomSectionBase):
    id: str
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


# --- Contact ---
class ContactMessageCreate(BaseModel):
    name: str = Field(min_length=2, max_length=150)
    email: str = Field(min_length=5, max_length=255)
    subject: str = Field(min_length=2, max_length=255)
    message: str = Field(min_length=10)


class ContactMessageUpdate(BaseModel):
    status: str  # New, Read, Replied, Archived


class ContactMessageOut(BaseModel):
    id: str
    name: str
    email: str
    subject: str
    message: str
    status: str
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


# --- Resume ---
class ResumeFileOut(BaseModel):
    id: str
    file_name: str
    file_url: str
    file_size: int
    is_active: bool
    uploaded_at: datetime

    model_config = ConfigDict(from_attributes=True)


# --- Site Settings ---
class SiteSettingBase(BaseModel):
    site_title: str
    meta_description: str
    keywords: str
    hero_subheadline: str
    hero_tagline: str
    allow_contact_form: bool = True
    theme_default: str = "dark"


class SiteSettingUpdate(BaseModel):
    site_title: Optional[str] = None
    meta_description: Optional[str] = None
    keywords: Optional[str] = None
    hero_subheadline: Optional[str] = None
    hero_tagline: Optional[str] = None
    allow_contact_form: Optional[bool] = None
    theme_default: Optional[str] = None


class SiteSettingOut(SiteSettingBase):
    id: str
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


# --- Admin Stats ---
class AdminDashboardStats(BaseModel):
    total_projects: int
    total_skills: int
    total_certifications: int
    total_achievements: int
    total_messages: int
    unread_messages: int
    custom_sections_count: int
    leetcode_solved: int
    recent_messages: List[ContactMessageOut] = []
    recent_progress: List[SkillProgressOut] = []
