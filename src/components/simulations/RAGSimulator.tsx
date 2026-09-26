import React, { useState, useEffect } from 'react';
import {
  FileText,
  Scissors,
  Layers,
  Search,
  CheckCircle2,
  Play,
  RotateCcw,
  Sparkles,
  ArrowRight,
  Database,
  Sliders,
  Filter,
  ExternalLink
} from 'lucide-react';
import { RAGChunk } from '../../types/simulation';
import { CollapsibleSection } from '../ui/Toggle';
import { DocHeading, DocParagraph, DocList, DocNote } from '../docs/Documentation';

const SAMPLE_DOCS = [
  {
    id: 'doc-apollo',
    title: 'Apollo Guidance Computer (AGC) System Spec',
    category: 'Engineering Manual',
    text: `The Apollo Guidance Computer (AGC) was a digital computer produced for the Apollo program that was installed on board each Apollo command module (CM) and lunar module (LM). The AGC provided computation and electronic interfaces for guidance, navigation, and control of the spacecraft. It operated at a clock frequency of 2.048 MHz with 2048 words of RAM and 36,864 words of ROM. Memory parity errors were handled by Executive priority routines designed by Margaret Hamilton. Priority interrupts enabled the computer to shed low-priority radar rendering jobs to preserve critical landing engine calculations during the Apollo 11 1202 program alarm.`
  },
  {
    id: 'doc-hr-policy',
    title: 'Acme Global Enterprise AI Governance & Remote Work Policy',
    category: 'Corporate Policy',
    text: `All corporate employees utilizing external generative AI models must route requests through the Acme Enterprise Gateway. Storing customer Personally Identifiable Information (PII) or unreleased financial earnings in unapproved model prompts constitutes a tier-1 compliance breach subject to immediate audit. Remote equipment stipends permit up to $1,500 for home office setup every 24 calendar months. Expense receipts must be submitted to the Concur portal within 30 days of purchase with direct manager signoff.`
  },
  {
    id: 'doc-quantum',
    title: 'Superconducting Transmon Qubits & Error Mitigation',
    category: 'Research Paper',
    text: `Transmon qubits mitigate charge noise sensitivity by operating in the regime where Josephson energy greatly exceeds charging energy (E_J / E_C >> 50). Coherence times T1 and T2 are limited by dielectric loss in capacitive pads and quasiparticle poisoning. Surface code lattice architectures require a physical error rate threshold below 1% per two-qubit gate to achieve fault-tolerant logical qubit operations.`
  }
];

export const RAGSimulator: React.FC = () => {
  const [selectedDocId, setSelectedDocId] = useState(SAMPLE_DOCS[0].id);
  const [chunkStrategy, setChunkStrategy] = useState<'fixed' | 'sliding' | 'semantic'>('sliding');
  const [chunkSize, setChunkSize] = useState(150);
  const [overlap, setOverlap] = useState(30);
  const [searchQuery, setSearchQuery] = useState('How did Apollo 11 handle the 1202 program alarm?');
  const [hybridSearch, setHybridSearch] = useState(true);
  const [enableReranking, setEnableReranking] = useState(true);
  
  // Pipeline state
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [isRunning, setIsRunning] = useState(false);
  const [generatedChunks, setGeneratedChunks] = useState<RAGChunk[]>([]);
  const [retrievedChunks, setRetrievedChunks] = useState<RAGChunk[]>([]);
  const [synthesizedAnswer, setSynthesizedAnswer] = useState<string>('');

  const activeDoc = SAMPLE_DOCS.find((d) => d.id === selectedDocId) || SAMPLE_DOCS[0];

  // Concept Explainer
  const conceptExplainer = {
    heading: 'What is RAG (Retrieval-Augmented Generation)?',
    intro: 'RAG combines information retrieval with language generation. Instead of relying on memorized knowledge, the model first retrieves relevant documents from a knowledge base, then generates a response grounded in those documents. This is the architecture behind most production AI assistants.',
    keyPoints: [
      'Chunking: Documents are split into smaller pieces for efficient retrieval',
      'Embedding: Text is converted to dense vectors that capture semantic meaning',
      'Retrieval: The system finds the most similar chunks to your query',
      'Reranking: A cross-encoder reorders candidates for better precision',
      'Synthesis: The LLM writes a final answer with citations to source chunks',
    ],
    definition: 'Key Term: Embedding - a vector representation of text where semantically similar texts have similar vectors.',
  };

  // Perform chunking when document or parameters change
  useEffect(() => {
    const text = activeDoc.text;
    const words = text.split(' ');
    const chunks: RAGChunk[] = [];
    
    const wordsPerChunk = Math.max(15, Math.round(chunkSize / 6));
    const overlapWords = chunkStrategy === 'sliding' ? Math.round(overlap / 6) : 0;
    const step = Math.max(1, wordsPerChunk - overlapWords);

    for (let i = 0; i < words.length; i += step) {
      const slice = words.slice(i, i + wordsPerChunk).join(' ');
      if (slice.trim()) {
        chunks.push({
          id: `chunk-${chunks.length + 1}`,
          docTitle: activeDoc.title,
          content: slice,
          embeddingPreview: Array.from({ length: 5 }, () => Number((Math.random() * 2 - 1).toFixed(3))),
        });
      }
      if (i + wordsPerChunk >= words.length) break;
    }

    setGeneratedChunks(chunks);
    setRetrievedChunks([]);
    setSynthesizedAnswer('');
    setCurrentStep(0);
  }, [selectedDocId, chunkStrategy, chunkSize, overlap]);

  // Execute the RAG pipeline step by step
  const handleRunPipeline = () => {
    if (isRunning) return;
    setIsRunning(true);
    setCurrentStep(1); // Step 1: Chunking

    setTimeout(() => {
      setCurrentStep(2); // Step 2: Embedding & Vector Storage
      
      setTimeout(() => {
        setCurrentStep(3); // Step 3: Query & Retrieval
        
        // Calculate simulated similarity scores
        const scored = generatedChunks.map((chunk) => {
          const matchTerms = searchQuery.toLowerCase().split(' ').filter(w => w.length > 3);
          let matchCount = 0;
          matchTerms.forEach(t => {
            if (chunk.content.toLowerCase().includes(t)) matchCount += 2;
          });
          const baseSim = 0.65 + (matchCount * 0.08) + (Math.random() * 0.08);
          const score = Math.min(0.98, Number(baseSim.toFixed(3)));
          return { ...chunk, similarityScore: score };
        });

        scored.sort((a, b) => (b.similarityScore || 0) - (a.similarityScore || 0));
        const topCandidates = scored.slice(0, 3);
        setRetrievedChunks(topCandidates);

        setTimeout(() => {
          setCurrentStep(4); // Step 4: Cross-Encoder Reranking
          
          setTimeout(() => {
            setCurrentStep(5); // Step 5: LLM Synthesis with Citations
            
            let answer = '';
            if (selectedDocId === 'doc-apollo') {
              answer = `During the Apollo 11 lunar descent, the Apollo Guidance Computer handled the 1202 program alarm through Executive priority routines designed by Margaret Hamilton [Doc: Apollo AGC, Chunk #1]. When overloaded with radar interrupts, the system dropped low-priority radar rendering tasks while continuing to execute critical landing engine navigation calculations.`;
            } else if (selectedDocId === 'doc-hr-policy') {
              answer = `Under Acme Global policy, all employees using generative AI must route requests through the Acme Enterprise Gateway [Doc: Acme HR Policy, Chunk #1]. Submitting PII or unreleased earnings to unapproved models is a tier-1 compliance violation. Furthermore, remote office equipment permits up to $1,500 reimbursement every 24 months with receipts filed within 30 days.`;
            } else {
              answer = `Transmon qubits suppress charge noise sensitivity by operating in the regime where Josephson energy significantly exceeds charging energy (E_J / E_C >> 50) [Doc: Superconducting Transmons, Chunk #1]. For fault-tolerant surface codes, physical two-qubit gate errors must be kept below the 1% threshold.`;
            }

            setSynthesizedAnswer(answer);
            setIsRunning(false);
          }, 600);
        }, 600);
      }, 600);
    }, 500);
  };

  const steps = [
    { num: 1, label: 'Chunking', icon: <Scissors className="w-3.5 h-3.5" /> },
    { num: 2, label: 'Embedding & Indexing', icon: <Database className="w-3.5 h-3.5" /> },
    { num: 3, label: 'Hybrid Retrieval', icon: <Search className="w-3.5 h-3.5" /> },
    { num: 4, label: 'Cross-Encoder Rerank', icon: <Filter className="w-3.5 h-3.5" /> },
    { num: 5, label: 'Synthesis & Citations', icon: <Sparkles className="w-3.5 h-3.5" /> },
  ];

  return (
    <div className="space-y-5 text-xs">
      {/* Concept Explainer - W3Schools Style */}
      <CollapsibleSection
        title="Learn: What is RAG (Retrieval-Augmented Generation)?"
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
      
      {/* Visual Pipeline Progress Flow */}
      <div className="p-4 rounded-xl bg-surface border border-hairline overflow-x-auto">
        <div className="flex items-center justify-between min-w-[720px] gap-2">
          {steps.map((s, idx) => {
            const isCurrent = currentStep === s.num;
            const isDone = currentStep > s.num;
            return (
              <React.Fragment key={s.num}>
                <div className="flex items-center gap-2">
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center font-mono text-[11px] border transition-all ${
                      isDone
                        ? 'bg-success/15 border-success text-success'
                        : isCurrent
                        ? 'bg-accent text-white border-accent shadow-md shadow-accent/20 animate-pulse'
                        : 'bg-elevated border-hairline text-text-secondary'
                    }`}
                  >
                    {isDone ? <CheckCircle2 className="w-4 h-4" /> : s.num}
                  </div>
                  <div className="flex flex-col">
                    <span className="font-semibold text-text-primary text-[11px] flex items-center gap-1">
                      {s.icon}
                      {s.label}
                    </span>
                    <span className="text-[9px] font-mono text-text-secondary">
                      {isDone ? 'Completed' : isCurrent ? 'Processing...' : 'Waiting'}
                    </span>
                  </div>
                </div>
                {idx < steps.length - 1 && (
                  <div className="flex-1 h-[1.5px] bg-hairline relative mx-2">
                    {isDone && <div className="absolute inset-0 bg-success" />}
                    {isCurrent && <div className="absolute inset-0 bg-accent animate-pulse" />}
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* Left Column: Ingestion & Configuration (4 Cols) */}
        <div className="lg:col-span-4 space-y-4">
          
          {/* Document Ingestion Preset */}
          <div className="p-4 rounded-xl bg-surface border border-hairline space-y-3">
            <span className="font-mono text-[11px] uppercase tracking-wider text-text-secondary font-semibold">
              Source Document Ingestion
            </span>
            <div className="space-y-1.5">
              {SAMPLE_DOCS.map((doc) => (
                <button
                  key={doc.id}
                  onClick={() => {
                    setSelectedDocId(doc.id);
                    if (doc.id === 'doc-apollo') setSearchQuery('How did Apollo 11 handle the 1202 program alarm?');
                    if (doc.id === 'doc-hr-policy') setSearchQuery('What is the policy on submitting PII to generative models?');
                    if (doc.id === 'doc-quantum') setSearchQuery('What is the error rate threshold for surface codes?');
                  }}
                  className={`w-full text-left p-2.5 rounded-lg border transition-colors flex flex-col ${
                    selectedDocId === doc.id
                      ? 'bg-accent/10 border-accent text-text-primary'
                      : 'bg-elevated/50 border-hairline hover:bg-elevated text-text-secondary'
                  }`}
                >
                  <span className="text-xs font-semibold text-text-primary">{doc.title}</span>
                  <span className="text-[10px] font-mono text-text-secondary mt-0.5">{doc.category}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Chunking Strategy Settings */}
          <div className="p-4 rounded-xl bg-surface border border-hairline space-y-3">
            <div className="font-mono text-[11px] uppercase tracking-wider text-text-secondary font-semibold flex items-center justify-between">
              <span>Chunking Configuration</span>
              <span className="text-accent">{generatedChunks.length} Chunks</span>
            </div>

            <div className="grid grid-cols-3 gap-1 p-1 rounded-lg bg-elevated border border-hairline">
              {(['fixed', 'sliding', 'semantic'] as const).map((strat) => (
                <button
                  key={strat}
                  onClick={() => setChunkStrategy(strat)}
                  className={`py-1 rounded text-[11px] font-medium capitalize transition-colors ${
                    chunkStrategy === strat
                      ? 'bg-surface text-text-primary shadow-xs'
                      : 'text-text-secondary hover:text-text-primary'
                  }`}
                >
                  {strat}
                </button>
              ))}
            </div>

            <div className="space-y-2 pt-1">
              <div className="flex justify-between font-mono text-[11px]">
                <span className="text-text-secondary">Target Chunk Size</span>
                <span className="text-accent">{chunkSize} characters</span>
              </div>
              <input
                type="range"
                min="80"
                max="400"
                step="20"
                value={chunkSize}
                onChange={(e) => setChunkSize(Number(e.target.value))}
                className="w-full accent-accent bg-elevated h-1 rounded-lg cursor-pointer"
              />

              {chunkStrategy === 'sliding' && (
                <>
                  <div className="flex justify-between font-mono text-[11px] pt-1">
                    <span className="text-text-secondary">Chunk Overlap</span>
                    <span className="text-accent">{overlap} characters</span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="80"
                    step="10"
                    value={overlap}
                    onChange={(e) => setOverlap(Number(e.target.value))}
                    className="w-full accent-accent bg-elevated h-1 rounded-lg cursor-pointer"
                  />
                </>
              )}
            </div>
          </div>

          {/* Advanced Retrieval Toggles */}
          <div className="p-4 rounded-xl bg-surface border border-hairline space-y-3">
            <span className="font-mono text-[11px] uppercase tracking-wider text-text-secondary font-semibold">
              Advanced Pipeline Stages
            </span>
            <div className="space-y-2">
              <label className="flex items-center justify-between cursor-pointer">
                <div>
                  <div className="text-xs font-semibold text-text-primary">Hybrid Search (BM25 + Dense)</div>
                  <div className="text-[10px] text-text-secondary">Reciprocal Rank Fusion</div>
                </div>
                <input
                  type="checkbox"
                  checked={hybridSearch}
                  onChange={(e) => setHybridSearch(e.target.checked)}
                  className="accent-accent w-4 h-4 rounded cursor-pointer"
                />
              </label>

              <label className="flex items-center justify-between cursor-pointer pt-1 border-t border-hairline">
                <div>
                  <div className="text-xs font-semibold text-text-primary">Cross-Encoder Reranker</div>
                  <div className="text-[10px] text-text-secondary">Cohere Rerank 3 scoring</div>
                </div>
                <input
                  type="checkbox"
                  checked={enableReranking}
                  onChange={(e) => setEnableReranking(e.target.checked)}
                  className="accent-accent w-4 h-4 rounded cursor-pointer"
                />
              </label>
            </div>
          </div>

        </div>

        {/* Right Column: Interactive Query, Chunk Visualizer & Synthesized Output (8 Cols) */}
        <div className="lg:col-span-8 space-y-4">
          
          {/* Query Bar */}
          <div className="p-4 rounded-xl bg-surface border border-hairline space-y-3">
            <span className="font-mono text-[11px] uppercase tracking-wider text-text-secondary font-semibold">
              Semantic Search Query
            </span>
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-text-secondary absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-lg bg-elevated border border-hairline text-xs text-text-primary focus:outline-none focus:border-accent"
                />
              </div>
              <button
                onClick={handleRunPipeline}
                disabled={isRunning}
                className="px-4 py-2 rounded-lg bg-accent text-white font-medium text-xs hover:bg-accent-hover transition-colors flex items-center gap-2 shadow-sm disabled:opacity-50"
              >
                <Play className="w-3.5 h-3.5 fill-white" />
                <span>Run RAG Pipeline</span>
              </button>
            </div>
          </div>

          {/* Generated Chunks Visualization */}
          <div className="p-4 rounded-xl bg-surface border border-hairline space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[11px] uppercase tracking-wider text-text-secondary font-semibold flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-accent" />
                Document Chunks & Dense Embedding Vector Previews
              </span>
              <span className="text-[10px] font-mono text-text-secondary">
                {chunkStrategy.toUpperCase()} Strategy
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 max-h-56 overflow-y-auto pr-1">
              {generatedChunks.map((chunk) => {
                const isRetrieved = retrievedChunks.some((rc) => rc.id === chunk.id);
                return (
                  <div
                    key={chunk.id}
                    className={`p-3 rounded-lg border transition-all ${
                      isRetrieved
                        ? 'bg-accent/10 border-accent shadow-sm'
                        : 'bg-elevated/40 border-hairline'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] font-mono font-semibold text-accent">
                        {chunk.id}
                      </span>
                      {isRetrieved && (
                        <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-accent text-white font-medium">
                          Retrieved (Rank #1)
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-text-primary leading-relaxed line-clamp-3">
                      {chunk.content}
                    </p>
                    <div className="mt-2 pt-1.5 border-t border-hairline flex items-center justify-between text-[9px] font-mono text-text-secondary">
                      <span>Vector: [{chunk.embeddingPreview.join(', ')}]</span>
                      {chunk.similarityScore && (
                        <span className="text-success font-semibold">Sim: {chunk.similarityScore}</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Synthesized Output with Source Citations */}
          <div className="p-5 rounded-xl bg-surface border border-hairline space-y-3">
            <div className="flex items-center justify-between pb-2.5 border-b border-hairline">
              <span className="font-mono text-[11px] uppercase tracking-wider text-text-secondary font-semibold flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-accent" />
                Grounded Model Response with Verifiable Citations
              </span>
              {synthesizedAnswer && (
                <span className="text-[10px] font-mono text-success flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-success" />
                  Hallucination Risk: 0.0% (Grounded)
                </span>
              )}
            </div>

            <div className="min-h-[90px] text-xs leading-relaxed text-text-primary">
              {synthesizedAnswer ? (
                <div className="space-y-3 animate-in fade-in duration-200">
                  <p className="leading-relaxed whitespace-pre-wrap">{synthesizedAnswer}</p>
                  <div className="p-2.5 rounded-lg bg-elevated/60 border border-hairline text-[11px] text-text-secondary flex items-center gap-2 font-mono">
                    <ExternalLink className="w-3 h-3 text-accent shrink-0" />
                    <span>Clickable Citation: [{activeDoc.title} • Passage ID: chunk-1]</span>
                  </div>
                </div>
              ) : (
                <div className="h-20 flex items-center justify-center text-text-secondary/50 italic font-sans">
                  Click "Run RAG Pipeline" to watch retrieval, cross-encoder reranking, and citation synthesis in action.
                </div>
              )}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
