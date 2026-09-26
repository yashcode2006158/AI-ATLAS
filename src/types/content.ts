export type LearningMode = 'beginner' | 'developer' | 'architect' | 'executive';

export interface ConceptExplainer {
  sixtySecondSummary: {
    beginner: string;
    developer: string;
    architect: string;
    executive: string;
  };
  analogy: string;
  technicalDeepDive: string;
  realWorldArchitecture: string;
  commonPitfalls: string[];
  keyEquationsOrFormulas?: string[];
}

export interface TechnologyItem {
  id: string;
  name: string;
  category: 'languages' | 'frameworks' | 'llm-platforms' | 'agent-frameworks' | 'vector-dbs' | 'infrastructure' | 'mlops' | 'security';
  badge: string;
  tagline: string;
  whyItExists: string;
  whenToUse: string;
  alternatives: string[];
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  industryAdoption: 'Emerging' | 'Growing' | 'Industry Standard' | 'Pervasive';
  githubStars?: string;
  codeSnippet?: {
    language: string;
    title: string;
    code: string;
  };
  learningPathIn: string;
  websiteUrl?: string;
}

export interface CertificationItem {
  id: string;
  title: string;
  provider: 'AWS' | 'Google Cloud' | 'Microsoft Azure' | 'NVIDIA' | 'Databricks' | 'Linux Foundation' | 'DeepLearning.AI';
  difficulty: 'Foundational' | 'Associate' | 'Professional' | 'Specialty';
  prerequisites: string[];
  skillsTested: string[];
  recommendedPath: string[];
  careerRelevance: string;
  examFormat: string;
  targetRole: string;
  badgeIcon?: string;
  cost: string;
}

export interface CareerPathItem {
  id: string;
  title: string;
  level: string;
  averageSalaryUs: string;
  description: string;
  primaryResponsibilities: string[];
  requiredSkills: {
    name: string;
    category: 'Core' | 'Applied' | 'Production' | 'Specialized';
    level: 'Essential' | 'Advanced' | 'Mastery';
  }[];
  skillGapsForTypicalProfiles: {
    profile: string;
    gaps: string[];
    bridgeAction: string;
  }[];
  recommendedProjects: string[];
  recommendedCerts: string[];
  interviewFocus: string[];
}

export interface RadarTrendItem {
  id: string;
  title: string;
  quadrant: 'Techniques' | 'Tools' | 'Platforms' | 'Frameworks';
  ring: 'Adopt' | 'Trial' | 'Assess' | 'Hold';
  description: string;
  whyItMatters: string;
  maturityScore: number; // 0 - 100
  adoptionRate: string;
  skillsRequired: string[];
  primaryTools: string[];
  careerImpact: string;
  lastUpdated: string;
}

export interface GlossaryTerm {
  id: string;
  term: string;
  acronym?: string;
  category: 'Fundamentals' | 'Architectures' | 'Generative AI' | 'LLMOps & Infra' | 'Safety & Governance';
  simpleDefinition: string;
  technicalDefinition: string;
  analogy: string;
  relatedNodeId?: string;
  relatedTerms: string[];
  tags: string[];
}
