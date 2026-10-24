# Team Contribution Guidelines — Innovators Conclave 2026

## AccessAble City

To ensure clean collaboration, each team member is assigned an independent module.

### Module Allocations
1. **Module 1 — Graph Routing Engine (`backend/app/routing_engine.py`, `backend/tests/test_routing.py`)**
   - Core Dijkstra / A* multi-profile pathfinding algorithms.
   - Profile constraints and penalty calculations.

2. **Module 2 — AI Vision Analysis (`backend/app/vision_service.py`, `backend/app/routers/vision.py`)**
   - Google Gemini API integration and prompt tuning.
   - Structured JSON schema validation and offline heuristic fallback.

3. **Module 3 — Frontend Dashboard UI (`frontend/src/App.tsx`, `frontend/src/components/RoutePlanner.tsx`, `frontend/src/components/RouteComparison.tsx`)**
   - User inputs, comparison metrics, profile selectors, and responsive layout.

4. **Module 4 — Geospatial Map Visualization (`frontend/src/components/MapView.tsx`)**
   - Leaflet & OpenStreetMap layers, polyline rendering, and custom vector pins.

5. **Module 5 — Backend API & Persistence (`backend/app/routers/barriers.py`, `backend/app/db_models.py`, `backend/app/database.py`)**
   - SQLite CRUD operations, verification workflow, and upvote counters.

6. **Module 6 — QA, Testing & Deployment (`backend/tests/`, `Dockerfile`, `vercel.json`)**
   - Automated pytest suites, build validation, and hosting configurations.

### Git Branching Strategy
- `master` or `main`: Stable, release-ready code for submission.
- `feature/<module-name>`: Dedicated feature branch per member.
- Submit Pull Requests with automated test verification before merging into `main`.
