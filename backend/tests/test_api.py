import pytest
from fastapi.testclient import TestClient
from backend.app.main import app

client = TestClient(app)

def test_health_endpoint():
    response = client.get("/api/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"

def test_root_endpoint():
    response = client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert data["project"] == "AccessAble City"

def test_get_network():
    response = client.get("/api/routing/network")
    assert response.status_code == 200
    data = response.json()
    assert "nodes" in data
    assert "edges" in data
    assert len(data["nodes"]) >= 8

def test_demo_route():
    response = client.get("/api/routing/demo?profile=wheelchair")
    assert response.status_code == 200
    data = response.json()
    assert data["shortest_route"]["is_valid"] is True
    assert data["accessible_route"]["is_valid"] is True
    assert data["comparison"]["distance_delta_m"] > 0
    assert "stairs" in str(data["comparison"]["barriers_avoided"]).lower()

def test_plan_route():
    payload = {
        "source_node_id": "node_transit_hub",
        "target_node_id": "node_library",
        "profile": "wheelchair"
    }
    response = client.post("/api/routing/plan", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["accessible_route"]["stairs_count"] == 0

def test_plan_route_invalid_node():
    payload = {
        "source_node_id": "node_non_existent",
        "target_node_id": "node_library",
        "profile": "wheelchair"
    }
    response = client.post("/api/routing/plan", json=payload)
    assert response.status_code == 400
