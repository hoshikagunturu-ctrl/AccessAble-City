from typing import List, Optional
from pydantic import BaseModel, Field

class DetectedFeature(BaseModel):
    label: str
    confidence: float
    description: str

class VisionAnalysisResult(BaseModel):
    is_barrier_detected: bool
    barrier_category: Optional[str] = None  # e.g. stairs_no_ramp, steep_incline, missing_curb_cut
    severity: str = "medium"  # low, medium, high, blocking
    title: str
    confidence_score: float  # 0.0 to 1.0
    detected_features: List[DetectedFeature]
    accessibility_impact: str
    recommended_action: str
    requires_human_verification: bool = True
    verification_disclaimer: str = (
        "AI-assisted preliminary finding. This does NOT certify accessibility or safety "
        "and must be verified by on-site human inspection."
    )
    analysis_mode: str = "gemini_multimodal"  # "gemini_multimodal" or "heuristic_fallback"
