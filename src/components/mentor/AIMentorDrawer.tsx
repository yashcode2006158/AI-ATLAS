import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  X,
  Send,
  Compass,
  Cpu,
  ArrowUpRight,
  Bot,
  User,
  Sliders
} from 'lucide-react';
import { useAppStore, AppView } from '../../store/useStore';
import { useUserStore } from '../../store/useUserStore';
import { useContentStore } from '../../store/useContentStore';

export const AIMentorDrawer: React.FC = () => {
  const {
    isMentorOpen,
    setMentorOpen,
    mentorMessages,
    addMentorMessage,
    learningMode,
    view,
    activeNodeId,
    activeSimulation,
    activeArchitectureId,
    activeProjectId,
    setView
  } = useAppStore();

  const { user } = useUserStore();
  const { nodes } = useContentStore();

  const [inputPrompt, setInputPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [mentorMessages, isGenerating]);

  // Context-tailored prompt suggestions based on active page and learning mode
  const getContextSuggestions = () => {
    if (view === 'roadmap' && activeNodeId) {
      const node = nodes.find(n => n.id === activeNodeId);
      return [
        `Explain ${node?.title || 'this concept'} like I'm an ${learningMode}`,
        `What are the common production pitfalls of ${node?.title}?`,
        `How does ${node?.title} connect to my target role (${user.targetCareer})?`
      ];
    }
    if (view === 'simulations') {
      return [
        `Why is the ${activeSimulation.toUpperCase()} simulator behaving this way?`,
        `How do temperature and top-p mathematically interact?`,
        `What is the difference between bi-encoders and cross-encoders in RAG?`
      ];
    }
    if (view === 'enterprise') {
      return [
        `Explain the trade-offs of this architecture for a CTO`,
        `How do we achieve zero-trust RBAC in vector search?`,
        `What is the estimated token cost for 10,000 daily users?`
      ];
    }
    return [
      `What should I learn next based on my current level (${user.levelTitle})?`,
      `Explain Transformers from first principles`,
      `Am I ready to apply for an AI Engineer role?`
    ];
  };

  const handleSend = (text: string) => {
    if (!text.trim() || isGenerating) return;

    addMentorMessage({
      sender: 'user',
      text: text.trim(),
    });
    setInputPrompt('');
    setIsGenerating(true);

    // Context-aware intelligent pedagogical generator
    setTimeout(() => {
      let reply = '';
      let action: { label: string; view: AppView; targetId?: string } | undefined = undefined;
      const lower = text.toLowerCase();

      if (lower.includes('transformer') || lower.includes('attention')) {
        if (learningMode === 'beginner') {
          reply = "Imagine a crowded conference room where everyone is talking at once. Legacy AI tried to listen to each word one after another. A Transformer is like having the supernatural ability to look at all 100 people at once, calculating an invisible laser beam of 'attention' between words that belong together (like 'bank' and 'river' vs 'bank' and 'money').";
        } else if (learningMode === 'executive') {
          reply = "The Transformer architecture eliminated the sequential bottleneck of recurrent networks, allowing massive parallelization on modern GPU clusters. This unlocked scaling laws where model capability scales predictably with compute and data, establishing foundation models as the standard compute infrastructure for enterprise automation.";
        } else {
          reply = "The Transformer replaces recurrence with Scaled Dot-Product Attention: Attention(Q, K, V) = softmax(QK^T / √d_k) V. Queries and Keys compute pairwise semantic affinities across all sequence positions simultaneously, scaled by 1/√d_k to stabilize softmax variance. FlashAttention optimizes this by tiling matrix blocks into fast GPU SRAM, avoiding high-bandwidth memory roundtrips.";
        }
        action = { label: 'Open Transformer Node', view: 'roadmap', targetId: 'modern-transformers' };
      } else if (lower.includes('what should i learn next') || lower.includes('next')) {
        reply = `You have completed ${user.completedNodeIds.length} modules and reached Level ${user.level} (${user.levelTitle}). Based on your target role (${user.targetCareer}), your next highest-leverage node is 'The Transformer Architecture & Self-Attention', followed by the hands-on RAG Simulator.`;
        action = { label: 'Launch RAG Simulator', view: 'simulations' };
      } else if (lower.includes('rag') || lower.includes('retrieval')) {
        reply = "In production RAG, pure vector search recall caps at ~60-70% because dense embeddings miss exact alphanumeric codes and acronyms. The enterprise standard is Hybrid Search: combine sparse BM25 with dense embeddings via Reciprocal Rank Fusion (RRF), then pass the top 30 hits through a cross-encoder reranker (e.g. Cohere Rerank 3) before feeding context to the LLM.";
        action = { label: 'Inspect Enterprise RAG Blueprint', view: 'enterprise', targetId: 'knowledge-assistant' };
      } else if (lower.includes('ready') || lower.includes('career') || lower.includes('job')) {
        reply = `To be competitive for an ${user.levelTitle} or AI Engineer role, hiring managers look for: 1) Mastery of hybrid retrieval and chunking trade-offs, 2) Production experience with vLLM continuous batching and latency SLAs, 3) End-to-end evaluation pipelines using Ragas, and 4) An active portfolio project showing autonomous agentic loops with sandboxed tool calling.`;
        action = { label: 'Review Career Gap Analysis', view: 'careers' };
      } else {
        reply = `Analyzing your inquiry through the ${learningMode.toUpperCase()} lens:\n\nIn modern AI systems, success hinges on decomposing probabilistic model reasoning into structured deterministic software harnesses. Foundation models provide flexible reasoning, while vector databases, API gateways, and sandbox executors guarantee reliability, compliance, and deterministic execution.`;
        action = { label: 'Explore Interactive Tech Universe', view: 'roadmap' };
      }

      addMentorMessage({
        sender: 'mentor',
        text: reply,
        suggestedAction: action,
      });
      setIsGenerating(false);
    }, 900);
  };

  if (!isMentorOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-surface border-l border-hairline shadow-2xl flex flex-col glass-panel animate-in slide-in-from-right duration-200">
      
      {/* Header */}
      <div className="p-4 border-b border-hairline flex items-center justify-between bg-surface/90">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-accent/15 border border-accent/30 flex items-center justify-center text-accent">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-semibold text-text-primary flex items-center gap-1.5">
              Nexus AI Mentor
              <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
            </div>
            <div className="text-[10px] font-mono text-text-secondary flex items-center gap-1">
              <span>Lens:</span>
              <span className="text-accent capitalize font-medium">{learningMode}</span>
              <span>•</span>
              <span>Context Aware</span>
            </div>
          </div>
        </div>

        <button
          onClick={() => setMentorOpen(false)}
          className="p-1 rounded-md text-text-secondary hover:text-text-primary hover:bg-elevated transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
        {mentorMessages.map((msg) => {
          const isMentor = msg.sender === 'mentor';
          return (
            <div
              key={msg.id}
              className={`flex gap-3 ${isMentor ? 'items-start' : 'items-start flex-row-reverse'}`}
            >
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 border ${
                  isMentor
                    ? 'bg-accent/15 border-accent/30 text-accent'
                    : 'bg-elevated border-hairline text-text-primary'
                }`}
              >
                {isMentor ? <Bot className="w-3.5 h-3.5" /> : <User className="w-3.5 h-3.5" />}
              </div>

              <div className={`space-y-2 max-w-[82%] ${isMentor ? 'text-left' : 'text-right'}`}>
                <div
                  className={`p-3 rounded-xl border leading-relaxed text-xs ${
                    isMentor
                      ? 'bg-elevated/70 border-hairline text-text-primary'
                      : 'bg-accent text-white border-transparent'
                  }`}
                >
                  <p className="whitespace-pre-line">{msg.text}</p>
                </div>

                {msg.suggestedAction && (
                  <button
                    onClick={() => {
                      setView(msg.suggestedAction!.view, {
                        nodeId: msg.suggestedAction!.targetId,
                        archId: msg.suggestedAction!.targetId,
                      });
                      setMentorOpen(false);
                    }}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-accent/10 border border-accent/25 text-accent hover:bg-accent/20 transition-colors text-[11px] font-medium"
                  >
                    <span>{msg.suggestedAction.label}</span>
                    <ArrowUpRight className="w-3 h-3" />
                  </button>
                )}

                <div className="text-[9px] font-mono text-text-secondary/70">
                  {msg.timestamp}
                </div>
              </div>
            </div>
          );
        })}

        {isGenerating && (
          <div className="flex gap-3 items-center text-text-secondary">
            <div className="w-6 h-6 rounded-full bg-accent/15 border border-accent/30 flex items-center justify-center text-accent shrink-0">
              <Bot className="w-3.5 h-3.5" />
            </div>
            <div className="flex items-center gap-1 px-3 py-2 rounded-lg bg-elevated border border-hairline text-[11px] font-mono">
              <span className="animate-pulse">Reasoning through {learningMode} lens</span>
              <span className="w-1 h-1 rounded-full bg-accent animate-bounce" />
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Context-aware suggestions */}
      <div className="p-3 border-t border-hairline bg-elevated/40 space-y-1.5">
        <div className="text-[10px] font-mono text-text-secondary flex items-center gap-1">
          <Sliders className="w-3 h-3" />
          <span>Recommended Prompts:</span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {getContextSuggestions().map((suggestion, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(suggestion)}
              className="text-[11px] text-left px-2.5 py-1 rounded-md bg-surface border border-hairline hover:border-accent/40 text-text-primary hover:text-accent transition-colors"
            >
              {suggestion}
            </button>
          ))}
        </div>
      </div>

      {/* Prompt Input */}
      <div className="p-3 border-t border-hairline bg-surface">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend(inputPrompt);
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            placeholder={`Ask NexusAI (${learningMode} lens)...`}
            value={inputPrompt}
            onChange={(e) => setInputPrompt(e.target.value)}
            disabled={isGenerating}
            className="flex-1 px-3 py-2 rounded-lg bg-elevated border border-hairline text-xs text-text-primary placeholder:text-text-secondary focus:outline-none focus:border-accent"
          />
          <button
            type="submit"
            disabled={!inputPrompt.trim() || isGenerating}
            className="p-2 rounded-lg bg-accent text-white hover:bg-accent-hover disabled:opacity-50 transition-colors"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>

    </div>
  );
};
