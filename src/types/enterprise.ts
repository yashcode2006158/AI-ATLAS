export interface ArchitectureComponent {
  id: string;
  name: string;
  type: 'gateway' | 'compute' | 'storage' | 'model' | 'guardrail' | 'cache' | 'agent' | 'telemetry';
  purpose: string;
  whyItExists: string;
  candidateTechnologies: {
    name: string;
    description: string;
    pros: string;
    cons: string;
    isRecommended?: boolean;
  }[];
  inputs: string[];
  outputs: string[];
  securityConsiderations: string[];
  scalingConsiderations: string[];
  costConsiderations: string[];
}

export interface EnterpriseArchitecture {
  id: string;
  title: string;
  slug: string;
  tagline: string;
  difficulty: 'Intermediate' | 'Advanced' | 'Staff/Principal';
  category: 'Retrieval' | 'Conversational' | 'Autonomous' | 'Engineering' | 'Multi-Agent';
  description: string;
  businessImpact: string;
  keyMetrics: {
    latency: string;
    estimatedCost: string;
    availability: string;
    throughput: string;
  };
  components: ArchitectureComponent[];
  flowConnections: {
    from: string;
    to: string;
    label?: string;
  }[];
}
