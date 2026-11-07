from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.models.models import Certification, User
from app.schemas.schemas import (
    CertificationOut, CertificationCreate, CertificationUpdate
)
from app.api.deps import get_current_active_admin

router = APIRouter(prefix="/certifications", tags=["Certifications"])


@router.get("", response_model=List[CertificationOut])
def get_certifications(
    issuer: Optional[str] = Query(None),
    featured: Optional[bool] = Query(None),
    db: Session = Depends(get_db),
):
    query = db.query(Certification)
    if issuer:
        query = query.filter(Certification.issuer.ilike(f"%{issuer}%"))
    if featured is not None:
        query = query.filter(Certification.featured == featured)
    return query.order_by(Certification.display_order.asc(), Certification.issue_date.desc()).all()


@router.post("", response_model=CertificationOut, status_code=status.HTTP_201_CREATED)
def create_certification(
    cert_in: CertificationCreate,
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_active_admin),
):
    cert = Certification(**cert_in.model_dump())
    db.add(cert)
    db.commit()
    db.refresh(cert)
    return cert


@router.put("/{cert_id}", response_model=CertificationOut)
def update_certification(
    cert_id: str,
    cert_in: CertificationUpdate,
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_active_admin),
):
    cert = db.query(Certification).filter(Certification.id == cert_id).first()
    if not cert:
        raise HTTPException(status_code=404, detail="Certification not found")
    for field, value in cert_in.model_dump(exclude_unset=True).items():
        setattr(cert, field, value)
    db.commit()
    db.refresh(cert)
    return cert


@router.delete("/{cert_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_certification(
    cert_id: str,
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_active_admin),
):
    cert = db.query(Certification).filter(Certification.id == cert_id).first()
    if not cert:
        raise HTTPException(status_code=404, detail="Certification not found")
    db.delete(cert)
    db.commit()
    return None
