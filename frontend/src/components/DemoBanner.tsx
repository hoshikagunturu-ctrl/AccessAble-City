import React from 'react';
import { Play, ShieldCheck, ArrowRight, Activity, CornerDownRight } from 'lucide-react';

interface DemoBannerProps {
  onRunDemo: () => void;
  isLoading: boolean;
}

export const DemoBanner: React.FC<DemoBannerProps> = ({ onRunDemo, isLoading }) => {
  return (
    <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-slate-950 rounded-2xl p-4 sm:p-5 text-white border border-slate-800 shadow-md relative overflow-hidden">
      {/* Subtle background ambient glow */}
      <div className="absolute top-0 right-1/4 w-96 h-32 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Left Information */}
        <div className="space-y-1.5 max-w-3xl">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-teal-500/15 text-teal-300 border border-teal-500/30">
              <Activity className="w-3.5 h-3.5 text-teal-400" />
              <span>Algorithmic Barrier Exclusion Active</span>
            </span>
            <span className="text-slate-400 text-xs hidden sm:inline">
              Verified Pedestrian Infrastructure Network
            </span>
          </div>

          <h2 className="text-base sm:text-lg font-bold tracking-tight text-white flex flex-wrap items-center gap-1.5">
            <span>Civic Transit Station</span>
            <ArrowRight className="w-4 h-4 text-teal-400 inline" />
            <span>Civic Public Library & Learning Hub</span>
          </h2>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Conventional navigation leads pedestrians down an <strong>impassable 18-step concrete flight</strong>. 
            AccessAble City dynamically rejects the barrier and safely routes through the <strong>ADA Switchback Ramp (4.2% grade)</strong>, 
            guaranteeing a continuous, wheel-friendly path.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-1 text-[11px] text-slate-400">
            <span className="flex items-center space-x-1">
              <ShieldCheck className="w-3.5 h-3.5 text-teal-400" />
              <span className="text-slate-300 font-medium">100% Zero-Step Ramp Guarantee</span>
            </span>
            <span className="flex items-center space-x-1">
              <CornerDownRight className="w-3.5 h-3.5 text-cyan-400" />
              <span className="text-slate-300 font-medium">Dropped Curb Cuts Verified</span>
            </span>
          </div>
        </div>

        {/* Right CTA */}
        <div className="flex-shrink-0">
          <button
            onClick={onRunDemo}
            disabled={isLoading}
            className="w-full sm:w-auto px-5 py-3 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 active:scale-98 text-slate-950 font-bold text-xs tracking-wide shadow-lg shadow-teal-500/20 hover:shadow-teal-500/30 transition-all flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                <span>Evaluating Dual Routes...</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-slate-950" />
                <span>Launch Benchmark Comparison</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
