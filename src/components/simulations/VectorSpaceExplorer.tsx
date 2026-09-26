import React, { useState, useMemo } from 'react';
import { Search, Compass, Sparkles, Sliders, Info } from 'lucide-react';
import { VectorPoint } from '../../types/simulation';
import { CollapsibleSection } from '../ui/Toggle';
import { DocHeading, DocParagraph, DocList, DocNote } from '../docs/Documentation';

const INITIAL_POINTS: VectorPoint[] = [
  // Cluster 1: Attention & Transformers (Blue)
  { id: '1', label: 'Self-Attention', category: 'Transformers', x: 0.72, y: 0.65, vector: [0.82, 0.65, 0.41, 0.12] },
  { id: '2', label: 'Multi-Head Attention', category: 'Transformers', x: 0.78, y: 0.70, vector: [0.85, 0.68, 0.39, 0.15] },
  { id: '3', label: 'Transformer Decoder', category: 'Transformers', x: 0.68, y: 0.75, vector: [0.79, 0.72, 0.44, 0.18] },
  { id: '4', label: 'RoPE Embeddings', category: 'Transformers', x: 0.82, y: 0.58, vector: [0.88, 0.60, 0.35, 0.10] },
  { id: '5', label: 'FlashAttention', category: 'Transformers', x: 0.65, y: 0.60, vector: [0.75, 0.63, 0.48, 0.22] },

  // Cluster 2: Optimization & Loss (Purple)
  { id: '6', label: 'Gradient Descent', category: 'Optimization', x: -0.65, y: 0.62, vector: [-0.75, 0.68, 0.12, 0.85] },
  { id: '7', label: 'Backpropagation', category: 'Optimization', x: -0.72, y: 0.70, vector: [-0.80, 0.72, 0.15, 0.88] },
  { id: '8', label: 'AdamW Optimizer', category: 'Optimization', x: -0.58, y: 0.55, vector: [-0.70, 0.60, 0.10, 0.80] },
  { id: '9', label: 'Cross-Entropy Loss', category: 'Optimization', x: -0.80, y: 0.65, vector: [-0.85, 0.66, 0.18, 0.90] },
  { id: '10', label: 'Learning Rate Schedule', category: 'Optimization', x: -0.68, y: 0.50, vector: [-0.73, 0.55, 0.08, 0.78] },

  // Cluster 3: RAG & Vector Retrieval (Amber)
  { id: '11', label: 'Vector Database', category: 'RAG & Retrieval', x: 0.55, y: -0.60, vector: [0.60, -0.65, 0.75, 0.25] },
  { id: '12', label: 'Dense Embeddings', category: 'RAG & Retrieval', x: 0.62, y: -0.55, vector: [0.65, -0.60, 0.78, 0.28] },
  { id: '13', label: 'HNSW Indexing', category: 'RAG & Retrieval', x: 0.50, y: -0.68, vector: [0.55, -0.72, 0.70, 0.20] },
  { id: '14', label: 'Cross-Encoder Rerank', category: 'RAG & Retrieval', x: 0.68, y: -0.65, vector: [0.72, -0.70, 0.82, 0.30] },
  { id: '15', label: 'Chunk Overlap', category: 'RAG & Retrieval', x: 0.45, y: -0.52, vector: [0.50, -0.58, 0.68, 0.18] },

  // Cluster 4: Infrastructure & Serving (Emerald)
  { id: '16', label: 'vLLM Serving', category: 'Infrastructure', x: -0.60, y: -0.65, vector: [-0.65, -0.70, 0.32, 0.45] },
  { id: '17', label: 'PagedAttention', category: 'Infrastructure', x: -0.52, y: -0.58, vector: [-0.58, -0.62, 0.38, 0.40] },
  { id: '18', label: 'Continuous Batching', category: 'Infrastructure', x: -0.68, y: -0.72, vector: [-0.72, -0.76, 0.30, 0.48] },
  { id: '19', label: 'GPU Cluster (H100)', category: 'Infrastructure', x: -0.55, y: -0.75, vector: [-0.60, -0.80, 0.35, 0.50] },
  { id: '20', label: 'FP8 Quantization', category: 'Infrastructure', x: -0.45, y: -0.62, vector: [-0.50, -0.68, 0.40, 0.38] },
];

const CATEGORY_COLORS: Record<string, string> = {
  Transformers: '#5B8CFF',
  Optimization: '#A855F7',
  'RAG & Retrieval': '#F5A623',
  Infrastructure: '#10B981',
};

export const VectorSpaceExplorer: React.FC = () => {
  const [points, setPoints] = useState<VectorPoint[]>(INITIAL_POINTS);
  const [searchQuery, setSearchQuery] = useState('Cross-Encoder Reranker');
  const [hoveredPoint, setHoveredPoint] = useState<VectorPoint | null>(null);

  const conceptExplainer = {
    heading: 'What is a Vector Space?',
    intro: 'Vector spaces represent concepts as coordinates in high-dimensional space. Semantically similar concepts cluster together, allowing AI systems to perform similarity search, recommendations, and retrieval by comparing vector distances like cosine similarity.',
    keyPoints: [
      'Embedding: Each concept is mapped to a numeric vector capturing semantic meaning.',
      'Cosine Similarity: Measures angular distance between vectors (1.0 = identical direction).',
      'Clustering: Related concepts naturally group together in latent space.',
      'Dimensionality Reduction: High-dimensional vectors are projected to 2D for visualization.',
      'Query Projection: A search query is transformed into a vector to find nearest neighbors.',
    ],
    definition: 'Key Term: Cosine Similarity - a measure of similarity between two vectors calculated as the cosine of the angle between them, ranging from -1 to 1.',
  };

  // Compute simulated 2D position for user query
  const queryPoint = useMemo(() => {
    const q = searchQuery.toLowerCase();
    let targetX = 0;
    let targetY = 0;

    if (q.includes('attention') || q.includes('transformer') || q.includes('rope')) {
      targetX = 0.74;
      targetY = 0.68;
    } else if (q.includes('gradient') || q.includes('backprop') || q.includes('loss') || q.includes('opt')) {
      targetX = -0.68;
      targetY = 0.64;
    } else if (q.includes('rag') || q.includes('vector') || q.includes('embed') || q.includes('rerank')) {
      targetX = 0.58;
      targetY = -0.62;
    } else if (q.includes('serving') || q.includes('vllm') || q.includes('gpu') || q.includes('quant')) {
      targetX = -0.56;
      targetY = -0.66;
    } else {
      // Default center
      targetX = 0.05;
      targetY = 0.05;
    }

    return { x: targetX, y: targetY };
  }, [searchQuery]);

  // Compute Cosine Similarity between query position and all points
  const pointsWithSimilarity = useMemo(() => {
    return points.map((p) => {
      // Euclidean distance mapped to similarity
      const dx = p.x - queryPoint.x;
      const dy = p.y - queryPoint.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const similarity = Math.max(0, 1 - dist * 0.5);
      return {
        ...p,
        similarity: Number(similarity.toFixed(3)),
      };
    }).sort((a, b) => (b.similarity || 0) - (a.similarity || 0));
  }, [points, queryPoint]);

  const topNeighbors = pointsWithSimilarity.slice(0, 4);

  return (
    <div className="space-y-5 text-xs">
      {/* Concept Explainer - W3Schools Style */}
      <CollapsibleSection
        title="Learn: What is a Vector Space?"
        icon={<DocHeading level={4} className="!mt-0 !mb-0">📚</DocHeading>}
        badge="Concept"
        defaultOpen={false}
      >
        <div className="space-y-3">
          <DocHeading level={3}>{conceptExplainer.heading}</DocHeading>
          <DocParagraph>{conceptExplainer.intro}</DocParagraph>
          <DocList items={conceptExplainer.keyPoints} />
          <DocNote type="tip" title="Key Term">
            {conceptExplainer.definition}
          </DocNote>
        </div>
      </CollapsibleSection>

      {/* Top Search & Filter Bar */}
      <div className="p-4 rounded-xl bg-surface border border-hairline flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 flex-1 min-w-[280px]">
          <Search className="w-4 h-4 text-text-secondary shrink-0" />
          <input
            type="text"
            placeholder="Type query to project point into 2D embedding space (e.g. 'FlashAttention' or 'vLLM')..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-transparent text-xs text-text-primary placeholder:text-text-secondary focus:outline-none font-mono"
          />
        </div>

        {/* Legend */}
        <div className="flex items-center gap-3 text-[10px] font-mono text-text-secondary">
          {Object.entries(CATEGORY_COLORS).map(([cat, color]) => (
            <div key={cat} className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
              <span>{cat}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* Left: 2D Projected Vector Space Canvas (8 Cols) */}
        <div className="lg:col-span-8 p-5 rounded-xl bg-surface border border-hairline flex flex-col items-center justify-center relative min-h-[460px]">
          <div className="absolute top-4 left-4 text-[10px] font-mono uppercase tracking-wider text-text-secondary">
            t-SNE / UMAP 2D Manifold Projection
          </div>

          <div className="relative w-full aspect-square max-w-[480px] border border-hairline/60 rounded-xl bg-base overflow-hidden">
            
            {/* Coordinate Grid axes */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-full h-[1px] bg-hairline" />
              <div className="h-full w-[1px] bg-hairline absolute" />
            </div>

            {/* SVG Connecting Ray Lines to Top Nearest Neighbors */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none">
              {topNeighbors.map((nb) => {
                const qx = ((queryPoint.x + 1) / 2) * 100;
                const qy = ((-queryPoint.y + 1) / 2) * 100;
                const nx = ((nb.x + 1) / 2) * 100;
                const ny = ((-nb.y + 1) / 2) * 100;

                return (
                  <line
                    key={nb.id}
                    x1={`${qx}%`}
                    y1={`${qy}%`}
                    x2={`${nx}%`}
                    y2={`${ny}%`}
                    stroke="#5B8CFF"
                    strokeWidth="1.5"
                    strokeDasharray="4 3"
                    className="pulsing-edge opacity-60"
                  />
                );
              })}
            </svg>

            {/* Projected Document Concept Points */}
            {pointsWithSimilarity.map((pt) => {
              const leftPercent = ((pt.x + 1) / 2) * 100;
              const topPercent = ((-pt.y + 1) / 2) * 100;
              const isNearest = topNeighbors.some((n) => n.id === pt.id);

              return (
                <div
                  key={pt.id}
                  onMouseEnter={() => setHoveredPoint(pt)}
                  onMouseLeave={() => setHoveredPoint(null)}
                  onClick={() => setSearchQuery(pt.label)}
                  style={{
                    left: `${leftPercent}%`,
                    top: `${topPercent}%`,
                    transform: 'translate(-50%, -50%)',
                  }}
                  className={`absolute z-10 cursor-pointer p-1 rounded-full transition-transform hover:scale-125 ${
                    isNearest ? 'ring-2 ring-accent shadow-md shadow-accent/20' : ''
                  }`}
                >
                  <div
                    className="w-3 h-3 rounded-full border border-white/80"
                    style={{ backgroundColor: CATEGORY_COLORS[pt.category] || '#5B8CFF' }}
                  />
                  <div className="absolute left-4 top-[-2px] whitespace-nowrap text-[9px] font-mono font-medium px-1 rounded bg-surface/90 border border-hairline text-text-primary shadow-xs">
                    {pt.label}
                  </div>
                </div>
              );
            })}

            {/* Active User Query Point */}
            <div
              style={{
                left: `${((queryPoint.x + 1) / 2) * 100}%`,
                top: `${((-queryPoint.y + 1) / 2) * 100}%`,
                transform: 'translate(-50%, -50%)',
              }}
              className="absolute z-20 pointer-events-none"
            >
              <div className="w-5 h-5 rounded-full bg-accent/20 border-2 border-accent animate-ping absolute inset-0" />
              <div className="w-5 h-5 rounded-full bg-accent border-2 border-white flex items-center justify-center text-white shadow-lg">
                <Sparkles className="w-2.5 h-2.5" />
              </div>
              <div className="absolute left-6 top-[-4px] whitespace-nowrap text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-accent text-white shadow-md">
                Query: "{searchQuery}"
              </div>
            </div>

          </div>

          <div className="mt-3 text-[10px] font-mono text-text-secondary">
            Semantically coherent clusters converge naturally in latent space.
          </div>
        </div>

        {/* Right: Cosine Similarity Neighbors Ranking (4 Cols) */}
        <div className="lg:col-span-4 space-y-4">
          
          <div className="p-4 rounded-xl bg-surface border border-hairline space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[11px] uppercase tracking-wider text-text-secondary font-semibold">
                Top Nearest Neighbors
              </span>
              <span className="text-[10px] font-mono text-accent">Cosine Metric</span>
            </div>

            <div className="space-y-2">
              {topNeighbors.map((item, idx) => (
                <div
                  key={item.id}
                  className="p-3 rounded-lg bg-elevated/70 border border-hairline space-y-1.5 hover:border-accent/40 transition-colors cursor-pointer"
                  onClick={() => setSearchQuery(item.label)}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-text-primary">
                      {idx + 1}. {item.label}
                    </span>
                    <span className="text-[10px] font-mono text-success font-semibold">
                      Sim: {item.similarity}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[10px] font-mono text-text-secondary">
                    <span style={{ color: CATEGORY_COLORS[item.category] }}>
                      {item.category}
                    </span>
                    <span>Coord: ({item.x.toFixed(2)}, {item.y.toFixed(2)})</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Point Inspector */}
          <div className="p-4 rounded-xl bg-surface border border-hairline space-y-2">
            <span className="font-mono text-[11px] uppercase tracking-wider text-text-secondary font-semibold">
              Vector Coordinate Inspector
            </span>
            {hoveredPoint ? (
              <div className="p-3 rounded-lg bg-elevated font-mono text-[11px] space-y-1 text-text-primary">
                <div>Concept: <span className="text-accent font-bold">{hoveredPoint.label}</span></div>
                <div>Domain: {hoveredPoint.category}</div>
                <div>Vector: [{hoveredPoint.vector.join(', ')}]</div>
              </div>
            ) : (
              <div className="p-3 rounded-lg bg-elevated/50 text-text-secondary/60 text-center italic">
                Hover over any vector point to inspect latent coordinates
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};
