from enum import Enum
from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field

class AccessibilityStatus(str, Enum):
    KNOWN_ACCESSIBLE = "known_accessible"
    KNOWN_BARRIER = "known_barrier"
    UNKNOWN = "unknown"

class MobilityProfile(str, Enum):
    WHEELCHAIR = "wheelchair"
    WALKER_CANE = "walker_cane"
    STROLLER_ELDERLY = "stroller_elderly"
    STANDARD = "standard"

class NetworkNode(BaseModel):
    id: str
    name: str
    lat: float
    lng: float
    description: Optional[str] = None
    node_type: str = "intersection"

class NetworkEdge(BaseModel):
    id: str
    source: str
    target: str
    distance: float  # in meters
    surface: str  # paved_smooth, asphalt, concrete, cobblestone, gravel, unpaved
    stairs: bool = False
    step_count: int = 0
    ramps: bool = False
    ramp_slope_pct: float = 0.0  # e.g. 5.0 = 5% grade
    slope: float = 0.0  # slope gradient % (e.g. 3.0 = 3%)
    width: float = 1.8  # width in meters
    curb_cuts: bool = True
    construction_blocked: bool = False
    accessibility_status: AccessibilityStatus = AccessibilityStatus.UNKNOWN
    description: str = ""
    geometry: Optional[List[List[float]]] = None  # [[lat, lng], [lat, lng]]

class RouteRequest(BaseModel):
    source_node_id: str
    target_node_id: str
    profile: MobilityProfile = MobilityProfile.WHEELCHAIR

class RouteSegment(BaseModel):
    edge_id: str
    source: str
    target: str
    source_name: str
    target_name: str
    distance: float
    surface: str
    stairs: bool
    step_count: int
    ramps: bool
    ramp_slope_pct: float
    slope: float
    width: float
    curb_cuts: bool
    accessibility_status: AccessibilityStatus
    description: str
    geometry: List[List[float]]
    segment_explanation: str

class RouteResult(BaseModel):
    route_id: str
    profile: MobilityProfile
    total_distance_m: float
    estimated_time_s: int
    estimated_time_formatted: str
    path_node_ids: List[str]
    segments: List[RouteSegment]
    coordinates: List[List[float]]
    stairs_count: int
    steep_slopes_count: int
    curb_cuts_missing_count: int
    narrow_paths_count: int
    accessibility_breakdown: Dict[str, float]  # meters per status
    decision_explanation: str
    is_valid: bool = True
    warnings: List[str] = []

class ComparisonDifference(BaseModel):
    distance_delta_m: float
    time_delta_s: int
    barriers_avoided: List[str]
    summary_verdict: str
    why_accessible_chosen: str

class RouteComparisonResponse(BaseModel):
    source_node: NetworkNode
    target_node: NetworkNode
    selected_profile: MobilityProfile
    shortest_route: Optional[RouteResult]
    accessible_route: Optional[RouteResult]
    comparison: Optional[ComparisonDifference]
    network_summary: Dict[str, Any]
