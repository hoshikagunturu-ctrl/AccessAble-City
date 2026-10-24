import React from 'react';
import { Cpu, Database, Network, Users, Award } from 'lucide-react';

export const AboutView: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Banner */}
      <div className="bg-gradient-to-r from-slate-900 to-blue-950 rounded-2xl p-6 text-white shadow-md border border-slate-800 space-y-2">
        <div className="flex items-center space-x-2 text-emerald-400 text-xs font-bold uppercase tracking-wider">
          <Award className="w-4 h-4" />
          <span>Innovators Conclave 2026 • Smart Cities & CivilTech</span>
        </div>
        <h2 className="text-2xl font-bold tracking-tight text-white">
          AccessAble City — Architectural Architecture & Design
        </h2>
        <p className="text-sm text-slate-300 leading-relaxed max-w-2xl">
          Every Street. Every Step. Everyone. A next-generation accessibility-first urban mobility engine
          combining NetworkX multi-criteria graph routing, Gemini multimodal barrier analysis, and
          crowdsourced civic validation.
        </p>
      </div>

      {/* Tech Stack Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
        <div className="p-4 rounded-xl border border-slate-200 bg-white shadow-xs space-y-2">
          <div className="flex items-center space-x-2 text-blue-600 font-bold text-sm">
            <Network className="w-4 h-4" />
            <span>Graph Routing Engine</span>
          </div>
          <p className="text-slate-600">
            Powered by <strong>NetworkX</strong> and custom <strong>Dijkstra / A*</strong> multi-criteria cost functions.
            Strictly filters out prohibited physical barriers (stairs without ramps, steep slopes &gt;8%, missing curb cuts)
            and applies 1.6x caution penalties to unverified paths.
          </p>
        </div>

        <div className="p-4 rounded-xl border border-slate-200 bg-white shadow-xs space-y-2">
          <div className="flex items-center space-x-2 text-purple-600 font-bold text-sm">
            <Cpu className="w-4 h-4" />
            <span>AI Multimodal Vision</span>
          </div>
          <p className="text-slate-600">
            Integrates <strong>Google Gemini 2.5 Flash</strong> via backend endpoints. Inspects sidewalk photos for
            obstructions, steps, cracks, and curb lips. Features deterministic offline fallback for offline hackathon demos.
          </p>
        </div>

        <div className="p-4 rounded-xl border border-slate-200 bg-white shadow-xs space-y-2">
          <div className="flex items-center space-x-2 text-emerald-600 font-bold text-sm">
            <Database className="w-4 h-4" />
            <span>Persistence & Civic Layer</span>
          </div>
          <p className="text-slate-600">
            FastAPI + SQLite with SQLAlchemy persistence. Stores verified barriers, community reports, and
            AI suggestions with upvote prioritizations and municipal status lifecycles.
          </p>
        </div>
      </div>

      {/* Team Contributions Organization */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
        <div className="flex items-center space-x-2 text-slate-900 font-bold text-base border-b border-slate-100 pb-3">
          <Users className="w-5 h-5 text-blue-600" />
          <span>Development Team Module Allocations (6 Members)</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs">
          <div className="p-3 rounded-xl border border-slate-200 bg-slate-50 space-y-1">
            <span className="font-bold text-slate-900 block">Lead Architect & Routing</span>
            <p className="text-slate-600">
              NetworkX graph engine, Dijkstra profile constraints, turn-by-turn explanations.
            </p>
            <span className="text-[10px] text-blue-600 font-semibold">Active: Lead Engineer</span>
          </div>

          <div className="p-3 rounded-xl border border-slate-200 bg-slate-50 space-y-1">
            <span className="font-bold text-slate-900 block">AI Integration Specialist</span>
            <p className="text-slate-600">
              Gemini API multimodal vision service, structured schemas, inspection prompts.
            </p>
            <span className="text-[10px] text-purple-600 font-semibold">Assigned Module</span>
          </div>

          <div className="p-3 rounded-xl border border-slate-200 bg-slate-50 space-y-1">
            <span className="font-bold text-slate-900 block">Frontend & UI/UX Specialist</span>
            <p className="text-slate-600">
              React + TypeScript dashboard, Tailwind v4, mobile responsiveness, WCAG compliance.
            </p>
            <span className="text-[10px] text-emerald-600 font-semibold">Assigned Module</span>
          </div>

          <div className="p-3 rounded-xl border border-slate-200 bg-slate-50 space-y-1">
            <span className="font-bold text-slate-900 block">Geospatial / GIS Engineer</span>
            <p className="text-slate-600">
              Leaflet & OpenStreetMap layers, custom DivIcon pins, polyline route renderers.
            </p>
            <span className="text-[10px] text-teal-600 font-semibold">Assigned Module</span>
          </div>

          <div className="p-3 rounded-xl border border-slate-200 bg-slate-50 space-y-1">
            <span className="font-bold text-slate-900 block">Backend & Persistence Engineer</span>
            <p className="text-slate-600">
              FastAPI REST endpoints, SQLite SQLAlchemy ORM, barrier reporting CRUD.
            </p>
            <span className="text-[10px] text-indigo-600 font-semibold">Assigned Module</span>
          </div>

          <div className="p-3 rounded-xl border border-slate-200 bg-slate-50 space-y-1">
            <span className="font-bold text-slate-900 block">QA & Deployment Coordinator</span>
            <p className="text-slate-600">
              Pytest verification, end-to-end integration testing, Vercel & Docker configs.
            </p>
            <span className="text-[10px] text-amber-600 font-semibold">Assigned Module</span>
          </div>
        </div>
      </div>
    </div>
  );
};
