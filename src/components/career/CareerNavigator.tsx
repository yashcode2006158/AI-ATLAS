import React, { useState } from 'react';
import {
  Briefcase,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Award,
  Terminal,
  Compass,
  DollarSign,
  TrendingUp,
  Layers
} from 'lucide-react';
import { INITIAL_CAREER_PATHS } from '../../data/careers';
import { useAppStore } from '../../store/useStore';
import { useUserStore } from '../../store/useUserStore';

export const CareerNavigator: React.FC = () => {
  const { setView } = useAppStore();
  const { user } = useUserStore();

  const [selectedRole, setSelectedRole] = useState(INITIAL_CAREER_PATHS[0]);
  const [userBackground, setUserBackground] = useState<'backend' | 'frontend' | 'data' | 'student'>('backend');

  const backgroundOptions = [
    { id: 'backend', label: 'Backend Developer (Java, Go, Node, Python)' },
    { id: 'frontend', label: 'Frontend / Full-Stack Engineer (React, TypeScript)' },
    { id: 'data', label: 'Data Analyst / BI Engineer (SQL, Pandas)' },
    { id: 'student', label: 'STEM Student / Junior Developer' },
  ];

  return (
    <div className="space-y-6 text-xs">
      
      {/* Visual Pipeline Header Banner */}
      <div className="p-5 rounded-2xl bg-surface border border-hairline overflow-x-auto">
        <div className="text-[10px] font-mono uppercase tracking-wider text-text-secondary font-semibold mb-3 flex items-center gap-1.5">
          <TrendingUp className="w-3.5 h-3.5 text-accent" />
          Career Transition Pipeline Engine
        </div>

        <div className="flex items-center justify-between min-w-[800px] gap-2">
          {['Current Skills', 'Skill Gap Analysis', 'Custom Roadmap', 'Portfolio Projects', 'Certifications', 'Interview Readiness', 'Target Role'].map((stage, idx) => (
            <React.Fragment key={idx}>
              <div className="flex items-center gap-2 p-2 rounded-lg bg-elevated/70 border border-hairline shrink-0">
                <span className="w-5 h-5 rounded-full bg-accent/15 border border-accent/30 text-accent font-mono text-[10px] flex items-center justify-center font-semibold">
                  0{idx + 1}
                </span>
                <span className="font-semibold text-text-primary text-[11px]">{stage}</span>
              </div>
              {idx < 6 && (
                <ArrowRight className="w-3.5 h-3.5 text-text-secondary/60 shrink-0" />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Target Role List & Background Selector (4 Cols) */}
        <div className="lg:col-span-4 space-y-4">
          
          {/* Background Selector */}
          <div className="p-4 rounded-xl bg-surface border border-hairline space-y-2">
            <span className="font-mono text-[11px] uppercase tracking-wider text-text-secondary font-semibold">
              Select Your Background
            </span>
            <div className="space-y-1">
              {backgroundOptions.map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => setUserBackground(opt.id as any)}
                  className={`w-full text-left p-2 rounded-lg border text-xs transition-colors ${
                    userBackground === opt.id
                      ? 'bg-accent/10 border-accent text-accent font-medium'
                      : 'bg-elevated/40 border-hairline text-text-secondary hover:text-text-primary hover:bg-elevated'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Roles Selector */}
          <div className="p-4 rounded-xl bg-surface border border-hairline space-y-3">
            <span className="font-mono text-[11px] uppercase tracking-wider text-text-secondary font-semibold">
              Target AI Roles ({INITIAL_CAREER_PATHS.length})
            </span>
            <div className="space-y-1.5">
              {INITIAL_CAREER_PATHS.map((role) => {
                const isSelected = selectedRole.id === role.id;
                return (
                  <button
                    key={role.id}
                    onClick={() => setSelectedRole(role)}
                    className={`w-full text-left p-3 rounded-xl border transition-all flex items-center justify-between ${
                      isSelected
                        ? 'bg-accent/10 border-accent shadow-sm'
                        : 'bg-elevated/40 border-hairline hover:bg-elevated text-text-secondary hover:text-text-primary'
                    }`}
                  >
                    <div className="space-y-0.5">
                      <div className="text-xs font-semibold text-text-primary">{role.title}</div>
                      <div className="text-[10px] font-mono text-accent">{role.averageSalaryUs}</div>
                    </div>
                    <ArrowRight className={`w-3.5 h-3.5 ${isSelected ? 'text-accent' : 'text-text-secondary/40'}`} />
                  </button>
                );
              })}
            </div>
          </div>

        </div>

        {/* Right Column: Detailed Skill Gap & Career Bridge Architecture (8 Cols) */}
        <div className="lg:col-span-8 space-y-5">
          
          {/* Role Header */}
          <div className="p-5 rounded-2xl bg-surface border border-hairline space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded bg-accent/15 border border-accent/25 text-accent font-semibold">
                  {selectedRole.level} Level
                </span>
                <span className="text-[10px] font-mono text-success font-medium">
                  {selectedRole.averageSalaryUs}
                </span>
              </div>
            </div>
            <h2 className="text-base font-bold font-display text-text-primary">
              {selectedRole.title}
            </h2>
            <p className="text-xs text-text-secondary leading-relaxed max-w-2xl">
              {selectedRole.description}
            </p>
          </div>

          {/* Skill Gaps for Current Profile */}
          <div className="p-5 rounded-2xl bg-surface border border-hairline space-y-3">
            <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-wider text-warning font-semibold">
              <AlertTriangle className="w-3.5 h-3.5 text-warning" />
              <span>Skill Gap Bridge Analysis for Your Background</span>
            </div>

            <div className="space-y-2.5">
              {selectedRole.skillGapsForTypicalProfiles.map((gap, i) => (
                <div key={i} className="p-3.5 rounded-xl bg-elevated/70 border border-hairline space-y-2">
                  <div className="font-semibold text-text-primary text-xs">
                    Profile: {gap.profile}
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {gap.gaps.map((item, idx) => (
                      <span key={idx} className="text-[10px] font-mono px-2 py-0.5 rounded bg-danger/10 text-danger border border-danger/20">
                        Gap: {item}
                      </span>
                    ))}
                  </div>
                  <div className="text-[11px] text-text-secondary leading-relaxed flex items-center gap-1.5 pt-1">
                    <Sparkles className="w-3.5 h-3.5 text-accent shrink-0" />
                    <span>Bridge Recommendation: {gap.bridgeAction}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Required Competencies Grid */}
          <div className="p-5 rounded-2xl bg-surface border border-hairline space-y-3">
            <span className="font-mono text-[11px] uppercase tracking-wider text-text-secondary font-semibold">
              Essential Production Competencies
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {selectedRole.requiredSkills.map((skill, idx) => (
                <div key={idx} className="p-3 rounded-lg bg-elevated/50 border border-hairline flex items-center justify-between">
                  <span className="text-xs font-semibold text-text-primary">{skill.name}</span>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-surface border border-hairline text-accent">
                    {skill.level}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Technical Interview Focus Areas */}
          <div className="p-5 rounded-2xl bg-surface border border-hairline space-y-3">
            <span className="font-mono text-[11px] uppercase tracking-wider text-text-secondary font-semibold">
              Technical Interview Focus Areas
            </span>
            <ul className="space-y-2">
              {selectedRole.interviewFocus.map((focus, i) => (
                <li key={i} className="p-2.5 rounded-lg bg-elevated/40 border border-hairline text-[11px] text-text-primary flex items-start gap-2">
                  <span className="text-accent font-mono">Q{i + 1}:</span>
                  <span>{focus}</span>
                </li>
              ))}
            </ul>
          </div>

        </div>

      </div>
    </div>
  );
};
