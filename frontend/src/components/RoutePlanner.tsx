import React from 'react';
import type { NetworkNode, MobilityProfile } from '../types';
import { ProfileSelector } from './ProfileSelector';
import { Navigation, ArrowUpDown, Search, RotateCcw, MapPin, Compass } from 'lucide-react';

interface RoutePlannerProps {
  nodes: NetworkNode[];
  sourceId: string;
  targetId: string;
  profile: MobilityProfile;
  onSourceChange: (id: string) => void;
  onTargetChange: (id: string) => void;
  onProfileChange: (p: MobilityProfile) => void;
  onPlanRoute: () => void;
  onSwapEndpoints: () => void;
  onReset: () => void;
  isLoading: boolean;
  errorMessage?: string | null;
}

export const RoutePlanner: React.FC<RoutePlannerProps> = ({
  nodes,
  sourceId,
  targetId,
  profile,
  onSourceChange,
  onTargetChange,
  onProfileChange,
  onPlanRoute,
  onSwapEndpoints,
  onReset,
  isLoading,
  errorMessage
}) => {
  return (
    <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-5 shadow-lg shadow-black/20 text-white space-y-4">
      {/* Title & Reset */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center space-x-2">
          <div className="p-1 rounded-md bg-teal-500/20 text-teal-400">
            <Compass className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-sm tracking-tight text-white">Route Dispatch & Planner</h3>
            <p className="text-[11px] text-slate-400">Specify journey waypoints and mobility constraints</p>
          </div>
        </div>

        <button
          onClick={onReset}
          className="text-xs text-slate-400 hover:text-slate-200 flex items-center space-x-1 cursor-pointer transition-colors px-2 py-1 rounded-md hover:bg-slate-800"
          title="Reset waypoints"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset</span>
        </button>
      </div>

      {/* Origin & Destination inputs */}
      <div className="space-y-3 relative">
        {/* Origin */}
        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1 flex items-center space-x-1.5">
            <span className="w-2 h-2 rounded-full bg-teal-400 shadow-xs shadow-teal-400" />
            <span>Origin Point (A)</span>
          </label>
          <div className="relative">
            <select
              value={sourceId}
              onChange={(e) => onSourceChange(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-xs font-semibold text-slate-200 focus:outline-none focus:ring-1 focus:ring-teal-500 focus:border-teal-500 transition-all cursor-pointer"
            >
              <option value="" disabled>-- Select Origin Node --</option>
              {nodes.map((n) => (
                <option key={n.id} value={n.id}>
                  {n.name} [{n.node_type}]
                </option>
              ))}
            </select>
            <MapPin className="w-4 h-4 text-teal-400 absolute left-3 top-3 pointer-events-none" />
          </div>
        </div>

        {/* Swap button */}
        <div className="flex justify-end pr-2 -my-1">
          <button
            type="button"
            onClick={onSwapEndpoints}
            className="p-1.5 rounded-full bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 hover:text-white shadow-xs cursor-pointer transition-all hover:rotate-180 active:scale-90"
            title="Swap Origin and Destination"
          >
            <ArrowUpDown className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Destination */}
        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1 flex items-center space-x-1.5">
            <span className="w-2 h-2 rounded-full bg-rose-400 shadow-xs shadow-rose-400" />
            <span>Destination Point (B)</span>
          </label>
          <div className="relative">
            <select
              value={targetId}
              onChange={(e) => onTargetChange(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-xs font-semibold text-slate-200 focus:outline-none focus:ring-1 focus:ring-rose-500 focus:border-rose-500 transition-all cursor-pointer"
            >
              <option value="" disabled>-- Select Destination Node --</option>
              {nodes.map((n) => (
                <option key={n.id} value={n.id} disabled={n.id === sourceId}>
                  {n.name} {n.id === sourceId ? '(Current Origin)' : `[${n.node_type}]`}
                </option>
              ))}
            </select>
            <MapPin className="w-4 h-4 text-rose-400 absolute left-3 top-3 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Mobility Profile */}
      <ProfileSelector
        selectedProfile={profile}
        onSelectProfile={onProfileChange}
        disabled={isLoading}
      />

      {/* Error display */}
      {errorMessage && (
        <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-800 text-rose-300 text-xs leading-relaxed">
          {errorMessage}
        </div>
      )}

      {/* Action Button */}
      <button
        onClick={onPlanRoute}
        disabled={!sourceId || !targetId || sourceId === targetId || isLoading}
        className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 active:scale-98 text-slate-950 font-bold text-xs tracking-wider uppercase shadow-md shadow-teal-500/20 transition-all flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
      >
        {isLoading ? (
          <>
            <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
            <span>Evaluating Accessibility Corridors...</span>
          </>
        ) : (
          <>
            <Search className="w-4 h-4" />
            <span>Calculate & Compare Paths</span>
          </>
        )}
      </button>
    </div>
  );
};
