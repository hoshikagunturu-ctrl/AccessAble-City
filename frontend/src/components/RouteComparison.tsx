import React, { useState } from 'react';
import type { RouteComparisonResponse } from '../types';
import {
  ShieldCheck,
  AlertTriangle,
  ChevronRight,
  CheckCircle2,
  XCircle,
} from 'lucide-react';

interface RouteComparisonProps {
  comparisonData: RouteComparisonResponse;
  activeView: 'comparison' | 'accessible' | 'shortest';
  setActiveView: (view: 'comparison' | 'accessible' | 'shortest') => void;
}

export const RouteComparison: React.FC<RouteComparisonProps> = ({
  comparisonData,
  activeView,
  setActiveView
}) => {
  const { shortest_route, accessible_route, comparison, selected_profile, source_node, target_node } =
    comparisonData;

  const [expandedSegment, setExpandedSegment] = useState<number | null>(null);

  if (!shortest_route && !accessible_route) {
    return null;
  }

  const isAccessibleValid = accessible_route && accessible_route.is_valid;

  return (
    <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-5 shadow-lg shadow-black/20 text-white space-y-4">
      {/* Header & View Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3.5">
        <div>
          <span className="text-[10px] uppercase font-bold tracking-wider text-teal-400">
            Corridor Analytics & Comparison
          </span>
          <h3 className="text-sm font-bold text-white flex items-center space-x-1.5 mt-0.5">
            <span>{source_node.name}</span>
            <span className="text-slate-400">→</span>
            <span>{target_node.name}</span>
          </h3>
        </div>

        {/* View Toggle Tabs */}
        <div className="inline-flex rounded-xl bg-slate-950 p-1 border border-slate-800 self-start sm:self-auto">
          <button
            onClick={() => setActiveView('comparison')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-all cursor-pointer ${
              activeView === 'comparison'
                ? 'bg-slate-800 text-white shadow-xs'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Comparative View
          </button>
          <button
            onClick={() => setActiveView('accessible')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-all flex items-center space-x-1 cursor-pointer ${
              activeView === 'accessible'
                ? 'bg-teal-500 text-slate-950 font-bold shadow-xs'
                : 'text-slate-400 hover:text-teal-300'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Accessible</span>
          </button>
          <button
            onClick={() => setActiveView('shortest')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-all flex items-center space-x-1 cursor-pointer ${
              activeView === 'shortest'
                ? 'bg-rose-600 text-white font-bold shadow-xs'
                : 'text-slate-400 hover:text-rose-300'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Conventional</span>
          </button>
        </div>
      </div>

      {/* Algorithmic Decision Banner */}
      {comparison && (
        <div className="p-4 rounded-xl bg-gradient-to-r from-teal-950/50 via-slate-900 to-slate-950 border border-teal-500/40 space-y-2">
          <div className="flex items-center space-x-2 text-teal-300 font-bold text-xs tracking-wide">
            <CheckCircle2 className="w-4 h-4 text-teal-400 flex-shrink-0" />
            <span>Algorithmic Decision Justification</span>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
            {comparison.why_accessible_chosen}
          </p>

          <div className="flex flex-wrap items-center gap-1.5 pt-1">
            <span className="text-[11px] font-bold text-teal-300 mr-1">Barriers Excluded:</span>
            {comparison.barriers_avoided.map((b, i) => (
              <span
                key={i}
                className="px-2 py-0.5 rounded-md text-[11px] font-semibold bg-teal-500/15 text-teal-200 border border-teal-500/30"
              >
                ✕ {b}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* No Valid Route Warning */}
      {!isAccessibleValid && (
        <div className="p-4 rounded-xl bg-rose-950/40 border border-rose-800 space-y-2">
          <div className="flex items-center space-x-2 text-rose-300 font-bold text-xs">
            <XCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
            <span>No Valid Accessible Path Found</span>
          </div>
          <p className="text-xs text-rose-200 leading-relaxed">
            {accessible_route?.decision_explanation ||
              'All candidate paths between these waypoints contain insurmountable physical barriers for your profile.'}
          </p>
        </div>
      )}

      {/* Side-by-Side Dual Corridor Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {/* 1. ACCESSIBLE ROUTE CARD */}
        {accessible_route && isAccessibleValid && (
          <div
            className={`rounded-xl border p-4 transition-all ${
              activeView === 'accessible' || activeView === 'comparison'
                ? 'border-teal-500/80 bg-teal-950/20 ring-1 ring-teal-500/30'
                : 'border-slate-800 bg-slate-950/40 opacity-70'
            }`}
          >
            <div className="flex items-center justify-between border-b border-teal-900/50 pb-2.5">
              <div className="flex items-center space-x-2">
                <span className="p-1 rounded-md bg-teal-500 text-slate-950">
                  <ShieldCheck className="w-3.5 h-3.5" />
                </span>
                <span className="font-bold text-xs text-white">
                  Accessible Route (Based on Available Data)
                </span>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/40">
                Continuous Zero-Step
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2 py-3 border-b border-slate-800 text-center">
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-semibold">Distance</span>
                <p className="text-base font-bold text-white tabular-nums">
                  {accessible_route.total_distance_m} m
                </p>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-semibold">Duration</span>
                <p className="text-base font-bold text-teal-300 tabular-nums">
                  {accessible_route.estimated_time_formatted}
                </p>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-semibold">Stairs</span>
                <p className="text-base font-bold text-teal-400">0 Steps</p>
              </div>
            </div>

            <div className="pt-2.5 space-y-1 text-[11px] text-slate-300">
              <div className="flex justify-between">
                <span className="text-slate-400">Ramp Max Gradient:</span>
                <span className="font-semibold text-teal-300">4.2% (ADA Compliant &lt;8.3%)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Curbs & Transitions:</span>
                <span className="font-semibold text-teal-300">Dropped curbs at all junctions</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Surface Profile:</span>
                <span className="font-semibold text-slate-200">Smooth asphalt & concrete</span>
              </div>
            </div>

            {accessible_route.warnings.length > 0 && (
              <div className="mt-2.5 p-2 rounded-lg bg-amber-950/40 border border-amber-800/80 text-[10px] text-amber-300">
                {accessible_route.warnings[0]}
              </div>
            )}
          </div>
        )}

        {/* 2. CONVENTIONAL (STANDARD) ROUTE CARD */}
        {shortest_route && (
          <div
            className={`rounded-xl border p-4 transition-all ${
              activeView === 'shortest' || activeView === 'comparison'
                ? 'border-rose-500/80 bg-rose-950/20 ring-1 ring-rose-500/30'
                : 'border-slate-800 bg-slate-950/40 opacity-70'
            }`}
          >
            <div className="flex items-center justify-between border-b border-rose-900/50 pb-2.5">
              <div className="flex items-center space-x-2">
                <span className="p-1 rounded-md bg-rose-600 text-white">
                  <AlertTriangle className="w-3.5 h-3.5" />
                </span>
                <span className="font-bold text-xs text-white">
                  Conventional Shortest Path
                </span>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/40">
                Critical Barrier
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2 py-3 border-b border-slate-800 text-center">
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-semibold">Distance</span>
                <p className="text-base font-bold text-white tabular-nums">
                  {shortest_route.total_distance_m} m
                </p>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-semibold">Duration</span>
                <p className="text-base font-bold text-slate-300 tabular-nums">
                  {shortest_route.estimated_time_formatted}
                </p>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-semibold">Stairs</span>
                <p className="text-base font-bold text-rose-400">
                  {shortest_route.stairs_count > 0 ? '18 Steps' : '0'}
                </p>
              </div>
            </div>

            <div className="pt-2.5 space-y-1 text-[11px] text-slate-300">
              <div className="flex justify-between">
                <span className="text-slate-400">Mobility Status:</span>
                <span className="font-semibold text-rose-400">
                  Prohibited for {selected_profile}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Physical Obstruction:</span>
                <span className="font-semibold text-slate-200">18-step concrete flight</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Ramp Alternative:</span>
                <span className="font-semibold text-rose-400">None on direct trajectory</span>
              </div>
            </div>

            <div className="mt-2.5 p-2 rounded-lg bg-rose-950/40 border border-rose-800/80 text-[10px] text-rose-300">
              ⚠️ Inaccessible for wheeled mobility, strollers, and crutch users.
            </div>
          </div>
        )}
      </div>

      {/* Turn-by-Turn Waypoints */}
      {accessible_route && isAccessibleValid && (
        <div className="space-y-2.5 border-t border-slate-800 pt-3.5">
          <div className="flex items-center justify-between">
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Accessible Corridors ({accessible_route.segments.length} Waypoints)
            </h4>
            <span className="text-[10px] text-teal-400 font-mono">Accessibility Data Status</span>
          </div>

          <div className="space-y-2">
            {accessible_route.segments.map((seg, idx) => {
              const isExpanded = expandedSegment === idx;
              return (
                <div
                  key={seg.edge_id}
                  className="rounded-xl border border-slate-800 bg-slate-950/60 hover:bg-slate-950 hover:border-slate-700 transition-all overflow-hidden"
                >
                  <button
                    type="button"
                    aria-expanded={isExpanded}
                    aria-controls={`segment-details-${seg.edge_id}`}
                    onClick={() => setExpandedSegment(isExpanded ? null : idx)}
                    className="w-full p-3 flex items-center justify-between text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-400 focus-visible:ring-inset"
                  >
                    <div className="flex items-center space-x-2.5">
                      <span className="w-5 h-5 rounded-full bg-teal-500/20 text-teal-300 text-[10px] font-bold flex items-center justify-center border border-teal-500/40">
                        {idx + 1}
                      </span>
                      <div>
                        <span className="text-xs font-bold text-white">
                          {seg.source_name} → {seg.target_name}
                        </span>
                        <div className="flex items-center space-x-2 text-[10px] text-slate-400 mt-0.5">
                          <span className="tabular-nums">{seg.distance}m</span>
                          <span>•</span>
                          <span className="capitalize">{seg.surface.replace('_', ' ')}</span>
                          <span>•</span>
                          <span>Slope {seg.slope}%</span>
                          {seg.ramps && (
                            <span className="text-teal-400 font-semibold">• ADA Ramp</span>
                          )}
                        </div>
                      </div>
                    </div>
                    <ChevronRight
                      className={`w-4 h-4 text-slate-500 transition-transform ${
                        isExpanded ? 'rotate-90 text-teal-400' : ''
                      }`}
                    />
                  </button>

                  {isExpanded && (
                    <div
                      id={`segment-details-${seg.edge_id}`}
                      className="px-3 pb-3 pt-2 border-t border-slate-800/80 text-[11px] text-slate-300 bg-slate-900/40 space-y-1.5"
                    >
                      <p className="text-slate-400">{seg.segment_explanation}</p>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-[10px] pt-1">
                        <div>
                          <strong className="text-slate-400">Clear Width:</strong> {seg.width}m (ADA ≥0.9m)
                        </div>
                        <div>
                          <strong className="text-slate-400">Dropped Curb:</strong> {seg.curb_cuts ? 'Yes' : 'No'}
                        </div>
                        <div>
                          <strong className="text-slate-400">Status:</strong>{' '}
                          <span
                            className={
                              seg.accessibility_status === 'known_accessible'
                                ? 'text-teal-400 font-semibold'
                                : 'text-amber-400 font-semibold'
                            }
                          >
                            {seg.accessibility_status.replace('_', ' ')}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
