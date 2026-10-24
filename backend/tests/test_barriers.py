import pytest
from fastapi.testclient import TestClient
from backend.app.main import app

client = TestClient(app)

def test_get_barriers():
    response = client.get("/api/barriers")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) >= 1

def test_create_barrier_report():
    payload = {
        "category": "stairs_no_ramp",
        "title": "Steep 5-step entrance without ramp",
        "description": "Storefront entrance has 5 steps without any ramp or elevator.",
        "lat": 37.7802,
        "lng": -122.4175,
        "severity": "high",
        "source": "user"
    }
    response = client.post("/api/barriers", json=payload)
    assert response.status_code == 201
    data = response.json()
    assert data["title"] == payload["title"]
    assert data["verification_status"] == "community_reported"
    assert data["id"] > 0
    barrier_id = data["id"]

    # Test upvote
    upvote_res = client.post(f"/api/barriers/{barrier_id}/upvote")
    assert upvote_res.status_code == 200
    assert upvote_res.json()["upvotes"] == 2

    # Test status update
    status_res = client.patch(f"/api/barriers/{barrier_id}/status", json={"verification_status": "verified_barrier"})
    assert status_res.status_code == 200
    assert status_res.json()["verification_status"] == "verified_barrier"

def test_vision_status_and_analyze():
    # Test status
    status_res = client.get("/api/vision/status")
    assert status_res.status_code == 200
    status_data = status_res.json()
    assert "human_verification_required" in status_data

    # Test analyze with dummy image bytes
    dummy_image = b"fake-image-content-for-testing"
    files = {"file": ("stairs_test.jpg", dummy_image, "image/jpeg")}
    analyze_res = client.post("/api/vision/analyze", files=files)
    assert analyze_res.status_code == 200
    data = analyze_res.json()
    assert "is_barrier_detected" in data
    assert data["requires_human_verification"] is True
    assert "AI-assisted" in data["verification_disclaimer"]
