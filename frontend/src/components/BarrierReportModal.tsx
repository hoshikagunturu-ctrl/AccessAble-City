import React, { useState } from 'react';
import type { BarrierCategory } from '../types';
import { X, AlertTriangle, Send, MapPin, CheckCircle2 } from 'lucide-react';

interface BarrierReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (report: {
    category: BarrierCategory;
    title: string;
    description: string;
    lat: number;
    lng: number;
    severity: 'low' | 'medium' | 'high' | 'blocking';
    source: string;
  }) => Promise<void>;
  initialCoordinates?: [number, number];
}

const CATEGORIES: { id: BarrierCategory; label: string; icon: string }[] = [
  { id: 'stairs_no_ramp', label: 'Stairs without Ramp / Lift', icon: '🪜' },
  { id: 'steep_incline', label: 'Steep Incline / Dangerous Cross-Slope', icon: '📐' },
  { id: 'missing_curb_cut', label: 'Missing / Broken Dropped Curb Ramp', icon: '🛑' },
  { id: 'broken_pavement', label: 'Severe Broken Pavement / Root Upheaval', icon: '⚡' },
  { id: 'narrow_sidewalk', label: 'Narrow Sidewalk (<0.9m Bottleneck)', icon: '↔️' },
  { id: 'construction_obstruction', label: 'Construction Barricade / Trench', icon: '🚧' },
  { id: 'pole_obstruction', label: 'Utility Pole / Signage Obstruction', icon: '📍' },
  { id: 'inoperable_elevator', label: 'Inoperable Station Elevator', icon: '🛗' },
  { id: 'other', label: 'Other Physical Barrier', icon: '⚠️' }
];

export const BarrierReportModal: React.FC<BarrierReportModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialCoordinates
}) => {
  const [category, setCategory] = useState<BarrierCategory>('stairs_no_ramp');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [lat, setLat] = useState(initialCoordinates ? initialCoordinates[0] : 37.7808);
  const [lng, setLng] = useState(initialCoordinates ? initialCoordinates[1] : -122.4182);
  const [severity, setSeverity] = useState<'low' | 'medium' | 'high' | 'blocking'>('high');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      setError('Please provide both an informative title and a description.');
      return;
    }
    setError(null);
    setIsSubmitting(true);
    try {
      await onSubmit({
        category,
        title: title.trim(),
        description: description.trim(),
        lat: Number(lat),
        lng: Number(lng),
        severity,
        source: 'community_audit'
      });
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to submit report.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 text-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 relative">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center space-x-2 text-rose-400 font-bold">
            <AlertTriangle className="w-5 h-5 text-rose-500" />
            <h3 className="text-base text-white font-bold">Submit Infrastructure Barrier Report</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-rose-950/50 border border-rose-800 text-rose-300 text-xs">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-300 mb-1">Barrier Classification</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as BarrierCategory)}
              className="w-full px-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl font-medium text-slate-200 focus:outline-none focus:ring-1 focus:ring-teal-500"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.icon} {cat.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-bold text-slate-300 mb-1">Title / Headline</label>
            <input
              type="text"
              placeholder="e.g., Unramped 18-step concrete stairs at Civic Terrace"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:ring-1 focus:ring-teal-500"
              required
            />
          </div>

          <div>
            <label className="block font-bold text-slate-300 mb-1">Detailed Field Description</label>
            <textarea
              rows={3}
              placeholder="Detail riser dimensions, lack of curb cut, missing tactile paving, or gravel debris..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:ring-1 focus:ring-teal-500"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-300 mb-1">Severity Rating</label>
              <select
                value={severity}
                onChange={(e) => setSeverity(e.target.value as any)}
                className="w-full px-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl font-medium text-slate-200 focus:outline-none focus:ring-1 focus:ring-teal-500"
              >
                <option value="low">Low (Minor rough surface)</option>
                <option value="medium">Medium (Moderate slope/curb)</option>
                <option value="high">High (Requires detour)</option>
                <option value="blocking">Blocking (100% Impassable)</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-300 mb-1">GPS Coordinates (Lat, Lng)</label>
              <div className="flex space-x-1.5">
                <input
                  type="number"
                  step="0.0001"
                  value={lat}
                  onChange={(e) => setLat(parseFloat(e.target.value))}
                  className="w-1/2 px-2 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 text-center font-mono text-[11px]"
                />
                <input
                  type="number"
                  step="0.0001"
                  value={lng}
                  onChange={(e) => setLng(parseFloat(e.target.value))}
                  className="w-1/2 px-2 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 text-center font-mono text-[11px]"
                />
              </div>
            </div>
          </div>

          <div className="pt-2 flex justify-end space-x-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-700 text-slate-300 hover:bg-slate-800 font-semibold cursor-pointer transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-500 hover:to-amber-500 text-white font-bold tracking-wide flex items-center space-x-1.5 shadow-md shadow-rose-900/40 cursor-pointer disabled:opacity-50"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{isSubmitting ? 'Submitting...' : 'Register Barrier'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
