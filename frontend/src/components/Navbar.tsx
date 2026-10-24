import React from 'react';
import { Accessibility, Sparkles, Cpu } from 'lucide-react';

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
    <header className="bg-slate-900 border-b border-slate-800 text-white sticky top-0 z-50 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Tagline */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('map')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-emerald-500 flex items-center justify-center shadow-lg shadow-blue-500/20">
              <Accessibility className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-lg tracking-tight text-white">AccessAble City</span>
                <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30">
                  Innovators Conclave '26
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">
                Every Street. Every Step. Everyone.
              </p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="flex space-x-1 sm:space-x-2">
            <button
              onClick={() => setActiveTab('map')}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all cursor-pointer ${
                activeTab === 'map'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              Interactive Map & Routing
            </button>
            <button
              onClick={() => setActiveTab('barriers')}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all cursor-pointer ${
                activeTab === 'barriers'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              Barrier Reports
            </button>
            <button
              onClick={() => setActiveTab('scanner')}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all flex items-center space-x-1 cursor-pointer ${
                activeTab === 'scanner'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span>AI Vision Scanner</span>
            </button>
            <button
              onClick={() => setActiveTab('about')}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all hidden md:block cursor-pointer ${
                activeTab === 'about'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              Architecture & Team
            </button>
          </nav>

          {/* Vision status indicator */}
          <div className="hidden lg:flex items-center space-x-2 text-xs bg-slate-800/80 px-2.5 py-1.5 rounded-lg border border-slate-700">
            <Cpu className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-slate-300">AI Engine:</span>
            <span className={`font-semibold ${visionStatus?.gemini_configured ? 'text-emerald-400' : 'text-amber-300'}`}>
              {visionStatus?.gemini_configured ? 'Gemini 2.5 Flash' : 'Inspection Fallback Mode'}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};
