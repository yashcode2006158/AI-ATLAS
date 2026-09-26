import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Cpu,
  Terminal,
  Sparkles,
  Activity,
  Layers,
  Compass,
  BookOpen,
  Code,
  Lightbulb,
  ChevronDown,
  ArrowRight,
} from 'lucide-react';
import { useAppStore } from '../store/useStore';
import { RAGSimulator } from '../components/simulations/RAGSimulator';
import { AgentSimulator } from '../components/simulations/AgentSimulator';
import { LLMPlayground } from '../components/simulations/LLMPlayground';
import { NeuralNetVisualizer } from '../components/simulations/NeuralNetVisualizer';
import { TokenizerExplorer } from '../components/simulations/TokenizerExplorer';
import { VectorSpaceExplorer } from '../components/simulations/VectorSpaceExplorer';
import { CollapsibleSection } from '../components/ui/Toggle';
import { DocHeading, DocParagraph, DocList, DocNote, TryItSection, CodeBlock } from '../components/docs/Documentation';

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-60px' },
  transition: { duration: 0.5 },
};

interface SimSection {
  id: string;
  title: string;
  icon: React.ReactNode;
  desc: string;
  badge: string;
}

export const SimulationsView: React.FC = () => {
  const { activeSimulation, setSimulation, setView, learningMode } = useAppStore();
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    rag: true,
    agent: true,
    llm: true,
    neural: true,
    tokenizer: true,
    vector: true,
  });

  const simulationSections: SimSection[] = [
    {
      id: 'rag',
      title: 'RAG Simulator',
      icon: <Layers className="w-4 h-4" />,
      desc: 'Document chunking, semantic search, and citation synthesis. Build production-ready retrieval pipelines.',
      badge: 'Step 1',
    },
    {
      id: 'agent',
      title: 'Agent Simulator',
      icon: <Terminal className="w-4 h-4" />,
      desc: 'ReAct reasoning loops with tool execution. Watch an agent decompose goals and execute actions autonomously.',
      badge: 'Step 2',
    },
    {
      id: 'llm',
      title: 'LLM Playground',
      icon: <Sparkles className="w-4 h-4" />,
      desc: 'Experiment with temperature, top-p, and context windows. Observe latency and cost metrics in real-time.',
      badge: 'Step 3',
    },
    {
      id: 'neural',
      title: 'Neural Net Visualizer',
      icon: <Activity className="w-4 h-4" />,
      desc: 'Interactive decision boundaries and forward passes. Visualize how weights transform during training.',
      badge: 'Step 4',
    },
    {
      id: 'tokenizer',
      title: 'Tokenizer Explorer',
      icon: <Code className="w-4 h-4" />,
      desc: 'Inspect byte-pair encoding tokenization. See how text is broken into subword tokens with IDs.',
      badge: 'Step 5',
    },
    {
      id: 'vector',
      title: 'Vector Space Explorer',
      icon: <Compass className="w-4 h-4" />,
      desc: '2D manifold visualization of embeddings. Understand semantic clustering and similarity spaces.',
      badge: 'Step 6',
    },
  ];

  const simulations = [
    { id: 'rag', name: 'RAG Simulator', icon: <Layers className="w-3.5 h-3.5" />, desc: 'Chunking, Vector Search & Citations' },
    { id: 'agent', name: 'Agent Simulator', icon: <Terminal className="w-3.5 h-3.5" />, desc: 'ReAct Cycle & Tool Execution' },
    { id: 'llm', name: 'LLM Playground', icon: <Sparkles className="w-3.5 h-3.5" />, desc: 'Temperature, Latency & Streaming' },
    { id: 'neural', name: 'Neural Net Visualizer', icon: <Activity className="w-3.5 h-3.5" />, desc: 'Forward Pass & Decision Surface' },
    { id: 'tokenizer', name: 'Tokenizer Explorer', icon: <Cpu className="w-3.5 h-3.5" />, desc: 'BPE Segmentation & Token IDs' },
    { id: 'vector', name: 'Vector Space Explorer', icon: <Compass className="w-3.5 h-3.5" />, desc: '2D Latent Clustering & Distance' },
  ];

  const activeSim = simulationSections.find((s) => s.id === activeSimulation) || simulationSections[0];

  return (
    <div className="space-y-6">

      {/* Page Header with W3Schools-Style Explanation */}
      <motion.div {...fadeUp} className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent/10 border border-accent/20 text-accent text-xs font-mono">
            <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
            <span>Interactive Labs • 6 Simulators</span>
          </div>
        </div>
        <h2 className="text-3xl font-bold font-display text-text-primary">
          AI Simulation Laboratory
        </h2>
        <p className="text-base text-text-secondary max-w-3xl leading-relaxed">
          Hands-on simulations to understand AI fundamentals from first principles. Each lab demonstrates real mechanisms used in production systems.
        </p>
      </motion.div>

      {/* How to Use Section - W3Schools Style */}
      <motion.section {...fadeUp} className="rounded-2xl bg-surface/50 border border-hairline p-6">
        <div className="flex items-center gap-3 mb-4">
          <Lightbulb className="w-5 h-5 text-accent" />
          <h3 className="text-xl font-bold font-display text-text-primary">How to Use These Simulators</h3>
        </div>

        <div className="grid md:grid-cols-4 gap-4 text-sm">
          {[
            { step: '1', title: 'Select a Simulator', desc: 'Click any lab in the toolbar below to load its view' },
            { step: '2', title: 'Adjust Parameters', desc: 'Tweak hyperparameters and configuration options' },
            { step: '3', title: 'Run the Pipeline', desc: 'Click execute to observe the simulation in action' },
            { step: '4', title: 'Analyze Results', desc: 'Study outputs, metrics, and visualizations' },
          ].map((item, i) => (
            <motion.div
              key={item.step}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1, duration: 0.4 }}
              viewport={{ once: true }}
              className="p-4 rounded-xl bg-surface border border-hairline"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="w-7 h-7 rounded-full bg-accent text-white font-bold text-[11px] flex items-center justify-center">
                  {item.step}
                </div>
                <span className="font-semibold text-text-primary text-sm">{item.title}</span>
              </div>
              <p className="text-xs text-text-secondary leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Simulator Selector */}
      <motion.div {...fadeUp}>
        <div className="p-2 rounded-2xl bg-surface border border-hairline flex items-center gap-1.5 overflow-x-auto shadow-xs">
          {simulations.map((sim) => {
            const isActive = activeSimulation === sim.id;
            return (
              <button
                key={sim.id}
                onClick={() => {
                  setSimulation(sim.id as any);
                  setExpandedSections((prev) => ({ ...prev, [sim.id]: true }));
                }}
                className={`px-3.5 py-2 rounded-xl text-xs font-medium transition-all shrink-0 flex items-center gap-2 ${
                  isActive
                    ? 'bg-accent text-white shadow-sm'
                    : 'text-text-secondary hover:text-text-primary hover:bg-elevated'
                }`}
              >
                {sim.icon}
                <div className="text-left">
                  <div className="leading-tight font-medium">{sim.name}</div>
                </div>
              </button>
            );
          })}
        </div>
      </motion.div>

      {/* Conceptual Explanation Panel */}
      <motion.section {...fadeUp} className="rounded-2xl bg-surface border border-hairline p-6">
        <div className="flex items-center gap-3 mb-4">
          <Code className="w-5 h-5 text-accent" />
          <h3 className="text-xl font-bold font-display text-text-primary">Concept: {activeSim.title}</h3>
        </div>

        <div className="prose prose-sm max-w-none text-text-secondary">
          <p className="mb-4 leading-relaxed">{activeSim.desc}</p>

          <div className="bg-elevated/40 rounded-xl p-4 mb-4 border border-hairline">
            <h4 className="text-sm font-semibold text-text-primary mb-2 flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-accent/15 flex items-center justify-center text-accent">!</span>
              Key Learning Points
            </h4>
            <ul className="text-xs text-text-secondary space-y-1.5">
              {activeSimulation === 'rag' && (
                <>
                  <li>Chunking determines how information is split for retrieval efficiency</li>
                  <li>Embedding models map text to semantic vector spaces for similarity search</li>
                  <li>Cross-encoder rerankers improve ranking precision beyond basic similarity</li>
                  <li>Citations require tracking source documents through the entire pipeline</li>
                </>
              )}
              {activeSimulation === 'agent' && (
                <>
                  <li>ReAct combines reasoning with action-taking for tool-using agents</li>
                  <li>Observation loops enable agents to adapt based on tool responses</li>
                  <li>Prompt engineering guides the agent's reasoning style</li>
                  <li>Maximum iterations prevent infinite reasoning loops</li>
                </>
              )}
              {activeSimulation === 'llm' && (
                <>
                  <li>Temperature controls randomness vs. determinism in outputs</li>
                  <li>Top-p nucleus sampling balances creativity with coherence</li>
                  <li>Token limits constrain generation length and cost</li>
                  <li>Streaming provides lower latency for interactive experiences</li>
                </>
              )}
              {activeSimulation === 'neural' && (
                <>
                  <li>Activation functions determine neuron output patterns</li>
                  <li>Learning rate controls convergence speed and stability</li>
                  <li>Forward propagation computes outputs from input to prediction</li>
                  <li>Loss surfaces visualize optimization landscape for training</li>
                </>
              )}
              {activeSimulation === 'tokenizer' && (
                <>
                  <li>BPE merges frequent character sequences into subwords</li>
                  <li>Vocabulary size balances precision vs. model complexity</li>
                  <li>Byte-level encoding handles all Unicode characters</li>
                  <li>Token density affects prompt efficiency and cost</li>
                </>
              )}
              {activeSimulation === 'vector' && (
                <>
                  <li>Semantic embeddings capture meaning in numeric space</li>
                  <li>Cosine similarity measures vector proximity for retrieval</li>
                  <li>Dimensionality reduction preserves cluster structure</li>
                  <li>Latent projections reveal semantic relationships</li>
                </>
              )}
            </ul>
          </div>
        </div>
      </motion.section>

      {/* Active Simulator with Collapse Toggle */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="rounded-2xl bg-surface border border-hairline overflow-hidden">
          <button
            onClick={() => {
              setExpandedSections((prev) => ({ ...prev, [activeSimulation]: !prev[activeSimulation] }));
            }}
            className="w-full flex items-center justify-between p-4 bg-elevated/50 hover:bg-surface border-b border-hairline transition-colors"
          >
            <div className="flex items-center gap-3">
              <span className="text-accent">{activeSim.icon}</span>
              <span className="text-sm font-semibold text-text-primary">Interactive: {activeSim.title}</span>
              <span className="text-[10px] font-mono text-text-secondary bg-elevated/50 px-2 py-0.5 rounded">{activeSim.badge}</span>
            </div>
            <motion.div
              animate={{ rotate: expandedSections[activeSimulation] ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <ChevronDown className="w-4 h-4 text-text-secondary" />
            </motion.div>
          </button>

          <AnimatePresence initial={false}>
            {expandedSections[activeSimulation] && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                className="overflow-hidden"
              >
                <div className="p-4">
                  {activeSimulation === 'rag' && <RAGSimulator />}
                  {activeSimulation === 'agent' && <AgentSimulator />}
                  {activeSimulation === 'llm' && <LLMPlayground />}
                  {activeSimulation === 'neural' && <NeuralNetVisualizer />}
                  {activeSimulation === 'tokenizer' && <TokenizerExplorer />}
                  {activeSimulation === 'vector' && <VectorSpaceExplorer />}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Bottom Navigation Buttons */}
      <motion.div {...fadeUp} className="flex flex-wrap items-center justify-center gap-3 pt-4 pb-8">
        <button
          onClick={() => setView('roadmap')}
          className="px-6 py-3 rounded-xl bg-surface border border-hairline text-text-primary font-medium text-sm transition-colors flex items-center gap-2 premium-shadow hover:border-accent/40"
        >
          <Layers className="w-4 h-4 text-accent" />
          <span>Explore Knowledge Nodes in Roadmap</span>
          <ArrowRight className="w-4 h-4" />
        </button>
        <button
          onClick={() => setView('dashboard')}
          className="px-6 py-3 rounded-xl bg-accent text-white font-semibold text-sm hover:bg-accent-hover transition-all shadow-sm shadow-accent/20 flex items-center gap-2"
        >
          <Activity className="w-4 h-4" />
          <span>Open Full AI Training OS</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </motion.div>

    </div>
  );
};