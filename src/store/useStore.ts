import { useState, useEffect } from 'react';
import { LearningMode } from '../types/content';

export type AppView =
  | 'home'
  | 'dashboard'
  | 'roadmap'
  | 'simulations'
  | 'enterprise'
  | 'projects'
  | 'tech'
  | 'careers'
  | 'certifications'
  | 'radar'
  | 'glossary'
  | 'missions'
  | 'admin';

export interface MentorMessage {
  id: string;
  sender: 'user' | 'mentor';
  text: string;
  timestamp: string;
  suggestedAction?: {
    label: string;
    view: AppView;
    targetId?: string;
  };
}

class Store {
  private listeners: Set<() => void> = new Set();
  
  // State
  view: AppView = 'home';
  activeNodeId: string | null = null;
  activeSimulation: 'llm' | 'rag' | 'agent' | 'neural' | 'tokenizer' | 'vector' = 'rag';
  activeArchitectureId: string = 'enterprise-chatbot';
  activeProjectId: string = 'project-rag-knowledge-base';
  activeMissionId: string = 'mission-rag-50k-docs';
  learningMode: LearningMode = 'beginner';
  theme: 'dark' | 'light' = 'dark';
  isCommandPaletteOpen: boolean = false;
  isMentorOpen: boolean = false;
  isOnboardingOpen: boolean = false;
  
  // Mentor state
  mentorMessages: MentorMessage[] = [
    {
      id: 'm-init',
      sender: 'mentor',
      text: 'Hello. I am Atlas AI, your friendly guide through AI concepts, careers, and real-world projects. What would you like to explore today?',
      timestamp: 'Just now',
    },
  ];

  constructor() {
    // Load persisted theme & mode
    try {
      const savedTheme = localStorage.getItem('nexus_theme') as 'dark' | 'light';
      if (savedTheme) this.theme = savedTheme;
      const savedMode = localStorage.getItem('nexus_learning_mode') as LearningMode;
      if (savedMode) this.learningMode = savedMode;
    } catch (e) {
      console.warn('Storage unavailable', e);
    }
  }

  subscribe(listener: () => void) {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  notify() {
    this.listeners.forEach((listener) => listener());
  }

  setView(view: AppView, params?: { nodeId?: string; sim?: 'llm' | 'rag' | 'agent' | 'neural' | 'tokenizer' | 'vector'; archId?: string; projId?: string; missionId?: string }) {
    this.view = view;
    if (params?.nodeId !== undefined) this.activeNodeId = params.nodeId;
    if (params?.sim) this.activeSimulation = params.sim;
    if (params?.archId) this.activeArchitectureId = params.archId;
    if (params?.projId) this.activeProjectId = params.projId;
    if (params?.missionId) this.activeMissionId = params.missionId;
    this.notify();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  setActiveNode(id: string | null) {
    this.activeNodeId = id;
    this.notify();
  }

  setSimulation(sim: 'llm' | 'rag' | 'agent' | 'neural' | 'tokenizer' | 'vector') {
    this.activeSimulation = sim;
    this.notify();
  }

  setArchitecture(id: string) {
    this.activeArchitectureId = id;
    this.notify();
  }

  setProject(id: string) {
    this.activeProjectId = id;
    this.notify();
  }

  setMission(id: string) {
    this.activeMissionId = id;
    this.notify();
  }

  setLearningMode(mode: LearningMode) {
    this.learningMode = mode;
    try {
      localStorage.setItem('nexus_learning_mode', mode);
    } catch {}
    this.notify();
  }

  setTheme(theme: 'dark' | 'light') {
    this.theme = theme;
    try {
      localStorage.setItem('nexus_theme', theme);
      if (theme === 'dark') {
        document.documentElement.classList.add('dark');
        document.documentElement.classList.remove('light');
      } else {
        document.documentElement.classList.remove('dark');
        document.documentElement.classList.add('light');
      }
    } catch {}
    this.notify();
  }

  toggleTheme() {
    this.setTheme(this.theme === 'dark' ? 'light' : 'dark');
  }

  setCommandPaletteOpen(open: boolean) {
    this.isCommandPaletteOpen = open;
    this.notify();
  }

  setMentorOpen(open: boolean) {
    this.isMentorOpen = open;
    this.notify();
  }

  setOnboardingOpen(open: boolean) {
    this.isOnboardingOpen = open;
    this.notify();
  }

  addMentorMessage(msg: Omit<MentorMessage, 'id' | 'timestamp'>) {
    const newMsg: MentorMessage = {
      ...msg,
      id: 'm-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    this.mentorMessages.push(newMsg);
    this.notify();
  }
}

export const appStore = new Store();

export function useAppStore() {
  const [, setTick] = useState(0);

  useEffect(() => {
    return appStore.subscribe(() => setTick((t) => t + 1));
  }, []);

  return {
    view: appStore.view,
    activeNodeId: appStore.activeNodeId,
    activeSimulation: appStore.activeSimulation,
    activeArchitectureId: appStore.activeArchitectureId,
    activeProjectId: appStore.activeProjectId,
    activeMissionId: appStore.activeMissionId,
    learningMode: appStore.learningMode,
    theme: appStore.theme,
    isCommandPaletteOpen: appStore.isCommandPaletteOpen,
    isMentorOpen: appStore.isMentorOpen,
    isOnboardingOpen: appStore.isOnboardingOpen,
    mentorMessages: appStore.mentorMessages,
    
    // Actions
    setView: (view: AppView, params?: any) => appStore.setView(view, params),
    setActiveNode: (id: string | null) => appStore.setActiveNode(id),
    setSimulation: (sim: any) => appStore.setSimulation(sim),
    setArchitecture: (id: string) => appStore.setArchitecture(id),
    setProject: (id: string) => appStore.setProject(id),
    setMission: (id: string) => appStore.setMission(id),
    setLearningMode: (mode: LearningMode) => appStore.setLearningMode(mode),
    setTheme: (theme: 'dark' | 'light') => appStore.setTheme(theme),
    toggleTheme: () => appStore.toggleTheme(),
    setCommandPaletteOpen: (open: boolean) => appStore.setCommandPaletteOpen(open),
    setMentorOpen: (open: boolean) => appStore.setMentorOpen(open),
    setOnboardingOpen: (open: boolean) => appStore.setOnboardingOpen(open),
    addMentorMessage: (msg: any) => appStore.addMentorMessage(msg),
  };
}
