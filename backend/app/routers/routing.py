from fastapi import APIRouter, HTTPException, Query
from typing import Optional
from backend.app.models.routing import (
    RouteRequest, RouteComparisonResponse, MobilityProfile
)
from backend.app.routing_engine import routing_engine
from backend.app.sample_network import get_sample_network

router = APIRouter(prefix="/routing", tags=["Routing"])

@router.get("/network")
def get_network():
    """Return the complete pedestrian graph (nodes, edges, metadata)."""
    return get_sample_network()

@router.post("/plan", response_model=RouteComparisonResponse)
def plan_route(request: RouteRequest):
    """
    Calculate and compare the shortest unconstrained route vs the accessibility-aware route
    for the specified mobility profile.
    """
    try:
        comparison = routing_engine.compare_routes(
            source_id=request.source_node_id,
            target_id=request.target_node_id,
            profile=request.profile
        )
        return comparison
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal routing error: {str(e)}")

@router.get("/demo", response_model=RouteComparisonResponse)
def get_one_click_demo(profile: MobilityProfile = Query(default=MobilityProfile.WHEELCHAIR)):
    """
    One-click hackathon demonstration:
    Evaluates Civic Plaza Transit Hub to Public Library route under the specified profile.
    Shows how the standard shortest route uses the 18-step Grand Stairs and the
    accessible route safely routes via the ADA switchback ramp.
    """
    return routing_engine.compare_routes(
        source_id="node_transit_hub",
        target_id="node_library",
        profile=profile
    )
