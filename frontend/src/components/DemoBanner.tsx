import React from 'react';
import { Play, Sparkles, ArrowRight } from 'lucide-react';

interface DemoBannerProps {
  onRunDemo: () => void;
  isLoading: boolean;
}

export const DemoBanner: React.FC<DemoBannerProps> = ({ onRunDemo, isLoading }) => {
  return (
    <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 rounded-2xl p-4 sm:p-5 text-white shadow-lg border border-blue-700/50 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute -top-12 -right-12 w-48 h-48 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1.5 max-w-2xl">
          <div className="flex items-center space-x-2">
            <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Official 1-Click Hackathon Benchmark Scenario</span>
            </span>
            <span className="text-xs text-slate-400">Zero-configuration demonstration</span>
          </div>

          <h2 className="text-lg sm:text-xl font-bold tracking-tight text-white flex items-center space-x-2">
            <span>Civic Transit Hub</span>
            <ArrowRight className="w-4 h-4 text-blue-400 inline" />
            <span>Inclusive Public Library Hub</span>
          </h2>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Demonstrates algorithmic barrier rejection: The standard shortest route (250m) forces wheelchair users down an
            impassable <strong>18-step concrete flight</strong>. AccessAble City dynamically reroutes via the <strong>ADA Switchback Ramp (4.2% grade)</strong>,
            delivering a continuous, barrier-free path (+80m).
          </p>
        </div>

        <div className="flex-shrink-0 w-full sm:w-auto">
          <button
            onClick={onRunDemo}
            disabled={isLoading}
            className="w-full sm:w-auto px-5 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 active:scale-95 text-slate-950 font-bold text-sm shadow-md transition-all flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                <span>Computing Dual Routes...</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-slate-950" />
                <span>Launch 1-Click Demo</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
