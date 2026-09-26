import React, { useState, useRef, useEffect } from 'react';
import {
  Play,
  Square,
  RotateCcw,
  Sliders,
  DollarSign,
  Clock,
  Sparkles,
  Zap,
  Info,
  Check
} from 'lucide-react';
import { LLMPlaygroundConfig } from '../../types/simulation';
import { CollapsibleSection } from '../ui/Toggle';
import { DocHeading, DocParagraph, DocList, DocNote } from '../docs/Documentation';

const MODEL_PRESETS = [
  { id: 'gpt-4o', name: 'GPT-4o (Omni)', provider: 'OpenAI', inputPrice: 2.50, outputPrice: 10.00, contextWindow: 128000, speed: 'Fast (85 t/s)' },
  { id: 'claude-3-5-sonnet', name: 'Claude 3.5 Sonnet', provider: 'Anthropic', inputPrice: 3.00, outputPrice: 15.00, contextWindow: 200000, speed: 'Fast (75 t/s)' },
  { id: 'llama-3-3-70b', name: 'Llama 3.3 70B (vLLM)', provider: 'Meta (Self-Hosted)', inputPrice: 0.35, outputPrice: 0.80, contextWindow: 128000, speed: 'Extreme (140 t/s)' },
  { id: 'mistral-large-2', name: 'Mistral Large 2', provider: 'Mistral AI', inputPrice: 2.00, outputPrice: 6.00, contextWindow: 128000, speed: 'Fast (70 t/s)' },
];

const TEMPLATE_PRESETS = [
  {
    title: 'Enterprise Architecture Review',
    system: 'You are a Principal Enterprise AI Architect at a Fortune 50 company. Review system designs for scalability, zero-trust security, cost, and high availability.',
    user: 'We are designing a customer support bot with 50,000 daily active users using RAG over SharePoint. Outline the critical failure modes and recommended telemetry stack.',
  },
  {
    title: 'Socratic Coding Mentor',
    system: 'You are a Senior Systems Engineer mentoring a junior developer. Do not write full answers immediately; guide the developer through first principles.',
    user: 'Why does my PyTorch training loop run out of GPU memory after 50 iterations even though my batch size is small?',
  },
  {
    title: 'JSON Structured Extraction',
    system: 'You are a high-precision data extraction engine. Output strictly valid RFC 8259 JSON adhering to the specified schema without conversational prose.',
    user: 'Extract entities from this contract: "Acme Corp agrees to license Horizon AI Platform to Stark Enterprises for $250,000 annually starting Jan 1, 2026 with 99.9% uptime SLA."',
  },
];

export const LLMPlayground: React.FC = () => {
  const [config, setConfig] = useState<LLMPlaygroundConfig>({
    model: 'gpt-4o',
    temperature: 0.7,
    maxTokens: 512,
    topP: 0.95,
    systemPrompt: TEMPLATE_PRESETS[0].system,
    userPrompt: TEMPLATE_PRESETS[0].user,
    presencePenalty: 0.0,
    frequencyPenalty: 0.0,
  });

  const [outputTokens, setOutputTokens] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [telemetry, setTelemetry] = useState<{
    tokenCount: number;
    ttftMs: number;
    totalTimeMs: number;
    estimatedCost: number;
  }>({
    tokenCount: 0,
    ttftMs: 0,
    totalTimeMs: 0,
    estimatedCost: 0,
  });

  const streamIntervalRef = useRef<any>(null);

  const activeModel = MODEL_PRESETS.find((m) => m.id === config.model) || MODEL_PRESETS[0];

  const conceptExplainer = {
    heading: 'What is an LLM (Large Language Model)?',
    intro: 'A Large Language Model is a neural network trained on massive text corpora to predict the next token in a sequence. By adjusting sampling parameters, you can control how creative, deterministic, or concise the model output becomes. This playground demonstrates autoregressive token streaming with real-time cost and latency telemetry.',
    keyPoints: [
      'Temperature: Controls randomness. Low values produce deterministic outputs; high values produce diverse, creative outputs.',
      'Top-P (Nucleus Sampling): Limits token choices to the most probable tokens that sum to probability P.',
      'Max Tokens: Caps the number of tokens the model generates in a single response.',
      'System Prompt: Sets the model persona, constraints, and task instructions before user input.',
    ],
    definition: 'Key Term: Autoregressive Generation - generating text one token at a time, where each new token depends on all previously generated tokens.',
  };

  const handleApplyTemplate = (preset: typeof TEMPLATE_PRESETS[0]) => {
    setConfig((prev) => ({
      ...prev,
      systemPrompt: preset.system,
      userPrompt: preset.user,
    }));
    setOutputTokens('');
  };

  const handleRunGeneration = () => {
    if (isStreaming) return;
    setIsStreaming(true);
    setOutputTokens('');

    const startTime = performance.now();
    const promptTokensEst = Math.round((config.systemPrompt.length + config.userPrompt.length) / 4);

    // High fidelity simulated response chunks
    const simulatedResponse = `## Architecture Critique & Evaluation (${activeModel.name})

### 1. Primary Failure Modes Identified:
1. **Unbounded Context Window Degradation**: SharePoint documents frequently contain complex XML tables and legal disclaimers that exceed chunk boundaries, injecting irrelevant noise.
2. **Permission Synchronization Latency (RBAC)**: If SharePoint permission changes take hours to sync with the vector store, employees will briefly retrieve unauthorized confidential files.
3. **KV-Cache Fragmentation**: At 50,000 daily users with variable query lengths, naïve vLLM deployment will cause GPU memory exhaustion unless PagedAttention is tuned.

### 2. Recommended Production Stack:
- **Serving Runtime**: vLLM cluster on 4x H100 SXM5 with FP8 quantization and continuous batching.
- **Vector Database**: Qdrant cluster with single-stage payload pre-filtering matching SharePoint ACL security group tokens.
- **Reranking**: Cross-encoder reranker (Cohere Rerank 3) to prune top-30 candidates down to top-4.
- **Telemetry**: OpenTelemetry spans exported to Langfuse for TTFT, token cost, and Ragas automated faithfulness scoring.

\`\`\`yaml
# Production SLA Targets
latency:
  ttft_p95: 380ms
  total_p95: 1400ms
cost:
  target_per_query: $0.0065
\`\`\``;

    const words = simulatedResponse.split(' ');
    let currentIdx = 0;
    const ttft = Math.round(180 + Math.random() * 120);

    streamIntervalRef.current = setInterval(() => {
      if (currentIdx < words.length) {
        setOutputTokens((prev) => prev + (prev ? ' ' : '') + words[currentIdx]);
        currentIdx++;
        const elapsed = Math.round(performance.now() - startTime);
        const tokensGenerated = Math.round(currentIdx * 1.3);
        const inputCost = (promptTokensEst / 1_000_000) * activeModel.inputPrice;
        const outputCost = (tokensGenerated / 1_000_000) * activeModel.outputPrice;

        setTelemetry({
          tokenCount: tokensGenerated,
          ttftMs: ttft,
          totalTimeMs: elapsed,
          estimatedCost: Number((inputCost + outputCost).toFixed(5)),
        });
      } else {
        clearInterval(streamIntervalRef.current);
        setIsStreaming(false);
      }
    }, 28);
  };

  const handleStopStream = () => {
    if (streamIntervalRef.current) {
      clearInterval(streamIntervalRef.current);
      setIsStreaming(false);
    }
  };

  useEffect(() => {
    return () => {
      if (streamIntervalRef.current) clearInterval(streamIntervalRef.current);
    };
  }, []);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 text-xs">
      {/* Concept Explainer - W3Schools Style */}
      <div className="lg:col-span-12">
        <CollapsibleSection
          title="Learn: What is an LLM (Large Language Model)?"
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
      </div>

      {/* Left Column: Model Parameters & Sliders (4 Cols) */}
      <div className="lg:col-span-4 space-y-4">
        
        {/* Model Selector Card */}
        <div className="p-4 rounded-xl bg-surface border border-hairline space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[11px] uppercase tracking-wider text-text-secondary font-semibold">
              Model Selection
            </span>
            <span className="text-[10px] font-mono text-accent">{activeModel.provider}</span>
          </div>

          <div className="space-y-1.5">
            {MODEL_PRESETS.map((m) => (
              <button
                key={m.id}
                onClick={() => setConfig({ ...config, model: m.id })}
                className={`w-full text-left p-2 rounded-lg border transition-all flex items-center justify-between ${
                  config.model === m.id
                    ? 'bg-accent/10 border-accent text-text-primary'
                    : 'bg-elevated/50 border-hairline hover:bg-elevated text-text-secondary'
                }`}
              >
                <div>
                  <div className="text-xs font-semibold text-text-primary">{m.name}</div>
                  <div className="text-[10px] font-mono text-text-secondary mt-0.5">
                    ${m.inputPrice.toFixed(2)} in / ${m.outputPrice.toFixed(2)} out per 1M
                  </div>
                </div>
                {config.model === m.id && <Check className="w-3.5 h-3.5 text-accent" />}
              </button>
            ))}
          </div>
        </div>

        {/* Hyperparameter Sliders */}
        <div className="p-4 rounded-xl bg-surface border border-hairline space-y-4">
          <div className="font-mono text-[11px] uppercase tracking-wider text-text-secondary font-semibold flex items-center gap-1.5">
            <Sliders className="w-3.5 h-3.5 text-accent" />
            Sampling Parameters
          </div>

          {/* Temperature */}
          <div className="space-y-1.5">
            <div className="flex justify-between font-mono text-[11px]">
              <span className="text-text-primary font-medium">Temperature</span>
              <span className="text-accent">{config.temperature.toFixed(2)}</span>
            </div>
            <input
              type="range"
              min="0.0"
              max="2.0"
              step="0.05"
              value={config.temperature}
              onChange={(e) => setConfig({ ...config, temperature: parseFloat(e.target.value) })}
              className="w-full accent-accent bg-elevated h-1 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[9px] font-mono text-text-secondary">
              <span>0.0 (Deterministic)</span>
              <span>1.0 (Creative)</span>
              <span>2.0 (Chaotic)</span>
            </div>
          </div>

          {/* Top-P Nucleus */}
          <div className="space-y-1.5">
            <div className="flex justify-between font-mono text-[11px]">
              <span className="text-text-primary font-medium">Top-P (Nucleus Sampling)</span>
              <span className="text-accent">{config.topP.toFixed(2)}</span>
            </div>
            <input
              type="range"
              min="0.1"
              max="1.0"
              step="0.05"
              value={config.topP}
              onChange={(e) => setConfig({ ...config, topP: parseFloat(e.target.value) })}
              className="w-full accent-accent bg-elevated h-1 rounded-lg cursor-pointer"
            />
            <p className="text-[10px] text-text-secondary leading-snug">
              Samples only from tokens comprising top P probability mass.
            </p>
          </div>

          {/* Max Generation Tokens */}
          <div className="space-y-1.5">
            <div className="flex justify-between font-mono text-[11px]">
              <span className="text-text-primary font-medium">Max Tokens</span>
              <span className="text-accent">{config.maxTokens}</span>
            </div>
            <input
              type="range"
              min="64"
              max="4096"
              step="64"
              value={config.maxTokens}
              onChange={(e) => setConfig({ ...config, maxTokens: parseInt(e.target.value) })}
              className="w-full accent-accent bg-elevated h-1 rounded-lg cursor-pointer"
            />
          </div>
        </div>

        {/* Preset Prompt Scenarios */}
        <div className="p-4 rounded-xl bg-surface border border-hairline space-y-2.5">
          <div className="font-mono text-[11px] uppercase tracking-wider text-text-secondary font-semibold">
            Prompt Scenarios
          </div>
          <div className="space-y-1.5">
            {TEMPLATE_PRESETS.map((t, idx) => (
              <button
                key={idx}
                onClick={() => handleApplyTemplate(t)}
                className="w-full text-left p-2 rounded-lg bg-elevated/50 hover:bg-elevated border border-hairline text-text-primary transition-colors text-xs"
              >
                {t.title}
              </button>
            ))}
          </div>
        </div>

      </div>

      {/* Right Column: Prompts, Live Streaming, & Telemetry (8 Cols) */}
      <div className="lg:col-span-8 space-y-4 flex flex-col">
        
        {/* System Prompt Input */}
        <div className="p-4 rounded-xl bg-surface border border-hairline space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-[11px] font-mono uppercase tracking-wider text-text-secondary font-semibold">
              System Prompt (Persona & Constraints)
            </label>
            <span className="text-[10px] font-mono text-text-secondary">
              ~{Math.round(config.systemPrompt.length / 4)} tokens
            </span>
          </div>
          <textarea
            rows={2}
            value={config.systemPrompt}
            onChange={(e) => setConfig({ ...config, systemPrompt: e.target.value })}
            className="w-full p-2.5 rounded-lg bg-elevated border border-hairline font-mono text-xs text-text-primary focus:outline-none focus:border-accent resize-none"
          />
        </div>

        {/* User Prompt Input */}
        <div className="p-4 rounded-xl bg-surface border border-hairline space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-[11px] font-mono uppercase tracking-wider text-text-secondary font-semibold">
              User Prompt
            </label>
            <span className="text-[10px] font-mono text-text-secondary">
              ~{Math.round(config.userPrompt.length / 4)} tokens
            </span>
          </div>
          <textarea
            rows={3}
            value={config.userPrompt}
            onChange={(e) => setConfig({ ...config, userPrompt: e.target.value })}
            className="w-full p-2.5 rounded-lg bg-elevated border border-hairline font-mono text-xs text-text-primary focus:outline-none focus:border-accent resize-none"
          />
        </div>

        {/* Action Controls & Real-Time Telemetry Bar */}
        <div className="p-3.5 rounded-xl bg-surface border border-hairline flex flex-wrap items-center justify-between gap-3 shadow-sm">
          <div className="flex items-center gap-2">
            {!isStreaming ? (
              <button
                onClick={handleRunGeneration}
                className="px-4 py-2 rounded-lg bg-accent text-white font-medium text-xs hover:bg-accent-hover transition-colors flex items-center gap-2 shadow-sm"
              >
                <Play className="w-3.5 h-3.5 fill-white" />
                <span>Execute Generation</span>
              </button>
            ) : (
              <button
                onClick={handleStopStream}
                className="px-4 py-2 rounded-lg bg-danger text-white font-medium text-xs hover:bg-danger/90 transition-colors flex items-center gap-2 shadow-sm"
              >
                <Square className="w-3.5 h-3.5 fill-white" />
                <span>Halt Stream</span>
              </button>
            )}

            <button
              onClick={() => setOutputTokens('')}
              className="p-2 rounded-lg bg-elevated border border-hairline text-text-secondary hover:text-text-primary transition-colors"
              title="Clear Output"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Live Telemetry Metrics */}
          <div className="flex items-center gap-4 text-[11px] font-mono text-text-secondary">
            <div className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-accent" />
              <span>TTFT: {telemetry.ttftMs}ms</span>
            </div>
            <div className="flex items-center gap-1">
              <Zap className="w-3.5 h-3.5 text-warning" />
              <span>Tokens: {telemetry.tokenCount}</span>
            </div>
            <div className="flex items-center gap-1">
              <DollarSign className="w-3.5 h-3.5 text-success" />
              <span>Cost: ${telemetry.estimatedCost}</span>
            </div>
          </div>
        </div>

        {/* Live Streaming Output Console */}
        <div className="flex-1 min-h-[300px] p-5 rounded-xl bg-surface border border-hairline flex flex-col">
          <div className="flex items-center justify-between pb-3 border-b border-hairline mb-3">
            <span className="font-mono text-[11px] uppercase tracking-wider text-text-secondary font-semibold flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-accent" />
              Live Autoregressive Stream Console
            </span>
            {isStreaming && (
              <div className="flex items-center gap-1 text-[11px] font-mono text-accent">
                <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                <span>Streaming tokens...</span>
              </div>
            )}
          </div>

          <div className="flex-1 font-mono text-xs leading-relaxed text-text-primary whitespace-pre-wrap overflow-y-auto">
            {outputTokens ? (
              <>
                {outputTokens}
                {isStreaming && <span className="inline-block w-2 h-4 bg-accent ml-0.5 animate-pulse" />}
              </>
            ) : (
              <div className="h-full flex items-center justify-center text-text-secondary/50 font-sans italic">
                Adjust parameters above and click "Execute Generation" to observe streaming latency, tokens, and cost.
              </div>
            )}
          </div>
        </div>

      </div>

    </div>
  );
};
