from enum import Enum
from typing import Optional, List
from datetime import datetime
from pydantic import BaseModel, Field, ConfigDict

class BarrierCategory(str, Enum):
    STAIRS_NO_RAMP = "stairs_no_ramp"
    STEEP_INCLINE = "steep_incline"
    MISSING_CURB_CUT = "missing_curb_cut"
    BROKEN_PAVEMENT = "broken_pavement"
    NARROW_SIDEWALK = "narrow_sidewalk"
    CONSTRUCTION_OBSTRUCTION = "construction_obstruction"
    POLE_OR_SIGN_OBSTRUCTION = "pole_obstruction"
    INOPERABLE_ELEVATOR = "inoperable_elevator"
    OTHER = "other"

class VerificationStatus(str, Enum):
    COMMUNITY_REPORTED = "community_reported"
    AI_SUGGESTED = "ai_suggested"
    VERIFIED_BARRIER = "verified_barrier"
    RESOLVED = "resolved"

class BarrierReportCreate(BaseModel):
    category: BarrierCategory
    title: str = Field(..., max_length=150)
    description: str = Field(..., max_length=1000)
    lat: float
    lng: float
    severity: str = "high"  # low, medium, high, blocking
    image_url: Optional[str] = None
    source: str = "user"  # "user", "ai_vision", "demo"

class BarrierReportResponse(BaseModel):
    id: int
    category: BarrierCategory
    title: str
    description: str
    lat: float
    lng: float
    severity: str
    verification_status: VerificationStatus
    upvotes: int
    image_url: Optional[str] = None
    created_at: datetime
    updated_at: Optional[datetime] = None
    source: str

    model_config = ConfigDict(from_attributes=True)

class BarrierStatusUpdate(BaseModel):
    verification_status: VerificationStatus
