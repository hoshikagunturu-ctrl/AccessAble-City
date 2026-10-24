import React, { useState } from 'react';
import type { BarrierReport, VerificationStatus } from '../types';
import {
  ThumbsUp,
  ShieldCheck,
  Sparkles,
  Users,
  CheckCircle,
  PlusCircle,
  Search,
  Filter,
  MapPin,
  AlertOctagon
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
  const [searchQuery, setSearchQuery] = useState('');

  const filteredBarriers = barriers.filter((b) => {
    const matchesFilter = filter === 'all' || b.verification_status === filter;
    const matchesSearch =
      b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getStatusBadge = (status: VerificationStatus) => {
    switch (status) {
      case 'verified_barrier':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/40">
            <ShieldCheck className="w-3 h-3 text-rose-400" />
            <span>Verified Barrier</span>
          </span>
        );
      case 'ai_suggested':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/40">
            <Sparkles className="w-3 h-3 text-indigo-400" />
            <span>AI Suggested (Unverified)</span>
          </span>
        );
      case 'resolved':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-teal-500/20 text-teal-300 border border-teal-500/40">
            <CheckCircle className="w-3 h-3 text-teal-400" />
            <span>Remediated</span>
          </span>
        );
      case 'community_reported':
      default:
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
            <Users className="w-3 h-3 text-amber-400" />
            <span>Community Audit</span>
          </span>
        );
    }
  };

  return (
    <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-6 shadow-xl text-white space-y-5">
      {/* Header and Report Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-[10px] uppercase font-bold tracking-wider text-rose-400">
              Civic Infrastructure Audit
            </span>
            <span className="px-2 py-0.2 rounded-md bg-slate-800 text-[10px] font-mono text-slate-300">
              Total: {barriers.length}
            </span>
          </div>
          <h2 className="text-lg font-bold text-white mt-0.5">
            Pedestrian Barrier Intelligence Registry
          </h2>
          <p className="text-xs text-slate-400">
            Crowdsourced audits, municipal physical inspections, and AI-assisted sidewalk scans.
          </p>
        </div>

        <button
          onClick={onOpenReportModal}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-500 hover:to-amber-500 text-white font-bold text-xs tracking-wide shadow-md shadow-rose-900/30 transition-all flex items-center justify-center space-x-1.5 cursor-pointer active:scale-98 self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Report Physical Barrier</span>
        </button>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Search barriers by title, category, or location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-teal-500 focus:border-teal-500 transition-all"
          />
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5 pointer-events-none" />
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap gap-1.5">
          {[
            { id: 'all', label: 'All' },
            { id: 'verified_barrier', label: 'Verified' },
            { id: 'community_reported', label: 'Community' },
            { id: 'ai_suggested', label: 'AI Suggested' },
            { id: 'resolved', label: 'Resolved' }
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-all cursor-pointer ${
                filter === f.id
                  ? 'bg-teal-500 text-slate-950 font-bold shadow-xs'
                  : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800 hover:border-slate-700'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Barrier Cards List */}
      <div className="space-y-3 max-h-[560px] overflow-y-auto pr-1">
        {filteredBarriers.length === 0 ? (
          <div className="text-center py-12 text-slate-500 text-xs border border-dashed border-slate-800 rounded-xl">
            No barrier reports match this filter criteria.
          </div>
        ) : (
          filteredBarriers.map((barrier) => (
            <div
              key={barrier.id}
              className="p-4 rounded-xl border border-slate-800 bg-slate-950/70 hover:bg-slate-950 hover:border-slate-700 transition-all space-y-2.5 card-hover-lift"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-bold text-sm text-white tracking-tight">
                      {barrier.title}
                    </span>
                    {getStatusBadge(barrier.verification_status)}
                  </div>
                  <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-400">
                    <span className="capitalize text-slate-300">
                      Category: <strong>{barrier.category.replace(/_/g, ' ')}</strong>
                    </span>
                    <span>•</span>
                    <span>
                      Severity:{' '}
                      <strong
                        className={
                          barrier.severity === 'blocking'
                            ? 'text-rose-400'
                            : barrier.severity === 'high'
                            ? 'text-orange-400'
                            : 'text-amber-400'
                        }
                      >
                        {barrier.severity.toUpperCase()}
                      </strong>
                    </span>
                  </div>
                </div>

                {/* Upvote button with refined microinteraction */}
                <button
                  onClick={() => onUpvote(barrier.id)}
                  className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 hover:border-teal-500 hover:bg-teal-950/30 text-slate-300 hover:text-teal-300 font-bold text-xs flex items-center space-x-1.5 shadow-xs transition-all cursor-pointer active:scale-95"
                  title="Validate this community report"
                >
                  <ThumbsUp className="w-3.5 h-3.5 text-teal-400" />
                  <span className="tabular-nums">{barrier.upvotes}</span>
                </button>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">{barrier.description}</p>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-2 border-t border-slate-900 text-[11px] text-slate-500">
                <span className="flex items-center space-x-1">
                  <MapPin className="w-3 h-3 text-slate-500" />
                  <span>
                    GPS: {barrier.lat.toFixed(4)}, {barrier.lng.toFixed(4)} • Source:{' '}
                    <strong className="text-slate-400">{barrier.source}</strong>
                  </span>
                </span>

                <div className="flex space-x-3 text-xs">
                  {barrier.verification_status !== 'verified_barrier' && (
                    <button
                      onClick={() => onUpdateStatus(barrier.id, 'verified_barrier')}
                      className="font-semibold text-rose-400 hover:text-rose-300 hover:underline cursor-pointer"
                    >
                      Verify as Official Barrier
                    </button>
                  )}
                  {barrier.verification_status !== 'resolved' && (
                    <button
                      onClick={() => onUpdateStatus(barrier.id, 'resolved')}
                      className="font-semibold text-teal-400 hover:text-teal-300 hover:underline cursor-pointer"
                    >
                      Mark Remediated
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
