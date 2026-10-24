import React from 'react';
import { Accessibility, Sparkles, Map, ShieldAlert, Cpu, Layers } from 'lucide-react';

interface NavbarProps {
  activeTab: 'map' | 'barriers' | 'scanner' | 'about';
  setActiveTab: (tab: 'map' | 'barriers' | 'scanner' | 'about') => void;
  visionStatus?: {
    gemini_configured: boolean;
    mode: string;
    description: string;
  };
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab, visionStatus }) => {
  return (
    <header className="bg-slate-950/95 backdrop-blur-md border-b border-slate-800/80 text-white sticky top-0 z-50 shadow-lg shadow-black/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Identity */}
          <div
            className="flex items-center space-x-3.5 cursor-pointer group"
            onClick={() => setActiveTab('map')}
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-600 via-cyan-500 to-blue-600 p-0.5 shadow-md shadow-teal-500/20 group-hover:shadow-teal-500/30 transition-shadow">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Accessibility className="w-5 h-5 text-teal-400 group-hover:scale-105 transition-transform" />
              </div>
            </div>

            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-lg tracking-tight text-white group-hover:text-teal-300 transition-colors">
                  AccessAble City
                </span>
                <span className="px-2 py-0.5 text-[10px] uppercase font-bold tracking-wider rounded-md bg-teal-500/10 text-teal-300 border border-teal-500/30">
                  Urban GIS
                </span>
              </div>
              <p className="text-[11px] font-medium text-slate-400 tracking-wide hidden sm:block">
                Every Street. Every Step. Everyone.
              </p>
            </div>
          </div>

          {/* Navigation Controls */}
          <nav className="flex items-center space-x-1 sm:space-x-1.5" aria-label="Main Navigation">
            <button
              onClick={() => setActiveTab('map')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-all flex items-center space-x-1.5 cursor-pointer ${
                activeTab === 'map'
                  ? 'bg-teal-500/15 text-teal-300 border border-teal-500/40 shadow-xs'
                  : 'text-slate-300 hover:text-white hover:bg-slate-900 border border-transparent'
              }`}
            >
              <Map className="w-3.5 h-3.5" />
              <span>Pedestrian Routing</span>
            </button>

            <button
              onClick={() => setActiveTab('barriers')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-all flex items-center space-x-1.5 cursor-pointer ${
                activeTab === 'barriers'
                  ? 'bg-teal-500/15 text-teal-300 border border-teal-500/40 shadow-xs'
                  : 'text-slate-300 hover:text-white hover:bg-slate-900 border border-transparent'
              }`}
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>Barrier Registry</span>
            </button>

            <button
              onClick={() => setActiveTab('scanner')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-all flex items-center space-x-1.5 cursor-pointer ${
                activeTab === 'scanner'
                  ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 shadow-xs'
                  : 'text-slate-300 hover:text-white hover:bg-slate-900 border border-transparent'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              <span>AI Vision Inspector</span>
            </button>

            <button
              onClick={() => setActiveTab('about')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-all hidden md:flex items-center space-x-1.5 cursor-pointer ${
                activeTab === 'about'
                  ? 'bg-teal-500/15 text-teal-300 border border-teal-500/40 shadow-xs'
                  : 'text-slate-300 hover:text-white hover:bg-slate-900 border border-transparent'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Architecture</span>
            </button>
          </nav>

          {/* Engine Status Pill */}
          <div className="hidden lg:flex items-center space-x-2 text-[11px] bg-slate-900/90 px-3 py-1.5 rounded-lg border border-slate-800">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-teal-500"></span>
            </span>
            <span className="text-slate-400 font-medium">Engine:</span>
            <span className={`font-semibold ${visionStatus?.gemini_configured ? 'text-teal-300' : 'text-amber-300'}`}>
              {visionStatus?.gemini_configured ? 'Gemini 2.5 Multimodal' : 'Verified Heuristic GIS'}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};
