import React, { useState } from 'react';
import {
  Compass,
  Cpu,
  Layers,
  Briefcase,
  Award,
  Radar,
  Terminal,
  BookOpen,
  Search,
  Sparkles,
  Sun,
  Moon,
  ShieldAlert,
  Flame,
  User,
  Sliders,
  Activity,
  Workflow,
  Menu,
  ChevronDown,
  X,
  Target,
  FileCode2,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore, AppView } from '../../store/useStore';
import { useUserStore } from '../../store/useUserStore';
import { LearningMode } from '../../types/content';

export const Navbar: React.FC = () => {
  const {
    view,
    setView,
    learningMode,
    setLearningMode,
    theme,
    toggleTheme,
    setCommandPaletteOpen,
    setMentorOpen,
    setOnboardingOpen,
  } = useAppStore();

  const { user } = useUserStore();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isModeDropdownOpen, setIsModeDropdownOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);

  // Primary desktop navigation items
  const primaryNavItems: { id: AppView; label: string; icon: React.ReactNode; badge?: string }[] = [
    { id: 'home', label: 'Home', icon: <Layers className="w-3.5 h-3.5" /> },
    { id: 'roadmap', label: 'Learn AI', icon: <BookOpen className="w-3.5 h-3.5" /> },
    { id: 'simulations', label: 'Simulations', icon: <Cpu className="w-3.5 h-3.5" />, badge: '6' },
    { id: 'projects', label: 'Projects', icon: <Terminal className="w-3.5 h-3.5" /> },
    { id: 'careers', label: 'Roadmaps', icon: <Briefcase className="w-3.5 h-3.5" /> },
    { id: 'radar', label: 'AI News', icon: <Radar className="w-3.5 h-3.5" /> },
    { id: 'glossary', label: 'AI Tools', icon: <Workflow className="w-3.5 h-3.5" /> },
  ];

  // Secondary W3Schools-inspired fast tracks
  const quickTracks: { id: AppView; label: string; icon: React.ReactNode }[] = [
    { id: 'roadmap', label: 'Workflow Flow', icon: <Workflow className="w-3 h-3 text-accent" /> },
    { id: 'simulations', label: 'Interactive Labs', icon: <Cpu className="w-3 h-3 text-info" /> },
    { id: 'dashboard', label: 'Personal Training OS', icon: <Activity className="w-3 h-3 text-success" /> },
    { id: 'missions', label: 'Scenario Missions', icon: <Target className="w-3 h-3 text-warning" /> },
    { id: 'tech', label: 'Tech Stack', icon: <FileCode2 className="w-3 h-3 text-purple-accent" /> },
    { id: 'certifications', label: 'Certifications', icon: <Award className="w-3 h-3 text-accent" /> },
  ];

  const modes: { id: LearningMode; label: string; desc: string }[] = [
    { id: 'beginner', label: 'Beginner', desc: 'Plain language, intuitive analogies' },
    { id: 'developer', label: 'Developer', desc: 'Code, implementation, APIs' },
    { id: 'architect', label: 'Architect', desc: 'System design, scalability, cost' },
    { id: 'executive', label: 'Executive', desc: 'ROI, risk, build-vs-buy strategy' },
  ];

  const viewTitles: Record<AppView, string> = {
    home: 'AI Atlas Home',
    roadmap: 'Learn AI',
    simulations: 'AI Simulation Lab',
    dashboard: 'Learning Dashboard',
    enterprise: 'Enterprise AI Studio',
    projects: 'Build Real AI',
    careers: 'Choose Your AI Career',
    certifications: 'AI Certifications',
    radar: 'AI News & Model Radar',
    glossary: 'AI Tools & Glossary',
    missions: 'Scenario Missions',
    tech: 'AI Tech Stack',
    admin: 'CMS & Content Admin',
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-hairline bg-base/90 backdrop-blur-md transition-colors duration-standard">
      {/* Top Primary Bar */}
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-3">
        {/* Left: Brand & Mobile Menu Button */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsMenuOpen(true)}
            className="lg:hidden p-1.5 rounded-lg bg-surface border border-hairline hover:bg-elevated text-text-primary focus:outline-none"
            aria-label="Open Navigation Menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <button
            onClick={() => setView('home')}
            className="flex items-center gap-2.5 group text-left focus:outline-none"
          >
            <div className="w-8 h-8 rounded-lg bg-surface border border-hairline flex items-center justify-center text-accent shadow-xs group-hover:border-accent/50 group-hover:shadow-sm transition-all">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="12 2 2 7 12 12 22 7 12 2" />
                <polyline points="2 17 12 22 22 17" />
                <polyline points="2 12 12 17 22 12" />
              </svg>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="font-display font-extrabold text-sm tracking-tight text-text-primary">
                AI <span className="text-accent">Atlas</span>
              </span>
              <span className="text-[10px] font-mono font-semibold px-1.5 py-0.2 rounded bg-accent/10 border border-accent/20 text-accent">
                NEW
              </span>
            </div>
          </button>
        </div>

        {/* Center: Desktop Navigation Bar (n8n style clean tabs) */}
        <nav className="hidden lg:flex items-center gap-1 bg-surface/70 p-1 rounded-xl border border-hairline shadow-xs">
          {primaryNavItems.map((item) => {
            const isActive = view === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setView(item.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-accent text-white shadow-xs font-semibold'
                    : 'text-text-secondary hover:text-text-primary hover:bg-elevated'
                }`}
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
                {item.badge && (
                  <span
                    className={`text-[9px] font-mono font-bold px-1.5 py-0.2 rounded-full ${
                      isActive ? 'bg-white/20 text-white' : 'bg-accent/10 text-accent'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Right: Actions & Status */}
        <div className="flex items-center gap-2">
          {/* Quick Search Trigger */}
          <button
            onClick={() => setCommandPaletteOpen(true)}
            className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-surface border border-hairline hover:border-accent/40 text-text-secondary hover:text-text-primary text-xs transition-colors shadow-xs"
            title="Search anywhere (⌘K / Ctrl+K)"
          >
            <Search className="w-3.5 h-3.5" />
            <span className="hidden xl:inline text-xs">Search concepts...</span>
            <kbd className="hidden sm:inline-flex text-[10px] font-mono px-1.5 py-0.5 rounded bg-elevated border border-hairline text-text-secondary">
              ⌘K
            </kbd>
          </button>

          {/* Learning Lens Selector */}
          <div className="relative">
            <button
              onClick={() => setIsModeDropdownOpen(!isModeDropdownOpen)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-surface border border-hairline text-xs font-medium text-text-primary hover:bg-elevated transition-colors shadow-xs"
            >
              <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
              <span className="capitalize hidden sm:inline">{learningMode}</span>
              <ChevronDown className="w-3 h-3 text-text-secondary" />
            </button>

            <AnimatePresence>
              {isModeDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -6, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -6, scale: 0.96 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 mt-1.5 w-64 rounded-xl bg-surface border border-hairline shadow-2xl p-2 z-50 glass-panel"
                  onClick={() => setIsModeDropdownOpen(false)}
                >
                  <div className="px-2.5 py-1.5 text-[10px] font-mono uppercase tracking-wider text-text-secondary border-b border-hairline mb-1">
                    Pedagogical Lens
                  </div>
                  <div className="grid grid-cols-1 gap-1">
                    {modes.map((m) => (
                      <button
                        key={m.id}
                        onClick={() => { setLearningMode(m.id); setIsModeDropdownOpen(false); }}
                        className={`w-full text-left px-2.5 py-2 rounded-lg transition-colors ${
                          learningMode === m.id
                            ? 'bg-accent/10 border border-accent/30 text-accent font-medium'
                            : 'text-text-primary hover:bg-elevated'
                        }`}
                      >
                        <div className="text-xs font-semibold flex items-center justify-between">
                          {m.label}
                          {learningMode === m.id && <span className="text-[10px]">✓</span>}
                        </div>
                        <div className="text-[10px] text-text-secondary mt-0.5">{m.desc}</div>
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* AI Mentor Trigger */}
          <button
            onClick={() => setMentorOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-accent text-white font-semibold text-xs hover:bg-accent-hover transition-all shadow-sm shadow-accent/20"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Atlas AI</span>
          </button>

          {/* Theme Toggle */}
          <motion.button
            onClick={toggleTheme}
            whileTap={{ scale: 0.92 }}
            className="p-1.5 rounded-lg bg-surface border border-hairline text-text-secondary hover:text-text-primary hover:bg-elevated transition-colors shadow-xs"
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} mode`}
          >
            <motion.div
              animate={{ rotate: theme === 'dark' ? 180 : 0 }}
              transition={{ duration: 0.35 }}
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-warning" /> : <Moon className="w-4 h-4" />}
            </motion.div>
          </motion.button>

          {/* User Profile & XP Status */}
          <div className="relative">
            <button
              onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
              className="flex items-center gap-2 pl-2 pr-1.5 py-1 rounded-lg bg-surface border border-hairline hover:border-accent/40 transition-colors shadow-xs"
            >
              <div className="flex items-center gap-1 text-[11px] font-mono text-warning font-semibold">
                <Flame className="w-3.5 h-3.5 fill-warning text-warning" />
                <span>{user.streakDays}d</span>
              </div>
              <div className="w-[1px] h-3.5 bg-hairline" />
              <div className="text-right hidden sm:block">
                <div className="text-[11px] font-mono font-bold leading-none text-accent">
                  {user.xp} XP
                </div>
              </div>
              <img
                src={user.avatarUrl}
                alt={user.name}
                className="w-5 h-5 rounded-full object-cover border border-hairline"
              />
            </button>

            <AnimatePresence>
              {isUserDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -6, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -6, scale: 0.96 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 mt-1.5 w-64 rounded-xl bg-surface border border-hairline shadow-2xl p-3 z-50 glass-panel"
                  onClick={() => setIsUserDropdownOpen(false)}
                >
                  <div className="flex items-center gap-3 pb-2.5 border-b border-hairline">
                    <img
                      src={user.avatarUrl}
                      alt={user.name}
                      className="w-9 h-9 rounded-full object-cover border border-hairline"
                    />
                    <div>
                      <div className="text-xs font-bold text-text-primary">{user.name}</div>
                      <div className="text-[10px] font-mono text-accent font-medium">{user.levelTitle}</div>
                    </div>
                  </div>

                  <div className="py-2.5 space-y-1.5 text-xs">
                    <div className="flex justify-between text-[11px] text-text-secondary">
                      <span>Rank: Level {user.level}</span>
                      <span className="font-mono">{user.xp} / {user.xpToNextLevel} XP</span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-elevated overflow-hidden">
                      <div
                        className="h-full bg-accent rounded-full transition-all duration-standard"
                        style={{ width: `${Math.min(100, (user.xp / user.xpToNextLevel) * 100)}%` }}
                      />
                    </div>
                  </div>

                  <div className="pt-2 border-t border-hairline space-y-1">
                    <button
                      onClick={() => setView('dashboard')}
                      className="w-full text-left px-2 py-1.5 text-xs rounded-lg hover:bg-elevated flex items-center justify-between text-text-primary transition-colors"
                    >
                      <span>Open AI Training OS</span>
                      <Activity className="w-3.5 h-3.5 text-accent" />
                    </button>
                    <button
                      onClick={() => setOnboardingOpen(true)}
                      className="w-full text-left px-2 py-1.5 text-xs rounded-lg hover:bg-elevated flex items-center justify-between text-text-primary transition-colors"
                    >
                      <span>Recalibrate Career Path</span>
                      <Sliders className="w-3.5 h-3.5 text-text-secondary" />
                    </button>
                    <button
                      onClick={() => setView('admin')}
                      className="w-full text-left px-2 py-1.5 text-xs rounded-lg hover:bg-elevated flex items-center justify-between text-text-secondary hover:text-accent transition-colors"
                    >
                      <span>CMS Admin Console</span>
                      <ShieldAlert className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* W3Schools-Style Secondary Category Ribbon */}
      <div className="border-t border-hairline/60 bg-elevated/40 backdrop-blur-xs px-4 sm:px-6 py-1.5">
        <div className="max-w-[1600px] mx-auto flex items-center justify-between gap-4 overflow-x-auto text-xs">
          {/* Breadcrumb Indicator */}
          <div className="flex items-center gap-2 shrink-0 font-mono text-[11px] text-text-secondary">
            <span className="hover:text-text-primary cursor-pointer" onClick={() => setView('home')}>NexusAI</span>
            <span>/</span>
            <span className="text-accent font-semibold">{viewTitles[view]}</span>
          </div>

          {/* Fast Category Track Jumpers */}
          <div className="flex items-center gap-1.5 shrink-0">
            {quickTracks.map((qt) => {
              const isCurrent = view === qt.id;
              return (
                <button
                  key={qt.id}
                  onClick={() => setView(qt.id)}
                  className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors flex items-center gap-1.5 ${
                    isCurrent
                      ? 'bg-surface text-accent font-semibold border border-hairline shadow-xs'
                      : 'text-text-secondary hover:text-text-primary hover:bg-surface/60'
                  }`}
                >
                  {qt.icon}
                  <span>{qt.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Mobile Drawer Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm lg:hidden flex justify-end"
            onClick={() => setIsMenuOpen(false)}
          >
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 250 }}
              className="w-full max-w-sm h-full bg-surface border-l border-hairline p-5 flex flex-col justify-between overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="space-y-6">
                {/* Drawer Header */}
                <div className="flex items-center justify-between pb-4 border-b border-hairline">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-accent/15 border border-accent/25 flex items-center justify-center text-accent">
                      <Workflow className="w-4 h-4" />
                    </div>
                    <span className="font-display font-extrabold text-sm text-text-primary">
                      Nexus<span className="text-accent">AI</span> Menu
                    </span>
                  </div>
                  <button
                    onClick={() => setIsMenuOpen(false)}
                    className="p-1.5 rounded-lg bg-elevated text-text-secondary hover:text-text-primary"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Mobile Navigation List */}
                <nav className="space-y-1">
                  <div className="text-[10px] font-mono uppercase tracking-wider text-text-secondary px-2 mb-2 font-semibold">
                    Platform Hubs
                  </div>
                  {primaryNavItems.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => { setView(item.id); setIsMenuOpen(false); }}
                      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-left text-xs font-medium transition-all ${
                        view === item.id
                          ? 'bg-accent text-white shadow-xs font-semibold'
                          : 'text-text-secondary hover:text-text-primary hover:bg-elevated'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <span>{item.icon}</span>
                        <span>{item.label}</span>
                      </div>
                      {item.badge && (
                        <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded-full ${view === item.id ? 'bg-white/20' : 'bg-accent/10 text-accent'}`}>
                          {item.badge}
                        </span>
                      )}
                    </button>
                  ))}
                  <div className="text-[10px] font-mono uppercase tracking-wider text-text-secondary px-2 mt-4 mb-2 font-semibold">
                    Labs & Systems
                  </div>
                  <button
                    onClick={() => { setView('dashboard'); setIsMenuOpen(false); }}
                    className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-left text-xs text-text-secondary hover:text-text-primary hover:bg-elevated"
                  >
                    <Activity className="w-3.5 h-3.5 text-success" />
                    <span>Personal Training OS</span>
                  </button>
                  <button
                    onClick={() => { setView('missions'); setIsMenuOpen(false); }}
                    className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-left text-xs text-text-secondary hover:text-text-primary hover:bg-elevated"
                  >
                    <Target className="w-3.5 h-3.5 text-warning" />
                    <span>Scenario Missions</span>
                  </button>
                  <button
                    onClick={() => { setView('tech'); setIsMenuOpen(false); }}
                    className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-left text-xs text-text-secondary hover:text-text-primary hover:bg-elevated"
                  >
                    <FileCode2 className="w-3.5 h-3.5 text-purple-accent" />
                    <span>Tech Stack Explorer</span>
                  </button>
                  <button
                    onClick={() => { setView('certifications'); setIsMenuOpen(false); }}
                    className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-left text-xs text-text-secondary hover:text-text-primary hover:bg-elevated"
                  >
                    <Award className="w-3.5 h-3.5 text-accent" />
                    <span>Certification Roadmaps</span>
                  </button>
                </nav>
              </div>

              {/* Mobile Drawer Bottom */}
              <div className="pt-4 border-t border-hairline space-y-3 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-text-secondary font-mono text-[11px]">Theme</span>
                  <button
                    onClick={toggleTheme}
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-elevated border border-hairline text-text-primary"
                  >
                    {theme === 'dark' ? <Sun className="w-3.5 h-3.5 text-warning" /> : <Moon className="w-3.5 h-3.5" />}
                    <span className="capitalize text-[11px]">{theme}</span>
                  </button>
                </div>

                <button
                  onClick={() => { setMentorOpen(true); setIsMenuOpen(false); }}
                  className="w-full py-2 rounded-xl bg-accent text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-sm"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Launch AI Mentor</span>
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};