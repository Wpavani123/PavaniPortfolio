from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.models.models import GitHubProfile, User
from app.schemas.schemas import GitHubProfileOut, GitHubProfileUpdate
from app.api.deps import get_current_active_admin

router = APIRouter(prefix="/github", tags=["GitHub"])


@router.get("", response_model=GitHubProfileOut)
def get_github_profile(db: Session = Depends(get_db)):
    profile = db.query(GitHubProfile).first()
    if not profile:
        profile = GitHubProfile(
            username="Wpavani123",
            profile_url="https://github.com/Wpavani123",
            bio="AWS Certified Cloud/DevOps Enthusiast building scalable cloud infrastructure.",
            public_repos=8,
            followers=1,
            following=2,
            pinned_repos=[
                {
                    "name": "aws-cloud-web-server",
                    "description": "Automated deployment of an Apache Web Server on AWS EC2 inside a custom VPC with CloudWatch metrics.",
                    "language": "HCL / Shell",
                    "stars": 0,
                    "forks": 0,
                    "url": "https://github.com/Wpavani123",
                },
                {
                    "name": "python-cloud-automation",
                    "description": "Python automation scripts for AWS resource audits, S3 bucket cleanups, and cost monitoring.",
                    "language": "Python",
                    "stars": 0,
                    "forks": 0,
                    "url": "https://github.com/Wpavani123",
                },
            ]
        )
        db.add(profile)
        db.commit()
        db.refresh(profile)
    return profile


@router.put("", response_model=GitHubProfileOut)
def update_github_profile(
    profile_in: GitHubProfileUpdate,
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_active_admin),
):
    profile = db.query(GitHubProfile).first()
    if not profile:
        profile = GitHubProfile()
        db.add(profile)
    for field, value in profile_in.model_dump(exclude_unset=True).items():
        setattr(profile, field, value)
    db.commit()
    db.refresh(profile)
    return profile
