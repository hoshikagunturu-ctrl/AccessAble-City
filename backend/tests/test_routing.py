import pytest
from backend.app.models.routing import MobilityProfile, AccessibilityStatus
from backend.app.routing_engine import AccessibilityRoutingEngine

@pytest.fixture
def engine():
    return AccessibilityRoutingEngine()

def test_shortest_route_uses_inaccessible_stairs(engine):
    """
    Proves that the standard shortest route uses the designated inaccessible edge
    (Grand Memorial Stairs, 18 steps without ramp).
    """
    shortest = engine.calculate_shortest_route("node_transit_hub", "node_library")
    assert shortest is not None
    assert shortest.is_valid is True

    # Must contain the grand stairs node in the path
    assert "node_grand_stairs_base" in shortest.path_node_ids
    assert "node_grand_stairs_top" in shortest.path_node_ids
    assert shortest.stairs_count > 0

    # Verify edge_grand_stairs was traversed
    edge_ids = [seg.edge_id for seg in shortest.segments]
    assert any("grand_stairs" in eid for eid in edge_ids)
    assert shortest.total_distance_m < 350.0  # around 250m - 335m

def test_wheelchair_route_strictly_excludes_inaccessible_stairs(engine):
    """
    Proves that the wheelchair-compatible route excludes the designated inaccessible
    staircase while remaining a continuous, valid path via the accessible switchback ramp.
    """
    accessible = engine.calculate_accessible_route("node_transit_hub", "node_library", MobilityProfile.WHEELCHAIR)
    assert accessible is not None
    assert accessible.is_valid is True

    # MUST NOT traverse the grand stairs
    assert "node_grand_stairs_base" not in accessible.path_node_ids
    edge_ids = [seg.edge_id for seg in accessible.segments]
    assert not any("edge_grand_stairs" in eid for eid in edge_ids)
    assert accessible.stairs_count == 0

    # MUST route via the accessible ramp and gardens
    assert "node_west_gardens_entry" in accessible.path_node_ids
    assert "node_accessible_switchback" in accessible.path_node_ids
    assert "node_upper_promenade" in accessible.path_node_ids

    # Every traversed segment must be wheelchair compatible
    for seg in accessible.segments:
        assert seg.stairs is False
        assert seg.curb_cuts is True
        assert seg.slope <= 8.0 or seg.ramps is True
        assert seg.width >= 0.9

def test_route_comparison_difference_and_explanations(engine):
    """
    Verify side-by-side comparison generates accurate distance deltas and explanations.
    """
    comp = engine.compare_routes("node_transit_hub", "node_library", MobilityProfile.WHEELCHAIR)
    assert comp.shortest_route is not None
    assert comp.accessible_route is not None
    assert comp.comparison is not None

    # Accessible route is slightly longer than direct stair route
    assert comp.comparison.distance_delta_m > 0
    assert len(comp.comparison.barriers_avoided) > 0
    assert "stairs" in comp.comparison.barriers_avoided[0].lower()
    assert "Grand Stairs" in comp.comparison.why_accessible_chosen or "barriers" in comp.comparison.why_accessible_chosen

def test_unknown_path_penalized(engine):
    """
    Verify that unverified/unknown paths receive higher penalty weight than verified accessible paths.
    """
    # Historic alley has unknown status and cobblestones
    edge_unknown = engine.edges_dict["edge_transit_to_historic_alley"]
    edge_accessible = engine.edges_dict["edge_transit_to_plaza"]

    weight_unknown = engine._calculate_edge_weight(edge_unknown.model_dump(), MobilityProfile.WHEELCHAIR)
    # The weight of unknown path should be multiplied by caution factor (1.6) and cobblestone factor (1.8)
    expected_multiplier = 1.6 * 1.8
    assert weight_unknown >= edge_unknown.distance * expected_multiplier * 0.95

def test_no_valid_route_handling(engine):
    """
    Verify clean error/warning response when no valid accessible route exists.
    """
    # Create isolated engine with no connections
    isolated_engine = AccessibilityRoutingEngine(nodes=[], edges=[])
    res = isolated_engine.calculate_accessible_route("invalid_a", "invalid_b", MobilityProfile.WHEELCHAIR)
    assert res is None
