from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime, timezone

from backend.app.database import get_db, Base, engine
from backend.app.db_models import BarrierReport as BarrierReportDB
from backend.app.models.barrier import (
    BarrierReportCreate, BarrierReportResponse, BarrierStatusUpdate,
    VerificationStatus, BarrierCategory
)

# Ensure database tables exist
Base.metadata.create_all(bind=engine)

router = APIRouter(prefix="/barriers", tags=["Barriers"])

def utc_now():
    return datetime.now(timezone.utc)

def seed_initial_barriers(db: Session):
    """Seed initial sample barriers if database is empty."""
    if db.query(BarrierReportDB).count() == 0:
        initial_reports = [
            BarrierReportDB(
                category=BarrierCategory.STAIRS_NO_RAMP.value,
                title="Grand Monument Flight of 18 Concrete Steps",
                description="Historic steps leading to Civic Terrace without any ADA ramp or lift. Impassable for wheelchairs.",
                lat=37.7810,
                lng=-122.4180,
                severity="blocking",
                verification_status=VerificationStatus.VERIFIED_BARRIER.value,
                upvotes=28,
                source="city_audit"
            ),
            BarrierReportDB(
                category=BarrierCategory.CONSTRUCTION_OBSTRUCTION.value,
                title="Active Water Utility Trench and Scaffolding",
                description="Utility repair on East Innovation Way. Sidewalk narrowed to 0.7m with loose gravel.",
                lat=37.7816,
                lng=-122.4167,
                severity="high",
                verification_status=VerificationStatus.COMMUNITY_REPORTED.value,
                upvotes=14,
                source="community"
            ),
            BarrierReportDB(
                category=BarrierCategory.BROKEN_PAVEMENT.value,
                title="Severe Root Upheaval on Historic Brick Alleyway",
                description="Heritage cobblestones and tree roots create a 6cm vertical lip and uneven tripping hazard.",
                lat=37.7804,
                lng=-122.4169,
                severity="medium",
                verification_status=VerificationStatus.AI_SUGGESTED.value,
                upvotes=7,
                source="ai_vision"
            ),
            BarrierReportDB(
                category=BarrierCategory.MISSING_CURB_CUT.value,
                title="Corner Curb Lacks Dropped Ramp",
                description="Curbside lip exceeds 15cm; wheelchair users forced onto vehicular road to cross.",
                lat=37.7799,
                lng=-122.4172,
                severity="high",
                verification_status=VerificationStatus.COMMUNITY_REPORTED.value,
                upvotes=9,
                source="community"
            )
        ]
        db.add_all(initial_reports)
        db.commit()

@router.get("", response_model=List[BarrierReportResponse])
def get_barriers(
    status: Optional[str] = None,
    category: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """List barrier reports with optional category and status filtering."""
    seed_initial_barriers(db)
    query = db.query(BarrierReportDB)
    if status:
        query = query.filter(BarrierReportDB.verification_status == status)
    if category:
        query = query.filter(BarrierReportDB.category == category)
    return query.order_by(BarrierReportDB.created_at.desc()).all()

@router.post("", response_model=BarrierReportResponse, status_code=201)
def create_barrier_report(
    report: BarrierReportCreate,
    db: Session = Depends(get_db)
):
    """Submit a new community accessibility barrier report."""
    db_report = BarrierReportDB(
        category=report.category.value,
        title=report.title,
        description=report.description,
        lat=report.lat,
        lng=report.lng,
        severity=report.severity,
        verification_status=VerificationStatus.AI_SUGGESTED.value if report.source == "ai_vision" else VerificationStatus.COMMUNITY_REPORTED.value,
        upvotes=1,
        image_url=report.image_url,
        source=report.source,
        created_at=utc_now(),
        updated_at=utc_now()
    )
    db.add(db_report)
    db.commit()
    db.refresh(db_report)
    return db_report

@router.patch("/{barrier_id}/status", response_model=BarrierReportResponse)
def update_barrier_status(
    barrier_id: int,
    status_update: BarrierStatusUpdate,
    db: Session = Depends(get_db)
):
    """Update verification status (e.g. community_reported -> verified_barrier or resolved)."""
    barrier = db.query(BarrierReportDB).filter(BarrierReportDB.id == barrier_id).first()
    if not barrier:
        raise HTTPException(status_code=404, detail="Barrier report not found")
    barrier.verification_status = status_update.verification_status.value
    barrier.updated_at = utc_now()
    db.commit()
    db.refresh(barrier)
    return barrier

@router.post("/{barrier_id}/upvote", response_model=BarrierReportResponse)
def upvote_barrier(
    barrier_id: int,
    db: Session = Depends(get_db)
):
    """Upvote a barrier report to boost its community priority."""
    barrier = db.query(BarrierReportDB).filter(BarrierReportDB.id == barrier_id).first()
    if not barrier:
        raise HTTPException(status_code=404, detail="Barrier report not found")
    barrier.upvotes += 1
    db.commit()
    db.refresh(barrier)
    return barrier
