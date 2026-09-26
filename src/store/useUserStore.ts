import { useState, useEffect } from 'react';
import { UserProfile, UserLevelTitle } from '../types/user';
import confetti from 'canvas-confetti';

const LEVEL_THRESHOLDS: { level: number; title: UserLevelTitle; xpRequired: number }[] = [
  { level: 1, title: 'AI Beginner', xpRequired: 0 },
  { level: 2, title: 'AI Practitioner', xpRequired: 300 },
  { level: 3, title: 'AI Developer', xpRequired: 750 },
  { level: 4, title: 'AI/ML Engineer', xpRequired: 1400 },
  { level: 5, title: 'GenAI Engineer', xpRequired: 2200 },
  { level: 6, title: 'Agentic AI Engineer', xpRequired: 3200 },
  { level: 7, title: 'AI Architect', xpRequired: 4500 },
  { level: 8, title: 'Enterprise AI Architect', xpRequired: 6000 },
];

const INITIAL_USER: UserProfile = {
  id: 'user_nexus_01',
  name: 'Alex Rivera',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
  levelTitle: 'AI Developer',
  level: 3,
  xp: 890,
  xpToNextLevel: 1400,
  streakDays: 7,
  lastActiveDate: new Date().toISOString(),
  learningMode: 'developer',
  targetCareer: 'ai-engineer',
  completedNodeIds: ['math-linear-algebra', 'math-calculus', 'prob-stats', 'python-data-ecosystem', 'ai-intro-ml'],
  inProgressNodeIds: ['deep-learning-neural-nets', 'modern-transformers'],
  bookmarkedNodeIds: ['modern-rag-systems', 'genai-agents', 'enterprise-rag-governance'],
  completedProjectIds: ['project-ai-chatbot'],
  activeProjectId: 'project-rag-knowledge-base',
  earnedBadges: [
    {
      id: 'badge-first-vector',
      title: 'Vector Initiate',
      icon: 'sparkles',
      description: 'Completed foundational linear algebra and tensor math',
      unlockedAt: '3 days ago'
    },
    {
      id: 'badge-week-streak',
      title: 'Consistent Cognition',
      icon: 'flame',
      description: 'Maintained a 7-day learning streak in NexusAI',
      unlockedAt: 'Today'
    },
    {
      id: 'badge-first-ship',
      title: 'Production Deployer',
      icon: 'rocket',
      description: 'Shipped first streaming conversational AI project',
      unlockedAt: 'Yesterday'
    }
  ],
  onboardingCompleted: true,
  onboardingPreferences: {
    education: 'Computer Science B.S.',
    profession: 'Software Engineer',
    programmingExperience: '3-5 years (TypeScript/Python)',
    aiExperience: 'Basic APIs & Prompting',
    mathComfort: 'Moderate (Calculus/Algebra)',
    careerGoal: 'AI Engineer',
    hoursPerWeek: 8,
    learningPreference: 'Hands-on Labs & Architecture Diagrams',
  },
};

class UserStore {
  private listeners: Set<() => void> = new Set();
  user: UserProfile = INITIAL_USER;

  constructor() {
    try {
      const saved = localStorage.getItem('nexus_user_profile');
      if (saved) {
        this.user = { ...INITIAL_USER, ...JSON.parse(saved) };
      }
    } catch (e) {
      console.warn('Failed to load user profile', e);
    }
  }

  subscribe(listener: () => void) {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  notify() {
    try {
      localStorage.setItem('nexus_user_profile', JSON.stringify(this.user));
    } catch {}
    this.listeners.forEach((l) => l());
  }

  private calculateLevel(xp: number): { level: number; title: UserLevelTitle; nextXp: number } {
    let current = LEVEL_THRESHOLDS[0];
    for (let i = LEVEL_THRESHOLDS.length - 1; i >= 0; i--) {
      if (xp >= LEVEL_THRESHOLDS[i].xpRequired) {
        current = LEVEL_THRESHOLDS[i];
        break;
      }
    }
    const nextTier = LEVEL_THRESHOLDS.find((t) => t.level === current.level + 1);
    return {
      level: current.level,
      title: current.title,
      nextXp: nextTier ? nextTier.xpRequired : current.xpRequired + 1500,
    };
  }

  addXP(amount: number) {
    const oldLevel = this.user.level;
    const newXp = this.user.xp + amount;
    const { level, title, nextXp } = this.calculateLevel(newXp);

    this.user.xp = newXp;
    this.user.level = level;
    this.user.levelTitle = title;
    this.user.xpToNextLevel = nextXp;

    if (level > oldLevel) {
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#5B8CFF', '#38BDF8', '#818CF8', '#F5A623'],
        });
      } catch {}
    }
    this.notify();
  }

  completeNode(nodeId: string, xpReward: number = 100) {
    if (this.user.completedNodeIds.includes(nodeId)) return;
    this.user.completedNodeIds.push(nodeId);
    this.user.inProgressNodeIds = this.user.inProgressNodeIds.filter((id) => id !== nodeId);
    this.addXP(xpReward);
  }

  startNode(nodeId: string) {
    if (this.user.completedNodeIds.includes(nodeId)) return;
    if (!this.user.inProgressNodeIds.includes(nodeId)) {
      this.user.inProgressNodeIds.push(nodeId);
      this.notify();
    }
  }

  toggleBookmark(nodeId: string) {
    if (this.user.bookmarkedNodeIds.includes(nodeId)) {
      this.user.bookmarkedNodeIds = this.user.bookmarkedNodeIds.filter((id) => id !== nodeId);
    } else {
      this.user.bookmarkedNodeIds.push(nodeId);
    }
    this.notify();
  }

  completeProject(projectId: string, xpReward: number = 300) {
    if (!this.user.completedProjectIds.includes(projectId)) {
      this.user.completedProjectIds.push(projectId);
      this.addXP(xpReward);
      try {
        confetti({
          particleCount: 100,
          spread: 90,
          origin: { y: 0.5 },
          colors: ['#38C793', '#5B8CFF', '#F5A623'],
        });
      } catch {}
    }
  }

  updateOnboarding(preferences: any) {
    this.user.onboardingPreferences = preferences;
    this.user.onboardingCompleted = true;
    this.addXP(100);
    this.notify();
  }

  resetAllProgress() {
    this.user = {
      ...INITIAL_USER,
      completedNodeIds: ['math-linear-algebra'],
      inProgressNodeIds: ['math-calculus'],
      completedProjectIds: [],
      xp: 120,
      level: 1,
      levelTitle: 'AI Beginner',
      xpToNextLevel: 300,
      streakDays: 1,
    };
    this.notify();
  }
}

export const userStore = new UserStore();

export function useUserStore() {
  const [, setTick] = useState(0);

  useEffect(() => {
    return userStore.subscribe(() => setTick((t) => t + 1));
  }, []);

  return {
    user: userStore.user,
    addXP: (amt: number) => userStore.addXP(amt),
    completeNode: (id: string, xp?: number) => userStore.completeNode(id, xp),
    startNode: (id: string) => userStore.startNode(id),
    toggleBookmark: (id: string) => userStore.toggleBookmark(id),
    completeProject: (id: string, xp?: number) => userStore.completeProject(id, xp),
    updateOnboarding: (prefs: any) => userStore.updateOnboarding(prefs),
    resetAllProgress: () => userStore.resetAllProgress(),
  };
}
