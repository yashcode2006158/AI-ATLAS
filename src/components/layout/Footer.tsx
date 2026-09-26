import React from 'react';
import { useAppStore } from '../../store/useStore';

export const Footer: React.FC = () => {
  const { setView } = useAppStore();

  return (
    <footer className="border-t border-hairline bg-base text-text-secondary text-xs transition-colors duration-standard py-12 mt-20">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 pb-12 border-b border-hairline">
          
          <div className="col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-surface border border-hairline flex items-center justify-center text-accent">
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <polygon points="12 2 2 7 12 12 22 7 12 2" />
                  <polyline points="2 17 12 22 22 17" />
                  <polyline points="2 12 12 17 22 12" />
                </svg>
              </div>
              <span className="font-display font-bold text-sm tracking-tight text-text-primary">
                AI <span className="text-accent">Atlas</span>
              </span>
            </div>
            <p className="text-xs text-text-secondary max-w-sm leading-relaxed">
              A beginner-friendly learning universe for understanding AI, experimenting with simulations, and building a real career in the future of intelligent systems.
            </p>
            <div className="flex items-center gap-2 pt-1 text-[11px] font-mono text-text-secondary">
              <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
              <span>AI learning platform • beginner to builder</span>
            </div>
          </div>

          <div className="space-y-2.5">
            <div className="text-[11px] font-mono uppercase tracking-wider text-text-primary font-semibold">
              Learning Map
            </div>
            <ul className="space-y-1.5">
              <li><button onClick={() => setView('roadmap')} className="hover:text-text-primary transition-colors">Technology Universe</button></li>
              <li><button onClick={() => setView('simulations', { sim: 'rag' })} className="hover:text-text-primary transition-colors">RAG Simulator</button></li>
              <li><button onClick={() => setView('simulations', { sim: 'agent' })} className="hover:text-text-primary transition-colors">Agent Simulator</button></li>
              <li><button onClick={() => setView('simulations', { sim: 'llm' })} className="hover:text-text-primary transition-colors">LLM Playground</button></li>
              <li><button onClick={() => setView('glossary')} className="hover:text-text-primary transition-colors">AI Glossary</button></li>
            </ul>
          </div>

          <div className="space-y-2.5">
            <div className="text-[11px] font-mono uppercase tracking-wider text-text-primary font-semibold">
              Enterprise & Lab
            </div>
            <ul className="space-y-1.5">
              <li><button onClick={() => setView('enterprise', { archId: 'enterprise-chatbot' })} className="hover:text-text-primary transition-colors">Enterprise Chatbot</button></li>
              <li><button onClick={() => setView('enterprise', { archId: 'knowledge-assistant' })} className="hover:text-text-primary transition-colors">Knowledge Assistant</button></li>
              <li><button onClick={() => setView('missions')} className="hover:text-text-primary transition-colors">Scenario Missions</button></li>
              <li><button onClick={() => setView('projects')} className="hover:text-text-primary transition-colors">Project Portfolio</button></li>
              <li><button onClick={() => setView('tech')} className="hover:text-text-primary transition-colors">Technology Stack</button></li>
            </ul>
          </div>

          <div className="space-y-2.5">
            <div className="text-[11px] font-mono uppercase tracking-wider text-text-primary font-semibold">
              Career & Platform
            </div>
            <ul className="space-y-1.5">
              <li><button onClick={() => setView('careers')} className="hover:text-text-primary transition-colors">Career Navigator</button></li>
              <li><button onClick={() => setView('certifications')} className="hover:text-text-primary transition-colors">Certification Roadmaps</button></li>
              <li><button onClick={() => setView('radar')} className="hover:text-text-primary transition-colors">Live AI Radar</button></li>
              <li><button onClick={() => setView('dashboard')} className="hover:text-text-primary transition-colors">Personal Training OS</button></li>
              <li><button onClick={() => setView('admin')} className="hover:text-text-primary transition-colors">CMS Admin Console</button></li>
            </ul>
          </div>

        </div>

        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-text-secondary">
          <div>
            © {new Date().getFullYear()} AI Atlas. Built for learning, experimenting, and growing with AI.
          </div>
          <div className="flex items-center gap-4 font-mono">
            <span>WCAG AA Compliant</span>
            <span>•</span>
            <span>TypeScript + Vite</span>
            <span>•</span>
            <span>Global Scale</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
