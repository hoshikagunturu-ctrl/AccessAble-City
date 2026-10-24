import React, { useState } from 'react';
import type { RouteComparisonResponse } from '../types';
import {
  ShieldCheck,
  AlertTriangle,
  ChevronRight,
  CheckCircle2,
  XCircle,
  Clock,
  ArrowRight,
  Sparkles,
  Info
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
