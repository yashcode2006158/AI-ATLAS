import { CareerPathItem } from '../types/content';

export const INITIAL_CAREER_PATHS: CareerPathItem[] = [
  {
    id: 'ai-engineer',
    title: 'AI Engineer',
    level: 'Mid-Senior',
    averageSalaryUs: '$165,000 - $220,000',
    description: 'Bridges software engineering and machine learning by integrating foundation models, building robust RAG pipelines, structuring agentic workflows, and deploying reliable AI APIs into production.',
    primaryResponsibilities: [
      'Architect and build hybrid RAG pipelines with dense vector stores and rerankers',
      'Integrate LLM APIs with structured schemas (Pydantic, Instructor) and fallback systems',
      'Develop stateful autonomous agents with tool-calling and memory architectures',
      'Implement synthetic evaluation harnesses (Ragas) and observability tracing (Langfuse)'
    ],
    requiredSkills: [
      { name: 'Python & Async APIs (FastAPI)', category: 'Core', level: 'Mastery' },
      { name: 'Vector Databases (Qdrant, Pinecone)', category: 'Applied', level: 'Advanced' },
      { name: 'RAG Architecture & Chunking', category: 'Applied', level: 'Mastery' },
      { name: 'Prompt Engineering & Structured Outputs', category: 'Applied', level: 'Mastery' },
      { name: 'Agent Frameworks (LangGraph, CrewAI)', category: 'Applied', level: 'Advanced' },
      { name: 'LLM Observability & Tracing', category: 'Production', level: 'Advanced' },
    ],
    skillGapsForTypicalProfiles: [
      {
        profile: 'Full-Stack / Backend Engineer (Java, Node, Go)',
        gaps: ['Vector math & embedding spaces', 'Non-deterministic evaluation strategies', 'Token optimization and KV-cache mechanics'],
        bridgeAction: 'Focus on Modern AI layer (Embeddings, Vector DBs, RAG) and hands-on LLM Playground & RAG Simulator.'
      },
      {
        profile: 'Data Analyst / BI Specialist',
        gaps: ['Async backend software architecture', 'Docker containerization and API gateways', 'Agentic cyclic loops and tool execution'],
        bridgeAction: 'Build software engineering fundamentals (FastAPI, Docker) before moving into agentic workflows.'
      }
    ],
    recommendedProjects: ['project-rag-knowledge-base', 'project-autonomous-coding-agent'],
    recommendedCerts: ['databricks-genai-engineer', 'azure-ai-engineer'],
    interviewFocus: [
      'System design for low-latency multi-tenant RAG',
      'Mitigating prompt injection and hallucination in user-facing APIs',
      'Trade-offs between fine-tuning vs RAG vs few-shot in-context learning'
    ],
  },
  {
    id: 'genai-engineer',
    title: 'Generative AI Engineer',
    level: 'Senior',
    averageSalaryUs: '$180,000 - $245,000',
    description: 'Specializes in foundation models, parameter-efficient fine-tuning (LoRA/QLoRA), alignment (DPO/RLHF), structured generation, and frontier model orchestration.',
    primaryResponsibilities: [
      'Curate, clean, and format enterprise instruction-tuning datasets',
      'Fine-tune open-weights models (Llama 3, Mistral) using PEFT/LoRA and bitsandbytes',
      'Implement constrained decoding grammars and JSON schema enforcement',
      'Benchmark and evaluate model outputs using automated LLM-as-a-judge frameworks'
    ],
    requiredSkills: [
      { name: 'PyTorch & Hugging Face Transformers', category: 'Core', level: 'Advanced' },
      { name: 'Parameter-Efficient Fine-Tuning (LoRA)', category: 'Applied', level: 'Mastery' },
      { name: 'Prompt Engineering & In-Context Learning', category: 'Applied', level: 'Mastery' },
      { name: 'Quantization (AWQ, GPTQ, FP8)', category: 'Production', level: 'Advanced' },
      { name: 'AI Safety & Jailbreak Mitigation', category: 'Specialized', level: 'Advanced' },
    ],
    skillGapsForTypicalProfiles: [
      {
        profile: 'Traditional Machine Learning Engineer',
        gaps: ['Autoregressive decoder mechanics & KV caching', 'Prompt engineering & in-context few-shot learning', 'LoRA adapter swapping architecture'],
        bridgeAction: 'Deep dive into the Modern AI and Generative AI layers, mastering Transformer self-attention and PEFT.'
      }
    ],
    recommendedProjects: ['project-ai-chatbot', 'project-rag-knowledge-base'],
    recommendedCerts: ['nvidia-genai-llm', 'databricks-genai-engineer'],
    interviewFocus: [
      'Mathematical mechanics of Low-Rank Adaptation (LoRA)',
      'Designing alignment and safety datasets for domain-specific fine-tuning',
      'Chinchilla scaling laws and compute-optimal training dynamics'
    ],
  },
  {
    id: 'agentic-ai-engineer',
    title: 'Agentic AI Engineer',
    level: 'Senior / Lead',
    averageSalaryUs: '$190,000 - $260,000',
    description: 'Designs and deploys complex autonomous agentic loops, multi-agent supervisor hierarchies, tool-use sandboxes, and persistent episodic memory systems.',
    primaryResponsibilities: [
      'Architect directed cyclic state graphs for autonomous agent reasoning (LangGraph, CrewAI)',
      'Construct secure execution sandboxes for untrusted agent-generated code and SQL queries',
      'Implement long-horizon episodic and semantic memory systems (MemGPT, vector profiles)',
      'Design deadlock prevention, cycle detection, and token budget circuit breakers'
    ],
    requiredSkills: [
      { name: 'LangGraph & Multi-Actor State Machines', category: 'Applied', level: 'Mastery' },
      { name: 'Tool Calling & Function Signatures', category: 'Applied', level: 'Mastery' },
      { name: 'Docker / MicroVM Sandboxing (gVisor)', category: 'Production', level: 'Advanced' },
      { name: 'Episodic Memory & Context Management', category: 'Specialized', level: 'Mastery' },
      { name: 'Multi-Agent Debate & Consensus Topologies', category: 'Specialized', level: 'Advanced' },
    ],
    skillGapsForTypicalProfiles: [
      {
        profile: 'Software Engineer',
        gaps: ['Probabilistic planning & non-deterministic error recovery', 'ReAct prompt design', 'Episodic memory decay math'],
        bridgeAction: 'Master the Generative AI layer with Agent Simulator, focusing on cyclic state transitions and sandboxing.'
      }
    ],
    recommendedProjects: ['project-autonomous-coding-agent'],
    recommendedCerts: ['databricks-genai-engineer'],
    interviewFocus: [
      'Designing self-healing loops for autonomous agents',
      'Sandboxing security architecture against arbitrary code execution',
      'Multi-agent consensus protocols and cost-bounding mechanisms'
    ],
  },
  {
    id: 'mlops-engineer',
    title: 'MLOps & LLMOps Engineer',
    level: 'Senior',
    averageSalaryUs: '$170,000 - $235,000',
    description: 'Constructs the infrastructure backbone for model serving, continuous batching, GPU cluster autoscaling, automated CI/CD evaluation pipelines, and observability.',
    primaryResponsibilities: [
      'Deploy and optimize high-throughput model serving engines (vLLM, Triton, TGI)',
      'Orchestrate multi-GPU Kubernetes clusters with Ray Serve and KEDA autoscaling',
      'Implement distributed OpenTelemetry tracing and token cost attribution (Langfuse)',
      'Build automated regression testing gates with synthetic evaluation benchmarks'
    ],
    requiredSkills: [
      { name: 'Kubernetes & GPU Node Scheduling', category: 'Production', level: 'Mastery' },
      { name: 'Model Serving Runtimes (vLLM, Triton)', category: 'Production', level: 'Mastery' },
      { name: 'Continuous Batching & PagedAttention', category: 'Production', level: 'Advanced' },
      { name: 'Distributed Tracing & OpenTelemetry', category: 'Production', level: 'Advanced' },
      { name: 'CI/CD Pipelines for Model Artifacts', category: 'Core', level: 'Mastery' },
    ],
    skillGapsForTypicalProfiles: [
      {
        profile: 'DevOps / Cloud Platform Engineer',
        gaps: ['GPU memory architecture (HBM, SRAM, KV cache)', 'PagedAttention and continuous batching mechanics', 'Model quantization formats (AWQ, GGUF, FP8)'],
        bridgeAction: 'Focus on AI Engineering layer: Model Serving, Low-Latency Inference, and LLMOps.'
      }
    ],
    recommendedProjects: ['project-production-rag-platform'],
    recommendedCerts: ['gcp-ml-engineer', 'nvidia-genai-llm'],
    interviewFocus: [
      'Sizing GPU clusters for peak concurrent LLM traffic',
      'Troubleshooting KV-cache memory exhaustion under sudden sequence length spikes',
      'Comparing Triton Inference Server with vLLM for multi-model workloads'
    ],
  },
  {
    id: 'ai-solutions-architect',
    title: 'Enterprise AI Architect',
    level: 'Staff / Principal',
    averageSalaryUs: '$210,000 - $290,000',
    description: 'Defines the overarching enterprise AI strategy, governance, zero-trust security, build-vs-buy roadmaps, model routing, and total cost of ownership (TCO) across business units.',
    primaryResponsibilities: [
      'Design zero-trust enterprise AI architectures with RBAC metadata filtering and PII DLP',
      'Establish enterprise model routing and semantic caching strategies to optimize FinOps',
      'Lead AI governance, compliance with EU AI Act, and corporate risk frameworks',
      'Evaluate vendor ecosystem (OpenAI vs Azure vs AWS vs Open Weights) for executive leadership'
    ],
    requiredSkills: [
      { name: 'Enterprise System Design & Zero Trust', category: 'Production', level: 'Mastery' },
      { name: 'FinOps & Semantic Caching Strategies', category: 'Production', level: 'Mastery' },
      { name: 'AI Governance, Compliance & EU AI Act', category: 'Specialized', level: 'Mastery' },
      { name: 'Compound AI System Architecture', category: 'Applied', level: 'Mastery' },
      { name: 'Executive Stakeholder Communication', category: 'Core', level: 'Mastery' },
    ],
    skillGapsForTypicalProfiles: [
      {
        profile: 'Senior Software Architect',
        gaps: ['Probabilistic failure modes in enterprise workflows', 'Vector search scaling and quantization trade-offs', 'EU AI Act high-risk classification rules'],
        bridgeAction: 'Complete the Enterprise AI layer and lead the CTO Executive Simulation mission.'
      }
    ],
    recommendedProjects: ['project-production-rag-platform'],
    recommendedCerts: ['linux-foundation-ai-ethics', 'azure-ai-engineer'],
    interviewFocus: [
      'Architecting a multi-tenant enterprise knowledge platform for 100,000 employees',
      'Balancing accuracy, latency, security, and cost across diverse enterprise use cases',
      'Formulating corporate data governance policies for generative model training and retrieval'
    ],
  },
];
