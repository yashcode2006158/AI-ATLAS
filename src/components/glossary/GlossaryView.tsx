import React, { useState } from 'react';
import { BookOpen, Search, Sparkles, Compass, ArrowRight, Layers, Tag } from 'lucide-react';
import { useContentStore } from '../../store/useContentStore';
import { GlossaryTerm } from '../../types/content';
import { useAppStore } from '../../store/useStore';

export const GlossaryView: React.FC = () => {
  const { glossary } = useContentStore();
  const { setView } = useAppStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeTerm, setActiveTerm] = useState<GlossaryTerm>(glossary[0]);

  const categories = [
    'all',
    'Fundamentals',
    'Architectures',
    'Generative AI',
    'LLMOps & Infra',
    'Safety & Governance',
  ];

  const filteredTerms = glossary.filter((term) => {
    const matchesCat = selectedCategory === 'all' || term.category === selectedCategory;
    const matchesQuery =
      term.term.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (term.acronym && term.acronym.toLowerCase().includes(searchQuery.toLowerCase())) ||
      term.simpleDefinition.toLowerCase().includes(searchQuery.toLowerCase()) ||
      term.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCat && matchesQuery;
  });

  return (
    <div className="space-y-6 text-xs">
      
      {/* Search & Category Filter Toolbar */}
      <div className="p-4 rounded-xl bg-surface border border-hairline flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2 flex-1 min-w-[280px]">
          <Search className="w-4 h-4 text-text-secondary" />
          <input
            type="text"
            placeholder="Search AI terms, acronyms, and formulas (e.g. 'RAG', 'LoRA', 'Self-Attention')..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-transparent text-xs text-text-primary placeholder:text-text-secondary focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto max-w-full pb-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded-md text-xs font-medium capitalize transition-all shrink-0 ${
                selectedCategory === cat
                  ? 'bg-accent text-white shadow-xs'
                  : 'bg-elevated/50 border border-hairline text-text-secondary hover:text-text-primary'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Alphabetical & Category List (5 Cols) */}
        <div className="lg:col-span-5 space-y-2 max-h-[70vh] overflow-y-auto pr-1">
          {filteredTerms.map((term) => {
            const isSelected = activeTerm.id === term.id;
            return (
              <div
                key={term.id}
                onClick={() => setActiveTerm(term)}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-accent/10 border-accent shadow-xs'
                    : 'bg-surface border-hairline hover:bg-elevated'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs text-text-primary">{term.term}</span>
                    {term.acronym && (
                      <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-surface border border-hairline text-accent">
                        {term.acronym}
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] font-mono text-text-secondary">
                    {term.category}
                  </span>
                </div>
                <p className="text-[11px] text-text-secondary line-clamp-2 mt-1 leading-snug">
                  {term.simpleDefinition}
                </p>
              </div>
            );
          })}
        </div>

        {/* Right Column: Deep Pedagogical Definition Card (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          {activeTerm && (
            <div className="p-6 rounded-2xl bg-surface border border-hairline shadow-sm space-y-5">
              
              {/* Header */}
              <div className="space-y-1.5 pb-3 border-b border-hairline">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded bg-accent/10 border border-accent/20 text-accent font-semibold">
                    {activeTerm.category}
                  </span>
                  {activeTerm.acronym && (
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-elevated border border-hairline text-text-primary">
                      Acronym: {activeTerm.acronym}
                    </span>
                  )}
                </div>
                <h2 className="text-lg font-bold font-display text-text-primary">
                  {activeTerm.term}
                </h2>
              </div>

              {/* Intuitive Definition */}
              <div className="space-y-1.5">
                <span className="font-mono text-[11px] uppercase tracking-wider text-accent font-semibold flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-accent" />
                  Intuitive Explanation
                </span>
                <p className="text-text-primary leading-relaxed bg-elevated/40 p-3.5 rounded-xl border border-hairline text-xs">
                  {activeTerm.simpleDefinition}
                </p>
              </div>

              {/* Plain Language Analogy */}
              <div className="space-y-1.5">
                <span className="font-mono text-[11px] uppercase tracking-wider text-text-secondary font-semibold">
                  Conceptual Analogy
                </span>
                <p className="text-text-primary italic leading-relaxed bg-elevated/40 p-3.5 rounded-xl border border-hairline text-xs">
                  "{activeTerm.analogy}"
                </p>
              </div>

              {/* Technical Rigorous Definition */}
              <div className="space-y-1.5">
                <span className="font-mono text-[11px] uppercase tracking-wider text-text-secondary font-semibold">
                  Technical & Mathematical Formulation
                </span>
                <p className="text-text-secondary leading-relaxed bg-base p-3.5 rounded-xl border border-hairline text-xs font-mono">
                  {activeTerm.technicalDefinition}
                </p>
              </div>

              {/* Cross-Link Into Roadmap Graph */}
              {activeTerm.relatedNodeId && (
                <div className="pt-2">
                  <button
                    onClick={() => setView('roadmap', { nodeId: activeTerm.relatedNodeId })}
                    className="w-full p-3 rounded-xl bg-accent/10 border border-accent/30 text-accent hover:bg-accent/20 transition-colors flex items-center justify-between text-xs font-semibold"
                  >
                    <div className="flex items-center gap-2">
                      <Compass className="w-4 h-4" />
                      <span>Explore this concept in the Living Roadmap Universe</span>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              {/* Related Terms */}
              <div className="pt-3 border-t border-hairline flex items-center justify-between text-xs">
                <span className="font-mono text-[10px] text-text-secondary uppercase">Related Concepts:</span>
                <div className="flex flex-wrap gap-1">
                  {activeTerm.relatedTerms.map((rt, i) => (
                    <span key={i} className="px-2 py-0.5 rounded bg-elevated border border-hairline text-[11px] font-mono text-text-primary">
                      {rt}
                    </span>
                  ))}
                </div>
              </div>

            </div>
          )}
        </div>

      </div>
    </div>
  );
};
