import React from 'react';
import { MobilityProfile } from '../types';
import { Accessibility, Footprints, Baby, User } from 'lucide-react';

interface ProfileSelectorProps {
  selectedProfile: MobilityProfile;
  onSelectProfile: (profile: MobilityProfile) => void;
  disabled?: boolean;
}

interface ProfileOption {
  id: MobilityProfile;
  label: string;
  tag: string;
  icon: React.ReactNode;
  description: string;
  constraints: string;
}

const PROFILES: ProfileOption[] = [
  {
    id: 'wheelchair',
    label: 'Wheelchair / Powerchair',
    tag: 'Strict ADA & Zero Stairs',
    icon: <Accessibility className="w-5 h-5" />,
    description: 'Requires curb cuts, smooth pavement, max 8.3% ramp slope, zero stairs, min 0.9m width.',
    constraints: 'Excludes: Stairs, missing curb cuts, slopes >8%, construction bottlenecks.'
  },
  {
    id: 'walker_cane',
    label: 'Walker / Cane / Crutches',
    tag: 'Low Step & Fall Prevention',
    icon: <Footprints className="w-5 h-5" />,
    description: 'Avoids multi-step flights, loose gravel, and steep grades (>10%). Prioritizes handrails.',
    constraints: 'Excludes: >3 steps, severe slopes, heavy cobblestone surfaces.'
  },
  {
    id: 'stroller_elderly',
    label: 'Stroller & Senior Transit',
    tag: 'Gentle Gradients & Benches',
    icon: <Baby className="w-5 h-5" />,
    description: 'Paved level pathways with rest zones, avoiding stairs and heavy detours.',
    constraints: 'Excludes: Flights of stairs without ramps, steep hills (>12%).'
  },
  {
    id: 'standard',
    label: 'Standard Pedestrian',
    tag: 'Minimum Distance Baseline',
    icon: <User className="w-5 h-5" />,
    description: 'Navigates stairs, curbs, and variable terrain with standard 1.35 m/s walking speed.',
    constraints: 'Unconstrained distance routing (used as direct baseline).'
  }
];

export const ProfileSelector: React.FC<ProfileSelectorProps> = ({
  selectedProfile,
  onSelectProfile,
  disabled = false
}) => {
  return (
    <div className="space-y-2">
      <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500">
        Mobility & Accessibility Profile
      </label>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        {PROFILES.map((p) => {
          const isSelected = selectedProfile === p.id;
          return (
            <button
              key={p.id}
              type="button"
              disabled={disabled}
              onClick={() => onSelectProfile(p.id)}
              className={`text-left p-3 rounded-xl border transition-all relative flex flex-col justify-between ${
                isSelected
                  ? 'border-blue-600 bg-blue-50/70 shadow-sm ring-1 ring-blue-500'
                  : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
              } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
            >
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center space-x-2">
                  <div
                    className={`p-1.5 rounded-lg ${
                      isSelected ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {p.icon}
                  </div>
                  <span className="font-semibold text-sm text-slate-900">{p.label}</span>
                </div>
                <span
                  className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                    isSelected ? 'bg-blue-200 text-blue-800' : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {p.tag}
                </span>
              </div>
              <p className="text-xs text-slate-600 mt-1 line-clamp-2">{p.description}</p>
            </button>
          );
        })}
      </div>
    </div>
  );
};
