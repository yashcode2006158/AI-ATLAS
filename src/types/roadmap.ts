import { ConceptExplainer } from './content';

export type RoadmapLayerId =
  | 'foundations'
  | 'ai-fundamentals'
  | 'modern-ai'
  | 'generative-ai'
  | 'ai-engineering'
  | 'enterprise-ai'
  | 'advanced-ai'
  | 'ai-core'
  | 'production';

export interface RoadmapLayer {
  id: RoadmapLayerId;
  order: number;
  name: string;
  tagline: string;
  badge: string;
  description: string;
  accentColor: string;
}

export type NodeStatus = 'locked' | 'available' | 'in_progress' | 'completed' | 'mastered';

export interface RoadmapNode {
  id: string;
  layerId: RoadmapLayerId;
  title: string;
  shortDesc: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  estimatedHours: number;
  xpReward: number;
  prerequisites: string[]; // Node IDs
  nextNodes: string[]; // Node IDs
  tags: string[];
  gridPosition: { x: number; y: number }; // For canvas mapping
  
  // Pedagogical explainer
  explainer: ConceptExplainer;
  
  // Hands-on & real-world
  simulationType?: 'llm' | 'rag' | 'agent' | 'neural' | 'tokenizer' | 'vector';
  handsOnLabSummary: string;
  realWorldUseCase: string;
  industryTools: string[];
  interviewQuestions: {
    question: string;
    answer: string;
    level: 'Junior' | 'Senior' | 'Staff';
  }[];
  careerRelevance: string[];
  relatedCertifications: string[];
}
