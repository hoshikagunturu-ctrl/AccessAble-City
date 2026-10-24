from fastapi import APIRouter, HTTPException, Query

from backend.app.models.routing import (
    RouteRequest,
    RouteComparisonResponse,
    MobilityProfile,
)
from backend.app.routing_engine import routing_engine
from backend.app.sample_network import get_sample_network

router = APIRouter(prefix="/routing", tags=["Routing"])


@router.get(
    "/network",
    summary="Get the pedestrian network",
    description=(
        "Returns the pedestrian graph, including nodes, edges, "
        "and metadata used for route planning."
    ),
)
def get_network():
    """Return the complete pedestrian graph (nodes, edges, metadata)."""
    return get_sample_network()


@router.post(
    "/plan",
    response_model=RouteComparisonResponse,
    summary="Compare pedestrian routes",
    description=(
        "Compares the shortest unconstrained route with the "
        "accessibility-aware route for the requested source, "
        "destination, and mobility profile."
    ),
    responses={
        400: {"description": "Invalid route request"},
        500: {"description": "Internal routing error"},
    },
)
def plan_route(request: RouteRequest):
    """
    Calculate and compare the shortest unconstrained route with the
    accessibility-aware route for the specified mobility profile.

    Returns:
        RouteComparisonResponse: Comparison of both routes.

    Raises:
        HTTPException: 400 if the routing engine raises ValueError.
        HTTPException: 500 if an unexpected internal error occurs.
    """
    try:
        comparison = routing_engine.compare_routes(
            source_id=request.source_node_id,
            target_id=request.target_node_id,
            profile=request.profile,
        )
        return comparison

    except ValueError as e:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid route request: {e}",
        ) from e

    except Exception:
        # Avoid exposing internal exception details to API clients.
        raise HTTPException(
            status_code=500,
            detail="An internal routing error occurred. Please try again.",
        ) from None


@router.get(
    "/demo",
    response_model=RouteComparisonResponse,
    summary="Run the sample route demonstration",
    description=(
        "Compares routes from the Civic Plaza Transit Hub to the "
        "Public Library using the selected mobility profile. "
        "Defaults to the wheelchair mobility profile."
    ),
    responses={
        400: {"description": "Unable to calculate the demo route"},
        500: {"description": "Internal routing error"},
    },
)
def get_one_click_demo(
    profile: MobilityProfile = Query(
        default=MobilityProfile.WHEELCHAIR
    ),
):
    """
    Run the predefined demonstration route between the transit hub
    and public library.
    """
    try:
        return routing_engine.compare_routes(
            source_id="node_transit_hub",
            target_id="node_library",
            profile=profile,
        )

    except ValueError as e:
        raise HTTPException(
            status_code=400,
            detail=f"Unable to calculate the demo route: {e}",
        ) from e

    except Exception:
        raise HTTPException(
            status_code=500,
            detail="The demo route could not be calculated. Please try again.",
        ) from None
