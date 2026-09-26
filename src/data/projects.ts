import { ProjectItem } from '../types/user';

export const INITIAL_PROJECTS: ProjectItem[] = [
  // ==========================================
  // BEGINNER TIER
  // ==========================================
  {
    id: 'project-ai-chatbot',
    title: 'Streaming Conversational AI Interface',
    tier: 'Beginner',
    shortDesc: 'Build a production-quality conversational interface with token streaming, system persona, and context window pruning.',
    estimatedHours: 6,
    xpReward: 150,
    problemStatement: 'Simple chatbots fail when conversations grow long, causing sudden API token limit crashes. Your goal is to build a streaming conversational assistant that maintains session history, enforces system guidelines, and dynamically prunes older messages to respect context limits.',
    architectureBlueprint: 'Client UI (React/SSE) -> Express/FastAPI Gateway -> Message History Buffer -> Sliding Window Pruner -> Model API (OpenAI/Anthropic) -> Stream Parser -> Token Renderer',
    technologies: ['React', 'TypeScript', 'FastAPI', 'OpenAI API', 'SSE'],
    requirements: [
      'Render streamed tokens smoothly with cursor animation',
      'Implement a sliding context window that preserves the system prompt while pruning oldest turns',
      'Add system persona switcher (e.g. Socratic Tutor, Senior Engineer, Executive Advisor)',
      'Display real-time token count and cost estimate per session'
    ],
    tasks: [
      {
        id: 'task-1',
        title: 'Configure Streaming API Handler',
        description: 'Set up an asynchronous route that streams token chunks using Server-Sent Events (SSE).',
        completed: true,
        hint: 'Use `stream=True` in OpenAI client and yield Server-Sent Event formatted chunks: `data: {"token": "..."}\\n\\n`.'
      },
      {
        id: 'task-2',
        title: 'Implement Context Window Memory Buffer',
        description: 'Build a token-aware sliding window that keeps total conversation tokens below 4,000.',
        completed: false,
        hint: 'Always keep index 0 (the system message) and slice messages from `[-N:]` based on token accumulation.'
      },
      {
        id: 'task-3',
        title: 'Build Resilient Frontend Stream Reader',
        description: 'Use the Fetch API with `response.body.getReader()` to decode utf-8 chunks into React state.',
        completed: false,
        hint: 'Handle trailing buffer fragments using a newline delimiter reader loop.'
      }
    ],
    starterCode: `import { OpenAI } from 'openai';

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function* streamChat(messages: Array<{ role: string; content: string }>) {
  // TODO: Implement sliding window pruning to keep tokens under 4000
  // TODO: Yield streamed token strings
}`,
    solutionCode: `import { OpenAI } from 'openai';

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function* streamChat(messages: Array<{ role: string; content: string }>) {
  const systemMessage = messages.find(m => m.role === 'system') || {
    role: 'system',
    content: 'You are NexusAI, an expert technical mentor.'
  };
  
  // Prune history to last 10 messages + system prompt
  const userHistory = messages.filter(m => m.role !== 'system').slice(-10);
  const context = [systemMessage, ...userHistory];

  const stream = await client.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: context as any,
    stream: true,
  });

  for await (const chunk of stream) {
    const token = chunk.choices[0]?.delta?.content || '';
    if (token) yield token;
  }
}`,
    portfolioOutcome: 'Production chat interface repository ready for portfolio demonstration with live streaming, token telemetry, and context resilience.',
    relatedNodeIds: ['modern-llms', 'genai-prompt-engineering'],
  },

  // ==========================================
  // INTERMEDIATE TIER
  // ==========================================
  {
    id: 'project-rag-knowledge-base',
    title: 'Enterprise Document RAG with Hybrid Search & Citations',
    tier: 'Intermediate',
    shortDesc: 'Build an end-to-end RAG system with PDF parsing, dense embeddings in Qdrant, BM25 hybrid search, and source citations.',
    estimatedHours: 14,
    xpReward: 300,
    problemStatement: 'Off-the-shelf vector search often misses exact part numbers, acronyms, and names. You must build a hybrid RAG system that fuses dense vector similarity with sparse BM25 keyword matching, reranks results, and synthesizes answers with clickable source citations.',
    architectureBlueprint: 'PDF Ingestion -> Recursive Chunking -> BGE Embeddings & BM25 Index -> Qdrant Hybrid Query -> Reciprocal Rank Fusion -> Cohere Rerank -> LLM Generation with Citations',
    technologies: ['Python', 'Qdrant', 'BM25', 'FastAPI', 'Cohere Rerank', 'LlamaIndex'],
    requirements: [
      'Parse multi-page PDFs with table preservation and metadata extraction',
      'Compute dense embeddings and sparse BM25 indices simultaneously',
      'Implement Reciprocal Rank Fusion (RRF) with configurable k factor',
      'Generate citations linking exact page numbers and quotes to model assertions'
    ],
    tasks: [
      {
        id: 'rag-task-1',
        title: 'Implement Semantic Chunking Pipeline',
        description: 'Build chunker with 400 token targets and 50 token overlap, carrying source doc title and page index.',
        completed: false,
        hint: 'Use `RecursiveCharacterTextSplitter` with separators: `["\\n\\n", "\\n", ". ", " ", ""]`.'
      },
      {
        id: 'rag-task-2',
        title: 'Configure Qdrant Hybrid Collection',
        description: 'Set up Qdrant collection with dense cosine vectors and payload indexing on document ID and access tags.',
        completed: false,
        hint: 'Enable payload schema indexing on `doc_id` and `category` fields to accelerate pre-filtered queries.'
      },
      {
        id: 'rag-task-3',
        title: 'Implement Reciprocal Rank Fusion (RRF)',
        description: 'Write the RRF formula to combine dense rank list and sparse BM25 rank list into a unified sorted list.',
        completed: false,
        hint: 'Score = 1 / (60 + dense_rank) + 1 / (60 + sparse_rank).'
      }
    ],
    starterCode: `def reciprocal_rank_fusion(dense_results: list, sparse_results: list, k: int = 60):
    # TODO: Implement RRF algorithm
    pass`,
    solutionCode: `def reciprocal_rank_fusion(dense_results: list, sparse_results: list, k: int = 60) -> list:
    scores = {}
    doc_map = {}
    
    for rank, doc in enumerate(dense_results):
        doc_id = doc["id"]
        doc_map[doc_id] = doc
        scores[doc_id] = scores.get(doc_id, 0.0) + (1.0 / (k + rank + 1))
        
    for rank, doc in enumerate(sparse_results):
        doc_id = doc["id"]
        doc_map[doc_id] = doc
        scores[doc_id] = scores.get(doc_id, 0.0) + (1.0 / (k + rank + 1))
        
    sorted_ids = sorted(scores.keys(), key=lambda d: scores[d], reverse=True)
    return [{"doc": doc_map[did], "rrf_score": scores[did]} for did in sorted_ids]`,
    portfolioOutcome: 'Enterprise-grade RAG engine demonstrating hybrid retrieval mastery, benchmarked against standard vector-only baselines.',
    relatedNodeIds: ['embeddings-vector-dbs', 'modern-rag-systems'],
  },

  // ==========================================
  // ADVANCED TIER
  // ==========================================
  {
    id: 'project-autonomous-coding-agent',
    title: 'Autonomous SWE Coding Agent with Docker Sandbox',
    tier: 'Advanced',
    shortDesc: 'Build a multi-step coding agent that reads GitHub issues, traverses codebases, generates diffs, and self-corrects using test logs.',
    estimatedHours: 22,
    xpReward: 450,
    problemStatement: 'Building an agent that writes code requires more than a single prompt. The agent must formulate a plan, look up symbols, author diffs, run tests in an isolated sandbox, interpret stack traces, and iterate until all unit tests pass.',
    architectureBlueprint: 'Issue Reader -> Code Graph Traversal -> Thought/Action Loop (ReAct) -> Tool Execution (File Read, Diff Apply, Shell Exec) -> Docker Sandbox Runner -> Test Log Parser -> Self-Correction Loop -> Git Commit Dispatch',
    technologies: ['LangGraph', 'Docker / gVisor', 'Claude 3.5 Sonnet', 'Tree-sitter', 'Python'],
    requirements: [
      'Implement cyclic state machine using LangGraph with state persistence',
      'Provide sandboxed tools: `read_file`, `write_diff`, `run_tests`, `search_symbols`',
      'Run unit tests inside isolated Docker containers with 15s execution timeout',
      'Demonstrate self-correction: if tests fail with exit code 1, feed trace back to agent for revision'
    ],
    tasks: [
      {
        id: 'swe-task-1',
        title: 'Define Agent State & Tools Schema',
        description: 'Define TypedDict state tracking messages, current git diff, test error trace, and attempt counter.',
        completed: false,
        hint: 'Include `iteration: int` and set a hard ceiling of 5 iterations to prevent runaway execution.'
      },
      {
        id: 'swe-task-2',
        title: 'Build Docker Container Test Runner Tool',
        description: 'Mount project directory read-only into ephemeral Docker container and execute `pytest`.',
        completed: false,
        hint: 'Use `docker.from_env().containers.run()` with `mem_limit="512m"` and `network_mode="none"`.'
      },
      {
        id: 'swe-task-3',
        title: 'Implement Feedback Correction Edge',
        description: 'Add conditional edge in LangGraph: if test exit code == 0 -> finish; else -> route back to reasoning node.',
        completed: false,
        hint: 'Pass the exact pytest stdout/stderr into the next model prompt with directive: "Fix this test failure".'
      }
    ],
    starterCode: `from typing import TypedDict, Sequence
from langchain_core.messages import BaseMessage

class SWEState(TypedDict):
    issue: str
    files: dict[str, str]
    current_diff: str
    test_logs: str
    is_passed: bool
    iterations: int`,
    solutionCode: `from typing import TypedDict, Literal
import subprocess

class SWEState(TypedDict):
    issue: str
    current_diff: str
    test_logs: str
    is_passed: bool
    iterations: int

def evaluate_tests(state: SWEState) -> SWEState:
    # Execute tests in isolated container
    result = subprocess.run(
        ["docker", "run", "--rm", "--network", "none", "-v", "./sandbox:/app", "test-runner", "pytest"],
        capture_output=True,
        text=True,
        timeout=20
    )
    is_passed = result.returncode == 0
    return {
        **state,
        "test_logs": result.stdout + result.stderr,
        "is_passed": is_passed,
        "iterations": state["iterations"] + 1
    }

def router(state: SWEState) -> Literal["agent_reason", "finish"]:
    if state["is_passed"] or state["iterations"] >= 5:
        return "finish"
    return "agent_reason"`,
    portfolioOutcome: 'Flagship engineering portfolio project demonstrating autonomous reasoning, secure sandbox execution, and stateful agent choreography.',
    relatedNodeIds: ['genai-agents', 'genai-memory-planning'],
  },

  // ==========================================
  // EXPERT TIER
  // ==========================================
  {
    id: 'project-production-rag-platform',
    title: 'High-Throughput Distributed AI Platform with vLLM & RBAC',
    tier: 'Expert',
    shortDesc: 'Architect and deploy an enterprise-scale AI platform with vLLM continuous batching, PII redaction, Okta SSO, and Langfuse tracing.',
    estimatedHours: 30,
    xpReward: 600,
    problemStatement: 'Deploying AI for 50,000 corporate employees demands sub-50ms token latency, high concurrency, tenant isolation, zero PII leakage, and strict cost attribution. You will build a multi-region, Kubernetes-orchestrated AI serving platform.',
    architectureBlueprint: 'Envoy Ingress -> Kong API Gateway (Okta OAuth2) -> Presidio PII Masker -> Redis Semantic Cache -> Qdrant Cluster (RBAC Metadata) -> Ray Serve with vLLM Cluster -> NeMo Guardrails -> Langfuse ClickHouse Tracing',
    technologies: ['vLLM', 'Kubernetes', 'Ray Serve', 'Qdrant', 'Redis', 'Presidio', 'Langfuse', 'OpenTelemetry'],
    requirements: [
      'Deploy vLLM with PagedAttention and FP8 quantization achieving > 2,000 tokens/sec',
      'Integrate Microsoft Presidio PII masking for HIPAA/GDPR compliance',
      'Implement Redis semantic cache returning < 15ms cached responses',
      'Enforce Qdrant single-stage metadata filtering matching user Okta security groups',
      'Emit OpenTelemetry traces to self-hosted Langfuse cluster'
    ],
    tasks: [
      {
        id: 'prod-task-1',
        title: 'Configure vLLM Kubernetes Service with Ray Serve',
        description: 'Deploy RayCluster with autoscaling worker pods and PagedAttention configuration.',
        completed: false,
        hint: 'Set `--gpu-memory-utilization 0.92` and enable `--enable-chunked-prefill` to balance prefill and decode.'
      },
      {
        id: 'prod-task-2',
        title: 'Implement PII Anonymization Middleware',
        description: 'Intercept incoming requests with Presidio Analyzer and redact SSNs, credit cards, and emails before model input.',
        completed: false,
        hint: 'Replace sensitive tokens with cryptographic placeholders `<PII_EMAIL_1>` and restore them on outgoing response stream.'
      },
      {
        id: 'prod-task-3',
        title: 'Set up Semantic Cache with Cosine Threshold',
        description: 'Compute query embedding and query Redis vector index; return cached answer if similarity > 0.96.',
        completed: false,
        hint: 'Use Redis FT.SEARCH with `@vector:[VECTOR_RANGE $radius $query_vec]`.'
      }
    ],
    starterCode: `from fastapi import FastAPI, Request
from presidio_analyzer import AnalyzerEngine
from presidio_anonymizer import AnonymizerEngine

app = FastAPI()
analyzer = AnalyzerEngine()
anonymizer = AnonymizerEngine()

@app.post("/v1/chat/completions")
async def chat_proxy(request: Request):
    # TODO: PII Anonymization
    # TODO: Semantic Cache Check
    # TODO: Forward to vLLM
    pass`,
    solutionCode: `from fastapi import FastAPI, Request
from fastapi.responses import StreamingResponse
from presidio_analyzer import AnalyzerEngine
from presidio_anonymizer import AnonymizerEngine
import httpx

app = FastAPI()
analyzer = AnalyzerEngine()
anonymizer = AnonymizerEngine()

@app.post("/v1/chat/completions")
async def chat_proxy(request: Request):
    body = await request.json()
    prompt = body["messages"][-1]["content"]
    
    # 1. PII Redaction
    results = analyzer.analyze(text=prompt, entities=["PHONE_NUMBER", "EMAIL_ADDRESS", "US_SSN"], language="en")
    anonymized = anonymizer.anonymize(text=prompt, analyzer_results=results)
    body["messages"][-1]["content"] = anonymized.text
    
    # 2. Forward to vLLM serving backend
    async def stream_generator():
        async with httpx.AsyncClient(timeout=60.0) as client:
            async with client.stream("POST", "http://vllm-service:8000/v1/chat/completions", json=body) as response:
                async for chunk in response.aiter_bytes():
                    yield chunk

    return StreamingResponse(stream_generator(), media_type="text/event-stream")`,
    portfolioOutcome: 'Enterprise AI Architect master capstone project demonstrating infrastructure, security, latency optimization, and governance readiness.',
    relatedNodeIds: ['ai-engineering-serving', 'enterprise-rag-governance', 'enterprise-model-routing'],
  },
];
