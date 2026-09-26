import { LearningMode } from './content';

export type UserLevelTitle =
  | 'AI Beginner'
  | 'AI Practitioner'
  | 'AI Developer'
  | 'AI/ML Engineer'
  | 'GenAI Engineer'
  | 'Agentic AI Engineer'
  | 'AI Architect'
  | 'Enterprise AI Architect';

export interface UserProfile {
  id: string;
  name: string;
  avatarUrl: string;
  levelTitle: UserLevelTitle;
  level: number;
  xp: number;
  xpToNextLevel: number;
  streakDays: number;
  lastActiveDate: string;
  learningMode: LearningMode;
  targetCareer: string;
  completedNodeIds: string[];
  inProgressNodeIds: string[];
  bookmarkedNodeIds: string[];
  completedProjectIds: string[];
  activeProjectId?: string;
  earnedBadges: {
    id: string;
    title: string;
    icon: string;
    description: string;
    unlockedAt: string;
  }[];
  onboardingCompleted: boolean;
  onboardingPreferences?: {
    education: string;
    profession: string;
    programmingExperience: string;
    aiExperience: string;
    mathComfort: string;
    careerGoal: string;
    hoursPerWeek: number;
    learningPreference: string;
  };
}

export interface ProjectTask {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  hint?: string;
  testValidationSnippet?: string;
}

export interface ProjectItem {
  id: string;
  title: string;
  tier: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  shortDesc: string;
  estimatedHours: number;
  xpReward: number;
  problemStatement: string;
  architectureBlueprint: string;
  technologies: string[];
  requirements: string[];
  tasks: ProjectTask[];
  starterCode: string;
  solutionCode: string;
  portfolioOutcome: string;
  relatedNodeIds: string[];
}
