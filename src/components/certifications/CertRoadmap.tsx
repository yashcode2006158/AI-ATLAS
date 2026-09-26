import React, { useState } from 'react';
import {
  Award,
  ExternalLink,
  CheckCircle2,
  BookOpen,
  DollarSign,
  Clock,
  Briefcase,
  Compass,
  ArrowRight
} from 'lucide-react';
import { useContentStore } from '../../store/useContentStore';
import { CertificationItem } from '../../types/content';
import { useAppStore } from '../../store/useStore';
import { createLearningAdapter } from '../../utils/learningAdapter';
import { LearningMode } from '../../types/content';

export const CertRoadmap: React.FC = () => {
  const { certifications } = useContentStore();
  const { setView, learningMode } = useAppStore();
  const adapter = createLearningAdapter(learningMode as LearningMode);

  const [selectedProvider, setSelectedProvider] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [inspectedCert, setInspectedCert] = useState<CertificationItem | null>(null);

  const providers = ['all', 'AWS', 'Google Cloud', 'Microsoft Azure', 'NVIDIA', 'Databricks', 'Linux Foundation'];
  const difficulties = ['all', 'Foundational', 'Associate', 'Professional', 'Specialty'];

  const filteredCerts = certifications.filter((c) => {
    const matchesProv = selectedProvider === 'all' || c.provider === selectedProvider;
    const matchesDiff = selectedDifficulty === 'all' || c.difficulty === selectedDifficulty;
    return matchesProv && matchesDiff;
  });

  return (
    <div className="space-y-6 text-xs">
      
      {/* Top Filter Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-xl bg-surface border border-hairline">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[11px] font-mono uppercase tracking-wider text-text-secondary font-semibold mr-1">
            Provider:
          </span>
          {providers.map((p) => (
            <button
              key={p}
              onClick={() => setSelectedProvider(p)}
              className={`px-2.5 py-1 rounded-md text-xs font-medium capitalize transition-all ${
                selectedProvider === p
                  ? 'bg-accent text-white shadow-xs'
                  : 'bg-elevated/50 border border-hairline text-text-secondary hover:text-text-primary'
              }`}
            >
              {p}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono uppercase tracking-wider text-text-secondary font-semibold mr-1">
            Tier:
          </span>
          <select
            value={selectedDifficulty}
            onChange={(e) => setSelectedDifficulty(e.target.value)}
            className="px-2.5 py-1 rounded-md bg-elevated border border-hairline text-xs text-text-primary focus:outline-none focus:border-accent"
          >
            {difficulties.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Grid of Certifications */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCerts.map((cert) => (
          <div
            key={cert.id}
            onClick={() => setInspectedCert(cert)}
            className="p-5 rounded-2xl bg-surface border border-hairline hover:border-accent/40 transition-all cursor-pointer shadow-xs hover:shadow-md flex flex-col justify-between group space-y-4"
          >
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-accent/10 border border-accent/20 text-accent font-semibold">
                  {cert.provider}
                </span>
                <span className="text-[10px] font-mono text-text-secondary">
                  {adapter.adaptDifficulty(cert.difficulty)}
                </span>
              </div>

              <div>
                <h3 className="text-sm font-bold font-display text-text-primary group-hover:text-accent transition-colors">
                  {cert.title}
                </h3>
                <div className="text-[11px] font-mono text-success font-medium mt-1">
                  Target: {cert.targetRole}
                </div>
              </div>

              <p className="text-[11px] text-text-secondary leading-snug line-clamp-2">
                {adapter.adaptConceptExplainer(cert.careerRelevance)}
              </p>
            </div>

            <div className="pt-3 border-t border-hairline flex items-center justify-between text-[10px] font-mono text-text-secondary">
              <span>Exam: {cert.examFormat}</span>
              <span className="flex items-center gap-1 text-accent group-hover:translate-x-0.5 transition-transform">
                <span>Exam Guide</span>
                <ArrowRight className="w-3 h-3" />
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Inspected Certification Modal */}
      {inspectedCert && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-100">
          <div className="w-full max-w-2xl max-h-[85vh] rounded-2xl bg-surface border border-hairline shadow-2xl p-6 overflow-y-auto space-y-5 glass-panel">
            
            <div className="flex items-start justify-between pb-3 border-b border-hairline">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-accent/10 border border-accent/20 text-accent font-semibold">
                    {inspectedCert.provider}
                  </span>
<span className="text-[10px] font-mono text-text-secondary">
                  {adapter.adaptDifficulty(inspectedCert.difficulty)} Level
                </span>
                </div>
                <h2 className="text-base font-bold font-display text-text-primary">
                  {inspectedCert.title}
                </h2>
                <p className="text-xs font-mono text-success font-medium">
                  {inspectedCert.targetRole}
                </p>
              </div>
              <button
                onClick={() => setInspectedCert(null)}
                className="p-1.5 rounded-lg text-text-secondary hover:text-text-primary hover:bg-elevated transition-colors"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="space-y-1.5">
                <span className="font-mono text-[11px] uppercase tracking-wider text-text-secondary font-semibold">
                  Career Relevance & ROI
                </span>
                <p className="text-text-primary leading-relaxed bg-elevated/40 p-3 rounded-xl border border-hairline">
                  {adapter.adaptConceptExplainer(inspectedCert.careerRelevance)}
                </p>
              </div>

              <div className="space-y-1.5">
                <span className="font-mono text-[11px] uppercase tracking-wider text-text-secondary font-semibold">
                  Key Skills & Knowledge Domains Tested
                </span>
                <ul className="space-y-1.5 bg-elevated/40 p-3.5 rounded-xl border border-hairline">
                  {inspectedCert.skillsTested.map((skill, i) => (
                    <li key={i} className="flex items-start gap-2 text-text-primary leading-relaxed">
                      <span className="text-accent font-mono">✓</span>
                      <span>{adapter.adaptDifficulty('developer') === 'developer' ? skill : skill.split(' ').slice(0, 3).join(' ')}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2 border-t border-hairline font-mono text-[11px]">
                <div className="p-3 rounded-lg bg-elevated/60 border border-hairline">
                  <span className="text-[10px] text-text-secondary uppercase block mb-0.5">Format</span>
                  <span className="text-text-primary font-bold">{adapter.adaptDifficulty('developer') === 'developer' ? inspectedCert.examFormat : inspectedCert.examFormat.split('.')[0]}</span>
                </div>
                <div className="p-3 rounded-lg bg-elevated/60 border border-hairline">
                  <span className="text-[10px] text-text-secondary uppercase block mb-0.5">Career Relevance</span>
                  <span className="text-text-primary font-bold">{adapter.adaptConceptExplainer(inspectedCert.careerRelevance)}</span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-hairline flex items-center justify-between">
              <button
                onClick={() => {
                  setView('roadmap');
                  setInspectedCert(null);
                }}
                className="text-xs text-accent hover:underline flex items-center gap-1 font-mono"
              >
                <Compass className="w-3.5 h-3.5" />
                <span>Jump to Recommended Learning Modules</span>
              </button>
              <button
                onClick={() => setInspectedCert(null)}
                className="px-4 py-1.5 rounded-lg bg-accent text-white font-medium text-xs hover:bg-accent-hover transition-colors"
              >
                Close Guide
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
