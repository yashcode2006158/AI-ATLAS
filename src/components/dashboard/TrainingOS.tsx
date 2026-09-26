import React from 'react';
import {
  Activity,
  Flame,
  Zap,
  Award,
  Compass,
  Terminal,
  Cpu,
  ArrowRight,
  CheckCircle2,
  TrendingUp,
  Radar,
  Sparkles,
  Play
} from 'lucide-react';
import { useUserStore } from '../../store/useUserStore';
import { useAppStore } from '../../store/useStore';
import { useContentStore } from '../../store/useContentStore';

export const TrainingOS: React.FC = () => {
  const { user } = useUserStore();
  const { setView, setSimulation } = useAppStore();
  const { nodes, projects, radarTrends } = useContentStore();

  const nextNode = nodes.find((n) => !user.completedNodeIds.includes(n.id)) || nodes[0];
  const activeProject = projects.find((p) => p.id === user.activeProjectId) || projects[0];
  const recentTrends = radarTrends.slice(0, 3);

  const xpProgressPercent = Math.min(100, Math.round((user.xp / user.xpToNextLevel) * 100));

  return (
    <div className="space-y-6 text-xs">
      
      {/* Top OS Summary Header */}
      <div className="p-6 rounded-2xl bg-surface border border-hairline space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <img
              src={user.avatarUrl}
              alt={user.name}
              className="w-12 h-12 rounded-xl object-cover border border-hairline shadow-sm"
            />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-text-primary font-display">{user.name}</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-accent/15 border border-accent/25 text-accent font-semibold">
                  Level {user.level} • {user.levelTitle}
                </span>
              </div>
              <p className="text-xs text-text-secondary mt-0.5">
                Target: <span className="text-text-primary font-medium">{user.targetCareer.replace('-', ' ').toUpperCase()}</span> • Active OS Session
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-elevated/70 border border-hairline flex items-center gap-2.5">
              <Flame className="w-4 h-4 fill-warning text-warning" />
              <div>
                <div className="text-[10px] text-text-secondary uppercase font-mono">Streak</div>
                <div className="text-sm font-bold text-text-primary font-mono">{user.streakDays} Days</div>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-elevated/70 border border-hairline flex items-center gap-2.5">
              <Zap className="w-4 h-4 text-accent" />
              <div>
                <div className="text-[10px] text-text-secondary uppercase font-mono">Total XP</div>
                <div className="text-sm font-bold text-accent font-mono">{user.xp} XP</div>
              </div>
            </div>
          </div>
        </div>

        {/* XP Progress Ladder Bar */}
        <div className="space-y-1.5 pt-2 border-t border-hairline">
          <div className="flex justify-between font-mono text-[11px] text-text-secondary">
            <span>Progression to Next Rank ({user.xpToNextLevel} XP required)</span>
            <span>{xpProgressPercent}% Complete</span>
          </div>
          <div className="w-full h-2 rounded-full bg-elevated overflow-hidden">
            <div
              className="h-full bg-accent rounded-full transition-all duration-standard shadow-sm"
              style={{ width: `${xpProgressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Main OS Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Next Lesson & Active Project (8 Cols) */}
        <div className="lg:col-span-8 space-y-5">
          
          {/* Next Recommended Node Card */}
          <div className="p-5 rounded-2xl bg-surface border border-hairline hover:border-accent/40 transition-all space-y-3 shadow-xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                <span className="font-mono text-[11px] uppercase tracking-wider text-accent font-semibold">
                  Next Priority Learning Node
                </span>
              </div>
              <span className="text-[10px] font-mono text-text-secondary">
                +{nextNode.xpReward} XP Reward
              </span>
            </div>

            <div>
              <h3 className="text-base font-bold font-display text-text-primary">
                {nextNode.title}
              </h3>
              <p className="text-xs text-text-secondary leading-relaxed mt-1">
                {nextNode.shortDesc}
              </p>
            </div>

            <div className="pt-2 border-t border-hairline flex items-center justify-between">
              <div className="flex items-center gap-2 font-mono text-[10px] text-text-secondary">
                <span>~{nextNode.estimatedHours}h estimate</span>
                <span>•</span>
                <span>{nextNode.difficulty}</span>
              </div>
              <button
                onClick={() => setView('roadmap', { nodeId: nextNode.id })}
                className="px-4 py-1.5 rounded-lg bg-accent text-white font-medium text-xs hover:bg-accent-hover transition-colors flex items-center gap-1.5 shadow-sm"
              >
                <span>Launch Node Explainer</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Active Project Card */}
          <div className="p-5 rounded-2xl bg-surface border border-hairline space-y-3 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[11px] uppercase tracking-wider text-warning font-semibold flex items-center gap-1.5">
                <Terminal className="w-3.5 h-3.5 text-warning" />
                Active Engineering Project
              </span>
              <span className="text-[10px] font-mono text-text-secondary">
                {activeProject.tier} Tier
              </span>
            </div>

            <div>
              <h3 className="text-base font-bold font-display text-text-primary">
                {activeProject.title}
              </h3>
              <p className="text-xs text-text-secondary leading-relaxed mt-1">
                {activeProject.shortDesc}
              </p>
            </div>

            <div className="pt-2 border-t border-hairline flex items-center justify-between">
              <div className="flex flex-wrap gap-1 font-mono text-[10px]">
                {activeProject.technologies.slice(0, 3).map((tech, i) => (
                  <span key={i} className="px-2 py-0.5 rounded bg-elevated border border-hairline text-text-primary">
                    {tech}
                  </span>
                ))}
              </div>
              <button
                onClick={() => setView('projects', { projId: activeProject.id })}
                className="px-4 py-1.5 rounded-lg bg-elevated border border-hairline text-text-primary hover:bg-elevated/80 font-medium text-xs transition-colors flex items-center gap-1.5"
              >
                <span>Open Project Lab</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Recently Run Simulations Quick-Launcher */}
          <div className="p-5 rounded-2xl bg-surface border border-hairline space-y-3">
            <span className="font-mono text-[11px] uppercase tracking-wider text-text-secondary font-semibold flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5 text-accent" />
              Simulation Quick-Launcher
            </span>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {[
                { id: 'rag', name: 'RAG Simulator', desc: 'Embed & Retrieve' },
                { id: 'agent', name: 'Agent Simulator', desc: 'ReAct Loop' },
                { id: 'llm', name: 'LLM Playground', desc: 'Temperature & Latency' },
                { id: 'neural', name: 'Neural Visualizer', desc: 'Decision Surface' },
                { id: 'tokenizer', name: 'Tokenizer Explorer', desc: 'BPE & Bytes' },
                { id: 'vector', name: 'Vector Space', desc: 'Cosine Clusters' },
              ].map((sim) => (
                <button
                  key={sim.id}
                  onClick={() => {
                    setSimulation(sim.id as any);
                    setView('simulations', { sim: sim.id as any });
                  }}
                  className="p-3 rounded-xl bg-elevated/50 border border-hairline hover:border-accent/40 text-left transition-all group"
                >
                  <div className="text-xs font-semibold text-text-primary group-hover:text-accent transition-colors flex items-center justify-between">
                    <span>{sim.name}</span>
                    <Play className="w-2.5 h-2.5 fill-accent opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <div className="text-[10px] text-text-secondary mt-0.5">{sim.desc}</div>
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* Right Column: Badges, Radar Movements, Skills (4 Cols) */}
        <div className="lg:col-span-4 space-y-5">
          
          {/* Earned Milestones & Badges */}
          <div className="p-5 rounded-2xl bg-surface border border-hairline space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[11px] uppercase tracking-wider text-text-secondary font-semibold flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5 text-warning" />
                Unlocked Credentials
              </span>
              <span className="text-[10px] font-mono text-accent">
                {user.earnedBadges.length} Badges
              </span>
            </div>

            <div className="space-y-2">
              {user.earnedBadges.map((badge) => (
                <div
                  key={badge.id}
                  className="p-2.5 rounded-lg bg-elevated/60 border border-hairline flex items-center gap-2.5"
                >
                  <div className="w-7 h-7 rounded-md bg-warning/10 border border-warning/20 text-warning flex items-center justify-center shrink-0">
                    <Award className="w-3.5 h-3.5" />
                  </div>
                  <div className="space-y-0.5">
                    <div className="text-xs font-semibold text-text-primary">{badge.title}</div>
                    <div className="text-[10px] text-text-secondary">{badge.description}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Live AI Radar Feed */}
          <div className="p-5 rounded-2xl bg-surface border border-hairline space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[11px] uppercase tracking-wider text-text-secondary font-semibold flex items-center gap-1.5">
                <Radar className="w-3.5 h-3.5 text-accent" />
                Live AI Radar Feed
              </span>
              <button
                onClick={() => setView('radar')}
                className="text-[10px] font-mono text-accent hover:underline"
              >
                View Radar →
              </button>
            </div>

            <div className="space-y-2">
              {recentTrends.map((trend) => (
                <div
                  key={trend.id}
                  onClick={() => setView('radar')}
                  className="p-2.5 rounded-lg bg-elevated/40 border border-hairline hover:bg-elevated cursor-pointer transition-colors space-y-1"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-text-primary">{trend.title}</span>
                    <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-surface border border-hairline text-accent">
                      {trend.ring}
                    </span>
                  </div>
                  <p className="text-[10px] text-text-secondary line-clamp-1">
                    {trend.whyItMatters}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Mastered Modules Summary */}
          <div className="p-5 rounded-2xl bg-surface border border-hairline space-y-2">
            <span className="font-mono text-[11px] uppercase tracking-wider text-text-secondary font-semibold">
              Mastered Foundation Concepts ({user.completedNodeIds.length})
            </span>
            <div className="flex flex-wrap gap-1.5">
              {user.completedNodeIds.map((id) => (
                <span
                  key={id}
                  onClick={() => setView('roadmap', { nodeId: id })}
                  className="px-2 py-1 rounded bg-elevated border border-hairline text-[10px] font-mono text-text-primary hover:border-accent cursor-pointer transition-colors"
                >
                  ✓ {id}
                </span>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
