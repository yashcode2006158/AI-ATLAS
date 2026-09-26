import React, { useState } from 'react';
import {
  X,
  CheckCircle2,
  Play,
  Clock,
  Award,
  BookOpen,
  Cpu,
  ArrowRight,
  Sparkles,
  Layers,
  ChevronRight,
  ExternalLink,
  HelpCircle
} from 'lucide-react';
import { RoadmapNode } from '../../types/roadmap';
import { useAppStore } from '../../store/useStore';
import { useUserStore } from '../../store/useUserStore';

interface Props {
  node: RoadmapNode;
  onClose: () => void;
}

export const NodeDetailsModal: React.FC<Props> = ({ node, onClose }) => {
  const { learningMode, setView, setSimulation } = useAppStore();
  const { user, completeNode, startNode } = useUserStore();

  const [activeTab, setActiveTab] = useState<'explainer' | 'handsOn' | 'architecture' | 'interview'>('explainer');
  const [revealedAnswers, setRevealedAnswers] = useState<Record<number, boolean>>({});

  const isCompleted = user.completedNodeIds.includes(node.id);
  const isInProgress = user.inProgressNodeIds.includes(node.id);

  // Dynamic 60-second summary according to the active Learning Mode
  const modeSummary = node.explainer.sixtySecondSummary[learningMode] || node.explainer.sixtySecondSummary.developer;

  const handleLaunchSimulation = () => {
    if (node.simulationType) {
      setSimulation(node.simulationType);
      setView('simulations', { sim: node.simulationType });
      onClose();
    }
  };

  const handleToggleComplete = () => {
    if (!isCompleted) {
      completeNode(node.id, node.xpReward);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end p-0 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="w-full max-w-2xl h-full sm:h-[92vh] sm:rounded-2xl bg-surface border border-hairline shadow-2xl flex flex-col glass-panel overflow-hidden">
        
        {/* Header Bar */}
        <div className="p-5 border-b border-hairline flex items-start justify-between bg-surface/90">
          <div className="space-y-1.5 max-w-[85%]">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded bg-accent/10 border border-accent/20 text-accent font-semibold">
                {node.layerId.replace('-', ' ')}
              </span>
              <span className="text-[10px] font-mono text-text-secondary">
                {node.difficulty} • ~{node.estimatedHours} hrs
              </span>
              <span className="text-[10px] font-mono text-warning font-medium">
                +{node.xpReward} XP
              </span>
            </div>
            <h2 className="text-base font-bold font-display text-text-primary tracking-tight">
              {node.title}
            </h2>
            <p className="text-xs text-text-secondary leading-relaxed">
              {node.shortDesc}
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-text-secondary hover:text-text-primary hover:bg-elevated transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-1 px-5 border-b border-hairline bg-elevated/30 text-xs font-medium">
          <button
            onClick={() => setActiveTab('explainer')}
            className={`py-2.5 px-3 border-b-2 transition-colors ${
              activeTab === 'explainer'
                ? 'border-accent text-accent'
                : 'border-transparent text-text-secondary hover:text-text-primary'
            }`}
          >
            Pedagogical Explainer
          </button>
          <button
            onClick={() => setActiveTab('architecture')}
            className={`py-2.5 px-3 border-b-2 transition-colors ${
              activeTab === 'architecture'
                ? 'border-accent text-accent'
                : 'border-transparent text-text-secondary hover:text-text-primary'
            }`}
          >
            System Architecture
          </button>
          <button
            onClick={() => setActiveTab('handsOn')}
            className={`py-2.5 px-3 border-b-2 transition-colors ${
              activeTab === 'handsOn'
                ? 'border-accent text-accent'
                : 'border-transparent text-text-secondary hover:text-text-primary'
            }`}
          >
            Lab & Industry Tools
          </button>
          <button
            onClick={() => setActiveTab('interview')}
            className={`py-2.5 px-3 border-b-2 transition-colors ${
              activeTab === 'interview'
                ? 'border-accent text-accent'
                : 'border-transparent text-text-secondary hover:text-text-primary'
            }`}
          >
            Interview Q&A
          </button>
        </div>

        {/* Tab Content Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5 text-xs">
          
          {/* TAB 1: EXPLAINER (60s summary, analogy, technical deep dive, equations) */}
          {activeTab === 'explainer' && (
            <div className="space-y-5">
              
              {/* 60-Second Explanation (Tailored to active learning mode) */}
              <div className="p-4 rounded-xl bg-accent/5 border border-accent/20 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono text-accent uppercase tracking-wider font-semibold flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    60-Second Explanation ({learningMode} Lens)
                  </span>
                  <span className="text-[10px] font-mono text-text-secondary">
                    Adapted dynamically
                  </span>
                </div>
                <p className="text-xs text-text-primary leading-relaxed">
                  {modeSummary}
                </p>
              </div>

              {/* Plain-Language Analogy */}
              <div className="space-y-2">
                <span className="text-[11px] font-mono text-text-secondary uppercase tracking-wider font-semibold">
                  Plain-Language Analogy
                </span>
                <div className="p-3.5 rounded-lg bg-elevated/70 border border-hairline text-text-primary leading-relaxed italic">
                  "{node.explainer.analogy}"
                </div>
              </div>

              {/* Technical Deep Dive */}
              <div className="space-y-2">
                <span className="text-[11px] font-mono text-text-secondary uppercase tracking-wider font-semibold">
                  Technical Deep Dive & Mathematical Mechanics
                </span>
                <p className="text-text-primary leading-relaxed">
                  {node.explainer.technicalDeepDive}
                </p>
              </div>

              {/* Mathematical Formulas / Equations */}
              {node.explainer.keyEquationsOrFormulas && (
                <div className="space-y-2">
                  <span className="text-[11px] font-mono text-text-secondary uppercase tracking-wider font-semibold">
                    Governing Equations
                  </span>
                  <div className="p-3 rounded-lg bg-elevated border border-hairline space-y-1.5 font-mono text-[11px] text-accent overflow-x-auto">
                    {node.explainer.keyEquationsOrFormulas.map((eq, i) => (
                      <div key={i} className="py-0.5">
                        {eq}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Common Pitfalls */}
              <div className="space-y-2">
                <span className="text-[11px] font-mono text-danger uppercase tracking-wider font-semibold">
                  Common Architectural Pitfalls
                </span>
                <ul className="space-y-1.5">
                  {node.explainer.commonPitfalls.map((pitfall, i) => (
                    <li key={i} className="flex items-start gap-2 text-text-secondary leading-relaxed">
                      <span className="text-danger font-mono shrink-0">✕</span>
                      <span>{pitfall}</span>
                    </li>
                  ))}
                </ul>
              </div>

            </div>
          )}

          {/* TAB 2: SYSTEM ARCHITECTURE */}
          {activeTab === 'architecture' && (
            <div className="space-y-4">
              <div className="space-y-2">
                <span className="text-[11px] font-mono text-text-secondary uppercase tracking-wider font-semibold">
                  Production Infrastructure Pattern
                </span>
                <p className="text-text-primary leading-relaxed">
                  {node.explainer.realWorldArchitecture}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-elevated border border-hairline space-y-3">
                <div className="text-xs font-semibold text-text-primary flex items-center gap-1.5">
                  <Layers className="w-4 h-4 text-accent" />
                  Enterprise Use Case
                </div>
                <p className="text-text-secondary leading-relaxed">
                  {node.realWorldUseCase}
                </p>
              </div>

              {node.relatedCertifications.length > 0 && (
                <div className="space-y-2">
                  <span className="text-[11px] font-mono text-text-secondary uppercase tracking-wider font-semibold">
                    Related Professional Certifications
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {node.relatedCertifications.map((cert, i) => (
                      <span key={i} className="px-2 py-1 rounded bg-elevated border border-hairline text-[11px] text-text-primary font-mono">
                        {cert}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: LAB & TOOLS */}
          {activeTab === 'handsOn' && (
            <div className="space-y-5">
              
              {/* Hands-On Lab Card */}
              <div className="p-4 rounded-xl bg-elevated border border-hairline space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-text-primary font-display flex items-center gap-2">
                    <Play className="w-4 h-4 text-accent fill-accent" />
                    Hands-On Challenge Lab
                  </span>
                  {node.simulationType && (
                    <button
                      onClick={handleLaunchSimulation}
                      className="px-3 py-1 rounded-md bg-accent text-white font-medium text-[11px] hover:bg-accent-hover transition-colors flex items-center gap-1"
                    >
                      <span>Launch {node.simulationType.toUpperCase()} Sim</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  )}
                </div>
                <p className="text-text-secondary leading-relaxed">
                  {node.handsOnLabSummary}
                </p>
              </div>

              {/* Industry Standard Tools */}
              <div className="space-y-2">
                <span className="text-[11px] font-mono text-text-secondary uppercase tracking-wider font-semibold">
                  Production Toolchain & Frameworks
                </span>
                <div className="grid grid-cols-2 gap-2">
                  {node.industryTools.map((tool, i) => (
                    <div
                      key={i}
                      className="p-2.5 rounded-lg bg-elevated/70 border border-hairline flex items-center gap-2"
                    >
                      <Cpu className="w-3.5 h-3.5 text-accent shrink-0" />
                      <span className="font-mono text-xs text-text-primary">{tool}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Target Career Relevance */}
              <div className="space-y-2">
                <span className="text-[11px] font-mono text-text-secondary uppercase tracking-wider font-semibold">
                  Career Role Relevance
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {node.careerRelevance.map((role, i) => (
                    <span key={i} className="px-2 py-0.5 rounded-md bg-surface border border-hairline text-text-primary text-[11px]">
                      {role}
                    </span>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* TAB 4: INTERVIEW QUESTIONS */}
          {activeTab === 'interview' && (
            <div className="space-y-4">
              <div className="text-[11px] text-text-secondary">
                Technical interview questions asked at frontier AI labs and Tier-1 enterprises:
              </div>

              {node.interviewQuestions.map((q, idx) => {
                const isRevealed = revealedAnswers[idx];
                return (
                  <div key={idx} className="p-3.5 rounded-xl bg-elevated border border-hairline space-y-2.5">
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-1">
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-surface border border-hairline text-accent font-semibold">
                          {q.level} Level
                        </span>
                        <div className="text-xs font-semibold text-text-primary leading-snug">
                          {q.question}
                        </div>
                      </div>
                      <button
                        onClick={() => setRevealedAnswers(prev => ({ ...prev, [idx]: !prev[idx] }))}
                        className="text-[11px] font-mono text-accent hover:underline shrink-0"
                      >
                        {isRevealed ? 'Hide' : 'Reveal Answer'}
                      </button>
                    </div>

                    {isRevealed && (
                      <div className="pt-2 border-t border-hairline text-text-secondary leading-relaxed bg-surface/40 p-2.5 rounded">
                        {q.answer}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-hairline bg-surface flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            {!isInProgress && !isCompleted && (
              <button
                onClick={() => startNode(node.id)}
                className="px-3 py-1.5 rounded-lg bg-elevated border border-hairline text-text-primary hover:bg-elevated/80 text-xs font-medium transition-colors"
              >
                Mark In Progress
              </button>
            )}
            {isCompleted ? (
              <div className="flex items-center gap-1.5 text-xs text-success font-medium">
                <CheckCircle2 className="w-4 h-4" />
                <span>Node Mastered (+{node.xpReward} XP)</span>
              </div>
            ) : (
              <button
                onClick={handleToggleComplete}
                className="px-4 py-1.5 rounded-lg bg-success text-white text-xs font-medium hover:opacity-90 transition-opacity flex items-center gap-1.5 shadow-sm"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Mark as Completed (+{node.xpReward} XP)</span>
              </button>
            )}
          </div>

          {node.simulationType && (
            <button
              onClick={handleLaunchSimulation}
              className="px-4 py-1.5 rounded-lg bg-accent text-white text-xs font-medium hover:bg-accent-hover transition-colors flex items-center gap-1.5 shadow-sm"
            >
              <span>Launch Live Simulation</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

      </div>
    </div>
  );
};
