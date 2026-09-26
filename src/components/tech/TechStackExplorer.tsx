import React, { useState } from 'react';
import {
  Sliders,
  Search,
  ExternalLink,
  Code,
  Layers,
  Sparkles,
  ArrowRight,
  GitBranch,
  Cpu
} from 'lucide-react';
import { useContentStore } from '../../store/useContentStore';
import { TechnologyItem } from '../../types/content';
import { useAppStore } from '../../store/useStore';

export const TechStackExplorer: React.FC = () => {
  const { technologies } = useContentStore();
  const { setView } = useAppStore();

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [inspectedTech, setInspectedTech] = useState<TechnologyItem | null>(null);

  const categories = [
    { id: 'all', label: 'All Stack' },
    { id: 'languages', label: 'Languages' },
    { id: 'frameworks', label: 'Frameworks' },
    { id: 'llm-platforms', label: 'LLM Platforms' },
    { id: 'agent-frameworks', label: 'Agent SDKs' },
    { id: 'vector-dbs', label: 'Vector DBs' },
    { id: 'infrastructure', label: 'Serving & Infra' },
    { id: 'mlops', label: 'MLOps & Evals' },
    { id: 'security', label: 'Security & Safety' },
  ];

  const filteredTechnologies = technologies.filter((tech) => {
    const matchesCat = selectedCategory === 'all' || tech.category === selectedCategory;
    const matchesQuery =
      tech.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tech.tagline.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tech.whyItExists.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesQuery;
  });

  return (
    <div className="space-y-6 text-xs">
      
      {/* Category Pills & Search Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-2 border-b border-hairline">
        <div className="flex items-center gap-1.5 overflow-x-auto max-w-full pb-1">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all shrink-0 ${
                selectedCategory === cat.id
                  ? 'bg-accent text-white shadow-xs'
                  : 'bg-surface border border-hairline text-text-secondary hover:text-text-primary hover:bg-elevated'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <div className="relative min-w-[240px]">
          <Search className="w-3.5 h-3.5 text-text-secondary absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Filter technologies (e.g. 'vLLM', 'Rust', 'Qdrant')..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-surface border border-hairline text-xs text-text-primary focus:outline-none focus:border-accent"
          />
        </div>
      </div>

      {/* Grid of Technology Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTechnologies.map((tech) => (
          <div
            key={tech.id}
            onClick={() => setInspectedTech(tech)}
            className="p-5 rounded-2xl bg-surface border border-hairline hover:border-accent/40 transition-all cursor-pointer shadow-xs hover:shadow-md flex flex-col justify-between group space-y-4"
          >
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded bg-accent/10 border border-accent/20 text-accent font-semibold">
                  {tech.badge}
                </span>
                <span className="text-[10px] font-mono text-text-secondary">
                  {tech.industryAdoption}
                </span>
              </div>

              <div>
                <h3 className="text-sm font-bold font-display text-text-primary group-hover:text-accent transition-colors">
                  {tech.name}
                </h3>
                <p className="text-[11px] text-text-secondary leading-snug mt-1">
                  {tech.tagline}
                </p>
              </div>

              <div className="space-y-1 pt-1">
                <div className="text-[10px] font-mono text-text-secondary uppercase font-semibold">Why It Exists:</div>
                <p className="text-[11px] text-text-primary line-clamp-2 leading-relaxed">
                  {tech.whyItExists}
                </p>
              </div>
            </div>

            <div className="pt-3 border-t border-hairline flex items-center justify-between text-[10px] font-mono text-text-secondary">
              <span>Diff: {tech.difficulty}</span>
              <span className="flex items-center gap-1 text-accent group-hover:translate-x-0.5 transition-transform">
                <span>Deep Specs</span>
                <ArrowRight className="w-3 h-3" />
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Detailed Technology Inspector Modal */}
      {inspectedTech && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-100">
          <div className="w-full max-w-2xl max-h-[85vh] rounded-2xl bg-surface border border-hairline shadow-2xl p-6 overflow-y-auto space-y-5 glass-panel">
            
            <div className="flex items-start justify-between pb-3 border-b border-hairline">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded bg-accent/10 border border-accent/20 text-accent font-semibold">
                    {inspectedTech.category}
                  </span>
                  <span className="text-[10px] font-mono text-text-secondary">
                    {inspectedTech.industryAdoption} Adoption
                  </span>
                </div>
                <h2 className="text-base font-bold font-display text-text-primary">
                  {inspectedTech.name}
                </h2>
                <p className="text-xs text-text-secondary">{inspectedTech.tagline}</p>
              </div>
              <button
                onClick={() => setInspectedTech(null)}
                className="p-1.5 rounded-lg text-text-secondary hover:text-text-primary hover:bg-elevated transition-colors"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="space-y-1.5">
                <span className="font-mono text-[11px] uppercase tracking-wider text-text-secondary font-semibold">
                  Why It Exists & Core Problem Solved
                </span>
                <p className="text-text-primary leading-relaxed bg-elevated/40 p-3 rounded-xl border border-hairline">
                  {inspectedTech.whyItExists}
                </p>
              </div>

              <div className="space-y-1.5">
                <span className="font-mono text-[11px] uppercase tracking-wider text-text-secondary font-semibold">
                  When to Use (Decision Matrix)
                </span>
                <p className="text-text-primary leading-relaxed bg-elevated/40 p-3 rounded-xl border border-hairline">
                  {inspectedTech.whenToUse}
                </p>
              </div>

              {inspectedTech.codeSnippet && (
                <div className="space-y-1.5">
                  <span className="font-mono text-[11px] uppercase tracking-wider text-text-secondary font-semibold flex items-center gap-1.5">
                    <Code className="w-3.5 h-3.5 text-accent" />
                    Production Implementation: {inspectedTech.codeSnippet.title}
                  </span>
                  <pre className="p-4 rounded-xl bg-base border border-hairline font-mono text-xs text-text-primary overflow-x-auto leading-relaxed">
                    {inspectedTech.codeSnippet.code}
                  </pre>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4 pt-2 border-t border-hairline text-xs">
                <div>
                  <span className="font-mono text-[10px] text-text-secondary uppercase block mb-1">Common Alternatives</span>
                  <div className="flex flex-wrap gap-1">
                    {inspectedTech.alternatives.map((alt, i) => (
                      <span key={i} className="px-2 py-0.5 rounded bg-elevated border border-hairline font-mono text-[11px] text-text-primary">
                        {alt}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <span className="font-mono text-[10px] text-text-secondary uppercase block mb-1">Learning Path Entry</span>
                  <div className="text-[11px] text-accent font-mono">
                    {inspectedTech.learningPathIn}
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-hairline flex items-center justify-between">
              {inspectedTech.websiteUrl && (
                <a
                  href={inspectedTech.websiteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-accent hover:underline flex items-center gap-1 font-mono"
                >
                  <span>Official Documentation</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
              <button
                onClick={() => setInspectedTech(null)}
                className="px-4 py-1.5 rounded-lg bg-accent text-white font-medium text-xs hover:bg-accent-hover transition-colors"
              >
                Close Inspector
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
