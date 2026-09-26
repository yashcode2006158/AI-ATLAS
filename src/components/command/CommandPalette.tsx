import React, { useState, useEffect, useRef } from 'react';
import {
  Search,
  Compass,
  Cpu,
  Layers,
  Terminal,
  Briefcase,
  Award,
  BookOpen,
  ArrowRight,
  Sparkles,
  X
} from 'lucide-react';
import { useAppStore, AppView } from '../../store/useStore';
import { useContentStore } from '../../store/useContentStore';
import { INITIAL_CAREER_PATHS } from '../../data/careers';
import { ENTERPRISE_ARCHITECTURES } from '../../data/enterpriseArchitectures';

interface SearchResult {
  id: string;
  title: string;
  category: string;
  icon: React.ReactNode;
  subtitle: string;
  action: () => void;
  keywords: string[];
}

export const CommandPalette: React.FC = () => {
  const { isCommandPaletteOpen, setCommandPaletteOpen, setView } = useAppStore();
  const { nodes, technologies, certifications, glossary, projects } = useContentStore();

  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  // Keyboard shortcut listener: Cmd+K / Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setCommandPaletteOpen(!isCommandPaletteOpen);
      }
      if (e.key === 'Escape' && isCommandPaletteOpen) {
        setCommandPaletteOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isCommandPaletteOpen, setCommandPaletteOpen]);

  useEffect(() => {
    if (isCommandPaletteOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setSelectedIndex(0);
    } else {
      setQuery('');
    }
  }, [isCommandPaletteOpen]);

  // Aggregate all searchable items
  const allItems: SearchResult[] = [
    // Simulations
    {
      id: 'sim-rag',
      title: 'RAG Pipeline Simulator',
      category: 'Simulations',
      icon: <Cpu className="w-4 h-4 text-accent" />,
      subtitle: 'Upload docs, chunk, embed, vector search, rerank, and synthesize cited answers',
      keywords: ['rag', 'retrieval', 'chunk', 'vector', 'search', 'embeddings', 'citations'],
      action: () => setView('simulations', { sim: 'rag' }),
    },
    {
      id: 'sim-agent',
      title: 'Autonomous AI Agent Simulator',
      category: 'Simulations',
      icon: <Cpu className="w-4 h-4 text-accent" />,
      subtitle: 'Directed cyclic reasoning loop: Goal -> Planning -> Tool Selection -> Observation',
      keywords: ['agent', 'react', 'tools', 'autonomous', 'loop', 'planning', 'memory'],
      action: () => setView('simulations', { sim: 'agent' }),
    },
    {
      id: 'sim-llm',
      title: 'LLM Generation Playground',
      category: 'Simulations',
      icon: <Cpu className="w-4 h-4 text-accent" />,
      subtitle: 'Adjust temperature, context window, model family, and stream generation in real time',
      keywords: ['llm', 'playground', 'temperature', 'tokens', 'streaming', 'models', 'prompt'],
      action: () => setView('simulations', { sim: 'llm' }),
    },
    {
      id: 'sim-neural',
      title: 'Neural Network Visualizer',
      category: 'Simulations',
      icon: <Cpu className="w-4 h-4 text-accent" />,
      subtitle: 'Forward pass animation, activation functions, learning rate, and decision boundary convergence',
      keywords: ['neural', 'backprop', 'relu', 'gelu', 'mlp', 'weights', 'loss'],
      action: () => setView('simulations', { sim: 'neural' }),
    },
    {
      id: 'sim-tokenizer',
      title: 'Tokenization & BPE Explorer',
      category: 'Simulations',
      icon: <Cpu className="w-4 h-4 text-accent" />,
      subtitle: 'Live byte-pair encoding token breakdown, token IDs, and 8D embedding vectors',
      keywords: ['tokenizer', 'bpe', 'tokens', 'bytes', 'encoding', 'vocabulary'],
      action: () => setView('simulations', { sim: 'tokenizer' }),
    },
    {
      id: 'sim-vector',
      title: 'Vector Space Explorer',
      category: 'Simulations',
      icon: <Cpu className="w-4 h-4 text-accent" />,
      subtitle: 'Interactive 2D semantic embedding projection and cosine similarity neighbors',
      keywords: ['vector', 'space', 'cosine', 'similarity', 'cluster', 'embeddings', 'distance'],
      action: () => setView('simulations', { sim: 'vector' }),
    },

    // Roadmap Nodes
    ...nodes.map((node) => ({
      id: `node-${node.id}`,
      title: node.title,
      category: 'Roadmap Nodes',
      icon: <Compass className="w-4 h-4 text-info" />,
      subtitle: `${node.difficulty} • ${node.estimatedHours}h • ${node.shortDesc}`,
      keywords: [node.title, node.layerId, ...node.tags, node.shortDesc],
      action: () => setView('roadmap', { nodeId: node.id }),
    })),

    // Enterprise Architectures
    ...ENTERPRISE_ARCHITECTURES.map((arch) => ({
      id: `arch-${arch.id}`,
      title: arch.title,
      category: 'Enterprise Blueprints',
      icon: <Layers className="w-4 h-4 text-success" />,
      subtitle: `${arch.tagline} • ${arch.keyMetrics.latency}`,
      keywords: [arch.title, arch.category, arch.tagline, 'rag', 'architecture', 'enterprise'],
      action: () => setView('enterprise', { archId: arch.id }),
    })),

    // Projects
    ...projects.map((proj) => ({
      id: `proj-${proj.id}`,
      title: proj.title,
      category: 'Projects',
      icon: <Terminal className="w-4 h-4 text-warning" />,
      subtitle: `${proj.tier} Tier • ${proj.shortDesc}`,
      keywords: [proj.title, proj.tier, ...proj.technologies, proj.problemStatement],
      action: () => setView('projects', { projId: proj.id }),
    })),

    // Careers
    ...INITIAL_CAREER_PATHS.map((c) => ({
      id: `career-${c.id}`,
      title: c.title,
      category: 'Careers',
      icon: <Briefcase className="w-4 h-4 text-text-secondary" />,
      subtitle: `${c.level} • ${c.averageSalaryUs}`,
      keywords: [c.title, c.description, ...c.primaryResponsibilities],
      action: () => setView('careers'),
    })),

    // Certifications
    ...certifications.map((cert) => ({
      id: `cert-${cert.id}`,
      title: cert.title,
      category: 'Certifications',
      icon: <Award className="w-4 h-4 text-accent" />,
      subtitle: `${cert.provider} • ${cert.difficulty} • ${cert.cost}`,
      keywords: [cert.title, cert.provider, cert.careerRelevance, ...cert.skillsTested],
      action: () => setView('certifications'),
    })),

    // Glossary
    ...glossary.map((g) => ({
      id: `glossary-${g.id}`,
      title: g.acronym ? `${g.term} (${g.acronym})` : g.term,
      category: 'Glossary',
      icon: <BookOpen className="w-4 h-4 text-text-secondary" />,
      subtitle: g.simpleDefinition,
      keywords: [g.term, g.acronym || '', g.category, ...g.relatedTerms, ...g.tags],
      action: () => setView('glossary'),
    })),
  ];

  // Multi-attribute semantic filter & ranking
  const filteredResults = query.trim()
    ? allItems.filter((item) => {
        const q = query.toLowerCase();
        const inTitle = item.title.toLowerCase().includes(q);
        const inSubtitle = item.subtitle.toLowerCase().includes(q);
        const inKeywords = item.keywords.some((k) => k.toLowerCase().includes(q));
        return inTitle || inSubtitle || inKeywords;
      }).slice(0, 8)
    : allItems.slice(0, 6);

  const handleSelect = (result: SearchResult) => {
    result.action();
    setCommandPaletteOpen(false);
  };

  const handleKeyDownList = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % filteredResults.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filteredResults.length) % filteredResults.length);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredResults[selectedIndex]) {
        handleSelect(filteredResults[selectedIndex]);
      }
    }
  };

  if (!isCommandPaletteOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-100">
      <div
        className="w-full max-w-2xl rounded-xl bg-surface border border-hairline shadow-2xl overflow-hidden glass-panel"
        onKeyDown={handleKeyDownList}
      >
        {/* Search Input */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-hairline bg-surface/80">
          <Search className="w-4 h-4 text-text-secondary shrink-0" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search concepts, RAG, agents, models, certs, architectures (e.g. 'RAG' or 'LoRA')..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            className="w-full bg-transparent text-sm text-text-primary placeholder:text-text-secondary focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-text-secondary hover:text-text-primary p-0.5"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
          <kbd className="hidden sm:inline-block text-[10px] font-mono px-1.5 py-0.5 rounded bg-elevated border border-hairline text-text-secondary">
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <div className="max-h-96 overflow-y-auto p-2 space-y-1">
          {filteredResults.length === 0 ? (
            <div className="py-8 text-center text-xs text-text-secondary">
              No matching nodes, architectures, or simulations found for "{query}"
            </div>
          ) : (
            filteredResults.map((item, idx) => {
              const isSelected = idx === selectedIndex;
              return (
                <button
                  key={item.id}
                  onClick={() => handleSelect(item)}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`w-full text-left p-2.5 rounded-lg flex items-center justify-between gap-3 transition-colors ${
                    isSelected
                      ? 'bg-accent/10 border border-accent/30 text-text-primary'
                      : 'hover:bg-elevated text-text-primary border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-3 overflow-hidden">
                    <div className={`p-1.5 rounded-md bg-elevated border border-hairline shrink-0 ${isSelected ? 'text-accent' : 'text-text-secondary'}`}>
                      {item.icon}
                    </div>
                    <div className="overflow-hidden">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold truncate">{item.title}</span>
                        <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-elevated border border-hairline text-text-secondary shrink-0">
                          {item.category}
                        </span>
                      </div>
                      <p className="text-[11px] text-text-secondary truncate mt-0.5">
                        {item.subtitle}
                      </p>
                    </div>
                  </div>
                  <ArrowRight className={`w-3.5 h-3.5 shrink-0 transition-transform ${isSelected ? 'text-accent translate-x-0.5' : 'text-text-secondary/50'}`} />
                </button>
              );
            })
          )}
        </div>

        {/* Quick Footer Instructions */}
        <div className="px-4 py-2 bg-elevated/50 border-t border-hairline flex items-center justify-between text-[10px] font-mono text-text-secondary">
          <div className="flex items-center gap-3">
            <span>↑↓ to navigate</span>
            <span>↵ to select</span>
          </div>
          <span>NexusAI Knowledge Graph Index</span>
        </div>
      </div>
    </div>
  );
};
