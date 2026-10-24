import React, { useEffect, useMemo, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import type {
  NetworkNode,
  NetworkEdge,
  RouteResult,
  BarrierReport
} from '../types';
import {
  AlertTriangle,
  ShieldCheck,
  Maximize2,
  Layers,
  Eye,
  EyeOff,
  Navigation,
  Compass,
  ArrowRight
} from 'lucide-react';

interface MapViewProps {
  nodes: NetworkNode[];
  edges: NetworkEdge[];
  barriers: BarrierReport[];
  shortestRoute: RouteResult | null;
  accessibleRoute: RouteResult | null;
  activeView: 'comparison' | 'accessible' | 'shortest';
  sourceNodeId: string;
  targetNodeId: string;
  onSelectSource: (id: string) => void;
  onSelectTarget: (id: string) => void;
}

// Auto fit bounds helper component
const FitBounds: React.FC<{ coordinates: [number, number][]; trigger: number }> = ({ coordinates, trigger }) => {
  const map = useMap();
  useEffect(() => {
    if (coordinates && coordinates.length > 0) {
      const bounds = L.latLngBounds(coordinates.map((c) => [c[0], c[1]]));
      map.fitBounds(bounds, { padding: [45, 45], maxZoom: 18, animate: true });
    }
  }, [coordinates, trigger, map]);
  return null;
};

// Vector SVG Markers
function createNodeIcon(isSource: boolean, isTarget: boolean, nodeType: string) {
  if (isSource) {
    return L.divIcon({
      className: 'custom-source-pin',
      html: `
        <div class="relative flex items-center justify-center transform -translate-x-1/2 -translate-y-1/2">
          <div class="absolute w-9 h-9 rounded-full bg-teal-500/30 animate-ping"></div>
          <div class="w-8 h-8 rounded-full bg-gradient-to-tr from-teal-600 to-emerald-400 text-slate-950 font-black text-xs flex items-center justify-center shadow-lg border-2 border-white ring-2 ring-teal-500/50 cursor-pointer">
            A
          </div>
        </div>
      `,
      iconSize: [32, 32],
      iconAnchor: [16, 16]
    });
  }

  if (isTarget) {
    return L.divIcon({
      className: 'custom-target-pin',
      html: `
        <div class="relative flex items-center justify-center transform -translate-x-1/2 -translate-y-1/2">
          <div class="absolute w-9 h-9 rounded-full bg-rose-500/30 animate-ping"></div>
          <div class="w-8 h-8 rounded-full bg-gradient-to-tr from-rose-600 to-amber-500 text-white font-black text-xs flex items-center justify-center shadow-lg border-2 border-white ring-2 ring-rose-500/50 cursor-pointer">
            B
          </div>
        </div>
      `,
      iconSize: [32, 32],
      iconAnchor: [16, 16]
    });
  }

  let bg = 'bg-slate-700';
  let symbol = '•';

  if (nodeType === 'transit') {
    bg = 'bg-indigo-600';
    symbol = 'M';
  } else if (nodeType === 'ramp') {
    bg = 'bg-teal-700';
    symbol = '♿';
  } else if (nodeType === 'destination') {
    bg = 'bg-cyan-700';
    symbol = '★';
  }

  return L.divIcon({
    className: 'custom-waypoint-pin',
    html: `
      <div class="w-6 h-6 rounded-full ${bg} text-white font-bold text-[10px] flex items-center justify-center shadow-md border border-white/80 transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-transform hover:scale-125">
        ${symbol}
      </div>
    `,
    iconSize: [24, 24],
    iconAnchor: [12, 12]
  });
}

function createBarrierIcon(category: string, severity: string) {
  const isBlocking = severity === 'blocking';
  const badgeColor = isBlocking ? 'from-rose-600 to-red-700' : 'from-amber-500 to-orange-600';

  let iconSvg = `
    <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
      <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/>
      <line x1="12" y1="9" x2="12" y2="13"/>
      <line x1="12" y1="17" x2="12.01" y2="17"/>
    </svg>
  `;

  if (category === 'stairs_no_ramp') {
    iconSvg = `
      <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <path d="M19 3v4h-4v4h-4v4H7v4H3"/>
      </svg>
    `;
  }

  return L.divIcon({
    className: 'custom-barrier-marker',
    html: `
      <div class="w-8 h-8 rounded-xl bg-gradient-to-tr ${badgeColor} text-white flex items-center justify-center shadow-lg shadow-rose-900/40 border-2 border-white ring-1 ring-rose-400 transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-transform hover:scale-115">
        ${iconSvg}
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 16]
  });
}

export const MapView: React.FC<MapViewProps> = ({
  nodes,
  edges,
  barriers,
  shortestRoute,
  accessibleRoute,
  activeView,
  sourceNodeId,
  targetNodeId,
  onSelectSource,
  onSelectTarget
}) => {
  const centerPosition: [number, number] = [37.7806, -122.4184];
  const [showNetworkEdges, setShowNetworkEdges] = useState(true);
  const [fitTrigger, setFitTrigger] = useState(0);

  // Focus coordinates
  const activeCoordinates = useMemo(() => {
    if (activeView === 'accessible' && accessibleRoute?.coordinates?.length) {
      return accessibleRoute.coordinates;
    }
    if (activeView === 'shortest' && shortestRoute?.coordinates?.length) {
      return shortestRoute.coordinates;
    }
    if (accessibleRoute?.coordinates?.length || shortestRoute?.coordinates?.length) {
      return [
        ...(accessibleRoute?.coordinates || []),
        ...(shortestRoute?.coordinates || [])
      ];
    }
    return nodes.map((n) => [n.lat, n.lng] as [number, number]);
  }, [activeView, accessibleRoute, shortestRoute, nodes]);

  return (
    <div className="relative w-full h-[580px] lg:h-[680px] rounded-2xl overflow-hidden shadow-2xl border border-slate-800 bg-slate-950 flex flex-col">
      {/* Top Map Action Toolbar */}
      <div className="absolute top-3 right-3 z-400 flex items-center space-x-2">
        <button
          onClick={() => setShowNetworkEdges(!showNetworkEdges)}
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold backdrop-blur-md border shadow-md flex items-center space-x-1.5 transition-all cursor-pointer ${
            showNetworkEdges
              ? 'bg-slate-900/90 text-teal-300 border-teal-500/40'
              : 'bg-slate-900/70 text-slate-400 border-slate-700'
          }`}
          title="Toggle baseline pedestrian paths"
        >
          {showNetworkEdges ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
          <span>Network Grid</span>
        </button>

        <button
          onClick={() => setFitTrigger((prev) => prev + 1)}
          className="p-2 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-200 border border-slate-700 shadow-md backdrop-blur-md cursor-pointer transition-colors"
          title="Reset Zoom to Active Corridors"
        >
          <Maximize2 className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Leaflet Map Canvas */}
      <MapContainer
        center={centerPosition}
        zoom={17}
        scrollWheelZoom={true}
        className="w-full h-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          maxZoom={19}
        />

        <FitBounds coordinates={activeCoordinates} trigger={fitTrigger} />

        {/* 1. Underlying Pedestrian Network Grid */}
        {showNetworkEdges &&
          edges.map((edge) => {
            if (!edge.geometry || edge.geometry.length < 2) return null;
            const isBarrier = edge.accessibility_status === 'known_barrier';
            const isUnknown = edge.accessibility_status === 'unknown';

            return (
              <Polyline
                key={edge.id}
                positions={edge.geometry}
                pathOptions={{
                  color: isBarrier ? '#fb7185' : isUnknown ? '#94a3b8' : '#38bdf8',
                  weight: isBarrier ? 3 : 2,
                  dashArray: isBarrier ? '3, 6' : isUnknown ? '2, 5' : undefined,
                  opacity: 0.45
                }}
              />
            );
          })}

        {/* 2. Conventional Shortest Route (Contains 18-step concrete stairs) */}
        {shortestRoute && (activeView === 'comparison' || activeView === 'shortest') && (
          <Polyline
            positions={shortestRoute.coordinates}
            pathOptions={{
              color: '#f43f5e',
              weight: 5,
              dashArray: '6, 8',
              opacity: activeView === 'shortest' ? 0.95 : 0.7
            }}
          >
            <Popup>
              <div className="p-1 space-y-1.5 text-xs text-slate-900">
                <div className="flex items-center space-x-1.5 text-rose-600 font-bold">
                  <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                  <span>Conventional Shortest Path</span>
                </div>
                <p className="text-slate-600">
                  Total Distance: <strong>{shortestRoute.total_distance_m}m</strong> • Time:{' '}
                  <strong>{shortestRoute.estimated_time_formatted}</strong>
                </p>
                <div className="p-2 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-[11px] leading-snug">
                  ⚠️ Contains <strong>18-step concrete flight</strong> without ramp or elevator. Prohibited for wheeled mobility.
                </div>
              </div>
            </Popup>
          </Polyline>
        )}

        {/* 3. Accessibility-Verified Route (Safe corridor via ADA switchback ramp) */}
        {accessibleRoute &&
          accessibleRoute.is_valid &&
          (activeView === 'comparison' || activeView === 'accessible') && (
            <Polyline
              positions={accessibleRoute.coordinates}
              pathOptions={{
                color: '#0d9488',
                weight: 6,
                opacity: 0.95
              }}
            >
              <Popup>
                <div className="p-1 space-y-1.5 text-xs text-slate-900">
                  <div className="flex items-center space-x-1.5 text-teal-700 font-bold">
                    <ShieldCheck className="w-4 h-4 flex-shrink-0" />
                    <span>Accessibility-Verified Corridor</span>
                  </div>
                  <p className="text-slate-600">
                    Total Distance: <strong>{accessibleRoute.total_distance_m}m</strong> • Time:{' '}
                    <strong>{accessibleRoute.estimated_time_formatted}</strong>
                  </p>
                  <div className="p-2 rounded-lg bg-teal-50 border border-teal-200 text-teal-800 text-[11px] leading-snug">
                    ✓ <strong>Accessible Alternative:</strong> Rerouted via ADA Switchback Ramp (4.2% grade, continuous handrails).
                  </div>
                </div>
              </Popup>
            </Polyline>
          )}

        {/* 4. Network Nodes */}
        {nodes.map((node) => {
          const isSource = node.id === sourceNodeId;
          const isTarget = node.id === targetNodeId;
          const icon = createNodeIcon(isSource, isTarget, node.node_type);

          return (
            <Marker key={node.id} position={[node.lat, node.lng]} icon={icon}>
              <Popup>
                <div className="p-1 space-y-2 text-xs min-w-[190px] text-slate-900">
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">{node.name}</h4>
                    <span className="text-[10px] uppercase font-bold text-teal-700 px-1.5 py-0.5 rounded bg-teal-50 border border-teal-200">
                      {node.node_type}
                    </span>
                  </div>
                  {node.description && <p className="text-slate-600 leading-snug">{node.description}</p>}
                  <div className="flex space-x-2 pt-2 border-t border-slate-100">
                    <button
                      onClick={() => onSelectSource(node.id)}
                      className="flex-1 px-2.5 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-700 text-white font-bold text-[11px] cursor-pointer shadow-xs transition-colors"
                    >
                      Set Origin A
                    </button>
                    <button
                      onClick={() => onSelectTarget(node.id)}
                      className="flex-1 px-2.5 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-bold text-[11px] cursor-pointer shadow-xs transition-colors"
                    >
                      Set Destination B
                    </button>
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}

        {/* 5. Known Barrier Markers */}
        {barriers.map((b) => {
          const icon = createBarrierIcon(b.category, b.severity);
          return (
            <Marker key={b.id} position={[b.lat, b.lng]} icon={icon}>
              <Popup>
                <div className="p-1 space-y-1.5 text-xs max-w-[240px] text-slate-900">
                  <div className="flex items-center space-x-1.5 text-rose-600 font-bold">
                    <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                    <span>{b.title}</span>
                  </div>
                  <p className="text-slate-700 leading-snug">{b.description}</p>
                  <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1.5 border-t border-slate-100">
                    <span className="font-semibold text-rose-700 uppercase text-[10px] px-1.5 py-0.5 rounded bg-rose-50 border border-rose-200">
                      {b.verification_status.replace('_', ' ')}
                    </span>
                    <span>▲ {b.upvotes} validations</span>
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>

      {/* Floating Smart Legend */}
      <div className="absolute bottom-4 left-4 z-400 bg-slate-950/90 backdrop-blur-md p-3.5 rounded-xl border border-slate-800 shadow-xl text-xs space-y-2.5 text-slate-300 max-w-xs">
        <div className="flex items-center justify-between border-b border-slate-800 pb-1.5">
          <span className="font-bold text-white text-xs tracking-wide">
            Cartographic Legend
          </span>
          <span className="text-[10px] text-teal-400 font-mono">OSM Pedestrian</span>
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-1.5 bg-teal-400 rounded-full shadow-xs shadow-teal-400" />
            <span className="text-white font-medium text-[11px]">
              Verified Accessible Route (ADA Ramps)
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <div className="w-4 h-1.5 bg-rose-500 border-dashed border-b-2 border-rose-600" />
            <span className="text-slate-300 font-medium text-[11px]">
              Conventional Route (Contains Stairs)
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 rounded-md bg-rose-600 text-[10px] text-white flex items-center justify-center font-bold">
              !
            </div>
            <span className="text-slate-300 font-medium text-[11px]">
              Physical Barrier (18-step concrete flight)
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 rounded-full bg-teal-500 text-[10px] text-slate-950 flex items-center justify-center font-bold">
              A
            </div>
            <span className="text-slate-300 font-medium text-[11px]">
              Origin (A) & Destination (B) Waypoints
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
