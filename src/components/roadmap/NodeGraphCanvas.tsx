import React, { useState, useRef, useMemo } from 'react';
import {
  ZoomIn,
  ZoomOut,
  Maximize2,
  CheckCircle2,
  Lock,
  Play,
  Compass,
  Sparkles,
  Workflow,
  List,
  Search,
  ArrowRight,
  Activity,
  Clock,
  Zap,
  BookOpen,
  Layers,
  Cpu,
  ChevronRight,
  HelpCircle,
  ExternalLink,
} from 'lucide-react';
import { RoadmapNode, RoadmapLayerId } from '../../types/roadmap';
import { ROADMAP_LAYERS } from '../../data/roadmapLayers';
import { useContentStore } from '../../store/useContentStore';
import { useUserStore } from '../../store/useUserStore';
import { useAppStore } from '../../store/useStore';
import { NodeDetailsModal } from './NodeDetailsModal';

export const NodeGraphCanvas: React.FC = () => {
  const { nodes } = useContentStore();
  const { user, completeNode } = useUserStore();
  const { setView, setSimulation } = useAppStore();

  // Mode: n8n visual workflow vs W3Schools curriculum list
  const [viewMode, setViewMode] = useState<'canvas' | 'curriculum'>('canvas');
  const [selectedNode, setSelectedNode] = useState<RoadmapNode | null>(null);
  const [selectedLayer, setSelectedLayer] = useState<RoadmapLayerId | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'in_progress' | 'available' | 'completed' | 'lab'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Canvas pan & zoom state
  const [zoom, setZoom] = useState(0.9);
  const [pan, setPan] = useState({ x: 60, y: 50 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const containerRef = useRef<HTMLDivElement>(null);

  // Status helper
  const getNodeStatus = (node: RoadmapNode): 'locked' | 'available' | 'in_progress' | 'completed' => {
    if (user.completedNodeIds.includes(node.id)) return 'completed';
    if (user.inProgressNodeIds.includes(node.id)) return 'in_progress';
    const prereqsMet = node.prerequisites.every((prereqId) => user.completedNodeIds.includes(prereqId));
    if (prereqsMet || node.prerequisites.length === 0) return 'available';
    return 'locked';
  };

  // Immediate next recommended node for user
  const nextRecommendedNode = useMemo(() => {
    return (
      nodes.find((n) => user.inProgressNodeIds.includes(n.id)) ||
      nodes.find((n) => getNodeStatus(n) === 'available') ||
      nodes[0]
    );
  }, [nodes, user.inProgressNodeIds, user.completedNodeIds]);

  // Filtered nodes
  const filteredNodes = useMemo(() => {
    return nodes.filter((node) => {
      const matchesLayer = selectedLayer === 'all' || node.layerId === selectedLayer;
      const status = getNodeStatus(node);
      const matchesStatus =
        statusFilter === 'all' ||
        (statusFilter === 'in_progress' && status === 'in_progress') ||
        (statusFilter === 'completed' && status === 'completed') ||
        (statusFilter === 'available' && status === 'available') ||
        (statusFilter === 'lab' && Boolean(node.simulationType));
      const matchesSearch =
        searchQuery.trim() === '' ||
        node.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        node.shortDesc.toLowerCase().includes(searchQuery.toLowerCase()) ||
        node.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesLayer && matchesStatus && matchesSearch;
    });
  }, [nodes, selectedLayer, statusFilter, searchQuery, user]);

  // Clean, structured n8n workflow positions (columnar or sequential)
  const computedNodesWithPos = useMemo(() => {
    // If a specific stage is selected, lay it out in a clean linear sequence (Stage view)
    if (selectedLayer !== 'all') {
      const stageNodes = filteredNodes;
      return stageNodes.map((node, idx) => {
        const col = idx % 3;
        const row = Math.floor(idx / 3);
        return {
          ...node,
          canvasPos: {
            x: 80 + col * 360,
            y: 80 + row * 220,
          },
        };
      });
    }

    // Full Pipeline (All 4 stages): 4 clean columns matching n8n pipeline architecture
    const layerIndices: Partial<Record<RoadmapLayerId, number>> = {
      foundations: 0,
      'ai-fundamentals': 0,
      'ai-core': 1,
      'modern-ai': 1,
      'generative-ai': 2,
      'ai-engineering': 2,
      production: 3,
      'enterprise-ai': 3,
      'advanced-ai': 3,
    };

    const layerCounters: Record<string, number> = {
      foundations: 0,
      'ai-core': 0,
      'generative-ai': 0,
      production: 0,
    };

    return filteredNodes.map((node) => {
      const col = layerIndices[node.layerId] ?? 0;
      const row = layerCounters[node.layerId] || 0;
      layerCounters[node.layerId] = row + 1;

      return {
        ...node,
        canvasPos: {
          x: 60 + col * 400,
          y: 70 + row * 200,
        },
      };
    });
  }, [filteredNodes, selectedLayer]);

  // Connectors between nodes
  const edges = useMemo(() => {
    const edgeList: {
      fromNode: (typeof computedNodesWithPos)[0];
      toNode: (typeof computedNodesWithPos)[0];
      isActive: boolean;
      isCompleted: boolean;
    }[] = [];

    const nodeMap = new Map(computedNodesWithPos.map((n) => [n.id, n]));

    computedNodesWithPos.forEach((fromNode) => {
      fromNode.nextNodes.forEach((nextId) => {
        const toNode = nodeMap.get(nextId);
        if (toNode) {
          const isFromCompleted = user.completedNodeIds.includes(fromNode.id);
          const isToCompleted = user.completedNodeIds.includes(toNode.id);
          const isToActive = user.inProgressNodeIds.includes(toNode.id);
          edgeList.push({
            fromNode,
            toNode,
            isActive: isFromCompleted && isToActive,
            isCompleted: isFromCompleted && isToCompleted,
          });
        }
      });
    });

    return edgeList;
  }, [computedNodesWithPos, user]);

  // Drag pan handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPan({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const factor = e.deltaY < 0 ? 1.08 : 0.92;
    setZoom((prev) => Math.min(Math.max(0.45, prev * factor), 1.6));
  };

  const resetView = () => {
    setZoom(0.88);
    setPan({ x: 50, y: 50 });
  };

  const layerAccentMap: Partial<Record<RoadmapLayerId, { color: string; border: string; bg: string; text: string }>> = {
    foundations: { color: '#38BDF8', border: 'border-sky-500/30', bg: 'bg-sky-500/10', text: 'text-sky-400' },
    'ai-fundamentals': { color: '#38BDF8', border: 'border-sky-500/30', bg: 'bg-sky-500/10', text: 'text-sky-400' },
    'ai-core': { color: '#818CF8', border: 'border-indigo-500/30', bg: 'bg-indigo-500/10', text: 'text-indigo-400' },
    'modern-ai': { color: '#818CF8', border: 'border-indigo-500/30', bg: 'bg-indigo-500/10', text: 'text-indigo-400' },
    'generative-ai': { color: '#A855F7', border: 'border-purple-500/30', bg: 'bg-purple-500/10', text: 'text-purple-400' },
    'ai-engineering': { color: '#A855F7', border: 'border-purple-500/30', bg: 'bg-purple-500/10', text: 'text-purple-400' },
    production: { color: '#F59E0B', border: 'border-amber-500/30', bg: 'bg-amber-500/10', text: 'text-amber-400' },
    'enterprise-ai': { color: '#F59E0B', border: 'border-amber-500/30', bg: 'bg-amber-500/10', text: 'text-amber-400' },
    'advanced-ai': { color: '#F59E0B', border: 'border-amber-500/30', bg: 'bg-amber-500/10', text: 'text-amber-400' },
  };

  return (
    <div className="space-y-5">
      {/* Top Banner: Next Recommended Step + View Switcher */}
      <div className="p-4 sm:p-5 rounded-2xl bg-surface border border-hairline shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-accent/15 border border-accent/25 flex items-center justify-center text-accent shrink-0">
            <Workflow className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono uppercase tracking-wider text-accent font-semibold px-2 py-0.5 rounded bg-accent/10">
                AI Engineering Pipeline
              </span>
              <span className="text-xs text-text-secondary font-mono">
                {user.completedNodeIds.length} / {nodes.length} Mastered ({Math.round((user.completedNodeIds.length / nodes.length) * 100)}%)
              </span>
            </div>
            <h1 className="text-lg sm:text-xl font-bold font-display text-text-primary mt-0.5">
              Interactive AI Learning Roadmap
            </h1>
          </div>
        </div>

        {/* View Mode Toggle (n8n Workflow vs W3Schools Curriculum) */}
        <div className="flex items-center gap-2">
          <div className="flex items-center p-1 rounded-xl bg-elevated border border-hairline">
            <button
              onClick={() => setViewMode('canvas')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-2 transition-all ${
                viewMode === 'canvas'
                  ? 'bg-surface text-accent font-semibold shadow-xs border border-hairline'
                  : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              <Workflow className="w-3.5 h-3.5" />
              <span>n8n Workflow Canvas</span>
            </button>
            <button
              onClick={() => setViewMode('curriculum')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-2 transition-all ${
                viewMode === 'curriculum'
                  ? 'bg-surface text-accent font-semibold shadow-xs border border-hairline'
                  : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              <List className="w-3.5 h-3.5" />
              <span>W3Schools Curriculum</span>
            </button>
          </div>

          {nextRecommendedNode && (
            <button
              onClick={() => setSelectedNode(nextRecommendedNode)}
              className="hidden xl:flex items-center gap-2 px-3.5 py-2 rounded-xl bg-accent text-white font-semibold text-xs hover:bg-accent-hover transition-all shadow-sm shadow-accent/20 shrink-0"
            >
              <span>Up Next: {nextRecommendedNode.title.slice(0, 20)}...</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Filter Toolbar: Stage Pills + Status + Search */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl bg-surface border border-hairline text-xs">
        {/* Stage Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto max-w-full pb-1 sm:pb-0">
          <button
            onClick={() => setSelectedLayer('all')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors shrink-0 ${
              selectedLayer === 'all'
                ? 'bg-accent text-white font-semibold shadow-xs'
                : 'bg-elevated/60 text-text-secondary hover:text-text-primary'
            }`}
          >
            All Stages (Full Pipeline)
          </button>
          {ROADMAP_LAYERS.map((layer) => {
            const isSelected = selectedLayer === layer.id;
            return (
              <button
                key={layer.id}
                onClick={() => setSelectedLayer(layer.id)}
                className={`px-2.5 py-1.5 rounded-lg font-medium transition-colors shrink-0 flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-accent text-white font-semibold shadow-xs'
                    : 'bg-elevated/60 text-text-secondary hover:text-text-primary'
                }`}
              >
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: layer.accentColor }} />
                <span>{layer.name}</span>
              </button>
            );
          })}
        </div>

        {/* Search & Status Filters */}
        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          {/* Quick Search */}
          <div className="relative flex-1 sm:w-56">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-text-secondary" />
            <input
              type="text"
              placeholder="Filter nodes or tech..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-elevated/70 border border-hairline text-xs text-text-primary placeholder:text-text-secondary focus:outline-none focus:border-accent"
            />
          </div>

          {/* Canvas Controls (Visible only in canvas mode) */}
          {viewMode === 'canvas' && (
            <div className="flex items-center gap-1 p-0.5 rounded-lg bg-elevated/80 border border-hairline">
              <button
                onClick={() => setZoom((z) => Math.min(1.6, z + 0.12))}
                className="p-1 rounded text-text-secondary hover:text-text-primary"
                title="Zoom In"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setZoom((z) => Math.max(0.45, z - 0.12))}
                className="p-1 rounded text-text-secondary hover:text-text-primary"
                title="Zoom Out"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={resetView}
                className="p-1 rounded text-text-secondary hover:text-text-primary"
                title="Reset View"
              >
                <Maximize2 className="w-3.5 h-3.5" />
              </button>
              <span className="px-1.5 font-mono text-[10px] text-text-secondary">
                {Math.round(zoom * 100)}%
              </span>
            </div>
          )}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* MODE 1: n8n-STYLE INTERACTIVE WORKFLOW CANVAS                            */}
      {/* ========================================================================= */}
      {viewMode === 'canvas' ? (
        <div className="relative w-full h-[calc(100vh-260px)] min-h-[620px] bg-base rounded-2xl border border-hairline overflow-hidden select-none flex flex-col glass-panel shadow-sm">
          {/* Top Instruction Pill */}
          <div className="absolute top-3 left-4 z-20 pointer-events-none flex items-center gap-2">
            <div className="px-3 py-1 rounded-full bg-surface/90 backdrop-blur-md border border-hairline text-[11px] font-mono text-text-secondary shadow-sm flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
              <span>Drag canvas to pan • Scroll to zoom • Click node to inspect details</span>
            </div>
          </div>

          {/* Interactive Graph Canvas */}
          <div
            ref={containerRef}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onWheel={handleWheel}
            className={`w-full h-full cursor-grab ${isDragging ? 'cursor-grabbing' : ''}`}
            style={{
              backgroundImage: `radial-gradient(circle at 1px 1px, var(--border-hairline) 1px, transparent 0)`,
              backgroundSize: '28px 28px',
            }}
          >
            <div
              style={{
                transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
                transformOrigin: '0 0',
                transition: isDragging ? 'none' : 'transform 100ms cubic-bezier(0.16, 1, 0.3, 1)',
              }}
              className="relative w-[2400px] h-[1600px]"
            >
              {/* Stage Column Background Headers (When viewing All Stages) */}
              {selectedLayer === 'all' &&
                ROADMAP_LAYERS.map((layer, index) => {
                  const xPos = index * 400 + 40;
                  return (
                    <div
                      key={layer.id}
                      style={{ left: `${xPos}px`, width: '360px' }}
                      className="absolute top-0 bottom-0 pointer-events-none border-l border-hairline/30 pl-4 pt-1"
                    >
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: layer.accentColor }} />
                        <span className="text-[11px] font-mono uppercase tracking-wider text-text-secondary font-bold">
                          Stage 0{layer.order} • {layer.badge}
                        </span>
                      </div>
                      <div className="text-sm font-bold text-text-primary mt-0.5 font-display">
                        {layer.name}
                      </div>
                      <p className="text-[10px] text-text-secondary line-clamp-1 mt-0.5">
                        {layer.tagline}
                      </p>
                    </div>
                  );
                })}

              {/* Connecting Bezier Curves (n8n Style) */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
                <defs>
                  <linearGradient id="edgeActiveGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#5B8CFF" stopOpacity="0.85" />
                    <stop offset="50%" stopColor="#38BDF8" stopOpacity="1" />
                    <stop offset="100%" stopColor="#5B8CFF" stopOpacity="0.85" />
                  </linearGradient>
                  <linearGradient id="edgeCompletedGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#38C793" stopOpacity="0.85" />
                    <stop offset="100%" stopColor="#5B8CFF" stopOpacity="0.85" />
                  </linearGradient>
                </defs>

                {edges.map((edge, idx) => {
                  // Connect from right output port of fromNode to left input port of toNode
                  const cardWidth = 280;
                  const cardHeight = 150;
                  const x1 = edge.fromNode.canvasPos.x + cardWidth;
                  const y1 = edge.fromNode.canvasPos.y + cardHeight / 2;
                  const x2 = edge.toNode.canvasPos.x;
                  const y2 = edge.toNode.canvasPos.y + cardHeight / 2;

                  const dx = Math.max(40, Math.abs(x2 - x1) * 0.45);
                  const pathD = `M ${x1} ${y1} C ${x1 + dx} ${y1}, ${x2 - dx} ${y2}, ${x2} ${y2}`;

                  const strokeColor = edge.isCompleted
                    ? 'url(#edgeCompletedGrad)'
                    : edge.isActive
                    ? 'url(#edgeActiveGrad)'
                    : 'var(--border-hairline)';

                  const strokeWidth = edge.isCompleted || edge.isActive ? 2.5 : 1.5;

                  return (
                    <g key={idx}>
                      <path
                        d={pathD}
                        fill="none"
                        stroke={strokeColor}
                        strokeWidth={strokeWidth}
                        strokeDasharray={edge.isActive ? '6 4' : undefined}
                      />
                      {/* Flowing particle animation along active/completed connection */}
                      {(edge.isActive || edge.isCompleted) && (
                        <circle r="3.5" fill={edge.isActive ? '#38BDF8' : '#38C793'}>
                          <animateMotion
                            path={pathD}
                            dur={edge.isActive ? '2s' : '3.5s'}
                            repeatCount="indefinite"
                          />
                        </circle>
                      )}
                    </g>
                  );
                })}
              </svg>

              {/* Modular n8n Node Cards */}
              {computedNodesWithPos.map((node) => {
                const status = getNodeStatus(node);
                const isCompleted = status === 'completed';
                const isInProgress = status === 'in_progress';
                const isLocked = status === 'locked';
                const defaultAccent = { color: '#38BDF8', border: 'border-sky-500/30', bg: 'bg-sky-500/10', text: 'text-sky-400' };
                const layerAccent = layerAccentMap[node.layerId] || defaultAccent;

                return (
                  <div
                    key={node.id}
                    onClick={() => setSelectedNode(node)}
                    style={{
                      left: `${node.canvasPos.x}px`,
                      top: `${node.canvasPos.y}px`,
                      width: '280px',
                    }}
                    className={`absolute z-10 p-3.5 rounded-2xl border transition-all duration-micro cursor-pointer group shadow-sm ${
                      isCompleted
                        ? 'bg-surface/95 border-success/40 hover:border-success hover:shadow-md'
                        : isInProgress
                        ? 'bg-surface/95 border-accent shadow-md shadow-accent/15 hover:border-accent ring-1 ring-accent/30'
                        : isLocked
                        ? 'bg-elevated/50 border-hairline opacity-65 hover:opacity-85'
                        : 'bg-surface border-hairline hover:border-accent/40 hover:shadow-md'
                    }`}
                  >
                    {/* Left Input Port Dot (n8n connector) */}
                    <div
                      className={`absolute -left-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full border-2 border-surface flex items-center justify-center ${
                        isCompleted
                          ? 'bg-success'
                          : isInProgress
                          ? 'bg-accent animate-pulse'
                          : 'bg-text-secondary/40'
                      }`}
                      title="Input dependency"
                    />

                    {/* Right Output Port Dot (n8n connector) */}
                    <div
                      className={`absolute -right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full border-2 border-surface flex items-center justify-center ${
                        isCompleted
                          ? 'bg-success'
                          : isInProgress
                          ? 'bg-accent'
                          : 'bg-text-secondary/40'
                      }`}
                      title="Output next step"
                    />

                    {/* Node Header Pill & Status */}
                    <div className="flex items-center justify-between gap-1 mb-2">
                      <span className={`text-[10px] font-mono font-semibold px-2 py-0.5 rounded-md ${layerAccent.bg} ${layerAccent.text}`}>
                        {node.layerId.toUpperCase()}
                      </span>

                      <div className="flex items-center gap-1.5">
                        {isCompleted ? (
                          <span className="flex items-center gap-1 text-[10px] font-mono font-semibold text-success">
                            <CheckCircle2 className="w-3 h-3" />
                            Done
                          </span>
                        ) : isInProgress ? (
                          <span className="flex items-center gap-1 text-[10px] font-mono font-semibold text-accent">
                            <Zap className="w-3 h-3 text-accent animate-pulse" />
                            Active
                          </span>
                        ) : isLocked ? (
                          <span className="flex items-center gap-1 text-[10px] font-mono text-text-secondary">
                            <Lock className="w-3 h-3" />
                          </span>
                        ) : (
                          <span className="text-[10px] font-mono text-text-secondary">
                            +{node.xpReward} XP
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Node Title */}
                    <h3 className="text-xs font-bold font-display text-text-primary group-hover:text-accent transition-colors line-clamp-1">
                      {node.title}
                    </h3>

                    {/* Short Description */}
                    <p className="text-[11px] text-text-secondary line-clamp-2 mt-1 leading-snug">
                      {node.shortDesc}
                    </p>

                    {/* Card Actions & Simulation Button */}
                    <div className="mt-3 pt-2.5 border-t border-hairline flex items-center justify-between text-[10px] font-mono">
                      <span className="text-text-secondary">~{node.estimatedHours}h • {node.difficulty}</span>

                      {node.simulationType ? (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (node.simulationType) {
                              setSimulation(node.simulationType);
                              setView('simulations', { sim: node.simulationType });
                            }
                          }}
                          className="px-2 py-0.5 rounded-md bg-accent text-white font-bold flex items-center gap-1 hover:bg-accent-hover shadow-xs"
                          title="Launch interactive simulation lab"
                        >
                          <Play className="w-2.5 h-2.5 fill-white" />
                          <span>RUN LAB</span>
                        </button>
                      ) : (
                        <span className="text-accent flex items-center gap-0.5 group-hover:translate-x-0.5 transition-transform font-medium">
                          <span>Inspect</span>
                          <ChevronRight className="w-3 h-3" />
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Bottom Status & Metrics Ribbon */}
          <div className="px-6 py-2.5 bg-surface/95 border-t border-hairline flex flex-wrap items-center justify-between gap-4 text-xs font-mono text-text-secondary z-20">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-success" />
                <span>Mastered ({user.completedNodeIds.length})</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                <span>In Progress ({user.inProgressNodeIds.length})</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-text-secondary/40" />
                <span>Available ({filteredNodes.length - user.completedNodeIds.length - user.inProgressNodeIds.length})</span>
              </div>
            </div>

            <div className="flex items-center gap-3 text-[11px]">
              <span className="px-2 py-0.5 rounded bg-elevated border border-hairline text-text-primary">
                {computedNodesWithPos.length} Pipeline Nodes
              </span>
            </div>
          </div>
        </div>
      ) : (
        /* ========================================================================= */
        /* MODE 2: W3SCHOOLS-STYLE STEP-BY-STEP CURRICULUM TRACK                     */
        /* ========================================================================= */
        <div className="space-y-6">
          {ROADMAP_LAYERS.map((layer) => {
            const layerNodes = filteredNodes.filter((n) => n.layerId === layer.id);
            if (layerNodes.length === 0) return null;

            const completedInLayer = layerNodes.filter((n) => user.completedNodeIds.includes(n.id)).length;
            const progressPercent = Math.round((completedInLayer / layerNodes.length) * 100);

            return (
              <div key={layer.id} className="rounded-2xl bg-surface border border-hairline overflow-hidden shadow-xs">
                {/* Stage Header */}
                <div className="p-4 sm:p-5 border-b border-hairline bg-elevated/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: layer.accentColor }} />
                      <span className="text-[10px] font-mono uppercase tracking-wider font-bold text-accent">
                        Stage 0{layer.order} • {layer.badge}
                      </span>
                    </div>
                    <h2 className="text-base sm:text-lg font-bold font-display text-text-primary">
                      {layer.name}
                    </h2>
                    <p className="text-xs text-text-secondary max-w-2xl">
                      {layer.description}
                    </p>
                  </div>

                  {/* Stage Progress Pill */}
                  <div className="text-right shrink-0">
                    <div className="font-mono text-xs text-text-primary font-semibold">
                      {completedInLayer} / {layerNodes.length} Lessons ({progressPercent}%)
                    </div>
                    <div className="w-36 h-2 rounded-full bg-elevated border border-hairline overflow-hidden mt-1.5">
                      <div
                        className="h-full rounded-full transition-all duration-standard"
                        style={{ width: `${progressPercent}%`, backgroundColor: layer.accentColor }}
                      />
                    </div>
                  </div>
                </div>

                {/* Lesson Table List (W3Schools Style) */}
                <div className="divide-y divide-hairline">
                  {layerNodes.map((node, index) => {
                    const status = getNodeStatus(node);
                    const isCompleted = status === 'completed';
                    const isInProgress = status === 'in_progress';
                    const isLocked = status === 'locked';

                    return (
                      <div
                        key={node.id}
                        className={`p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-colors hover:bg-elevated/30 ${
                          isInProgress ? 'bg-accent/5' : ''
                        }`}
                      >
                        {/* Left: Number + Details */}
                        <div className="flex items-start gap-3.5 max-w-3xl">
                          <span className="w-7 h-7 rounded-lg bg-elevated border border-hairline font-mono text-xs font-bold flex items-center justify-center text-text-secondary shrink-0 mt-0.5">
                            {index + 1 < 10 ? `0${index + 1}` : index + 1}
                          </span>

                          <div className="space-y-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <h3
                                onClick={() => setSelectedNode(node)}
                                className="text-sm font-bold font-display text-text-primary hover:text-accent cursor-pointer transition-colors"
                              >
                                {node.title}
                              </h3>

                              {isCompleted && (
                                <span className="px-2 py-0.2 rounded-full bg-success/15 border border-success/30 text-success text-[10px] font-mono font-bold flex items-center gap-1">
                                  <CheckCircle2 className="w-3 h-3" /> Mastered
                                </span>
                              )}
                              {isInProgress && (
                                <span className="px-2 py-0.2 rounded-full bg-accent/15 border border-accent/30 text-accent text-[10px] font-mono font-bold flex items-center gap-1">
                                  <Zap className="w-3 h-3" /> In Progress
                                </span>
                              )}
                              {isLocked && (
                                <span className="px-2 py-0.2 rounded-full bg-elevated border border-hairline text-text-secondary text-[10px] font-mono flex items-center gap-1">
                                  <Lock className="w-3 h-3" /> Locked
                                </span>
                              )}
                            </div>

                            <p className="text-xs text-text-secondary leading-relaxed">
                              {node.shortDesc}
                            </p>

                            {/* Tags & Prereqs */}
                            <div className="flex flex-wrap items-center gap-2 pt-1">
                              <span className="text-[10px] font-mono text-text-secondary">
                                Difficulty: <span className="text-text-primary font-medium">{node.difficulty}</span>
                              </span>
                              <span className="text-text-secondary/40">•</span>
                              <span className="text-[10px] font-mono text-text-secondary">
                                Time: <span className="text-text-primary font-medium">~{node.estimatedHours}h</span>
                              </span>
                              <span className="text-text-secondary/40">•</span>
                              <span className="text-[10px] font-mono text-warning font-medium">
                                +{node.xpReward} XP
                              </span>
                              {node.tags.slice(0, 3).map((tag) => (
                                <span
                                  key={tag}
                                  className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-elevated border border-hairline text-text-secondary"
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* Right: Actions */}
                        <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                          {node.simulationType && (
                            <button
                              onClick={() => {
                                if (node.simulationType) {
                                  setSimulation(node.simulationType);
                                  setView('simulations', { sim: node.simulationType });
                                }
                              }}
                              className="px-3 py-1.5 rounded-lg bg-accent/10 border border-accent/25 text-accent hover:bg-accent hover:text-white transition-all text-xs font-semibold flex items-center gap-1.5 shadow-xs"
                            >
                              <Play className="w-3 h-3 fill-current" />
                              <span>Try Lab</span>
                            </button>
                          )}

                          <button
                            onClick={() => setSelectedNode(node)}
                            className="px-3 py-1.5 rounded-lg bg-surface border border-hairline hover:bg-elevated text-text-primary text-xs font-medium transition-colors"
                          >
                            Inspect Lesson
                          </button>

                          {!isCompleted && (
                            <button
                              onClick={() => completeNode(node.id, node.xpReward)}
                              className="px-2.5 py-1.5 rounded-lg bg-success/10 border border-success/20 text-success hover:bg-success hover:text-white transition-colors text-xs font-semibold"
                              title="Mark this concept mastered"
                            >
                              ✓ Mark Done
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Node Details Flyout Modal */}
      {selectedNode && (
        <NodeDetailsModal
          node={selectedNode}
          onClose={() => setSelectedNode(null)}
        />
      )}
    </div>
  );
};

