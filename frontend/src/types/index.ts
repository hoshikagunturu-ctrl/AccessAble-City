export type MobilityProfile = 'wheelchair' | 'walker_cane' | 'stroller_elderly' | 'standard';

export type AccessibilityStatus = 'known_accessible' | 'known_barrier' | 'unknown';

export type BarrierCategory =
  | 'stairs_no_ramp'
  | 'steep_incline'
  | 'missing_curb_cut'
  | 'broken_pavement'
  | 'narrow_sidewalk'
  | 'construction_obstruction'
  | 'pole_obstruction'
  | 'inoperable_elevator'
  | 'other';

export type VerificationStatus =
  | 'community_reported'
  | 'ai_suggested'
  | 'verified_barrier'
  | 'resolved';

export interface NetworkNode {
  id: string;
  name: string;
  lat: float;
  lng: float;
  description?: string;
  node_type: string;
}

export type float = number;

export interface NetworkEdge {
  id: string;
  source: string;
  target: string;
  distance: number;
  surface: string;
  stairs: boolean;
  step_count: number;
  ramps: boolean;
  ramp_slope_pct: number;
  slope: number;
  width: number;
  curb_cuts: boolean;
  construction_blocked: boolean;
  accessibility_status: AccessibilityStatus;
  description: string;
  geometry: [number, number][];
}

export interface RouteSegment {
  edge_id: string;
  source: string;
  target: string;
  source_name: string;
  target_name: string;
  distance: number;
  surface: string;
  stairs: boolean;
  step_count: number;
  ramps: boolean;
  ramp_slope_pct: number;
  slope: number;
  width: number;
  curb_cuts: boolean;
  accessibility_status: AccessibilityStatus;
  description: string;
  geometry: [number, number][];
  segment_explanation: string;
}

export interface RouteResult {
  route_id: string;
  profile: MobilityProfile;
  total_distance_m: number;
  estimated_time_s: number;
  estimated_time_formatted: string;
  path_node_ids: string[];
  segments: RouteSegment[];
  coordinates: [number, number][];
  stairs_count: number;
  steep_slopes_count: number;
  curb_cuts_missing_count: number;
  narrow_paths_count: number;
  accessibility_breakdown: Record<string, number>;
  decision_explanation: string;
  is_valid: boolean;
  warnings: string[];
}

export interface ComparisonDifference {
  distance_delta_m: number;
  time_delta_s: number;
  barriers_avoided: string[];
  summary_verdict: string;
  why_accessible_chosen: string;
}

export interface RouteComparisonResponse {
  source_node: NetworkNode;
  target_node: NetworkNode;
  selected_profile: MobilityProfile;
  shortest_route: RouteResult | null;
  accessible_route: RouteResult | null;
  comparison: ComparisonDifference | null;
  network_summary: {
    total_nodes: number;
    total_edges: number;
    known_accessible_count: number;
    known_barrier_count: number;
    unknown_count: number;
  };
}

export interface BarrierReport {
  id: number;
  category: BarrierCategory;
  title: string;
  description: string;
  lat: number;
  lng: number;
  severity: 'low' | 'medium' | 'high' | 'blocking';
  verification_status: VerificationStatus;
  upvotes: number;
  image_url?: string;
  created_at: string;
  updated_at?: string;
  source: string;
}

export interface DetectedFeature {
  label: string;
  confidence: number;
  description: string;
}

export interface VisionAnalysisResult {
  is_barrier_detected: boolean;
  barrier_category: BarrierCategory | null;
  severity: 'low' | 'medium' | 'high' | 'blocking';
  title: string;
  confidence_score: number;
  detected_features: DetectedFeature[];
  accessibility_impact: string;
  recommended_action: string;
  requires_human_verification: boolean;
  verification_disclaimer: string;
  analysis_mode: string;
}
