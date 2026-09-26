import { LearningMode, GlossaryTerm, CertificationItem } from '../types/content';

export type UIComplexity = 'simple' | 'moderate' | 'detailed' | 'minimal';

export interface LearningAdapter {
  mode: LearningMode;
  uiComplexity: UIComplexity;
  contentDepth: 'shallow' | 'medium' | 'deep' | 'executive';
  terminology: 'foundational' | 'technical' | 'advanced' | 'business';
  
  adaptConceptExplainer: (base: string, mode?: LearningMode) => string;
  adaptDifficulty: (level: string, mode?: LearningMode) => string;
  adaptUIComplexity: (base: UIComplexity, mode?: LearningMode) => UIComplexity;
  adaptGlossaryTerm: (term: GlossaryTerm) => AdaptedGlossaryTerm;
  adaptCertification: (cert: CertificationItem) => AdaptedCertification;
  adaptSimulationDesc: (desc: string, simId: string) => string;
}

interface AdaptedGlossaryTerm {
  simple: string;
  technical: string;
  analogy?: string;
  showTechnicalDetails: boolean;
  showExecutiveSummary: boolean;
}

interface AdaptedCertification {
  title: string;
  provider: string;
  difficulty: string;
  focus: string;
  prerequisites: string[];
  keySkills: string[];
  executiveSummary: string;
  showFullDetails: boolean;
}

const MODE_CONFIG: Record<LearningMode, LearningAdapter['contentDepth']> = {
  beginner: 'shallow',
  developer: 'medium',
  architect: 'deep',
  executive: 'executive',
};

const MODE_TERMINOLOGY: Record<LearningMode, LearningAdapter['terminology']> = {
  beginner: 'foundational',
  developer: 'technical',
  architect: 'advanced',
  executive: 'business',
};

const MODE_UI: Record<LearningMode, UIComplexity> = {
  beginner: 'simple',
  developer: 'moderate',
  architect: 'detailed',
  executive: 'minimal',
};

const MODE_SHOW_TECHNICAL: Record<LearningMode, boolean> = {
  beginner: false,
  developer: true,
  architect: true,
  executive: false,
};

const MODE_SHOW_EXECUTIVE: Record<LearningMode, boolean> = {
  beginner: false,
  developer: false,
  architect: true,
  executive: true,
};

const ADAPT_EXPLANATIONS: Record<LearningMode, { base: string; modifier: string }> = {
  beginner: {
    base: 'Keep explanations simple and concrete.',
    modifier: 'Use everyday analogies and avoid jargon.',
  },
  developer: {
    base: 'Provide code-first explanations with runnable examples.',
    modifier: 'Focus on practical implementation patterns.',
  },
  architect: {
    base: 'Emphasize system design, scalability, and integration patterns.',
    modifier: 'Show how components fit into larger architectures.',
  },
  executive: {
    base: 'Focus on business value, ROI, and strategic implications.',
    modifier: 'Minimize technical details, highlight outcomes.',
  },
};

const ADAPT_DIFFICULTY: Record<LearningMode, { level: string; prefix: string }> = {
  beginner: { level: 'Beginner', prefix: 'Foundational: ' },
  developer: { level: 'Intermediate', prefix: 'Practical: ' },
  architect: { level: 'Advanced', prefix: 'System Design: ' },
  executive: { level: 'Expert', prefix: 'Strategic: ' },
};

export const createLearningAdapter = (mode: LearningMode): LearningAdapter => {
  const contentDepth = MODE_CONFIG[mode];
  const terminology = MODE_TERMINOLOGY[mode];
  const uiComplexity = MODE_UI[mode];
  
  return {
    mode,
    uiComplexity,
    contentDepth,
    terminology,
    
    adaptConceptExplainer(base: string, overrideMode?: LearningMode): string {
      const m = overrideMode || this.mode;
      const ADAPT_MODIFIER = ADAPT_EXPLANATIONS[m];
      if (m === 'beginner') {
        return `${ADAPT_MODIFIER.base} ${ADAPT_MODIFIER.modifier} Keep it under 2 sentences.`;
      }
      if (m === 'developer') {
        return `${ADAPT_MODIFIER.base} ${ADAPT_MODIFIER.modifier} Include runnable code snippets.`;
      }
      if (m === 'architect') {
        return `${ADAPT_MODIFIER.base} ${ADAPT_MODIFIER.modifier} Focus on component interactions and data flow.`;
      }
      if (m === 'executive') {
        return `${ADAPT_MODIFIER.base} ${ADAPT_MODIFIER.modifier} Summarize business impact in 1 sentence.`;
      }
      return base;
    },
    
    adaptDifficulty(level: string, overrideMode?: LearningMode): string {
      const m = overrideMode || this.mode;
      const ADAPT_LEVEL = ADAPT_DIFFICULTY[m];
      return `${ADAPT_LEVEL.prefix}${level}`;
    },
    
    adaptUIComplexity(base: UIComplexity, overrideMode?: LearningMode): UIComplexity {
      const m = overrideMode || this.mode;
      return MODE_UI[m] || base;
    },
    
    adaptGlossaryTerm(term: GlossaryTerm): AdaptedGlossaryTerm {
      const showTechnical = MODE_SHOW_TECHNICAL[this.mode];
      const showExecutive = MODE_SHOW_EXECUTIVE[this.mode];
      
      let simple: string;
      let technical: string;
      
      if (this.mode === 'beginner') {
        simple = term.simpleDefinition;
        technical = '';
      } else if (this.mode === 'executive') {
        simple = term.analogy || term.term;
        technical = '';
      } else {
        simple = term.simpleDefinition;
        technical = term.technicalDefinition;
      }
      
      return {
        simple,
        technical,
        analogy: term.analogy,
        showTechnicalDetails: showTechnical,
        showExecutiveSummary: showExecutive,
      };
    },
    
    adaptCertification(cert: CertificationItem): AdaptedCertification {
      const showFull = this.mode !== 'beginner' && this.mode !== 'executive';
      
      let focus: string;
      if (this.mode === 'beginner') {
        focus = 'Foundational concepts and prerequisites';
      } else if (this.mode === 'developer') {
        focus = 'Technical implementation and skills tested';
      } else if (this.mode === 'architect') {
        focus = 'System design and architecture patterns';
      } else {
        focus = 'Business value and strategic relevance';
      }
      
      const keySkills = cert.skillsTested.slice(0, this.mode === 'executive' ? 2 : undefined);
      
      let executiveSummary: string;
      if (this.mode === 'executive') {
        executiveSummary = `Earn the ${cert.title} to validate ${cert.careerRelevance.toLowerCase()}.`;
      } else if (this.mode === 'architect') {
        executiveSummary = `Designs ${cert.targetRole.toLowerCase()} capabilities with ${cert.provider} infrastructure.`;
      } else {
        executiveSummary = '';
      }
      
      return {
        title: cert.title,
        provider: cert.provider,
        difficulty: cert.difficulty,
        focus,
        prerequisites: showFull ? cert.prerequisites : cert.prerequisites.slice(0, 2),
        keySkills,
        executiveSummary,
        showFullDetails: showFull,
      };
    },
    
    adaptSimulationDesc(desc: string, simId: string): string {
      if (this.mode === 'beginner') {
        return desc.split('.')[0] + '.';
      }
      if (this.mode === 'executive') {
        return desc.split('.').slice(0, 2).join('.') + ' (Business impact focused)';
      }
      return desc;
    },
  };
};

