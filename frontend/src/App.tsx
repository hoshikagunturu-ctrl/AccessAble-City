import React, { useState, useEffect } from 'react';
import {
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
import { AlertCircle } from 'lucide-react';

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

        // Run default demo comparison immediately so judges see instant results
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
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900">
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        visionStatus={visionStatus}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Error Toast */}
        {errorMessage && (
          <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center space-x-2">
            <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* 1. Map & Navigation View */}
        {activeTab === 'map' && (
          <div className="space-y-6">
            {/* Demo Banner at top */}
            <DemoBanner onRunDemo={handleRunDemo} isLoading={isLoading} />

            {/* Split Grid: Left Sidebar (Planner & Comparison) + Right Map */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Left Column: Form & Route Metrics */}
              <div className="lg:col-span-5 space-y-5">
                <RoutePlanner
                  nodes={nodes}
                  sourceId={sourceNodeId}
                  targetId={targetNodeId}
                  profile={profile}
                  onSourceChange={setSourceNodeId}
                  onTargetChange={setTargetNodeId}
                  onProfileChange={(p) => {
                    setProfile(p);
                    // auto trigger recalculate if endpoints exist
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

              {/* Right Column: Leaflet Map */}
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

        {/* 2. Barrier Reports View */}
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

        {/* 3. AI Scanner View */}
        {activeTab === 'scanner' && (
          <ImageBarrierScanner
            onSaveAsBarrier={async (report) => {
              await handleCreateBarrier(report);
              setActiveTab('map');
            }}
          />
        )}

        {/* 4. Architecture View */}
        {activeTab === 'about' && <AboutView />}
      </main>

      {/* Modal for reporting new barrier */}
      <BarrierReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        onSubmit={handleCreateBarrier}
      />

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-6 mt-12 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 space-y-1">
          <p className="font-semibold text-slate-700">
            AccessAble City — Innovators Conclave 2026
          </p>
          <p>
            Autonomous End-to-End Build • NetworkX Multi-Criteria Routing • Google Gemini Vision • OpenStreetMap
          </p>
        </div>
      </footer>
    </div>
  );
};

export default App;
