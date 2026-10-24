import React from 'react';
import { NetworkNode, MobilityProfile } from '../types';
import { ProfileSelector } from './ProfileSelector';
import { MapPin, Navigation, ArrowUpDown, Search, RefreshCw } from 'lucide-react';

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
    <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center space-x-2">
          <Navigation className="w-5 h-5 text-blue-600" />
          <h3 className="font-bold text-slate-900 text-base">Route Navigation Planner</h3>
        </div>
        <button
          onClick={onReset}
          className="text-xs text-slate-500 hover:text-slate-800 flex items-center space-x-1 cursor-pointer transition-colors"
          title="Reset fields"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Reset</span>
        </button>
      </div>

      {/* Origin and Destination */}
      <div className="space-y-3 relative">
        {/* Source */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1 flex items-center space-x-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>Origin (Start Point)</span>
          </label>
          <div className="relative">
            <select
              value={sourceId}
              onChange={(e) => onSourceChange(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-medium text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all cursor-pointer"
            >
              <option value="">-- Choose Origin Point --</option>
              {nodes.map((n) => (
                <option key={n.id} value={n.id}>
                  {n.name} ({n.node_type})
                </option>
              ))}
            </select>
            <MapPin className="w-4 h-4 text-emerald-600 absolute left-3 top-3.5 pointer-events-none" />
          </div>
        </div>

        {/* Swap Button */}
        <div className="flex justify-end pr-3 -my-1">
          <button
            type="button"
            onClick={onSwapEndpoints}
            className="p-1.5 rounded-full bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-600 hover:text-slate-900 shadow-xs cursor-pointer transition-transform active:rotate-180"
            title="Swap Origin and Destination"
          >
            <ArrowUpDown className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Destination */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1 flex items-center space-x-1">
            <span className="w-2 h-2 rounded-full bg-rose-500" />
            <span>Destination</span>
          </label>
          <div className="relative">
            <select
              value={targetId}
              onChange={(e) => onTargetChange(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-medium text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all cursor-pointer"
            >
              <option value="">-- Choose Destination Point --</option>
              {nodes.map((n) => (
                <option key={n.id} value={n.id} disabled={n.id === sourceId}>
                  {n.name} {n.id === sourceId ? '(Current Origin)' : `(${n.node_type})`}
                </option>
              ))}
            </select>
            <MapPin className="w-4 h-4 text-rose-600 absolute left-3 top-3.5 pointer-events-none" />
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
        <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs leading-relaxed">
          {errorMessage}
        </div>
      )}

      {/* Submit Button */}
      <button
        onClick={onPlanRoute}
        disabled={!sourceId || !targetId || sourceId === targetId || isLoading}
        className="w-full py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? (
          <>
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            <span>Calculating Accessible Route...</span>
          </>
        ) : (
          <>
            <Search className="w-4 h-4" />
            <span>Compare Shortest vs. Accessible Path</span>
          </>
        )}
      </button>
    </div>
  );
};
