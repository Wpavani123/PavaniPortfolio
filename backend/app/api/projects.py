from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.models.models import Project, ProjectImage, User
from app.schemas.schemas import (
    ProjectOut, ProjectCreate, ProjectUpdate,
    ProjectImageOut, ProjectImageCreate
)
from app.api.deps import get_current_active_admin

router = APIRouter(prefix="/projects", tags=["Projects"])


@router.get("", response_model=List[ProjectOut])
def get_projects(
    category: Optional[str] = Query(None),
    featured: Optional[bool] = Query(None),
    search: Optional[str] = Query(None),
    db: Session = Depends(get_db),
):
    query = db.query(Project)
    if category:
        query = query.filter(Project.category == category)
    if featured is not None:
        query = query.filter(Project.featured == featured)
    if search:
        query = query.filter(
            (Project.title.ilike(f"%{search}%"))
            | (Project.short_description.ilike(f"%{search}%"))
        )
    return query.order_by(Project.display_order.asc(), Project.created_at.desc()).all()


@router.get("/{slug_or_id}", response_model=ProjectOut)
def get_project(slug_or_id: str, db: Session = Depends(get_db)):
    project = (
        db.query(Project)
        .filter((Project.slug == slug_or_id) | (Project.id == slug_or_id))
        .first()
    )
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    return project


@router.post("", response_model=ProjectOut, status_code=status.HTTP_201_CREATED)
def create_project(
    project_in: ProjectCreate,
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_active_admin),
):
    existing = db.query(Project).filter(Project.slug == project_in.slug).first()
    if existing:
        raise HTTPException(status_code=400, detail="A project with this slug already exists")
    project = Project(**project_in.model_dump())
    db.add(project)
    db.commit()
    db.refresh(project)
    return project


@router.put("/{project_id}", response_model=ProjectOut)
def update_project(
    project_id: str,
    project_in: ProjectUpdate,
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_active_admin),
):
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    
    update_data = project_in.model_dump(exclude_unset=True)
    if "slug" in update_data and update_data["slug"] != project.slug:
        existing = db.query(Project).filter(Project.slug == update_data["slug"]).first()
        if existing:
            raise HTTPException(status_code=400, detail="A project with this slug already exists")
            
    for field, value in update_data.items():
        setattr(project, field, value)
        
    db.commit()
    db.refresh(project)
    return project


@router.delete("/{project_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_project(
    project_id: str,
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_active_admin),
):
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    db.delete(project)
    db.commit()
    return None


# --- Project Screenshots / Gallery ---
@router.post("/{project_id}/images", response_model=ProjectImageOut, status_code=status.HTTP_201_CREATED)
def add_project_image(
    project_id: str,
    image_in: ProjectImageCreate,
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_active_admin),
):
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    image = ProjectImage(project_id=project_id, **image_in.model_dump())
    db.add(image)
    db.commit()
    db.refresh(image)
    return image


@router.delete("/images/{image_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_project_image(
    image_id: str,
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_active_admin),
):
    image = db.query(ProjectImage).filter(ProjectImage.id == image_id).first()
    if not image:
        raise HTTPException(status_code=404, detail="Image not found")
    db.delete(image)
    db.commit()
    return None
