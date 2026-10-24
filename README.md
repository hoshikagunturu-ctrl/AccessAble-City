# AccessAble City ♿🚶‍♂️🏙️
> **AI-Powered Accessibility Intelligence for Inclusive Urban Mobility**  
> *Tagline:* **Every Street. Every Step. Everyone.**  
> *Category:* **Smart Cities & CivilTech — Open Innovation**  
> *GitHub Repository:* [https://github.com/hoshikagunturu-ctrl/AccessAble-City](https://github.com/hoshikagunturu-ctrl/AccessAble-City)  
> *Git Remote URL:* `https://github.com/hoshikagunturu-ctrl/AccessAble-City.git`

---

## 1. Problem Statement & Target Users
Wheelchair users, pedestrians with limited mobility, elderly citizens, and caregivers face severe daily urban navigation challenges: inaccessible sidewalks, unramped stairways, missing curb cuts, broken pavement, steep inclines, and temporary construction blockades.

Conventional pedestrian navigation platforms optimize strictly for **shortest physical distance** or **travel time**, often directing citizens directly into insurmountable barriers (such as flights of stairs or uncurbed road crossings).

**AccessAble City** provides an accessibility-first pedestrian routing and intelligence platform that:
1. Calculates multi-criteria accessible pedestrian paths tailored to mobility profiles.
2. Identifies and strictly avoids physical obstructions (stairs without ramps, steep inclines >8%, missing curb cuts, narrow bottlenecks).
3. Directly contrasts standard shortest routes against accessibility-aware alternatives with algorithmic decision explanations.
4. Integrates community reporting and AI multimodal image inspection for sidewalk obstacles.
5. Operates with full offline and local fallback capabilities without requiring external API keys for core routing.

---

## 2. Implemented & Verified Core Features

- ✅ **Interactive Leaflet & OpenStreetMap Pedestrian GIS:** High-resolution map with custom vector markers for origins, destinations, verified accessible paths, and known physical barriers.
- ✅ **NetworkX Multi-Criteria Routing Engine:** Profile-specific Dijkstra routing with strict barrier exclusions and documented 1.6x caution penalties for unverified paths.
- ✅ **Mobility Profile Customization:**
  - **Wheelchair / Powerchair:** Strict zero-stairs requirement, dropped curb cut enforcement, max 8.3% ramp slope, min 0.9m passage width.
  - **Walker / Cane / Crutches:** Fall-prevention routing, low-step filtering (max 3 steps), avoidance of rough cobblestones/gravel.
  - **Stroller & Senior Transit:** Gentle grade prioritization, step avoidance, resting corridor preference.
  - **Standard Pedestrian:** Direct distance baseline for comparative benchmarking.
- ✅ **Benchmark Scenario:** Instant one-click demonstration comparing the direct path (blocked by an **18-step concrete flight of stairs**) against the **ADA Switchback Ramp (4.2% grade)** alternative (+230m avoidance route).
- ✅ **Algorithmic Decision Explanations:** Explains exactly why a route was selected and which barriers were avoided.
- ✅ **Turn-by-Turn Waypoint Breakdown:** Segment-by-segment surface, slope, width, and curb cut details.
- ✅ **Community Barrier Registry (SQLite & SQLAlchemy):** Full CRUD persistence with category filtering, upvoting, and verification lifecycle (`community_reported`, `verified_barrier`, `ai_suggested`, `resolved`).
- ✅ **AI Vision Barrier Scanner:** Sidewalk image analysis with Google Gemini multimodal inspection and deterministic offline fallback.
- ✅ **Zero-Key Local Fallback:** Complete core application functions locally without requiring external API keys.

---

## 3. Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 19, TypeScript, Vite, Tailwind CSS v4, Lucide Icons |
| **Interactive Map** | Leaflet 1.9, React-Leaflet 5, OpenStreetMap Cartography |
| **Backend API** | Python 3.13, FastAPI, Uvicorn, Pydantic v2 |
| **Graph Routing** | NetworkX (DiGraph, Dijkstra multi-criteria traversal) |
| **Persistence** | SQLite, SQLAlchemy 2.0 ORM |
| **AI Vision** | Google Gemini 2.5 Flash with structured fallback |
| **Testing** | Pytest, FastAPI TestClient, Vitest/TSC |

---

## 4. Quickstart: Run Locally

### Prerequisites
- Python 3.10+
- Node.js 18+ and npm

### 1. Start the Backend API
```bash
# Navigate to project root and create virtual environment
python -m venv backend/venv

# Activate virtual environment
# Windows:
.\backend\venv\Scripts\activate
# Linux/macOS:
source backend/venv/bin/activate

# Install backend dependencies
pip install -r backend/requirements.txt

# Run backend server (starts on http://127.0.0.1:8000)
python backend/run.py
```
*API interactive documentation will be live at: [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)*

### 2. Start the Frontend Dashboard
In a second terminal:
```bash
# Navigate to frontend
cd frontend

# Install dependencies
npm install

# Start Vite development server (starts on http://localhost:5173)
npm run dev
```
*Open your browser to: [http://localhost:5173](http://localhost:5173)*

---

## 5. Environment Variables

All settings use safe defaults and local fallbacks:

| Variable | Description | Default (Local) |
|---|---|---|
| `PORT` | Backend server port | `8000` |
| `HOST` | Backend server host | `0.0.0.0` |
| `DATABASE_URL` | SQLite database URI | `sqlite:///./accessable.db` |
| `CORS_ORIGINS` | Permitted frontend origins | `http://localhost:5173,http://localhost:3000` |
| `GEMINI_API_KEY` | Optional: Google AI Studio API key for multimodal image analysis | *(Omitted: uses offline inspection heuristic)* |
| `VITE_API_BASE_URL` | Frontend API proxy endpoint | `/api` |

---

## 6. Automated Test Suite & Actual Results

Run backend automated verification:
```bash
.\backend\venv\Scripts\pytest -v
```

### Verified Test Results (14/14 Passed)
```
backend/tests/test_api.py::test_health_endpoint PASSED                   [  7%]
backend/tests/test_api.py::test_root_endpoint PASSED                     [ 14%]
backend/tests/test_api.py::test_get_network PASSED                       [ 21%]
backend/tests/test_api.py::test_demo_route PASSED                        [ 28%]
backend/tests/test_api.py::test_plan_route PASSED                        [ 35%]
backend/tests/test_api.py::test_plan_route_invalid_node PASSED           [ 42%]
backend/tests/test_barriers.py::test_get_barriers PASSED                 [ 50%]
backend/tests/test_barriers.py::test_create_barrier_report PASSED        [ 57%]
backend/tests/test_barriers.py::test_vision_status_and_analyze PASSED    [ 64%]
backend/tests/test_routing.py::test_shortest_route_uses_inaccessible_stairs PASSED [ 71%]
backend/tests/test_routing.py::test_wheelchair_route_strictly_excludes_inaccessible_stairs PASSED [ 78%]
backend/tests/test_routing.py::test_route_comparison_difference_and_explanations PASSED [ 85%]
backend/tests/test_routing.py::test_unknown_path_penalized PASSED        [ 92%]
backend/tests/test_routing.py::test_no_valid_route_handling PASSED       [100%]

======================== 14 passed in 2.44s ========================
```
- **Shortest Route Verification:** Proves the unconstrained shortest route traverses `edge_grand_stairs` (18 steps).
- **Wheelchair Exclusion Verification:** Proves the wheelchair route strictly rejects `edge_grand_stairs` and routes via the ADA switchback ramp.
- **Frontend Production Build:** `tsc -b && vite build` succeeded with 0 errors.

---

## 7. Live API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | Backend health check |
| `GET` | `/api/routing/network` | Full pedestrian graph (nodes, edges, geometries) |
| `GET` | `/api/routing/demo` | Benchmark comparison (Transit Hub to Library) |
| `POST` | `/api/routing/plan` | Dynamic route planning with profile constraints |
| `GET` | `/api/barriers` | List community and verified barrier reports |
| `POST` | `/api/barriers` | Submit new barrier report |
| `POST` | `/api/barriers/{id}/upvote` | Upvote a barrier for municipal prioritization |
| `PATCH` | `/api/barriers/{id}/status` | Update verification status (`verified_barrier`, `resolved`) |
| `GET` | `/api/vision/status` | Check Gemini API connection status |
| `POST` | `/api/vision/analyze` | Multimodal AI image barrier detection |

---

## 8. Step-by-Step Demonstration Sequence

1. **Open the Application:** Navigate to [http://localhost:5173](http://localhost:5173) to view the pedestrian network map with labeled waypoints and barrier markers.
2. **Select a Mobility Profile:** Review the physical constraints for **Wheelchair & Powerchair** (zero stairs, max 8.3% grade, curb ramps required).
3. **Enter the Demo Origin and Destination:**
   - **Origin:** Civic Plaza Transit Hub (`node_transit_hub`)
   - **Destination:** Civic Public Library & Learning Hub (`node_library`)
4. **Compare the Conventional vs. Accessible Route:** Click **"Launch Benchmark Comparison"**:
   - The **dashed red line** displays the standard shortest route (225m) encountering the **18-step concrete Grand Stairs**.
   - The **solid teal line** displays AccessAble City's accessible alternative (455m) safely routing through the **ADA switchback ramp (4.2% grade)**.
5. **Explain the Barrier and Route Trade-Off:** Observe the automatically generated decision justification:
   *"The standard shortest route contains insurmountable barriers for wheelchair: 1 flight(s) of stairs... AccessAble City routed via the verified accessible corridor featuring ADA ramps and dropped curb cuts (+230.0m / +4.4 min)."*
6. **Submit an Illustrative Community Barrier Report:**
   - Navigate to the **Barrier Registry** tab.
   - Click **Report Physical Barrier**, fill in details (e.g. *Corner curb missing ramp*), and click submit. Notice the entry is persisted in SQLite and can be upvoted.
7. **Demonstrate Image Analysis:**
   - Navigate to the **AI Vision Inspector** tab.
   - Select an audit preset (e.g. *18-Step Concrete Stairs* or *Missing Dropped Curb Cut*).
   - Click **Run Multimodal Barrier Inspection** to review structured classifications, visual features, confidence scores, and safety disclaimers.
   - Click **Pin as Barrier Report** to add it to the live database.
8. **Explain Limitations & Civil Benefit:** Discuss data provenance (illustrative benchmark network in the Civic Center district), the importance of human verification, and the potential for city-wide OpenStreetMap Overpass integration.

---

## 9. Honest Limitations & Data Provenance

- **Illustrative Network Data:** The current network is an illustrative benchmark dataset modeled on realistic urban pedestrian geometry in San Francisco's Civic Center district. Locations and barrier coordinates are demonstration data, not real-world municipal audits.
- **No Absolute Guarantees:** Pedestrian environments fluctuate. AccessAble City never claims routes are "guaranteed safe" or "100% barrier-free." Unverified paths are penalized by 1.6x weight, and AI vision findings are explicitly labeled as suggestions requiring human audit.
- **Dynamic Blockages:** Weather, temporary construction, and transient vehicular obstructions currently rely on crowdsourced updates rather than live sensor feeds.

---

## 10. Authentic Team Collaboration

To invite project team members to collaborate on this repository:
1. Navigate to the GitHub repository: `https://github.com/hoshikagunturu-ctrl/AccessAble-City`
2. Go to **Settings** → **Collaborators** → **Add people**.
3. Enter your teammates' GitHub usernames or email addresses to send invitations.
4. Each team member clones the repository, checks out a dedicated branch (`git checkout -b feature/<module-name>`), and submits pull requests through their own authenticated GitHub account.
