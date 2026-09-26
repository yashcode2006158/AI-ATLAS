import React, { useState } from 'react';
import { Radar, ArrowRight, TrendingUp, Sparkles, AlertCircle, Info, ExternalLink } from 'lucide-react';
import { useContentStore } from '../../store/useContentStore';
import { RadarTrendItem } from '../../types/content';

export const AIRadarView: React.FC = () => {
  const { radarTrends } = useContentStore();

  const [selectedRing, setSelectedRing] = useState<string>('all');
  const [selectedQuadrant, setSelectedQuadrant] = useState<string>('all');
  const [inspectedTrend, setInspectedTrend] = useState<RadarTrendItem | null>(null);

  const rings: ('all' | 'Adopt' | 'Trial' | 'Assess' | 'Hold')[] = ['all', 'Adopt', 'Trial', 'Assess', 'Hold'];
  const quadrants: ('all' | 'Techniques' | 'Tools' | 'Platforms' | 'Frameworks')[] = [
    'all',
    'Techniques',
    'Tools',
    'Platforms',
    'Frameworks',
  ];

  const ringColors: Record<string, string> = {
    Adopt: '#10B981', // Emerald
    Trial: '#5B8CFF', // Blue
    Assess: '#F5A623', // Amber
    Hold: '#EF4444', // Red
  };

  const filteredTrends = radarTrends.filter((t) => {
    const matchesRing = selectedRing === 'all' || t.ring === selectedRing;
    const matchesQuad = selectedQuadrant === 'all' || t.quadrant === selectedQuadrant;
    return matchesRing && matchesQuad;
  });

  return (
    <div className="space-y-6 text-xs">
      
      {/* Top Controls & Quadrant Filters */}
      <div className="p-4 rounded-xl bg-surface border border-hairline flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[11px] font-mono uppercase tracking-wider text-text-secondary font-semibold mr-1">
            Ring Status:
          </span>
          {rings.map((ring) => (
            <button
              key={ring}
              onClick={() => setSelectedRing(ring)}
              className={`px-3 py-1 rounded-md text-xs font-medium capitalize transition-all ${
                selectedRing === ring
                  ? 'bg-accent text-white shadow-xs'
                  : 'bg-elevated/50 border border-hairline text-text-secondary hover:text-text-primary'
              }`}
            >
              {ring}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono uppercase tracking-wider text-text-secondary font-semibold mr-1">
            Quadrant:
          </span>
          <select
            value={selectedQuadrant}
            onChange={(e) => setSelectedQuadrant(e.target.value)}
            className="px-2.5 py-1 rounded-md bg-elevated border border-hairline text-xs text-text-primary focus:outline-none focus:border-accent"
          >
            {quadrants.map((q) => (
              <option key={q} value={q}>
                {q}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* 4-Quadrant Visual Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {(['Adopt', 'Trial', 'Assess', 'Hold'] as const).map((ringName) => {
          const trendsInRing = filteredTrends.filter((t) => t.ring === ringName);
          return (
            <div
              key={ringName}
              className="p-4 rounded-2xl bg-surface border border-hairline flex flex-col space-y-3"
            >
              <div className="flex items-center justify-between pb-2 border-b border-hairline">
                <div className="flex items-center gap-2">
                  <span
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: ringColors[ringName] }}
                  />
                  <span className="font-mono text-xs font-bold uppercase tracking-wider text-text-primary">
                    {ringName} Ring
                  </span>
                </div>
                <span className="text-[10px] font-mono text-text-secondary">
                  {trendsInRing.length} Movements
                </span>
              </div>

              <div className="space-y-2 flex-1">
                {trendsInRing.length === 0 ? (
                  <div className="h-32 flex items-center justify-center text-[11px] text-text-secondary/50 italic">
                    No active trends in this filter
                  </div>
                ) : (
                  trendsInRing.map((trend) => (
                    <div
                      key={trend.id}
                      onClick={() => setInspectedTrend(trend)}
                      className="p-3 rounded-xl bg-elevated/60 border border-hairline hover:border-accent/40 transition-all cursor-pointer space-y-1.5 shadow-2xs hover:shadow-xs group"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-surface border border-hairline text-text-secondary">
                          {trend.quadrant}
                        </span>
                        <span className="text-[9px] font-mono text-accent font-semibold">
                          Score: {trend.maturityScore}/100
                        </span>
                      </div>

                      <div className="text-xs font-semibold text-text-primary group-hover:text-accent transition-colors">
                        {trend.title}
                      </div>

                      <p className="text-[10px] text-text-secondary leading-snug line-clamp-2">
                        {trend.description}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Trend Detail Inspector Modal */}
      {inspectedTrend && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-100">
          <div className="w-full max-w-2xl max-h-[85vh] rounded-2xl bg-surface border border-hairline shadow-2xl p-6 overflow-y-auto space-y-5 glass-panel">
            
            <div className="flex items-start justify-between pb-3 border-b border-hairline">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span
                    className="text-[10px] font-mono px-2 py-0.5 rounded font-semibold text-white"
                    style={{ backgroundColor: ringColors[inspectedTrend.ring] }}
                  >
                    {inspectedTrend.ring} Ring
                  </span>
                  <span className="text-[10px] font-mono text-text-secondary">
                    {inspectedTrend.quadrant} Quadrant
                  </span>
                  <span className="text-[10px] font-mono text-text-secondary">
                    Updated: {inspectedTrend.lastUpdated}
                  </span>
                </div>
                <h2 className="text-base font-bold font-display text-text-primary">
                  {inspectedTrend.title}
                </h2>
                <div className="text-xs font-mono text-accent font-medium">
                  Adoption Velocity: {inspectedTrend.adoptionRate}
                </div>
              </div>
              <button
                onClick={() => setInspectedTrend(null)}
                className="p-1.5 rounded-lg text-text-secondary hover:text-text-primary hover:bg-elevated transition-colors"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="space-y-1.5">
                <span className="font-mono text-[11px] uppercase tracking-wider text-text-secondary font-semibold">
                  Why It Matters & Strategic Impact
                </span>
                <p className="text-text-primary leading-relaxed bg-elevated/40 p-3.5 rounded-xl border border-hairline">
                  {inspectedTrend.whyItMatters}
                </p>
              </div>

              <div className="space-y-1.5">
                <span className="font-mono text-[11px] uppercase tracking-wider text-text-secondary font-semibold">
                  Career & Hiring Market Opportunity
                </span>
                <p className="text-text-primary leading-relaxed bg-elevated/40 p-3.5 rounded-xl border border-hairline">
                  {inspectedTrend.careerImpact}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-2 border-t border-hairline text-xs">
                <div>
                  <span className="font-mono text-[10px] text-text-secondary uppercase block mb-1">Required Skills</span>
                  <div className="flex flex-wrap gap-1">
                    {inspectedTrend.skillsRequired.map((s, i) => (
                      <span key={i} className="px-2 py-0.5 rounded bg-elevated border border-hairline font-mono text-[11px] text-text-primary">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <span className="font-mono text-[10px] text-text-secondary uppercase block mb-1">Primary Tools & Frameworks</span>
                  <div className="flex flex-wrap gap-1">
                    {inspectedTrend.primaryTools.map((tool, i) => (
                      <span key={i} className="px-2 py-0.5 rounded bg-accent/10 border border-accent/20 font-mono text-[11px] text-accent">
                        {tool}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-hairline flex justify-end">
              <button
                onClick={() => setInspectedTrend(null)}
                className="px-4 py-1.5 rounded-lg bg-accent text-white font-medium text-xs hover:bg-accent-hover transition-colors"
              >
                Close Trend Analysis
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
