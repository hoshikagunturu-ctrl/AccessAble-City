import React, { useState, useEffect } from 'react';
import type {
  NetworkNode,
  NetworkEdge,
  MobilityProfile,
  RouteComparisonResponse,
  BarrierReport,
  VerificationStatus,
  BarrierCategory
} from './types';
import { api } from './services/api';
import { Navbar } from './components/Navbar';
import { DemoBanner } from './components/DemoBanner';
import { RoutePlanner } from './components/RoutePlanner';
import { RouteComparison } from './components/RouteComparison';
import { MapView } from './components/MapView';
import { BarrierList } from './components/BarrierList';
import { BarrierReportModal } from './components/BarrierReportModal';
import { ImageBarrierScanner } from './components/ImageBarrierScanner';
import { AboutView } from './components/AboutView';
import { AlertCircle, Accessibility, Compass, ShieldCheck, Sparkles } from 'lucide-react';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'map' | 'barriers' | 'scanner' | 'about'>('map');
  const [nodes, setNodes] = useState<NetworkNode[]>([]);
  const [edges, setEdges] = useState<NetworkEdge[]>([]);
  const [barriers, setBarriers] = useState<BarrierReport[]>([]);
  const [sourceNodeId, setSourceNodeId] = useState<string>('node_transit_hub');
  const [targetNodeId, setTargetNodeId] = useState<string>('node_library');
  const [profile, setProfile] = useState<MobilityProfile>('wheelchair');
  const [comparisonData, setComparisonData] = useState<RouteComparisonResponse | null>(null);
  const [activeView, setActiveView] = useState<'comparison' | 'accessible' | 'shortest'>('comparison');
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [visionStatus, setVisionStatus] = useState<any>(null);

  // Initialize data on mount
  useEffect(() => {
    const init = async () => {
      try {
        const [net, bList, vStatus] = await Promise.all([
          api.getNetwork(),
          api.getBarriers(),
          api.getVisionStatus()
        ]);
        setNodes(net.nodes);
        setEdges(net.edges);
        setBarriers(bList);
        setVisionStatus(vStatus);

        // Run default benchmark comparison immediately
        const demoRes = await api.getOneClickDemo('wheelchair');
        setComparisonData(demoRes);
      } catch (err: any) {
        console.error('Initialization error:', err);
        setErrorMessage('Failed to connect to backend service. Please check API server.');
      }
    };
    init();
  }, []);

  // Run 1-Click Demo
  const handleRunDemo = async () => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      setSourceNodeId('node_transit_hub');
      setTargetNodeId('node_library');
      setProfile('wheelchair');
      const res = await api.getOneClickDemo('wheelchair');
      setComparisonData(res);
      setActiveTab('map');
      setActiveView('comparison');
    } catch (err: any) {
      setErrorMessage(err.message || 'Demo route calculation failed.');
    } finally {
      setIsLoading(false);
    }
  };

  // Plan Route
  const handlePlanRoute = async () => {
    if (!sourceNodeId || !targetNodeId) return;
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const res = await api.planRoute(sourceNodeId, targetNodeId, profile);
      setComparisonData(res);
      setActiveView('comparison');
    } catch (err: any) {
      setErrorMessage(err.message || 'Route planning failed.');
    } finally {
      setIsLoading(false);
    }
  };

  // Swap endpoints
  const handleSwapEndpoints = () => {
    const temp = sourceNodeId;
    setSourceNodeId(targetNodeId);
    setTargetNodeId(temp);
  };

  // Reset
  const handleReset = () => {
    setSourceNodeId('node_transit_hub');
    setTargetNodeId('node_library');
    setProfile('wheelchair');
  };

  // Upvote barrier
  const handleUpvoteBarrier = async (id: number) => {
    try {
      const updated = await api.upvoteBarrier(id);
      setBarriers((prev) => prev.map((b) => (b.id === id ? updated : b)));
    } catch (err: any) {
      console.error('Failed to upvote:', err);
    }
  };

  // Update barrier verification status
  const handleUpdateStatus = async (id: number, status: VerificationStatus) => {
    try {
      const updated = await api.updateBarrierStatus(id, status);
      setBarriers((prev) => prev.map((b) => (b.id === id ? updated : b)));
    } catch (err: any) {
      console.error('Failed to update status:', err);
    }
  };

  // Create new barrier report
  const handleCreateBarrier = async (reportData: {
    category: BarrierCategory;
    title: string;
    description: string;
    lat: number;
    lng: number;
    severity: 'low' | 'medium' | 'high' | 'blocking';
    source: string;
  }) => {
    const created = await api.createBarrier(reportData);
    setBarriers((prev) => [created, ...prev]);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col font-sans text-slate-100 selection:bg-teal-500 selection:text-slate-950">
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        visionStatus={visionStatus}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-5 space-y-5">
        {/* Error Toast */}
        {errorMessage && (
          <div className="p-4 rounded-xl bg-rose-950/60 border border-rose-800 text-rose-200 text-xs flex items-center space-x-2.5 shadow-lg">
            <AlertCircle className="w-5 h-5 text-rose-400 flex-shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* 1. Map & Navigation View */}
        {activeTab === 'map' && (
          <div className="space-y-5">
            {/* Integrated Urban Intelligence Strip */}
            <DemoBanner onRunDemo={handleRunDemo} isLoading={isLoading} />

            {/* Main Interactive Grid: Left Controls (5 cols) + Right Map Canvas (7 cols) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
              {/* Left Column: Dispatch & Comparison */}
              <div className="lg:col-span-5 space-y-4">
                <RoutePlanner
                  nodes={nodes}
                  sourceId={sourceNodeId}
                  targetId={targetNodeId}
                  profile={profile}
                  onSourceChange={setSourceNodeId}
                  onTargetChange={setTargetNodeId}
                  onProfileChange={(p) => {
                    setProfile(p);
                    if (sourceNodeId && targetNodeId) {
                      api.planRoute(sourceNodeId, targetNodeId, p)
                        .then(setComparisonData)
                        .catch(() => {});
                    }
                  }}
                  onPlanRoute={handlePlanRoute}
                  onSwapEndpoints={handleSwapEndpoints}
                  onReset={handleReset}
                  isLoading={isLoading}
                  errorMessage={errorMessage}
                />

                {comparisonData && (
                  <RouteComparison
                    comparisonData={comparisonData}
                    activeView={activeView}
                    setActiveView={setActiveView}
                  />
                )}
              </div>

              {/* Right Column: Central Map View */}
              <div className="lg:col-span-7">
                <MapView
                  nodes={nodes}
                  edges={edges}
                  barriers={barriers}
                  shortestRoute={comparisonData?.shortest_route || null}
                  accessibleRoute={comparisonData?.accessible_route || null}
                  activeView={activeView}
                  sourceNodeId={sourceNodeId}
                  targetNodeId={targetNodeId}
                  onSelectSource={(id) => setSourceNodeId(id)}
                  onSelectTarget={(id) => setTargetNodeId(id)}
                />
              </div>
            </div>
          </div>
        )}

        {/* 2. Civic Barrier Registry */}
        {activeTab === 'barriers' && (
          <div className="max-w-4xl mx-auto">
            <BarrierList
              barriers={barriers}
              onUpvote={handleUpvoteBarrier}
              onUpdateStatus={handleUpdateStatus}
              onOpenReportModal={() => setIsReportModalOpen(true)}
            />
          </div>
        )}

        {/* 3. AI Vision Scanner */}
        {activeTab === 'scanner' && (
          <ImageBarrierScanner
            onSaveAsBarrier={async (report) => {
              await handleCreateBarrier(report);
              setActiveTab('map');
            }}
          />
        )}

        {/* 4. Platform Architecture & Formulation */}
        {activeTab === 'about' && <AboutView />}
      </main>

      {/* Modal for reporting new barrier */}
      <BarrierReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        onSubmit={handleCreateBarrier}
      />

      {/* Refined Product Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-6 mt-12 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 space-y-1.5">
          <div className="flex items-center justify-center space-x-2 text-slate-400 font-semibold text-xs">
            <span>AccessAble City</span>
            <span>•</span>
            <span className="text-teal-400">Every Street. Every Step. Everyone.</span>
          </div>
          <p className="text-[11px] text-slate-500">
            Open-source Smart City Pedestrian Intelligence • NetworkX Multi-Criteria Graph Engine • OpenStreetMap GIS
          </p>
        </div>
      </footer>
    </div>
  );
};

export default App;
