import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Layers,
  Cpu,
  Zap,
  Play,
  Pause,
  RotateCw,
  Database,
  Terminal,
  Shield,
  Activity,
  Sparkles,
  ArrowRight,
  Eye,
  Sliders,
} from 'lucide-react';
import { useAppStore } from '../../store/useStore';

interface IsometricStage {
  id: string;
  name: string;
  subtitle: string;
  tag: string;
  color: string;
  accent: string;
  metrics: { label: string; value: string }[];
  description: string;
}

export const IsometricAIPipeline: React.FC<{ className?: string }> = ({ className = '' }) => {
  const { learningMode, setView, setSimulation } = useAppStore();
  const [activeStage, setActiveStage] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [rotationAngle, setRotationAngle] = useState<number>(0);

  const stages: IsometricStage[] = [
    {
      id: 'ingestion',
      name: '01. Ingestion & Vectorization',
      subtitle: 'Document Chunking & Dense Embeddings',
      tag: 'Dense Retrieval',
      color: '#38BDF8',
      accent: 'from-sky-500/20 to-sky-500/5',
      metrics: [
        { label: 'Chunk Size', value: '512 tokens' },
        { label: 'Overlap', value: '15%' },
        { label: 'Embedding Dim', value: '1536 (FP16)' },
        { label: 'Indexing Time', value: '1.2ms / doc' },
      ],
      description:
        learningMode === 'beginner'
          ? 'Documents are sliced into bite-sized sentences and converted into coordinate lists (vectors) so the AI can understand similarity.'
          : learningMode === 'executive'
          ? 'Transforms enterprise silos into searchable semantic embeddings, reducing search latency and eliminating manual tagging costs.'
          : 'High-dimensional embeddings generated via bi-encoder models with HNSW indexing for sub-millisecond approximate nearest neighbor search.',
    },
    {
      id: 'attention',
      name: '02. Transformer & Attention Core',
      subtitle: 'Multi-Head Attention & KV Cache',
      tag: 'Neural Engine',
      color: '#818CF8',
      accent: 'from-indigo-500/20 to-indigo-500/5',
      metrics: [
        { label: 'Attention Heads', value: '32 Heads' },
        { label: 'Context Window', value: '128k tokens' },
        { label: 'KV Cache Hit', value: '94.2%' },
        { label: 'GEMM Throughput', value: '312 TFLOPS' },
      ],
      description:
        learningMode === 'beginner'
          ? 'The attention mechanism lets the AI look at all words simultaneously, highlighting which words relate to each other.'
          : learningMode === 'executive'
          ? 'Self-attention scales compute across GPU clusters to process million-token enterprise context with minimal overhead.'
          : 'Scaled dot-product attention computed via FlashAttention-3 kernels, maximizing GPU Tensor Core utilization and minimizing HBM memory roundtrips.',
    },
    {
      id: 'agent',
      name: '03. Autonomous Agent Loop',
      subtitle: 'ReAct Cycle & Tool Invocation',
      tag: 'Agentic Cognition',
      color: '#A855F7',
      accent: 'from-purple-500/20 to-purple-500/5',
      metrics: [
        { label: 'Reasoning Steps', value: '3.4 avg / task' },
        { label: 'Tool Success Rate', value: '99.1%' },
        { label: 'Sandbox Isolation', value: 'gVisor Kernel' },
        { label: 'Self-Correction', value: 'Active' },
      ],
      description:
        learningMode === 'beginner'
          ? 'The AI thinks step-by-step, writes temporary notes, uses calculators or search engines, and fixes its own mistakes.'
          : learningMode === 'executive'
          ? 'Autonomous workflow agents automate multi-step operational tasks with enterprise permission guardrails and audit logging.'
          : 'Cyclic DAG state machines implementing ReAct prompt traces, executing sandboxed function calls and reflection prompts.',
    },
    {
      id: 'serving',
      name: '04. Production LLMOps & Serving',
      subtitle: 'vLLM Continuous Batching & Guardrails',
      tag: 'Enterprise Scale',
      color: '#F59E0B',
      accent: 'from-amber-500/20 to-amber-500/5',
      metrics: [
        { label: 'TTFT (First Token)', value: '18ms' },
        { label: 'Generation Speed', value: '115 tok/s' },
        { label: 'PagedAttention', value: 'Zero Fragmentation' },
        { label: 'Safety Guardrails', value: 'LlamaGuard 3' },
      ],
      description:
        learningMode === 'beginner'
          ? 'High-speed delivery systems ensure millions of users get instant responses safely with guardrails against inappropriate answers.'
          : learningMode === 'executive'
          ? 'Optimized GPU batching cuts infrastructure cost by 68% while upholding 99.99% availability SLAs.'
          : 'Distributed model inference with Tensor Parallelism (vLLM), speculative decoding, and real-time Langfuse observability traces.',
    },
  ];

  // Auto-cycle stages if playing
  useEffect(() => {
    if (!isPlaying) return;
    const timer = setInterval(() => {
      setActiveStage((prev) => (prev + 1) % stages.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [isPlaying, stages.length]);

  const currentStage = stages[activeStage];

  return (
    <div className={`rounded-3xl border border-hairline bg-surface/80 glass-panel overflow-hidden shadow-xl ${className}`}>
      {/* Top Header Bar */}
      <div className="p-5 border-b border-hairline bg-elevated/30 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-accent/15 border border-accent/25 flex items-center justify-center text-accent">
            <Sparkles className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-accent px-2 py-0.5 rounded bg-accent/10">
                3D Isometric Visualizer
              </span>
              <span className="text-[10px] font-mono text-text-secondary">
                Live Data Stream • 60 FPS
              </span>
            </div>
            <h3 className="text-base font-bold font-display text-text-primary mt-0.5">
              Interactive AI Systems Pipeline Architecture
            </h3>
          </div>
        </div>

        {/* Stage Tabs */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-surface border border-hairline overflow-x-auto">
          {stages.map((stage, idx) => {
            const isActive = activeStage === idx;
            return (
              <button
                key={stage.id}
                onClick={() => {
                  setActiveStage(idx);
                  setIsPlaying(false);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 shrink-0 ${
                  isActive
                    ? 'bg-accent text-white shadow-xs font-semibold'
                    : 'text-text-secondary hover:text-text-primary hover:bg-elevated'
                }`}
              >
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: stage.color }}
                />
                <span>Stage 0{idx + 1}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Isometric Visual Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
        {/* Isometric SVG 3D Canvas (7 Cols) */}
        <div className="lg:col-span-7 relative min-h-[380px] sm:min-h-[440px] flex items-center justify-center p-6 bg-gradient-to-br from-base via-surface to-elevated/40 overflow-hidden select-none">
          {/* Animated Background Grid Pattern */}
          <div
            className="absolute inset-0 opacity-40 pointer-events-none"
            style={{
              backgroundImage: `radial-gradient(circle at 1px 1px, var(--border-hairline) 1.5px, transparent 0)`,
              backgroundSize: '24px 24px',
            }}
          />

          {/* Interactive Isometric 3D SVG Stage */}
          <svg
            viewBox="0 0 600 420"
            className="w-full max-w-[540px] h-auto transition-transform duration-700 ease-out"
            style={{ transform: `rotate(${rotationAngle}deg)` }}
          >
            <defs>
              <linearGradient id="isoBeamGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.9" />
                <stop offset="50%" stopColor="#818CF8" stopOpacity="1" />
                <stop offset="100%" stopColor="#A855F7" stopOpacity="0.9" />
              </linearGradient>
              <filter id="neonGlow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="4" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Stage 1: Isometric Ingestion Platform (Bottom-Left) */}
            <g
              onClick={() => setActiveStage(0)}
              className="cursor-pointer transition-all hover:opacity-100"
              opacity={activeStage === 0 ? 1 : 0.45}
            >
              {/* Isometric Base Plate */}
              <polygon
                points="120,240 220,185 120,130 20,185"
                fill={activeStage === 0 ? 'rgba(56, 189, 248, 0.18)' : 'rgba(255, 255, 255, 0.04)'}
                stroke="#38BDF8"
                strokeWidth={activeStage === 0 ? 2 : 1}
              />
              {/* Vertical Pillars / Data Cylinders */}
              <polygon points="60,165 80,155 80,115 60,125" fill="#38BDF8" opacity="0.6" />
              <polygon points="80,155 100,165 100,125 80,115" fill="#38BDF8" opacity="0.9" />
              <polygon points="60,125 80,115 100,125 80,135" fill="#38BDF8" />

              <polygon points="120,195 140,185 140,145 120,155" fill="#38BDF8" opacity="0.6" />
              <polygon points="140,185 160,195 160,155 140,145" fill="#38BDF8" opacity="0.9" />
              <polygon points="120,155 140,145 160,155 140,165" fill="#38BDF8" />

              <text x="60" y="220" fill="#38BDF8" fontSize="11" fontFamily="JetBrains Mono" fontWeight="bold">
                01. INGEST
              </text>
            </g>

            {/* Connecting Isometric Conduit 1 -> 2 */}
            <path
              d="M 170 160 Q 230 140 280 160"
              fill="none"
              stroke="url(#isoBeamGrad)"
              strokeWidth="2.5"
              strokeDasharray="4 4"
            >
              <animate attributeName="stroke-dashoffset" from="30" to="0" dur="1.5s" repeatCount="indefinite" />
            </path>
            <circle r="4" fill="#38BDF8" filter="url(#neonGlow)">
              <animateMotion path="M 170 160 Q 230 140 280 160" dur="2s" repeatCount="indefinite" />
            </circle>

            {/* Stage 2: Isometric Transformer Attention Matrix (Center) */}
            <g
              onClick={() => setActiveStage(1)}
              className="cursor-pointer transition-all hover:opacity-100"
              opacity={activeStage === 1 ? 1 : 0.45}
            >
              {/* Isometric Base Plate */}
              <polygon
                points="300,210 400,155 300,100 200,155"
                fill={activeStage === 1 ? 'rgba(129, 140, 248, 0.22)' : 'rgba(255, 255, 255, 0.04)'}
                stroke="#818CF8"
                strokeWidth={activeStage === 1 ? 2.5 : 1}
              />
              {/* 3D Transformer Stack Slices */}
              <polygon points="260,140 300,120 340,140 300,160" fill="#818CF8" opacity="0.9" />
              <polygon points="260,110 300,90 340,110 300,130" fill="#818CF8" opacity="0.75" />
              <polygon points="260,80 300,60 340,80 300,100" fill="#818CF8" filter="url(#neonGlow)" />

              {/* Floating Attention Rays */}
              <line x1="300" y1="60" x2="300" y2="40" stroke="#818CF8" strokeWidth="2" strokeDasharray="2 2" />
              <circle cx="300" cy="36" r="3.5" fill="#818CF8" />

              <text x="255" y="195" fill="#818CF8" fontSize="11" fontFamily="JetBrains Mono" fontWeight="bold">
                02. ATTENTION
              </text>
            </g>

            {/* Connecting Isometric Conduit 2 -> 3 */}
            <path
              d="M 350 140 Q 410 120 460 170"
              fill="none"
              stroke="url(#isoBeamGrad)"
              strokeWidth="2.5"
              strokeDasharray="4 4"
            >
              <animate attributeName="stroke-dashoffset" from="30" to="0" dur="1.5s" repeatCount="indefinite" />
            </path>
            <circle r="4" fill="#A855F7" filter="url(#neonGlow)">
              <animateMotion path="M 350 140 Q 410 120 460 170" dur="2s" repeatCount="indefinite" />
            </circle>

            {/* Stage 3: Isometric Autonomous Agent (Right) */}
            <g
              onClick={() => setActiveStage(2)}
              className="cursor-pointer transition-all hover:opacity-100"
              opacity={activeStage === 2 ? 1 : 0.45}
            >
              <polygon
                points="480,260 580,205 480,150 380,205"
                fill={activeStage === 2 ? 'rgba(168, 85, 247, 0.22)' : 'rgba(255, 255, 255, 0.04)'}
                stroke="#A855F7"
                strokeWidth={activeStage === 2 ? 2.5 : 1}
              />
              {/* Agent Hex Core & Satellite Tools */}
              <polygon points="450,195 480,180 510,195 480,210" fill="#A855F7" />
              <polygon points="420,180 440,170 460,180 440,190" fill="#A855F7" opacity="0.6" />
              <polygon points="500,180 520,170 540,180 520,190" fill="#A855F7" opacity="0.6" />

              <text x="440" y="245" fill="#A855F7" fontSize="11" fontFamily="JetBrains Mono" fontWeight="bold">
                03. AGENT
              </text>
            </g>

            {/* Stage 4: Isometric Production Serving & LLMOps (Bottom-Center) */}
            <g
              onClick={() => setActiveStage(3)}
              className="cursor-pointer transition-all hover:opacity-100"
              opacity={activeStage === 3 ? 1 : 0.45}
            >
              <polygon
                points="300,380 420,315 300,250 180,315"
                fill={activeStage === 3 ? 'rgba(245, 158, 11, 0.22)' : 'rgba(255, 255, 255, 0.04)'}
                stroke="#F59E0B"
                strokeWidth={activeStage === 3 ? 2.5 : 1}
              />
              {/* 3D Server Blade Racks */}
              <polygon points="260,290 280,280 340,310 320,320" fill="#F59E0B" opacity="0.8" />
              <polygon points="260,310 280,300 340,330 320,340" fill="#F59E0B" opacity="0.9" />

              <text x="245" y="365" fill="#F59E0B" fontSize="11" fontFamily="JetBrains Mono" fontWeight="bold">
                04. PRODUCTION SERVING
              </text>
            </g>
          </svg>

          {/* Floating Controls Bar */}
          <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between pointer-events-none">
            <div className="flex items-center gap-1.5 p-1 rounded-xl bg-surface/90 border border-hairline shadow-lg pointer-events-auto backdrop-blur-md">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="p-1.5 rounded-lg text-text-secondary hover:text-text-primary hover:bg-elevated transition-colors"
                title={isPlaying ? 'Pause Auto-cycle' : 'Play Auto-cycle'}
              >
                {isPlaying ? <Pause className="w-3.5 h-3.5 text-accent" /> : <Play className="w-3.5 h-3.5" />}
              </button>
              <button
                onClick={() => setRotationAngle((a) => (a + 45) % 360)}
                className="p-1.5 rounded-lg text-text-secondary hover:text-text-primary hover:bg-elevated transition-colors"
                title="Rotate Isometric View"
              >
                <RotateCw className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="px-3 py-1 rounded-xl bg-surface/90 border border-hairline text-[10px] font-mono text-text-secondary shadow-lg pointer-events-auto backdrop-blur-md">
              <span>Stage {activeStage + 1} of {stages.length} Active</span>
            </div>
          </div>
        </div>

        {/* Right Stage Inspector (5 Cols) */}
        <div className="lg:col-span-5 p-6 border-t lg:border-t-0 lg:border-l border-hairline bg-surface/60 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span
                className="text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-md"
                style={{
                  backgroundColor: `${currentStage.color}18`,
                  color: currentStage.color,
                  border: `1px solid ${currentStage.color}30`,
                }}
              >
                {currentStage.tag}
              </span>
              <span className="text-[11px] font-mono text-text-secondary">
                Mode: <span className="capitalize text-accent font-semibold">{learningMode}</span>
              </span>
            </div>

            <div>
              <h4 className="text-lg font-bold font-display text-text-primary">
                {currentStage.name}
              </h4>
              <p className="text-xs text-text-secondary mt-0.5 font-medium">
                {currentStage.subtitle}
              </p>
            </div>

            <p className="text-xs text-text-primary leading-relaxed bg-elevated/40 p-3.5 rounded-xl border border-hairline">
              {currentStage.description}
            </p>

            {/* Live Telemetry / Metrics Grid */}
            <div className="space-y-2">
              <span className="text-[10px] font-mono uppercase tracking-wider text-text-secondary font-semibold">
                Architecture Telemetry
              </span>
              <div className="grid grid-cols-2 gap-2">
                {currentStage.metrics.map((m) => (
                  <div
                    key={m.label}
                    className="p-2.5 rounded-xl bg-surface border border-hairline space-y-0.5"
                  >
                    <div className="text-[10px] text-text-secondary font-mono">{m.label}</div>
                    <div className="text-xs font-bold font-mono text-text-primary">{m.value}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="pt-4 border-t border-hairline flex items-center justify-between gap-3">
            <button
              onClick={() => {
                if (currentStage.id === 'ingestion') setSimulation('rag');
                if (currentStage.id === 'attention') setSimulation('neural');
                if (currentStage.id === 'agent') setSimulation('agent');
                if (currentStage.id === 'serving') setSimulation('llm');
                setView('simulations');
              }}
              className="flex-1 py-2.5 px-4 rounded-xl bg-accent text-white font-semibold text-xs hover:bg-accent-hover transition-all shadow-sm shadow-accent/20 flex items-center justify-center gap-2"
            >
              <Play className="w-3.5 h-3.5 fill-white" />
              <span>Launch Live Simulator</span>
            </button>

            <button
              onClick={() => setView('roadmap')}
              className="py-2.5 px-3.5 rounded-xl bg-elevated border border-hairline hover:bg-surface text-text-primary text-xs font-medium transition-colors flex items-center gap-1.5"
            >
              <span>Inspect Roadmap</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
