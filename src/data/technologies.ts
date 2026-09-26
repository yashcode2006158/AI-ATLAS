import { TechnologyItem } from '../types/content';

export const INITIAL_TECHNOLOGIES: TechnologyItem[] = [
  // Languages
  {
    id: 'python',
    name: 'Python',
    category: 'languages',
    badge: 'Standard',
    tagline: 'The undisputed lingua franca of artificial intelligence and scientific computing',
    whyItExists: 'Provides clean high-level ergonomics, dynamic typing, and rapid prototyping while offloading computationally intensive linear algebra to C, C++, and CUDA via bindings.',
    whenToUse: 'Primary language for 95% of AI modeling, data preparation, pipeline orchestration, and server-side model integration.',
    alternatives: ['Rust', 'Julia', 'C++', 'Mojo'],
    difficulty: 'Beginner',
    industryAdoption: 'Pervasive',
    githubStars: '200k+',
    codeSnippet: {
      language: 'python',
      title: 'Vectorized Cosine Similarity',
      code: `import numpy as np

def cosine_similarity(a: np.ndarray, b: np.ndarray) -> float:
    """Computes cosine similarity between two 1D embedding vectors."""
    dot_product = np.dot(a, b)
    norm_a = np.linalg.norm(a)
    norm_b = np.linalg.norm(b)
    if norm_a == 0 or norm_b == 0:
        return 0.0
    return float(dot_product / (norm_a * norm_b))`
    },
    learningPathIn: 'Foundations -> Linear Algebra -> Python & High-Performance Data Ecosystem',
    websiteUrl: 'https://python.org',
  },
  {
    id: 'rust',
    name: 'Rust',
    category: 'languages',
    badge: 'High Perf',
    tagline: 'Memory-safe systems programming for extreme performance AI tooling and inference engines',
    whyItExists: 'Delivers C++ level bare-metal throughput with zero-cost abstractions and compile-time memory safety guarantees, eliminating segfaults and data races.',
    whenToUse: 'Building vector database engines (Qdrant), tokenizers (HuggingFace tokenizers), and ultra-low latency model runtimes (Burn, Candle).',
    alternatives: ['C++', 'Go', 'Mojo'],
    difficulty: 'Advanced',
    industryAdoption: 'Growing',
    githubStars: '98k+',
    codeSnippet: {
      language: 'rust',
      title: 'Fast Dot Product in Rust',
      code: `pub fn dot_product(v1: &[f32], v2: &[f32]) -> f32 {
    assert_eq!(v1.len(), v2.len(), "Vector lengths must match");
    v1.iter().zip(v2.iter()).map(|(a, b)| a * b).sum()
}`
    },
    learningPathIn: 'Foundations -> Systems Programming for AI',
    websiteUrl: 'https://rust-lang.org',
  },

  // Frameworks
  {
    id: 'pytorch',
    name: 'PyTorch',
    category: 'frameworks',
    badge: 'Industry Standard',
    tagline: 'The leading open-source deep learning framework based on dynamic computation graphs',
    whyItExists: 'Pioneered eager execution and dynamic autograd, making deep learning development feel like native, debuggable Python rather than static graph compilation.',
    whenToUse: 'Model research, pre-training, fine-tuning, and production deployment of transformers and computer vision models.',
    alternatives: ['JAX', 'TensorFlow', 'MLX'],
    difficulty: 'Intermediate',
    industryAdoption: 'Pervasive',
    githubStars: '84k+',
    codeSnippet: {
      language: 'python',
      title: 'PyTorch Multi-Head Self-Attention',
      code: `import torch
import torch.nn as nn

class AttentionHead(nn.Module):
    def __init__(self, d_model: int, d_k: int):
        super().__init__()
        self.q = nn.Linear(d_model, d_k, bias=False)
        self.k = nn.Linear(d_model, d_k, bias=False)
        self.v = nn.Linear(d_model, d_k, bias=False)
        self.scale = 1.0 / (d_k ** 0.5)

    def forward(self, x: torch.Tensor) -> torch.Tensor:
        # B: batch, T: seq_len, D: d_model
        Q, K, V = self.q(x), self.k(x), self.v(x)
        scores = torch.matmul(Q, K.transpose(-2, -1)) * self.scale
        attn = torch.softmax(scores, dim=-1)
        return torch.matmul(attn, V)`
    },
    learningPathIn: 'AI Fundamentals -> Deep Learning & Neural Networks -> Transformers',
    websiteUrl: 'https://pytorch.org',
  },
  {
    id: 'jax',
    name: 'JAX',
    category: 'frameworks',
    badge: 'Research Favorite',
    tagline: 'Composable transformations of Python+NumPy programs: differentiate, vectorize, JIT to XLA',
    whyItExists: 'Brings functional purity to high-performance numerical computing. Enables seamless compilation to GPUs and TPUs via Google XLA with automatic vectorization (`vmap`).',
    whenToUse: 'Frontier AI research, reinforcement learning, physics-informed neural networks, and massive cluster TPU pretraining.',
    alternatives: ['PyTorch', 'TensorFlow'],
    difficulty: 'Advanced',
    industryAdoption: 'Growing',
    githubStars: '30k+',
    learningPathIn: 'Foundations -> Multivariable Calculus -> JAX Advanced Optimization',
    websiteUrl: 'https://github.com/google/jax',
  },

  // LLM Platforms
  {
    id: 'openai-api',
    name: 'OpenAI API',
    category: 'llm-platforms',
    badge: 'Frontier',
    tagline: 'State-of-the-art multimodal and reasoning models (GPT-4o, o1, o3-mini)',
    whyItExists: 'Sets the benchmark for frontier model reasoning, vision capabilities, structured JSON output compliance, and developer ecosystem tooling.',
    whenToUse: 'High-reasoning enterprise tasks, multimodal document extraction, complex autonomous agent loops, and initial product prototyping.',
    alternatives: ['Anthropic Claude', 'Google Gemini', 'Mistral'],
    difficulty: 'Beginner',
    industryAdoption: 'Pervasive',
    codeSnippet: {
      language: 'python',
      title: 'OpenAI Structured Outputs with Pydantic',
      code: `from openai import OpenAI
from pydantic import BaseModel

class ContractAnalysis(BaseModel):
    risk_level: str
    indemnity_clause_present: bool
    governing_jurisdiction: str
    critical_findings: list[str]

client = OpenAI()
completion = client.beta.chat.completions.parse(
    model="gpt-4o-2024-08-06",
    messages=[
        {"role": "system", "content": "Analyze the legal agreement."},
        {"role": "user", "content": "This agreement shall be governed by the laws of Delaware..."}
    ],
    response_format=ContractAnalysis,
)
print(completion.choices[0].message.parsed)`
    },
    learningPathIn: 'Modern AI -> Large Language Models -> Prompt Engineering',
    websiteUrl: 'https://platform.openai.com',
  },
  {
    id: 'anthropic-claude',
    name: 'Anthropic Claude',
    category: 'llm-platforms',
    badge: 'Coding & Analysis',
    tagline: 'Frontier models with 200k context windows, leading coding capabilities, and computer-use agents',
    whyItExists: 'Built with Constitutional AI principles, delivering superior technical analysis, software engineering benchmarks, nuanced human-like tone, and low hallucination rates.',
    whenToUse: 'Software engineering copilots, massive legal/financial document analysis, and safety-critical enterprise deployments.',
    alternatives: ['OpenAI GPT-4o', 'Google Gemini', 'Llama 3.3'],
    difficulty: 'Beginner',
    industryAdoption: 'Industry Standard',
    learningPathIn: 'Modern AI -> Prompt Engineering -> Autonomous AI Agents',
    websiteUrl: 'https://anthropic.com',
  },

  // Agent Frameworks
  {
    id: 'langchain-langgraph',
    name: 'LangGraph & LangChain',
    category: 'agent-frameworks',
    badge: 'Cyclic Graph',
    tagline: 'Stateful, multi-actor orchestration for building resilient autonomous agent loops',
    whyItExists: 'Traditional linear DAG chains fail when agents need loops, memory branching, human-in-the-loop approvals, and durable persistence. LangGraph treats agents as state graphs.',
    whenToUse: 'Production multi-step autonomous workflows requiring state rollbacks, human validation gates, and complex conditional branching.',
    alternatives: ['CrewAI', 'LlamaIndex Workflows', 'AutoGen'],
    difficulty: 'Advanced',
    industryAdoption: 'Industry Standard',
    githubStars: '95k+',
    codeSnippet: {
      language: 'python',
      title: 'LangGraph Agent State Definition',
      code: `from typing import TypedDict, Annotated, Sequence
import operator
from langchain_core.messages import BaseMessage

class AgentState(TypedDict):
    messages: Annotated[Sequence[BaseMessage], operator.add]
    active_tool: str
    iteration_count: int
    is_complete: bool`
    },
    learningPathIn: 'Generative AI -> Autonomous AI Agents -> Multi-Agent Architectures',
    websiteUrl: 'https://langchain-ai.github.io/langgraph/',
  },
  {
    id: 'crewai',
    name: 'CrewAI',
    category: 'agent-frameworks',
    badge: 'Multi-Agent',
    tagline: 'Role-playing, collaborative AI agent teams that mirror human enterprise departments',
    whyItExists: 'Simplifies multi-agent orchestration by letting developers assign intuitive roles, goals, backstories, and delegation hierarchies to teams of cooperating agents.',
    whenToUse: 'Content creation pipelines, research and synthesis teams, and automated code review workflows.',
    alternatives: ['LangGraph', 'AutoGen', 'MetaGPT'],
    difficulty: 'Intermediate',
    industryAdoption: 'Growing',
    githubStars: '24k+',
    learningPathIn: 'Generative AI -> Multi-Agent Architectures',
    websiteUrl: 'https://crewai.com',
  },

  // Vector DBs
  {
    id: 'qdrant',
    name: 'Qdrant',
    category: 'vector-dbs',
    badge: 'Rust Engine',
    tagline: 'High-performance vector similarity search engine with advanced payload-based filtering',
    whyItExists: 'Written in Rust for sub-millisecond similarity search, true payload filtering during HNSW graph traversal (pre-filtering), and multi-tenant partitioning.',
    whenToUse: 'Production enterprise RAG requiring strict role-based access control, high concurrency, and billions of vectors.',
    alternatives: ['Pinecone', 'Milvus', 'pgvector', 'Weaviate'],
    difficulty: 'Intermediate',
    industryAdoption: 'Industry Standard',
    githubStars: '22k+',
    learningPathIn: 'Modern AI -> Dense Embeddings & Vector Databases -> RAG Systems',
    websiteUrl: 'https://qdrant.tech',
  },
  {
    id: 'pgvector',
    name: 'pgvector',
    category: 'vector-dbs',
    badge: 'Postgres Native',
    tagline: 'Open-source vector similarity search extension for PostgreSQL',
    whyItExists: 'Allows engineering teams to store vector embeddings directly alongside their existing relational application data, avoiding the operational overhead of a separate database.',
    whenToUse: 'Early-to-medium scale applications where transactional relational data and semantic vectors need ACID consistency in one database.',
    alternatives: ['Qdrant', 'Pinecone', 'ClickHouse Vector'],
    difficulty: 'Beginner',
    industryAdoption: 'Pervasive',
    githubStars: '16k+',
    learningPathIn: 'Modern AI -> Vector Databases -> AI Engineering',
    websiteUrl: 'https://github.com/pgvector/pgvector',
  },

  // Infrastructure & Serving
  {
    id: 'vllm',
    name: 'vLLM',
    category: 'infrastructure',
    badge: 'High Throughput',
    tagline: 'High-throughput and low-latency LLM serving engine powered by PagedAttention',
    whyItExists: 'Eliminates GPU memory fragmentation from dynamic sequence KV-caches via virtual memory paging, unlocking 2x–4x higher serving throughput.',
    whenToUse: 'Self-hosting open-weights foundation models (Llama 3, Mistral, DeepSeek) in private clouds or Kubernetes clusters.',
    alternatives: ['Triton Inference Server', 'TGI', 'TensorRT-LLM'],
    difficulty: 'Advanced',
    industryAdoption: 'Industry Standard',
    githubStars: '38k+',
    learningPathIn: 'AI Engineering -> Model Serving & Low-Latency Inference',
    websiteUrl: 'https://vllm.ai',
  },
  {
    id: 'docker-kubernetes',
    name: 'Docker & Kubernetes',
    category: 'infrastructure',
    badge: 'Cloud Native',
    tagline: 'Containerization and cluster orchestration for scalable, fault-tolerant AI workloads',
    whyItExists: 'Ensures reproducible CUDA environments, automated GPU node scheduling, horizontal autoscaling, and zero-downtime rolling model updates.',
    whenToUse: 'Deploying multi-tenant model serving, distributed vector databases, and asynchronous data processing pipelines at scale.',
    alternatives: ['Docker Compose', 'Nomad', 'Ray Cluster'],
    difficulty: 'Intermediate',
    industryAdoption: 'Pervasive',
    learningPathIn: 'AI Engineering -> Production AI Systems',
    websiteUrl: 'https://kubernetes.io',
  },

  // MLOps & Observability
  {
    id: 'langfuse',
    name: 'Langfuse',
    category: 'mlops',
    badge: 'Open Source',
    tagline: 'Open-source LLM engineering platform: observability, tracing, prompt management, and evaluations',
    whyItExists: 'Provides end-to-end visibility into production LLM applications: tracking latency, token usage, cost breakdowns, user feedback, and prompt versions.',
    whenToUse: 'Production AI monitoring, prompt iteration, and regression testing before pushing model updates to production.',
    alternatives: ['Arize Phoenix', 'Weights & Biases Weave', 'Helicone'],
    difficulty: 'Intermediate',
    industryAdoption: 'Industry Standard',
    githubStars: '7k+',
    learningPathIn: 'AI Engineering -> LLMOps, Tracing & Production Observability',
    websiteUrl: 'https://langfuse.com',
  },
  {
    id: 'ragas',
    name: 'Ragas',
    category: 'mlops',
    badge: 'Evaluation',
    tagline: 'Framework for automated reference-free evaluation of Retrieval Augmented Generation pipelines',
    whyItExists: 'Quantifies RAG performance across objective metrics: faithfulness, answer relevance, context precision, and context recall without manual human labeling.',
    whenToUse: 'Automated CI/CD quality testing when tuning chunk sizes, embedding models, or retrieval prompts.',
    alternatives: ['Deepeval', 'Promptfoo', 'Giskard'],
    difficulty: 'Intermediate',
    industryAdoption: 'Growing',
    githubStars: '9k+',
    learningPathIn: 'AI Engineering -> AI Evaluation & Guardrails',
    websiteUrl: 'https://ragas.io',
  },

  // Security & Governance
  {
    id: 'nemo-guardrails',
    name: 'NeMo Guardrails',
    category: 'security',
    badge: 'Enterprise Safety',
    tagline: 'Open-source toolkit by NVIDIA for adding programmable safety guardrails to conversational AI',
    whyItExists: 'Enforces topical rails, safety rails, security rails (blocking jailbreaks and prompt injections), and factual moderation before requests hit models.',
    whenToUse: 'Customer-facing enterprise assistants and regulated industries (healthcare, finance) requiring strict conversation boundaries.',
    alternatives: ['Llama Guard', 'Lakera Gandalf', 'Microsoft Presidio'],
    difficulty: 'Advanced',
    industryAdoption: 'Growing',
    githubStars: '6k+',
    learningPathIn: 'AI Engineering -> AI Evaluation & Guardrails -> Enterprise Governance',
    websiteUrl: 'https://github.com/NVIDIA/NeMo-Guardrails',
  },
];
