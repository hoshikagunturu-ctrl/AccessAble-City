import React from 'react';
import type { MobilityProfile } from '../types';
import { Accessibility, Footprints, Baby, Compass, Check } from 'lucide-react';

interface ProfileSelectorProps {
  selectedProfile: MobilityProfile;
  onSelectProfile: (profile: MobilityProfile) => void;
  disabled?: boolean;
}

interface ProfileOption {
  id: MobilityProfile;
  label: string;
  badge: string;
  icon: React.ReactNode;
  specs: string;
  ruleExplanation: string;
}

const PROFILES: ProfileOption[] = [
  {
    id: 'wheelchair',
    label: 'Wheelchair & Powerchair',
    badge: 'Strict ADA Standard',
    icon: <Accessibility className="w-4 h-4" />,
    specs: 'Max grade 8.3% • Clear width ≥0.9m • Zero steps',
    ruleExplanation: 'Strictly excludes flights of stairs, missing dropped curb ramps, steep street inclines (>8%), and construction bottlenecks.'
  },
  {
    id: 'walker_cane',
    label: 'Walking Aid / Cane / Crutches',
    badge: 'Low-Step & Stability',
    icon: <Footprints className="w-4 h-4" />,
    specs: 'Max 3 steps • Fall hazard avoidance • Railing priority',
    ruleExplanation: 'Filters out tall staircases (>3 risers), high-vibration cobblestone, and steep slopes (>10%) to minimize trip and fatigue risks.'
  },
  {
    id: 'stroller_elderly',
    label: 'Stroller & Senior Transit',
    badge: 'Gentle Gradients',
    icon: <Baby className="w-4 h-4" />,
    specs: 'Paved smooth paths • Gentle slopes (<6%) • Rest benches',
    ruleExplanation: 'Prioritizes level asphalt and concrete walkways, avoids unramped stairs, and identifies resting corridors.'
  },
  {
    id: 'standard',
    label: 'Standard Pedestrian',
    badge: 'Distance Baseline',
    icon: <Compass className="w-4 h-4" />,
    specs: 'Unconstrained distance routing • Average 1.35 m/s',
    ruleExplanation: 'Calculates the direct distance shortest path without accessibility filtering. Used as comparative benchmark.'
  }
];

export const ProfileSelector: React.FC<ProfileSelectorProps> = ({
  selectedProfile,
  onSelectProfile,
  disabled = false
}) => {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
          Mobility & Accessibility Profile
        </label>
        <span className="text-[10px] text-teal-400 font-semibold">
          Multi-criteria Dijkstra Cost Function
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        {PROFILES.map((p) => {
          const isSelected = selectedProfile === p.id;
          return (
            <button
              key={p.id}
              type="button"
              disabled={disabled}
              onClick={() => onSelectProfile(p.id)}
              className={`text-left p-3 rounded-xl border transition-all relative flex flex-col justify-between cursor-pointer ${
                isSelected
                  ? 'border-teal-500 bg-teal-950/30 text-white shadow-sm ring-1 ring-teal-500/50'
                  : 'border-slate-800 bg-slate-900/60 text-slate-300 hover:border-slate-700 hover:bg-slate-900/90'
              } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center space-x-2">
                    <div
                      className={`p-1.5 rounded-lg transition-colors ${
                        isSelected
                          ? 'bg-teal-500 text-slate-950 font-bold'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {p.icon}
                    </div>
                    <span className="font-bold text-xs text-white tracking-tight">
                      {p.label}
                    </span>
                  </div>

                  {isSelected && (
                    <div className="w-4 h-4 rounded-full bg-teal-500 text-slate-950 flex items-center justify-center">
                      <Check className="w-2.5 h-2.5 stroke-[3]" />
                    </div>
                  )}
                </div>

                <p className="text-[11px] font-medium text-slate-400 mt-1">
                  {p.specs}
                </p>
              </div>

              <div className="mt-2 pt-1.5 border-t border-slate-800/80">
                <span className="text-[10px] text-slate-400 line-clamp-1">
                  {p.ruleExplanation}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
