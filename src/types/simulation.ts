export interface LLMPlaygroundConfig {
  model: string;
  temperature: number;
  maxTokens: number;
  topP: number;
  systemPrompt: string;
  userPrompt: string;
  presencePenalty: number;
  frequencyPenalty: number;
}

export interface RAGChunk {
  id: string;
  docTitle: string;
  content: string;
  embeddingPreview: number[];
  similarityScore?: number;
  selected?: boolean;
}

export interface AgentStep {
  stepIndex: number;
  phase: 'Goal' | 'Planning' | 'Tool Selection' | 'Execution' | 'Observation' | 'Reasoning' | 'Final Answer';
  title: string;
  description: string;
  toolUsed?: string;
  toolInput?: string;
  toolOutput?: string;
  status: 'running' | 'completed' | 'error';
  timestamp: string;
}

export interface NeuralNetConfig {
  learningRate: number;
  epochs: number;
  activation: 'relu' | 'sigmoid' | 'tanh' | 'gelu';
  hiddenLayers: number[];
  dataset: 'xor' | 'circles' | 'moons';
}

export interface TokenItem {
  id: number;
  text: string;
  bytes: string;
  colorIndex: number;
}

export interface VectorPoint {
  id: string;
  label: string;
  category: string;
  x: number;
  y: number;
  z?: number;
  vector: number[];
  similarity?: number;
}
