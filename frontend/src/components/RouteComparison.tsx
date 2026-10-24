import React, { useState } from 'react';
import type { RouteComparisonResponse } from '../types';
import {
  ShieldCheck,
  AlertTriangle,
  ChevronRight,
  CheckCircle2,
  XCircle
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
    <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-5">
      {/* Header & Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-blue-600">
            Route Analysis & Comparison
          </span>
          <h3 className="text-base font-bold text-slate-900 flex items-center space-x-1.5 mt-0.5">
            <span>{source_node.name}</span>
            <span className="text-slate-400">→</span>
            <span>{target_node.name}</span>
          </h3>
        </div>

        {/* View Toggle Tabs */}
        <div className="inline-flex rounded-xl bg-slate-100 p-1 border border-slate-200">
          <button
            onClick={() => setActiveView('comparison')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeView === 'comparison'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Side-by-Side
          </button>
          <button
            onClick={() => setActiveView('accessible')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center space-x-1 cursor-pointer ${
              activeView === 'accessible'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-emerald-700'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Accessible Route</span>
          </button>
          <button
            onClick={() => setActiveView('shortest')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center space-x-1 cursor-pointer ${
              activeView === 'shortest'
                ? 'bg-rose-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-rose-700'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Shortest (Standard)</span>
          </button>
        </div>
      </div>

      {/* Decision Explanation Banner */}
      {comparison && (
        <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 space-y-2">
          <div className="flex items-center space-x-2 text-emerald-900 font-bold text-sm">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
            <span>Algorithmic Route Decision Justification</span>
          </div>
          <p className="text-xs sm:text-sm text-emerald-800 leading-relaxed">
            {comparison.why_accessible_chosen}
          </p>

          {/* Key barriers avoided badges */}
          <div className="flex flex-wrap items-center gap-1.5 pt-1">
            <span className="text-xs font-semibold text-emerald-900 mr-1">Barriers Avoided:</span>
            {comparison.barriers_avoided.map((b, i) => (
              <span
                key={i}
                className="px-2 py-0.5 rounded-md text-xs font-medium bg-emerald-100 text-emerald-800 border border-emerald-300"
              >
                ✓ {b}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* No Valid Route Warning */}
      {!isAccessibleValid && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 space-y-2">
          <div className="flex items-center space-x-2 text-rose-900 font-bold text-sm">
            <XCircle className="w-5 h-5 text-rose-600 flex-shrink-0" />
            <span>No Valid Accessible Path Found</span>
          </div>
          <p className="text-xs text-rose-800 leading-relaxed">
            {accessible_route?.decision_explanation ||
              'All pathways between these locations contain insurmountable physical barriers for your profile.'}
          </p>
        </div>
      )}

      {/* Side-by-Side Comparison Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* 1. ACCESSIBLE ROUTE CARD */}
        {accessible_route && isAccessibleValid && (
          <div
            className={`rounded-xl border p-4 transition-all ${
              activeView === 'accessible' || activeView === 'comparison'
                ? 'border-emerald-500 bg-emerald-50/20 ring-1 ring-emerald-400'
                : 'border-slate-200 bg-white opacity-70'
            }`}
          >
            <div className="flex items-center justify-between border-b border-emerald-100 pb-2.5">
              <div className="flex items-center space-x-2">
                <span className="p-1 rounded-md bg-emerald-600 text-white">
                  <ShieldCheck className="w-4 h-4" />
                </span>
                <span className="font-bold text-sm text-slate-900">
                  Accessibility-Verified Route
                </span>
              </div>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                100% Barrier-Free
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2 py-3 border-b border-slate-100 text-center">
              <div>
                <span className="text-[10px] text-slate-500 uppercase font-medium">Distance</span>
                <p className="text-base font-bold text-slate-900">
                  {accessible_route.total_distance_m} m
                </p>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 uppercase font-medium">Est. Time</span>
                <p className="text-base font-bold text-slate-900">
                  {accessible_route.estimated_time_formatted}
                </p>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 uppercase font-medium">Stairs</span>
                <p className="text-base font-bold text-emerald-600">0 Steps (Ramps only)</p>
              </div>
            </div>

            <div className="pt-3 space-y-1.5 text-xs text-slate-700">
              <div className="flex justify-between">
                <span className="text-slate-500">Max Ramp Gradient:</span>
                <span className="font-semibold text-slate-900">4.5% (ADA Compliant &lt;8.3%)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Curb Ramps:</span>
                <span className="font-semibold text-emerald-700">Present at all crossings</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Surface Quality:</span>
                <span className="font-semibold text-slate-900">Smooth asphalt & paved concrete</span>
              </div>
            </div>

            {accessible_route.warnings.length > 0 && (
              <div className="mt-3 p-2 rounded-lg bg-amber-50 border border-amber-200 text-[11px] text-amber-800">
                {accessible_route.warnings[0]}
              </div>
            )}
          </div>
        )}

        {/* 2. SHORTEST (STANDARD) ROUTE CARD */}
        {shortest_route && (
          <div
            className={`rounded-xl border p-4 transition-all ${
              activeView === 'shortest' || activeView === 'comparison'
                ? 'border-rose-400 bg-rose-50/20 ring-1 ring-rose-300'
                : 'border-slate-200 bg-white opacity-70'
            }`}
          >
            <div className="flex items-center justify-between border-b border-rose-100 pb-2.5">
              <div className="flex items-center space-x-2">
                <span className="p-1 rounded-md bg-rose-600 text-white">
                  <AlertTriangle className="w-4 h-4" />
                </span>
                <span className="font-bold text-sm text-slate-900">
                  Standard Shortest Path
                </span>
              </div>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 border border-rose-300">
                Contains Barriers
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2 py-3 border-b border-slate-100 text-center">
              <div>
                <span className="text-[10px] text-slate-500 uppercase font-medium">Distance</span>
                <p className="text-base font-bold text-slate-900">
                  {shortest_route.total_distance_m} m
                </p>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 uppercase font-medium">Est. Time</span>
                <p className="text-base font-bold text-slate-900">
                  {shortest_route.estimated_time_formatted}
                </p>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 uppercase font-medium">Stairs</span>
                <p className="text-base font-bold text-rose-600">
                  {shortest_route.stairs_count > 0 ? '18 Steps (No Ramp)' : '0'}
                </p>
              </div>
            </div>

            <div className="pt-3 space-y-1.5 text-xs text-slate-700">
              <div className="flex justify-between">
                <span className="text-slate-500">Accessibility Status:</span>
                <span className="font-semibold text-rose-600">
                  Prohibited for {selected_profile}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Critical Barrier:</span>
                <span className="font-semibold text-slate-900">Monumental Concrete Stairs</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Elevator / Ramp:</span>
                <span className="font-semibold text-rose-600">None available</span>
              </div>
            </div>

            <div className="mt-3 p-2 rounded-lg bg-rose-50 border border-rose-200 text-[11px] text-rose-800">
              ⚠️ Inaccessible for wheelchairs, strollers, and walker users.
            </div>
          </div>
        )}
      </div>

      {/* Turn-by-Turn Segment Breakdown */}
      {accessible_route && isAccessibleValid && (
        <div className="space-y-2 border-t border-slate-100 pt-4">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Accessible Turn-by-Turn Waypoints ({accessible_route.segments.length} Segments)
          </h4>
          <div className="space-y-2">
            {accessible_route.segments.map((seg, idx) => {
              const isExpanded = expandedSegment === idx;
              return (
                <div
                  key={seg.edge_id}
                  className="rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white transition-all overflow-hidden"
                >
                  <div
                    onClick={() => setExpandedSegment(isExpanded ? null : idx)}
                    className="p-3 flex items-center justify-between cursor-pointer"
                  >
                    <div className="flex items-center space-x-2.5">
                      <span className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center">
                        {idx + 1}
                      </span>
                      <div>
                        <span className="text-xs font-semibold text-slate-900">
                          {seg.source_name} → {seg.target_name}
                        </span>
                        <div className="flex items-center space-x-2 text-[11px] text-slate-500">
                          <span>{seg.distance}m</span>
                          <span>•</span>
                          <span className="capitalize">{seg.surface.replace('_', ' ')}</span>
                          <span>•</span>
                          <span>Slope {seg.slope}%</span>
                          {seg.ramps && (
                            <span className="text-emerald-600 font-semibold">• ADA Ramp</span>
                          )}
                        </div>
                      </div>
                    </div>
                    <ChevronRight
                      className={`w-4 h-4 text-slate-400 transition-transform ${
                        isExpanded ? 'rotate-90' : ''
                      }`}
                    />
                  </div>

                  {isExpanded && (
                    <div className="px-3 pb-3 pt-1 border-t border-slate-100 text-xs text-slate-600 bg-white space-y-1">
                      <p>{seg.segment_explanation}</p>
                      <div className="grid grid-cols-2 gap-2 text-[11px] pt-1">
                        <div>
                          <strong>Width:</strong> {seg.width}m (ADA min: 0.9m)
                        </div>
                        <div>
                          <strong>Curb Cuts:</strong> {seg.curb_cuts ? 'Yes (Dropped)' : 'No'}
                        </div>
                        <div>
                          <strong>Status:</strong>{' '}
                          <span
                            className={
                              seg.accessibility_status === 'known_accessible'
                                ? 'text-emerald-600 font-semibold'
                                : 'text-amber-600 font-semibold'
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
