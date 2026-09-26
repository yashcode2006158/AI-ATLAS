import { RoadmapLayer } from '../types/roadmap';

export const ROADMAP_LAYERS: RoadmapLayer[] = [
  {
    id: 'foundations',
    order: 1,
    name: 'Foundations',
    tagline: 'Mathematical & computational bedrock',
    badge: 'Foundations',
    description: 'Linear algebra, calculus, probability, and Python essential for understanding how AI systems operate.',
    accentColor: '#38BDF8', // Cyan
  },
  {
    id: 'ai-core',
    order: 2,
    name: 'AI Core',
    tagline: 'From fundamentals to transformers',
    badge: 'AI Core',
    description: 'Supervised & unsupervised learning, backpropagation, CNNs, RNNs, and the self-attention architecture that powers modern AI.',
    accentColor: '#818CF8', // Indigo
  },
  {
    id: 'generative-ai',
    order: 3,
    name: 'Generative AI',
    tagline: 'Agents, RAG, and prompt engineering',
    badge: 'Generative',
    description: 'Building cognitive loops: ReAct frameworks, function calling, vector memory, multi-agent coordination, and Retrieval-Augmented Generation.',
    accentColor: '#A855F7', // Purple
  },
  {
    id: 'production',
    order: 4,
    name: 'Production & Scale',
    tagline: 'Engineering, deployment, and governance',
    badge: 'Production',
    description: 'Model serving, low-latency inference, observability, containerization, evaluation, and enterprise-grade compliance and governance.',
    accentColor: '#F59E0B', // Amber
  },
];
