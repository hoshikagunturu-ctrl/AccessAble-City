import React, { useState } from 'react';
import type { BarrierCategory } from '../types';
import { X, AlertTriangle, Send } from 'lucide-react';

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

const CATEGORIES: { id: BarrierCategory; label: string }[] = [
  { id: 'stairs_no_ramp', label: 'Stairs without Ramp / Lift' },
  { id: 'steep_incline', label: 'Steep Incline / Excessive Cross-Slope' },
  { id: 'missing_curb_cut', label: 'Missing / Broken Dropped Curb Cut' },
  { id: 'broken_pavement', label: 'Severe Broken Pavement / Root Upheaval' },
  { id: 'narrow_sidewalk', label: 'Narrow Sidewalk (<0.9m Bottleneck)' },
  { id: 'construction_obstruction', label: 'Construction Barricade / Trench' },
  { id: 'pole_obstruction', label: 'Utility Pole / Street Sign Obstruction' },
  { id: 'inoperable_elevator', label: 'Inoperable Station Elevator' },
  { id: 'other', label: 'Other Accessibility Barrier' }
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
      setError('Please provide both a title and description.');
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
        source: 'community'
      });
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to submit report.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center space-x-2 text-rose-600 font-bold">
            <AlertTriangle className="w-5 h-5" />
            <h3 className="text-base text-slate-900">Report Accessibility Barrier</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Barrier Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as BarrierCategory)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-medium text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-500"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Headline Title</label>
            <input
              type="text"
              placeholder="e.g. Unramped 18-step staircase at Civic Terrace"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Detailed Description</label>
            <textarea
              rows={3}
              placeholder="Describe the physical obstruction, riser height, lack of curb cut, or temporary detour..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Severity</label>
              <select
                value={severity}
                onChange={(e) => setSeverity(e.target.value as any)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-medium text-slate-900 focus:bg-white"
              >
                <option value="low">Low (Minor inconvenience)</option>
                <option value="medium">Medium (Rough / strenuous)</option>
                <option value="high">High (Major accessibility hazard)</option>
                <option value="blocking">Blocking (100% impassable)</option>
              </select>
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Coordinates (Lat, Lng)</label>
              <div className="flex space-x-1">
                <input
                  type="number"
                  step="0.0001"
                  value={lat}
                  onChange={(e) => setLat(parseFloat(e.target.value))}
                  className="w-1/2 px-2 py-2 bg-slate-50 border border-slate-300 rounded-xl"
                />
                <input
                  type="number"
                  step="0.0001"
                  value={lng}
                  onChange={(e) => setLng(parseFloat(e.target.value))}
                  className="w-1/2 px-2 py-2 bg-slate-50 border border-slate-300 rounded-xl"
                />
              </div>
            </div>
          </div>

          <div className="pt-2 flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100 font-semibold cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 active:bg-rose-800 text-white font-bold flex items-center space-x-1.5 shadow-md cursor-pointer disabled:opacity-50"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{isSubmitting ? 'Submitting...' : 'Submit Barrier Report'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
