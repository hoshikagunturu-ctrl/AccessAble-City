import type {
  RouteComparisonResponse,
  BarrierReport,
  VisionAnalysisResult,
  MobilityProfile,
  NetworkNode,
  NetworkEdge,
  VerificationStatus
} from '../types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

export const api = {
  async getNetwork(): Promise<{
    nodes: NetworkNode[];
    edges: NetworkEdge[];
    metadata: {
      name: string;
      center: [number, number];
      zoom: number;
      demo_pair: { source: string; target: string; description: string };
    };
  }> {
    const res = await fetch(`${API_BASE_URL}/routing/network`);
    if (!res.ok) {
      throw new Error(`Failed to fetch network graph: ${res.statusText}`);
    }
    return res.json();
  },

  async planRoute(
    sourceNodeId: string,
    targetNodeId: string,
    profile: MobilityProfile
  ): Promise<RouteComparisonResponse> {
    const res = await fetch(`${API_BASE_URL}/routing/plan`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        source_node_id: sourceNodeId,
        target_node_id: targetNodeId,
        profile
      })
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: res.statusText }));
      throw new Error(err.detail || 'Routing failed');
    }
    return res.json();
  },

  async getOneClickDemo(profile: MobilityProfile = 'wheelchair'): Promise<RouteComparisonResponse> {
    const res = await fetch(`${API_BASE_URL}/routing/demo?profile=${profile}`);
    if (!res.ok) {
      throw new Error(`Failed to load demo route: ${res.statusText}`);
    }
    return res.json();
  },

  async getBarriers(status?: string, category?: string): Promise<BarrierReport[]> {
    const params = new URLSearchParams();
    if (status) params.append('status', status);
    if (category) params.append('category', category);
    const query = params.toString() ? `?${params.toString()}` : '';
    const res = await fetch(`${API_BASE_URL}/barriers${query}`);
    if (!res.ok) {
      throw new Error(`Failed to fetch barriers: ${res.statusText}`);
    }
    return res.json();
  },

  async createBarrier(report: {
    category: string;
    title: string;
    description: string;
    lat: number;
    lng: number;
    severity?: string;
    image_url?: string;
    source?: string;
  }): Promise<BarrierReport> {
    const res = await fetch(`${API_BASE_URL}/barriers`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(report)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: res.statusText }));
      throw new Error(err.detail || 'Failed to submit barrier report');
    }
    return res.json();
  },

  async updateBarrierStatus(id: number, status: VerificationStatus): Promise<BarrierReport> {
    const res = await fetch(`${API_BASE_URL}/barriers/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ verification_status: status })
    });
    if (!res.ok) {
      throw new Error('Failed to update status');
    }
    return res.json();
  },

  async upvoteBarrier(id: number): Promise<BarrierReport> {
    const res = await fetch(`${API_BASE_URL}/barriers/${id}/upvote`, {
      method: 'POST'
    });
    if (!res.ok) {
      throw new Error('Failed to upvote barrier');
    }
    return res.json();
  },

  async analyzeImage(file: File): Promise<VisionAnalysisResult> {
    const formData = new FormData();
    formData.append('file', file);
    const res = await fetch(`${API_BASE_URL}/vision/analyze`, {
      method: 'POST',
      body: formData
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: res.statusText }));
      throw new Error(err.detail || 'Image analysis failed');
    }
    return res.json();
  },

  async getVisionStatus(): Promise<{
    gemini_configured: boolean;
    mode: string;
    description: string;
    human_verification_required: boolean;
  }> {
    const res = await fetch(`${API_BASE_URL}/vision/status`);
    if (!res.ok) {
      return {
        gemini_configured: false,
        mode: 'heuristic_fallback',
        description: 'Offline heuristic inspection mode',
        human_verification_required: true
      };
    }
    return res.json();
  }
};
