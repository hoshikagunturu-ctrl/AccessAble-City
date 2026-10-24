"""
Sample Pedestrian Accessibility Graph
District: Civic Center & Innovation Quarter (Illustrative Benchmark Network)
Clearly labeled sample data representing real-world urban pedestrian geometry,
with verified accessible pathways, known barriers (stairs, construction, steep slopes),
and unverified/unknown pedestrian pathways.
"""

from typing import List, Dict
from backend.app.models.routing import NetworkNode, NetworkEdge, AccessibilityStatus

# Sample Nodes
NODES: List[NetworkNode] = [
    NetworkNode(
        id="node_transit_hub",
        name="Civic Plaza Transit Station",
        lat=37.7792,
        lng=-122.4191,
        description="Main multimodal subway and bus station with elevator access to street level.",
        node_type="transit"
    ),
    NetworkNode(
        id="node_plaza_crossing",
        name="Plaza North Crosswalk",
        lat=37.7801,
        lng=-122.4187,
        description="Signalized intersection with audio chirps and dropped curb ramps.",
        node_type="intersection"
    ),
    NetworkNode(
        id="node_grand_stairs_base",
        name="Civic Terrace Lower Landing",
        lat=37.7808,
        lng=-122.4182,
        description="Base of the historical monument staircase.",
        node_type="landmark"
    ),
    NetworkNode(
        id="node_grand_stairs_top",
        name="Civic Terrace Upper Landing",
        lat=37.7813,
        lng=-122.4178,
        description="Upper tier overlooking the plaza. Connected only via 18 concrete steps.",
        node_type="barrier_point"
    ),
    NetworkNode(
        id="node_library",
        name="Public Library & Inclusive Learning Hub",
        lat=37.7820,
        lng=-122.4172,
        description="Civic library destination with automatic doors and ADA-compliant ramp access.",
        node_type="destination"
    ),
    NetworkNode(
        id="node_west_gardens_entry",
        name="West Promenade Garden Entrance",
        lat=37.7804,
        lng=-122.4202,
        description="Entry to the level botanical promenade.",
        node_type="intersection"
    ),
    NetworkNode(
        id="node_accessible_switchback",
        name="Civic Gardens ADA Switchback Ramp",
        lat=37.7812,
        lng=-122.4195,
        description="Engineered switchback ramp with 4.5% grade and continuous dual handrails.",
        node_type="ramp"
    ),
    NetworkNode(
        id="node_upper_promenade",
        name="Upper Promenade & Health Center Junction",
        lat=37.7818,
        lng=-122.4185,
        description="Smooth asphalt pedestrian boulevard with tactile edge markers.",
        node_type="intersection"
    ),
    NetworkNode(
        id="node_historic_alley",
        name="Old Brick Alleyway",
        lat=37.7800,
        lng=-122.4170,
        description="Narrow historic passage with uneven heritage pavers.",
        node_type="intersection"
    ),
    NetworkNode(
        id="node_east_crossing",
        name="East Innovation Way",
        lat=37.7815,
        lng=-122.4165,
        description="Active utility construction corridor with temporary wood barricades.",
        node_type="intersection"
    ),
    NetworkNode(
        id="node_city_hall",
        name="City Hall Main Entrance",
        lat=37.7790,
        lng=-122.4168,
        description="Municipal offices with accessible south ramp and ground level entry.",
        node_type="landmark"
    )
]

# Sample Edges
# Each edge is bidirectional or has directed traversal details
EDGES: List[NetworkEdge] = [
    # 1. Direct path start: Transit Hub to Plaza Crossing
    NetworkEdge(
        id="edge_transit_to_plaza",
        source="node_transit_hub",
        target="node_plaza_crossing",
        distance=105.0,
        surface="paved_smooth",
        stairs=False,
        step_count=0,
        ramps=False,
        ramp_slope_pct=0.0,
        slope=1.2,
        width=2.4,
        curb_cuts=True,
        construction_blocked=False,
        accessibility_status=AccessibilityStatus.KNOWN_ACCESSIBLE,
        description="Wide concrete sidewalk with tactile paving and clear curb cut at crossing.",
        geometry=[[37.7792, -122.4191], [37.7797, -122.4189], [37.7801, -122.4187]]
    ),

    # 2. Shortest direct path segment: Plaza Crossing to Base of Grand Stairs
    NetworkEdge(
        id="edge_plaza_to_stairs_base",
        source="node_plaza_crossing",
        target="node_grand_stairs_base",
        distance=85.0,
        surface="concrete",
        stairs=False,
        step_count=0,
        ramps=False,
        ramp_slope_pct=0.0,
        slope=2.0,
        width=2.0,
        curb_cuts=True,
        construction_blocked=False,
        accessibility_status=AccessibilityStatus.KNOWN_ACCESSIBLE,
        description="Standard paved plaza walkway leading to the memorial terrace.",
        geometry=[[37.7801, -122.4187], [37.7805, -122.4184], [37.7808, -122.4182]]
    ),

    # 3. CRITICAL BARRIER: Grand Stairs (18 steps, no ramp, no lift)
    # This is on the shortest direct path from Transit Hub to Library
    NetworkEdge(
        id="edge_grand_stairs",
        source="node_grand_stairs_base",
        target="node_grand_stairs_top",
        distance=55.0,
        surface="concrete_stairs",
        stairs=True,
        step_count=18,
        ramps=False,
        ramp_slope_pct=0.0,
        slope=18.0,
        width=3.0,
        curb_cuts=False,
        construction_blocked=False,
        accessibility_status=AccessibilityStatus.KNOWN_BARRIER,
        description="Monumental 18-step concrete flight without ramp or elevator. Strict barrier for wheelchairs.",
        geometry=[[37.7808, -122.4182], [37.7810, -122.4180], [37.7813, -122.4178]]
    ),

    # 4. Shortest path final leg: Top of Stairs to Library
    NetworkEdge(
        id="edge_stairs_top_to_library",
        source="node_grand_stairs_top",
        target="node_library",
        distance=90.0,
        surface="paved_smooth",
        stairs=False,
        step_count=0,
        ramps=False,
        ramp_slope_pct=0.0,
        slope=1.0,
        width=2.2,
        curb_cuts=True,
        construction_blocked=False,
        accessibility_status=AccessibilityStatus.KNOWN_ACCESSIBLE,
        description="Level pedestrian courtyard directly fronting the library entrance.",
        geometry=[[37.7813, -122.4178], [37.7817, -122.4175], [37.7820, -122.4172]]
    ),

    # 5. ACCESSIBLE ALTERNATIVE LEG 1: Plaza North to West Gardens Entry
    NetworkEdge(
        id="edge_plaza_to_west_gardens",
        source="node_plaza_crossing",
        target="node_west_gardens_entry",
        distance=130.0,
        surface="paved_smooth",
        stairs=False,
        step_count=0,
        ramps=True,
        ramp_slope_pct=3.0,
        slope=2.5,
        width=2.5,
        curb_cuts=True,
        construction_blocked=False,
        accessibility_status=AccessibilityStatus.KNOWN_ACCESSIBLE,
        description="Broad accessible walkway around civic fountain with smooth pavers and dual curb cuts.",
        geometry=[[37.7801, -122.4187], [37.7802, -122.4195], [37.7804, -122.4202]]
    ),

    # 6. ACCESSIBLE ALTERNATIVE LEG 2: West Gardens to ADA Switchback Ramp
    NetworkEdge(
        id="edge_west_gardens_to_switchback",
        source="node_west_gardens_entry",
        target="node_accessible_switchback",
        distance=110.0,
        surface="paved_asphalt",
        stairs=False,
        step_count=0,
        ramps=True,
        ramp_slope_pct=4.2,
        slope=4.2,
        width=2.2,
        curb_cuts=True,
        construction_blocked=False,
        accessibility_status=AccessibilityStatus.KNOWN_ACCESSIBLE,
        description="Gradual ADA-compliant switchback ramp bypassing the elevation grade; max slope 4.5%.",
        geometry=[[37.7804, -122.4202], [37.7808, -122.4199], [37.7812, -122.4195]]
    ),

    # 7. ACCESSIBLE ALTERNATIVE LEG 3: Switchback to Upper Promenade
    NetworkEdge(
        id="edge_switchback_to_upper_promenade",
        source="node_accessible_switchback",
        target="node_upper_promenade",
        distance=105.0,
        surface="paved_smooth",
        stairs=False,
        step_count=0,
        ramps=False,
        ramp_slope_pct=0.0,
        slope=1.8,
        width=2.5,
        curb_cuts=True,
        construction_blocked=False,
        accessibility_status=AccessibilityStatus.KNOWN_ACCESSIBLE,
        description="Shaded promenade path with resting benches every 30m, high contrast edge strips.",
        geometry=[[37.7812, -122.4195], [37.7815, -122.4190], [37.7818, -122.4185]]
    ),

    # 8. ACCESSIBLE ALTERNATIVE LEG 4: Upper Promenade to Library
    NetworkEdge(
        id="edge_upper_promenade_to_library",
        source="node_upper_promenade",
        target="node_library",
        distance=115.0,
        surface="paved_smooth",
        stairs=False,
        step_count=0,
        ramps=True,
        ramp_slope_pct=2.0,
        slope=1.0,
        width=2.4,
        curb_cuts=True,
        construction_blocked=False,
        accessibility_status=AccessibilityStatus.KNOWN_ACCESSIBLE,
        description="Direct level approach to the automated accessibility entrance of the library.",
        geometry=[[37.7818, -122.4185], [37.7819, -122.4178], [37.7820, -122.4172]]
    ),

    # 9. Additional edge: Upper Promenade connects to Top of Stairs (level terrace)
    NetworkEdge(
        id="edge_upper_promenade_to_stairs_top",
        source="node_upper_promenade",
        target="node_grand_stairs_top",
        distance=80.0,
        surface="concrete",
        stairs=False,
        step_count=0,
        ramps=False,
        ramp_slope_pct=0.0,
        slope=1.0,
        width=2.0,
        curb_cuts=True,
        construction_blocked=False,
        accessibility_status=AccessibilityStatus.KNOWN_ACCESSIBLE,
        description="Level terrace connector walkway between upper promenade and terrace lookout.",
        geometry=[[37.7818, -122.4185], [37.7815, -122.4181], [37.7813, -122.4178]]
    ),

    # 10. UNKNOWN / UNVERIFIED PATH: Historic Brick Alleyway
    NetworkEdge(
        id="edge_transit_to_historic_alley",
        source="node_transit_hub",
        target="node_historic_alley",
        distance=170.0,
        surface="cobblestone",
        stairs=False,
        step_count=0,
        ramps=False,
        ramp_slope_pct=0.0,
        slope=3.5,
        width=1.3,
        curb_cuts=False,
        construction_blocked=False,
        accessibility_status=AccessibilityStatus.UNKNOWN,
        description="Uneven heritage cobblestone alleyway without marked curb cuts. Surface unverified.",
        geometry=[[37.7792, -122.4191], [37.7796, -122.4180], [37.7800, -122.4170]]
    ),

    # 11. UNKNOWN / POTENTIALLY UNSTABLE: Historic Alley to East Crossing
    NetworkEdge(
        id="edge_historic_alley_to_east_crossing",
        source="node_historic_alley",
        target="node_east_crossing",
        distance=180.0,
        surface="cobblestone",
        stairs=False,
        step_count=0,
        ramps=False,
        ramp_slope_pct=0.0,
        slope=4.0,
        width=1.2,
        curb_cuts=False,
        construction_blocked=False,
        accessibility_status=AccessibilityStatus.UNKNOWN,
        description="Narrow paved alley with sporadic potholes and missing tactile warnings. Unverified.",
        geometry=[[37.7800, -122.4170], [37.7808, -122.4168], [37.7815, -122.4165]]
    ),

    # 12. KNOWN BARRIER: Construction blocked corridor
    NetworkEdge(
        id="edge_east_crossing_to_library",
        source="node_east_crossing",
        target="node_library",
        distance=95.0,
        surface="gravel_temporary",
        stairs=False,
        step_count=0,
        ramps=False,
        ramp_slope_pct=0.0,
        slope=2.0,
        width=0.7,
        curb_cuts=False,
        construction_blocked=True,
        accessibility_status=AccessibilityStatus.KNOWN_BARRIER,
        description="Active water main construction with gravel trenches and temporary 0.7m passage bottleneck.",
        geometry=[[37.7815, -122.4165], [37.7818, -122.4169], [37.7820, -122.4172]]
    ),

    # 13. Transit Hub to City Hall
    NetworkEdge(
        id="edge_transit_to_city_hall",
        source="node_transit_hub",
        target="node_city_hall",
        distance=190.0,
        surface="paved_smooth",
        stairs=False,
        step_count=0,
        ramps=True,
        ramp_slope_pct=2.0,
        slope=1.5,
        width=2.8,
        curb_cuts=True,
        construction_blocked=False,
        accessibility_status=AccessibilityStatus.KNOWN_ACCESSIBLE,
        description="Primary civic walkway with dual curb cuts and audio signals.",
        geometry=[[37.7792, -122.4191], [37.7791, -122.4180], [37.7790, -122.4168]]
    ),

    # 14. City Hall to Historic Alley
    NetworkEdge(
        id="edge_city_hall_to_historic_alley",
        source="node_city_hall",
        target="node_historic_alley",
        distance=110.0,
        surface="paved_smooth",
        stairs=False,
        step_count=0,
        ramps=False,
        ramp_slope_pct=0.0,
        slope=1.2,
        width=1.8,
        curb_cuts=True,
        construction_blocked=False,
        accessibility_status=AccessibilityStatus.KNOWN_ACCESSIBLE,
        description="Smooth pavement connecting City Hall east plaza.",
        geometry=[[37.7790, -122.4168], [37.7795, -122.4169], [37.7800, -122.4170]]
    )
]

def get_sample_network():
    return {
        "nodes": NODES,
        "edges": EDGES,
        "metadata": {
            "name": "Civic Center & Innovation Quarter Pedestrian Network",
            "center": [37.7805, -122.4185],
            "zoom": 17,
            "demo_pair": {
                "source": "node_transit_hub",
                "target": "node_library",
                "description": "Transit Hub to Inclusive Public Library"
            }
        }
    }
