</div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-semibold">Duration</span>
                <p className="text-base font-bold text-slate-300 tabular-nums">
                  {shortest_route.estimated_time_formatted}
                </p>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-semibold">Stairs</span>
                <p className="text-base font-bold text-rose-400">
                  {shortest_route.stairs_count > 0 ? '18 Steps' : '0'}
                </p>
              </div>
            </div>

            <div className="pt-2.5 space-y-1 text-[11px] text-slate-300">
              <div className="flex justify-between">
                <span className="text-slate-400">Mobility Status:</span>
                <span className="font-semibold text-rose-400">
                  Prohibited for {selected_profile}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Physical Obstruction:</span>
                <span className="font-semibold text-slate-200">18-step concrete flight</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Ramp Alternative:</span>
                <span className="font-semibold text-rose-400">None on direct trajectory</span>
              </div>
            </div>

            <div className="mt-2.5 p-2 rounded-lg bg-rose-950/40 border border-rose-800/80 text-[10px] text-rose-300">
              ⚠️ Inaccessible for wheeled mobility, strollers, and crutch users.
            </div>
          </div>
        )}
      </div>

      {/* Turn-by-Turn Waypoints */}
      {accessible_route && isAccessibleValid && (
        <div className="space-y-2.5 border-t border-slate-800 pt-3.5">
          <div className="flex items-center justify-between">
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Accessible Corridors ({accessible_route.segments.length} Waypoints)
            </h4>
            <span className="text-[10px] text-teal-400 font-mono">Accessibility Data Status</span>
          </div>

          <div className="space-y-2">
            {accessible_route.segments.map((seg, idx) => {
              const isExpanded = expandedSegment === idx;
              return (
                <div
                  key={seg.edge_id}
                  className="rounded-xl border border-slate-800 bg-slate-950/60 hover:bg-slate-950 hover:border-slate-700 transition-all overflow-hidden"
                >
                  <div
                    onClick={() => setExpandedSegment(isExpanded ? null : idx)}
                    className="p-3 flex items-center justify-between cursor-pointer"
                  >
                    <div className="flex items-center space-x-2.5">
                      <span className="w-5 h-5 rounded-full bg-teal-500/20 text-teal-300 text-[10px] font-bold flex items-center justify-center border border-teal-500/40">
                        {idx + 1}
                      </span>
                      <div>
                        <span className="text-xs font-bold text-white">
                          {seg.source_name} → {seg.target_name}
                        </span>
                        <div className="flex items-center space-x-2 text-[10px] text-slate-400 mt-0.5">
                          <span className="tabular-nums">{seg.distance}m</span>
                          <span>•</span>
                          <span className="capitalize">{seg.surface.replace('_', ' ')}</span>
                          <span>•</span>
                          <span>Slope {seg.slope}%</span>
                          {seg.ramps && (
                            <span className="text-teal-400 font-semibold">• ADA Ramp</span>
                          )}
                        </div>
                      </div>
                    </div>
                    <ChevronRight
                      className={`w-4 h-4 text-slate-500 transition-transform ${
                        isExpanded ? 'rotate-90 text-teal-400' : ''
                      }`}
                    />
                  </div>

                  {isExpanded && (
                    <div className="px-3 pb-3 pt-2 border-t border-slate-800/80 text-[11px] text-slate-300 bg-slate-900/40 space-y-1.5">
                      <p className="text-slate-400">{seg.segment_explanation}</p>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-[10px] pt-1">
                        <div>
                          <strong className="text-slate-400">Clear Width:</strong> {seg.width}m (ADA ≥0.9m)
                        </div>
                        <div>
                          <strong className="text-slate-400">Dropped Curb:</strong> {seg.curb_cuts ? 'Yes' : 'No'}
                        </div>
                        <div>
                          <strong className="text-slate-400">Status:</strong>{' '}
                          <span
                            className={
                              seg.accessibility_status === 'known_accessible'
                                ? 'text-teal-400 font-semibold'
                                : 'text-amber-400 font-semibold'
                            }
                          >
                            {seg.accessibility_status.replace('_', ' ')}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
