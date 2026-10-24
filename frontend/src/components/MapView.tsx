import React, { useEffect, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import type {
  NetworkNode,
  NetworkEdge,
  RouteResult,
  BarrierReport
} from '../types';
import { AlertTriangle } from 'lucide-react';

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
const FitBounds: React.FC<{ coordinates: [number, number][] }> = ({ coordinates }) => {
  const map = useMap();
  useEffect(() => {
    if (coordinates && coordinates.length > 0) {
      const bounds = L.latLngBounds(coordinates.map((c) => [c[0], c[1]]));
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 18 });
    }
  }, [coordinates, map]);
  return null;
};

// Create custom icons using DivIcon for crisp vector rendering
function createNodeIcon(isSource: boolean, isTarget: boolean, nodeType: string) {
  let bgColor = 'bg-blue-600';
  let label = '•';

  if (isSource) {
    bgColor = 'bg-emerald-600 ring-4 ring-emerald-200 animate-pulse';
    label = 'A';
  } else if (isTarget) {
    bgColor = 'bg-rose-600 ring-4 ring-rose-200 animate-pulse';
    label = 'B';
  } else if (nodeType === 'transit') {
    bgColor = 'bg-purple-600';
    label = 'T';
  } else if (nodeType === 'ramp') {
    bgColor = 'bg-teal-600';
    label = '♿';
  } else if (nodeType === 'destination') {
    bgColor = 'bg-indigo-600';
    label = '★';
  }

  return L.divIcon({
    className: 'custom-node-icon',
    html: `
      <div class="w-7 h-7 rounded-full ${bgColor} text-white font-bold text-xs flex items-center justify-center shadow-md border-2 border-white transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-transform hover:scale-125">
        ${label}
      </div>
    `,
    iconSize: [28, 28],
    iconAnchor: [14, 14]
  });
}

function createBarrierIcon(_category: string, severity: string) {
  const isBlocking = severity === 'blocking';
  const bg = isBlocking ? 'bg-rose-600' : 'bg-amber-500';

  return L.divIcon({
    className: 'custom-barrier-icon',
    html: `
      <div class="w-8 h-8 rounded-full ${bg} text-white text-sm font-bold flex items-center justify-center shadow-lg border-2 border-white ring-2 ring-rose-300 animate-bounce cursor-pointer">
        ⚠️
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

  // Calculate coordinates to frame in map view
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
    <div className="relative w-full h-[520px] lg:h-[620px] rounded-2xl overflow-hidden shadow-sm border border-slate-200 bg-slate-100">
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

        <FitBounds coordinates={activeCoordinates} />

        {/* 1. Base Pedestrian Network Edges */}
        {edges.map((edge) => {
          if (!edge.geometry || edge.geometry.length < 2) return null;
          const isBarrier = edge.accessibility_status === 'known_barrier';
          const isUnknown = edge.accessibility_status === 'unknown';

          return (
            <Polyline
              key={edge.id}
              positions={edge.geometry}
              pathOptions={{
                color: isBarrier ? '#f43f5e' : isUnknown ? '#94a3b8' : '#cbd5e1',
                weight: isBarrier ? 3 : 2,
                dashArray: isBarrier ? '4, 6' : isUnknown ? '2, 4' : undefined,
                opacity: 0.6
              }}
            />
          );
        })}

        {/* 2. Shortest Route Polyline (Shown in comparison or shortest view) */}
        {shortestRoute && (activeView === 'comparison' || activeView === 'shortest') && (
          <Polyline
            positions={shortestRoute.coordinates}
            pathOptions={{
              color: '#ef4444',
              weight: 5,
              dashArray: '8, 8',
              opacity: activeView === 'shortest' ? 0.95 : 0.7
            }}
          >
            <Popup>
              <div className="p-1 space-y-1 text-xs">
                <p className="font-bold text-rose-700">Standard Shortest Route</p>
                <p>Total Distance: {shortestRoute.total_distance_m}m</p>
                <p>Est. Duration: {shortestRoute.estimated_time_formatted}</p>
                <p className="text-rose-600 font-semibold">
                  ⚠️ Contains 18-step concrete stairs without ramp!
                </p>
              </div>
            </Popup>
          </Polyline>
        )}

        {/* 3. Accessible Route Polyline (Shown in comparison or accessible view) */}
        {accessibleRoute &&
          accessibleRoute.is_valid &&
          (activeView === 'comparison' || activeView === 'accessible') && (
            <Polyline
              positions={accessibleRoute.coordinates}
              pathOptions={{
                color: '#10b981',
                weight: 6,
                opacity: 0.95
              }}
            >
              <Popup>
                <div className="p-1 space-y-1 text-xs">
                  <p className="font-bold text-emerald-700 flex items-center space-x-1">
                    <span>✓ Verified Accessible Route</span>
                  </p>
                  <p>Total Distance: {accessibleRoute.total_distance_m}m</p>
                  <p>Est. Duration: {accessibleRoute.estimated_time_formatted}</p>
                  <p className="text-emerald-700 font-semibold">
                    100% Barrier-Free via ADA Switchback Ramp
                  </p>
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
                <div className="p-1 space-y-2 text-xs min-w-[180px]">
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">{node.name}</h4>
                    <span className="text-[10px] uppercase font-semibold text-blue-600 px-1.5 py-0.5 rounded bg-blue-50">
                      {node.node_type}
                    </span>
                  </div>
                  {node.description && <p className="text-slate-600">{node.description}</p>}
                  <div className="flex space-x-1.5 pt-1 border-t border-slate-100">
                    <button
                      onClick={() => onSelectSource(node.id)}
                      className="px-2 py-1 rounded bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-[11px] cursor-pointer"
                    >
                      Set as Origin
                    </button>
                    <button
                      onClick={() => onSelectTarget(node.id)}
                      className="px-2 py-1 rounded bg-rose-600 hover:bg-rose-700 text-white font-semibold text-[11px] cursor-pointer"
                    >
                      Set Destination
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
                <div className="p-1 space-y-1 text-xs max-w-[220px]">
                  <div className="flex items-center space-x-1 text-rose-600 font-bold">
                    <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                    <span>{b.title}</span>
                  </div>
                  <p className="text-slate-700">{b.description}</p>
                  <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1 border-t border-slate-100">
                    <span className="capitalize font-semibold text-amber-700">
                      Status: {b.verification_status.replace('_', ' ')}
                    </span>
                    <span>👍 {b.upvotes} upvotes</span>
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>

      {/* Map Legend Overlay */}
      <div className="absolute bottom-4 left-4 z-400 bg-white/95 backdrop-blur-md p-3 rounded-xl border border-slate-200 shadow-md text-xs space-y-2 pointer-events-auto">
        <span className="font-bold text-slate-900 block border-b border-slate-100 pb-1">
          Map Legend
        </span>
        <div className="flex items-center space-x-2">
          <div className="w-5 h-1.5 bg-emerald-500 rounded-full" />
          <span className="text-slate-700 font-medium">Accessible Route (Ramps / Drop Curbs)</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-5 h-1.5 bg-rose-500 border-dashed border-b-2 border-rose-600" />
          <span className="text-slate-700 font-medium">Shortest Route (Contains Stairs)</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3.5 h-3.5 rounded-full bg-rose-600 text-[9px] text-white flex items-center justify-center font-bold">
            ⚠️
          </div>
          <span className="text-slate-700 font-medium">Known Physical Barrier (18 Steps)</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3.5 h-3.5 rounded-full bg-emerald-600 text-[9px] text-white flex items-center justify-center font-bold">
            A
          </div>
          <span className="text-slate-700 font-medium">Origin / Destination Waypoint</span>
        </div>
      </div>
    </div>
  );
};
