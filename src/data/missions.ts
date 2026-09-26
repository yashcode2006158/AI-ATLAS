export interface MissionChoice {
  id: string;
  label: string;
  description: string;
  impactLatencyMs: number;
  impactMonthlyCost: number;
  impactAccuracyScore: number; // -20 to +20
  impactRiskScore: number; // -20 to +20 (lower is safer)
  consequenceFeedback: string;
}

export interface MissionStep {
  stepNumber: number;
  phaseTitle: string;
  question: string;
  context: string;
  choices: MissionChoice[];
}

export interface ScenarioMission {
  id: string;
  type: 'engineering' | 'executive';
  title: string;
  roleBadge: string;
  scenarioBrief: string;
  baselineMetrics: {
    latencyMs: number;
    monthlyCost: number;
    accuracyScore: number;
    riskScore: number;
  };
  steps: MissionStep[];
}

export const SCENARIO_MISSIONS: ScenarioMission[] = [
  // 1. Engineering Mission
  {
    id: 'mission-rag-50k-docs',
    type: 'engineering',
    title: 'Architecting Enterprise RAG for 50,000 Complex Documents',
    roleBadge: 'Staff AI Systems Engineer',
    scenarioBrief: 'You are the lead AI systems engineer tasked with deploying an internal knowledge assistant over 50,000 heterogeneous technical documents (PDFs, scanned schematics, and Confluence pages) for 2,000 aerospace engineers. Make 5 critical architectural decisions with real consequences on latency, monthly cost, retrieval accuracy, and enterprise security risk.',
    baselineMetrics: {
      latencyMs: 800,
      monthlyCost: 1200,
      accuracyScore: 65,
      riskScore: 40,
    },
    steps: [
      {
        stepNumber: 1,
        phaseTitle: 'Document Ingestion & Chunking Strategy',
        question: 'How will you parse and chunk the 50,000 complex technical manuals containing dense tables?',
        context: 'Technical schematics contain critical torque specifications in multi-column tables. Fixed 500-character chunks frequently cut tables in half.',
        choices: [
          {
            id: 'chunk-fixed',
            label: 'Fixed-Size Character Splitter (500 chars, 50 overlap)',
            description: 'Fast CPU splitting without parsing document ASTs or layout tables.',
            impactLatencyMs: -100,
            impactMonthlyCost: 0,
            impactAccuracyScore: -15,
            impactRiskScore: +15,
            consequenceFeedback: 'Tables are split randomly across chunks, causing the LLM to hallucinate incorrect engineering torque values!'
          },
          {
            id: 'chunk-semantic-layout',
            label: 'Layout-Aware Structural Chunker (Unstructured.io + Markdown Table Preservation)',
            description: 'Identifies table boundaries, converts tables to Markdown HTML strings, and preserves structural hierarchy.',
            impactLatencyMs: +150,
            impactMonthlyCost: +250,
            impactAccuracyScore: +18,
            impactRiskScore: -12,
            consequenceFeedback: 'Excellent choice. All engineering tables remain intact with headers, drastically boosting retrieval precision.'
          },
          {
            id: 'chunk-full-page',
            label: 'Full Page Chunking with Vision LLM Summaries',
            description: 'Convert every page to high-res image and run multimodal VLM to extract text and image captions.',
            impactLatencyMs: +800,
            impactMonthlyCost: +1400,
            impactAccuracyScore: +14,
            impactRiskScore: -5,
            consequenceFeedback: 'High accuracy on charts, but ingestion cost quadrupled and latency exceeds the SLA during peak queries.'
          }
        ]
      },
      {
        stepNumber: 2,
        phaseTitle: 'Embedding Model & Dimensionality',
        question: 'Which embedding representation strategy will you index into your vector store?',
        context: 'Documents contain aerospace technical acronyms and domain-specific part codes not common in standard web text.',
        choices: [
          {
            id: 'embed-small-cloud',
            label: 'OpenAI text-embedding-3-small (1536-dim)',
            description: 'Turnkey cloud embedding API at $0.02 / 1M tokens.',
            impactLatencyMs: +50,
            impactMonthlyCost: +50,
            impactAccuracyScore: +5,
            impactRiskScore: +5,
            consequenceFeedback: 'Fast and cheap, but occasionally confuses similar aerospace part numbers that differ by one alphanumeric character.'
          },
          {
            id: 'embed-bge-m3',
            label: 'Self-Hosted BGE-M3 (Dense + Sparse Multi-Vector)',
            description: 'Generates dense semantic vector plus lexical sparse BM25 weights in a single forward pass on internal GPUs.',
            impactLatencyMs: -80,
            impactMonthlyCost: +180,
            impactAccuracyScore: +16,
            impactRiskScore: -10,
            consequenceFeedback: 'Outstanding technical match. The sparse lexical weights ensure exact part numbers hit 100% recall.'
          }
        ]
      },
      {
        stepNumber: 3,
        phaseTitle: 'Retrieval & Reranking Architecture',
        question: 'How do you refine top candidates before feeding them to the generation model?',
        context: 'Pure vector similarity brings 20 candidate passages, but irrelevant noise distracts the LLM.',
        choices: [
          {
            id: 'retrieval-direct',
            label: 'Direct Top-5 Cosine Similarity',
            description: 'Pass the top 5 nearest neighbors directly to the generator without secondary reranking.',
            impactLatencyMs: -120,
            impactMonthlyCost: 0,
            impactAccuracyScore: -10,
            impactRiskScore: +8,
            consequenceFeedback: 'Fast response, but irrelevant chunks frequently occupy position 1 or 2, causing prompt dilution.'
          },
          {
            id: 'retrieval-cross-encoder',
            label: 'Cross-Encoder Reranker (Cohere Rerank 3 / bge-reranker-large)',
            description: 'Retrieve top 30 vector hits, then compute full cross-attention query-passage scoring to select top 4.',
            impactLatencyMs: +90,
            impactMonthlyCost: +80,
            impactAccuracyScore: +15,
            impactRiskScore: -12,
            consequenceFeedback: 'Superior precision: cross-encoder eliminates 95% of background noise and surfaces the exact sub-paragraph needed.'
          }
        ]
      },
      {
        stepNumber: 4,
        phaseTitle: 'Enterprise Access Control & Tenant Isolation',
        question: 'How do you enforce that engineers only see manuals corresponding to their security clearance?',
        context: 'Some propulsion blueprints are ITAR-restricted and legally forbidden from junior contractors.',
        choices: [
          {
            id: 'sec-post-filter',
            label: 'Post-Retrieval Filtering in Application Code',
            description: 'Query the global vector index, then discard documents in Python if the user lacks clearance.',
            impactLatencyMs: +40,
            impactMonthlyCost: 0,
            impactAccuracyScore: -12,
            impactRiskScore: +25,
            consequenceFeedback: 'CRITICAL VULNERABILITY! When top-5 hits are all ITAR docs, filtering them out leaves 0 results for authorized context, and embedding vectors can be probed via timing attacks.'
          },
          {
            id: 'sec-pre-filter',
            label: 'Single-Stage HNSW Payload Pre-Filtering (Qdrant RBAC)',
            description: 'Vector search graph traversal is mathematically restricted only to nodes matching the user security group bitmask.',
            impactLatencyMs: -10,
            impactMonthlyCost: +40,
            impactAccuracyScore: +8,
            impactRiskScore: -20,
            consequenceFeedback: 'Zero-trust compliant. The vector engine never evaluates restricted nodes, ensuring complete legal and ITAR compliance.'
          }
        ]
      },
      {
        stepNumber: 5,
        phaseTitle: 'LLM Generation & Prompt Caching',
        question: 'Which model and caching strategy will you use to synthesize the final cited answers?',
        context: 'Engineers ask 10,000 queries per day, many focusing on the same central flight manual.',
        choices: [
          {
            id: 'llm-uncached-gpt4',
            label: 'Direct GPT-4o with Zero Caching',
            description: 'Full prompt sent on every single request to frontier API.',
            impactLatencyMs: +350,
            impactMonthlyCost: +1600,
            impactAccuracyScore: +10,
            impactRiskScore: 0,
            consequenceFeedback: 'High answer quality, but monthly billing ballooned to $2,800/mo exceeding department budget.'
          },
          {
            id: 'llm-cached-sonnet',
            label: 'Claude 3.5 Sonnet with Anthropic Prompt Caching & Redis Semantic Cache',
            description: 'Cache static system instructions and frequent manual excerpts; return instant hits for duplicate questions.',
            impactLatencyMs: -220,
            impactMonthlyCost: -450,
            impactAccuracyScore: +12,
            impactRiskScore: -8,
            consequenceFeedback: 'Masterful architecture. Prompt caching and semantic cache cut monthly bill by 40% while slashing latency below 600ms.'
          }
        ]
      }
    ]
  },

  // 2. Executive / CTO Mission
  {
    id: 'mission-cto-enterprise-adoption',
    type: 'executive',
    title: 'CTO Simulation: Deploying Generative AI across a 5,000-Person Enterprise',
    roleBadge: 'Chief Technology Officer (CTO)',
    scenarioBrief: 'You are the CTO of a Global 2000 financial services enterprise with a $500,000 Year-1 Generative AI budget. You must lead your company through model provider selection, build-vs-buy decisions, EU AI Act compliance, and workforce adoption. Every choice impacts your Board Confidence, Security Posture, Capital Burn, and Time-to-Value.',
    baselineMetrics: {
      latencyMs: 100, // Used here as Time-to-Value in days
      monthlyCost: 41666, // $500k / 12
      accuracyScore: 70, // Board Confidence Score
      riskScore: 50, // Regulatory & Security Risk
    },
    steps: [
      {
        stepNumber: 1,
        phaseTitle: 'Foundation Model Strategy: Commercial Cloud vs Open Weights',
        question: 'Which foundation model strategy will serve as the core of the enterprise AI initiative?',
        context: 'Your board is concerned about data sovereignty and IP rights, while product teams demand state-of-the-art capabilities.',
        choices: [
          {
            id: 'cto-commercial-cloud',
            label: 'Multi-Tenant Commercial Cloud APIs (OpenAI / Anthropic via Azure)',
            description: 'Sign Enterprise Zero Data Retention (ZDR) agreement with Azure OpenAI and Anthropic.',
            impactLatencyMs: -45, // Faster Time-to-Value
            impactMonthlyCost: +8000,
            impactAccuracyScore: +15,
            impactRiskScore: -5,
            consequenceFeedback: 'Rapid 30-day time-to-value. Teams begin prototyping immediately with frontier intelligence; ZDR satisfies legal counsel.'
          },
          {
            id: 'cto-self-hosted-dgx',
            label: 'On-Premise GPU Cluster (2x NVIDIA DGX H100s) + Open Weights',
            description: 'Purchase hardware ($700k CapEx), install Llama 3 70B in corporate data center.',
            impactLatencyMs: +90, // Slower deployment
            impactMonthlyCost: -15000, // Fixed cost after purchase
            impactAccuracyScore: -10, // Board upset about huge initial CapEx
            impactRiskScore: -18, // Maximum privacy
            consequenceFeedback: 'Hardware lead times delayed deployment by 4 months; CapEx depleted first-year AI budget, but compliance team is ecstatic.'
          }
        ]
      },
      {
        stepNumber: 2,
        phaseTitle: 'Build vs Buy: Enterprise Knowledge Assistant',
        question: 'Will your engineering team build an in-house RAG platform from scratch or purchase an enterprise SaaS solution?',
        context: 'Your VP of Engineering wants to build custom LangGraph microservices; the Head of Sales wants an instant solution.',
        choices: [
          {
            id: 'cto-buy-glean',
            label: 'Buy: Enterprise SaaS Knowledge Search (Glean / Microsoft 365 Copilot)',
            description: 'Turnkey SaaS connecting to 40+ corporate connectors out of the box.',
            impactLatencyMs: -30,
            impactMonthlyCost: +12000,
            impactAccuracyScore: +10,
            impactRiskScore: -10,
            consequenceFeedback: 'Immediate adoption across sales and HR. High recurring per-seat license cost, but zero engineering maintenance overhead.'
          },
          {
            id: 'cto-build-inhouse',
            label: 'Build: Dedicated 4-Engineer Platform Team with Open-Source Frameworks',
            description: 'Develop proprietary compound AI platform tailored to company proprietary risk scoring models.',
            impactLatencyMs: +60,
            impactMonthlyCost: +22000, // Engineer salaries
            impactAccuracyScore: +18,
            impactRiskScore: +5,
            consequenceFeedback: 'Takes 5 months to ship v1, but creates a defensible proprietary IP asset tailored to the firm’s algorithmic edge.'
          }
        ]
      },
      {
        stepNumber: 3,
        phaseTitle: 'AI Governance & EU AI Act Compliance',
        question: 'How do you establish internal review boards and compliance gating for AI systems?',
        context: 'The EU AI Act mandates strict compliance, transparency, and human oversight for high-risk financial credit scoring systems.',
        choices: [
          {
            id: 'cto-lightweight-policy',
            label: 'Self-Certification Checklist for Engineering Teams',
            description: 'Lightweight checklist trusting tech leads to audit their own models.',
            impactLatencyMs: -20,
            impactMonthlyCost: 0,
            impactAccuracyScore: -12,
            impactRiskScore: +30,
            consequenceFeedback: 'DISASTER: A credit triage model deployed with discriminatory bias, triggering an audit from financial regulators!'
          },
          {
            id: 'cto-formal-safety-board',
            label: 'Formal AI Ethics Committee + Automated CI/CD Guardrail Testing',
            description: 'Multidisciplinary board (Legal, Tech, Security) gating production deploys with Deepeval automated bias scans.',
            impactLatencyMs: +15,
            impactMonthlyCost: +4000,
            impactAccuracyScore: +14,
            impactRiskScore: -25,
            consequenceFeedback: 'Board and regulators praise the proactive compliance posture. The firm receives ISO 42001 certification ahead of schedule.'
          }
        ]
      }
    ]
  }
];
