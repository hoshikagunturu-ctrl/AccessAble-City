import React from 'react';
import { Cpu, Database, Network, Users, ShieldCheck, Compass, GitBranch, Layers } from 'lucide-react';

export const AboutView: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-6 text-white">
      {/* Product Vision Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-slate-950 rounded-2xl p-6 border border-slate-800 shadow-xl space-y-2">
        <div className="flex items-center space-x-2 text-teal-400 text-xs font-bold uppercase tracking-wider">
          <Compass className="w-4 h-4" />
          <span>Smart City Pedestrian GIS • Platform Specifications</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
          AccessAble City — Architectural Architecture & Design
        </h2>
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-2xl">
          <strong>Every Street. Every Step. Everyone.</strong> An accessibility-first urban mobility engine
          combining NetworkX multi-criteria graph routing, Gemini multimodal vision inspection, and
          crowdsourced civic validation to deliver more accessible pedestrian navigation.
        </p>
      </div>

      {/* Routing Mathematics & Algorithm */}
      <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-6 shadow-xl space-y-4">
        <div className="flex items-center space-x-2 text-white font-bold text-sm border-b border-slate-800 pb-3">
          <Network className="w-4 h-4 text-teal-400" />
          <span>Multi-Criteria Pedestrian Routing Cost Formulation</span>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed">
          Standard GPS engines solve for minimum distance \(\min \sum d(e)\). AccessAble City constructs a filtered
          candidate subgraph \(G' \subseteq G\) that strictly prunes prohibited edges for the active mobility profile,
          then computes optimal traversal over an accessibility-penalized edge weight function:
        </p>

        <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-teal-300 space-y-1">
          <p className="font-bold">W(edge, profile) = distance × K_caution × K_surface × K_incline + Step_Penalty</p>
          <p className="text-slate-400 text-[11px] font-sans">
            Where K_caution = 1.6x for unverified paths; K_surface = 1.8x for cobblestone/gravel; Step_Penalty = +80m/riser.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-1">
          <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
            <span className="font-bold text-white block mb-1">Strict Prohibitions (Filtered Pre-Routing):</span>
            <ul className="list-disc list-inside space-y-1 text-slate-400 text-[11px]">
              <li>Stairs without accompanying ADA ramp or elevator</li>
              <li>Ramp gradient exceeding ADA max (8.33% / 1:12)</li>
              <li>Unassisted street slope &gt;8.0%</li>
              <li>Corridor clear width &lt;0.9m (ADA minimum 36 inches)</li>
              <li>Missing dropped curb ramps at vehicular street crossings</li>
            </ul>
          </div>

          <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
            <span className="font-bold text-white block mb-1">Honest Uncertainty Transparency:</span>
            <ul className="list-disc list-inside space-y-1 text-slate-400 text-[11px]">
              <li>Unverified paths are never certified as guaranteed safe</li>
              <li>Documented 1.6x caution penalty deters routing through unknown terrain</li>
              <li>AI findings labeled as preliminary suggestions requiring human audit</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Tech Stack Trio */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
        <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/90 shadow-md space-y-2">
          <div className="flex items-center space-x-2 text-teal-400 font-bold text-sm">
            <Network className="w-4 h-4" />
            <span>Graph Routing</span>
          </div>
          <p className="text-slate-300 text-[11px] leading-relaxed">
            FastAPI + NetworkX DiGraph engine with custom multi-criteria Dijkstra. Evaluates road surfaces,
            curb ramps, tactile paving, and elevation grades in real time.
          </p>
        </div>

        <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/90 shadow-md space-y-2">
          <div className="flex items-center space-x-2 text-indigo-400 font-bold text-sm">
            <Cpu className="w-4 h-4" />
            <span>AI Multimodal Vision</span>
          </div>
          <p className="text-slate-300 text-[11px] leading-relaxed">
            Google Gemini 2.5 Flash API with deterministic offline fallback. Inspects sidewalk photos for
            obstructions, vertical step thresholds, and curb lip elevations.
          </p>
        </div>

        <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/90 shadow-md space-y-2">
          <div className="flex items-center space-x-2 text-cyan-400 font-bold text-sm">
            <Database className="w-4 h-4" />
            <span>Civic Persistence</span>
          </div>
          <p className="text-slate-300 text-[11px] leading-relaxed">
            SQLAlchemy 2.0 ORM with SQLite backend. Stores community audits, municipal reports, upvotes,
            and verification status transitions (`community_reported` → `verified_barrier`).
          </p>
        </div>
      </div>

      {/* Engineering Modularity (6 Modules) */}
      <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-6 shadow-xl space-y-4">
        <div className="flex items-center space-x-2 text-white font-bold text-sm border-b border-slate-800 pb-3">
          <Users className="w-4 h-4 text-teal-400" />
          <span>Core Engineering Subsystems & Architecture</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs">
          <div className="p-3 rounded-xl border border-slate-800 bg-slate-950/80 space-y-1">
            <span className="font-bold text-white block">1. Graph Routing Engine</span>
            <p className="text-slate-400 text-[11px]">
              NetworkX graph formulation, multi-profile Dijkstra constraints, and turn-by-turn logic.
            </p>
          </div>

          <div className="p-3 rounded-xl border border-slate-800 bg-slate-950/80 space-y-1">
            <span className="font-bold text-white block">2. AI Vision Service</span>
            <p className="text-slate-400 text-[11px]">
              Gemini multimodal vision service, structured Pydantic schemas, and inspection prompts.
            </p>
          </div>

          <div className="p-3 rounded-xl border border-slate-800 bg-slate-950/80 space-y-1">
            <span className="font-bold text-white block">3. Frontend Accessibility UX</span>
            <p className="text-slate-400 text-[11px]">
              React 19 + TypeScript, Tailwind CSS v4, WCAG high-contrast compliance, and responsive layouts.
            </p>
          </div>

          <div className="p-3 rounded-xl border border-slate-800 bg-slate-950/80 space-y-1">
            <span className="font-bold text-white block">4. Cartographic GIS</span>
            <p className="text-slate-400 text-[11px]">
              Leaflet & OpenStreetMap, vector marker pins, and luminous dual-route polyline renderers.
            </p>
          </div>

          <div className="p-3 rounded-xl border border-slate-800 bg-slate-950/80 space-y-1">
            <span className="font-bold text-white block">5. REST API & Persistence</span>
            <p className="text-slate-400 text-[11px]">
              FastAPI asynchronous routers, SQLite SQLAlchemy ORM, and barrier reporting CRUD lifecycle.
            </p>
          </div>

          <div className="p-3 rounded-xl border border-slate-800 bg-slate-950/80 space-y-1">
            <span className="font-bold text-white block">6. QA & Deployment</span>
            <p className="text-slate-400 text-[11px]">
              Pytest verification suites (14/14 tests passing), Docker container, and Vercel edge configs.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
