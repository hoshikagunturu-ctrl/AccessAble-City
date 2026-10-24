import React, { useState } from 'react';
import type { BarrierReport, VerificationStatus } from '../types';
import {
  ThumbsUp,
  ShieldCheck,
  Sparkles,
  Users,
  CheckCircle,
  PlusCircle
} from 'lucide-react';

interface BarrierListProps {
  barriers: BarrierReport[];
  onUpvote: (id: number) => void;
  onUpdateStatus: (id: number, status: VerificationStatus) => void;
  onOpenReportModal: () => void;
}

export const BarrierList: React.FC<BarrierListProps> = ({
  barriers,
  onUpvote,
  onUpdateStatus,
  onOpenReportModal
}) => {
  const [filter, setFilter] = useState<string>('all');

  const filteredBarriers = barriers.filter((b) => {
    if (filter === 'all') return true;
    return b.verification_status === filter;
  });

  const getStatusBadge = (status: VerificationStatus) => {
    switch (status) {
      case 'verified_barrier':
        return (
          <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-rose-100 text-rose-800 border border-rose-300">
            <ShieldCheck className="w-3 h-3 text-rose-600" />
            <span>Verified Barrier</span>
          </span>
        );
      case 'ai_suggested':
        return (
          <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-purple-100 text-purple-800 border border-purple-300">
            <Sparkles className="w-3 h-3 text-purple-600" />
            <span>AI Suggested (Unverified)</span>
          </span>
        );
      case 'resolved':
        return (
          <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
            <CheckCircle className="w-3 h-3 text-emerald-600" />
            <span>Resolved / Repaired</span>
          </span>
        );
      case 'community_reported':
      default:
        return (
          <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800 border border-amber-300">
            <Users className="w-3 h-3 text-amber-600" />
            <span>Community Reported</span>
          </span>
        );
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
      {/* Header and Report Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-rose-600">
            Community & Municipal Registry
          </span>
          <h3 className="text-base font-bold text-slate-900">
            Accessibility Barrier Intelligence ({barriers.length})
          </h3>
          <p className="text-xs text-slate-500">
            Crowdsourced reports, municipal audits, and AI-suggested sidewalk inspections.
          </p>
        </div>

        <button
          onClick={onOpenReportModal}
          className="px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center space-x-1.5 cursor-pointer"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Report New Barrier</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-1.5 pb-2">
        {[
          { id: 'all', label: 'All Reports' },
          { id: 'verified_barrier', label: 'Verified Barriers' },
          { id: 'community_reported', label: 'Community Reported' },
          { id: 'ai_suggested', label: 'AI Suggested' },
          { id: 'resolved', label: 'Resolved' }
        ].map((f) => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id)}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              filter === f.id
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* List */}
      <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
        {filteredBarriers.length === 0 ? (
          <div className="text-center py-8 text-slate-400 text-xs">
            No barrier reports match this filter.
          </div>
        ) : (
          filteredBarriers.map((barrier) => (
            <div
              key={barrier.id}
              className="p-4 rounded-xl border border-slate-200 bg-slate-50/40 hover:bg-white hover:border-slate-300 transition-all space-y-2.5"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-sm text-slate-900">{barrier.title}</span>
                    {getStatusBadge(barrier.verification_status)}
                  </div>
                  <span className="text-[11px] text-slate-500 capitalize">
                    Category: {barrier.category.replace(/_/g, ' ')} • Severity:{' '}
                    <span className="font-semibold text-rose-600">{barrier.severity}</span>
                  </span>
                </div>

                {/* Upvote Button */}
                <button
                  onClick={() => onUpvote(barrier.id)}
                  className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 hover:border-blue-400 hover:bg-blue-50 text-slate-700 hover:text-blue-700 font-semibold text-xs flex items-center space-x-1 shadow-xs transition-all cursor-pointer"
                  title="Upvote this barrier report"
                >
                  <ThumbsUp className="w-3.5 h-3.5" />
                  <span>{barrier.upvotes}</span>
                </button>
              </div>

              <p className="text-xs text-slate-700 leading-relaxed">{barrier.description}</p>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-2 border-t border-slate-100 text-[11px] text-slate-500">
                <span>
                  Location: {barrier.lat.toFixed(4)}, {barrier.lng.toFixed(4)} • Source:{' '}
                  <span className="font-medium text-slate-700">{barrier.source}</span>
                </span>

                {/* Action buttons to verify or resolve */}
                <div className="flex space-x-2">
                  {barrier.verification_status !== 'verified_barrier' && (
                    <button
                      onClick={() => onUpdateStatus(barrier.id, 'verified_barrier')}
                      className="text-xs font-semibold text-rose-700 hover:underline cursor-pointer"
                    >
                      Verify Barrier
                    </button>
                  )}
                  {barrier.verification_status !== 'resolved' && (
                    <button
                      onClick={() => onUpdateStatus(barrier.id, 'resolved')}
                      className="text-xs font-semibold text-emerald-700 hover:underline cursor-pointer"
                    >
                      Mark Resolved
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
