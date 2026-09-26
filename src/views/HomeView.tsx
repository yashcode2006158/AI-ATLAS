import React from 'react';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  BookOpen,
  Bot,
  BrainCircuit,
  Briefcase,
  Cpu,
  Database,
  Gauge,
  Globe2,
  Layers3,
  Network,
  Play,
  Rocket,
  Search,
  Sparkles,
  Target,
  TrendingUp,
  Workflow,
  Zap,
} from 'lucide-react';
import { HeroScene3D } from '../components/three/HeroScene3D';
import { Card3D } from '../components/ui/Card3D';
import { useAppStore } from '../store/useStore';

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-60px' },
  transition: { duration: 0.55, ease: 'easeOut' as const },
};

const conceptCards = [
  {
    title: 'What is an LLM?',
    short: 'A language model trained on huge amounts of text to understand and generate human-like language.',
    details: 'Prompt → Model → Response',
    icon: <Bot className="w-5 h-5" />,
  },
  {
    title: 'Why embeddings matter',
    short: 'AI converts meaning into numbers so it can compare ideas, documents, and intent.',
    details: 'Meaning → Vectors → Similarity',
    icon: <Layers3 className="w-5 h-5" />,
  },
  {
    title: 'How RAG works',
    short: 'The system searches trusted knowledge, adds context, and then asks the model to answer.',
    details: 'Search → Retrieve → Reason → Answer',
    icon: <Database className="w-5 h-5" />,
  },
  {
    title: 'What is an AI agent?',
    short: 'An agent can reason, choose tools, observe results, and iterate toward a goal.',
    details: 'Goal → Tool → Action → Result',
    icon: <Workflow className="w-5 h-5" />,
  },
];

const topicCards = [
  'AI Fundamentals',
  'Machine Learning',
  'Deep Learning',
  'Neural Networks',
  'Generative AI',
  'LLMs',
  'Prompt Engineering',
  'RAG',
  'Agents',
  'Vector Databases',
  'Computer Vision',
  'NLP',
];

const simulationCards = [
  { title: 'LLM Simulation', description: 'Change temperature, context, and token budget to see how answers shift.', icon: <Bot className="w-5 h-5" />, accent: 'accent' },
  { title: 'RAG Simulation', description: 'Upload docs, chunk text, create embeddings, and retrieve context visually.', icon: <Database className="w-5 h-5" />, accent: 'info' },
  { title: 'Neural Network Lab', description: 'Adjust weights to watch predictions move across hidden layers.', icon: <Network className="w-5 h-5" />, accent: 'success' },
  { title: 'Agent Flow Builder', description: 'Guide a goal through reasoning, tools, observation, and action loops.', icon: <BrainCircuit className="w-5 h-5" />, accent: 'warning' },
];

const careerCards = [
  'AI Beginner',
  'AI Engineer',
  'ML Engineer',
  'Generative AI Engineer',
  'LLM Engineer',
  'RAG Engineer',
  'AI Agent Engineer',
  'AI Automation Engineer',
  'Prompt Engineer',
  'AI Product Manager',
];

const tutorialCards = [
  'What is AI?',
  'How an LLM works',
  'What are embeddings?',
  'How RAG works',
  'What is a vector database?',
  'How AI agents work',
];

const newsCards = [
  { title: 'Open models are accelerating enterprise AI adoption', source: 'MIT Tech Review', tag: 'Open Source' },
  { title: 'Research teams show new gains in multimodal reasoning', source: 'arXiv', tag: 'Research' },
  { title: 'AI agents move from pilot projects to workflow automation', source: 'The Verge', tag: 'Agents' },
];

const modelCards = [
  { name: 'GPT-4.1', org: 'OpenAI', type: 'Reasoning', window: '1M', status: 'Closed' },
  { name: 'Claude 3.7', org: 'Anthropic', type: 'Coding', window: '200K', status: 'Closed' },
  { name: 'Llama 3.1', org: 'Meta', type: 'Open Source', window: '128K', status: 'Open' },
  { name: 'Gemini 2.0', org: 'Google', type: 'Multimodal', window: '1M', status: 'Closed' },
];

const toolCards = [
  { name: 'ChatGPT', category: 'LLMs', desc: 'General-purpose AI assistant for writing, planning, and reasoning.' },
  { name: 'Cursor', category: 'Coding', desc: 'AI-native code editor for pair programming and engineering workflows.' },
  { name: 'Midjourney', category: 'Image Generation', desc: 'Creative image generation for design and concept iterations.' },
  { name: 'Notion AI', category: 'Productivity', desc: 'Summaries, document generation, and knowledge capture for teams.' },
];

const progressItems = [
  { label: 'AI Foundations', value: '82%' },
  { label: 'Prompt Engineering', value: '66%' },
  { label: 'RAG Skills', value: '74%' },
  { label: 'AI Agent Systems', value: '58%' },
];

export const HomeView: React.FC = () => {
  const { setView, setOnboardingOpen } = useAppStore();

  return (
    <div className="relative space-y-16 pb-10">
      <section className="relative min-h-[560px] overflow-hidden rounded-[32px] border border-hairline bg-surface/60">
        <HeroScene3D />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-base/10 to-base z-[1]" />
        <div className="relative z-10 mx-auto max-w-5xl px-6 py-20 text-center sm:px-8">
          <motion.div {...fadeUp}>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-hairline bg-surface/85 px-3 py-1.5 text-[11px] font-mono text-text-secondary shadow-sm backdrop-blur-sm">
              <span className="h-2 w-2 animate-pulse rounded-full bg-success" />
              <span>AI Atlas • Beginner to Builder</span>
            </div>
          </motion.div>

          <motion.h1 {...fadeUp} transition={{ ...fadeUp.transition, delay: 0.1 }} className="mx-auto max-w-4xl">
            <span className="block text-4xl font-black tracking-tight text-text-primary sm:text-5xl lg:text-7xl">
              Understand AI.
            </span>
            <span className="mt-2 block text-4xl font-black tracking-tight text-text-primary sm:text-5xl lg:text-7xl">
              Build with AI.
            </span>
            <span className="mt-3 block bg-gradient-to-r from-accent via-cyan-400 to-violet-400 bg-clip-text text-transparent text-3xl sm:text-4xl lg:text-5xl">
              Shape the future.
            </span>
          </motion.h1>

          <motion.p {...fadeUp} transition={{ ...fadeUp.transition, delay: 0.2 }} className="mx-auto mt-6 max-w-2xl text-base text-text-secondary sm:text-lg">
            An interactive learning universe that takes you from AI beginner to AI builder — without requiring a technical background.
          </motion.p>

          <motion.div {...fadeUp} transition={{ ...fadeUp.transition, delay: 0.3 }} className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <button onClick={() => setView('roadmap')} className="inline-flex items-center gap-2 rounded-xl bg-accent px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-accent/30 transition hover:bg-accent-hover">
              <Rocket className="h-4 w-4" />
              Start Your AI Journey
              <ArrowRight className="h-4 w-4" />
            </button>
            <button onClick={() => setView('simulations')} className="inline-flex items-center gap-2 rounded-xl border border-hairline bg-surface/80 px-6 py-3 text-sm font-medium text-text-primary transition hover:bg-elevated">
              <Cpu className="h-4 w-4 text-accent" />
              Explore AI Simulations
            </button>
          </motion.div>

          <motion.div {...fadeUp} transition={{ ...fadeUp.transition, delay: 0.35 }} className="mt-10 flex flex-wrap items-center justify-center gap-2 text-xs text-text-secondary">
            {['AI Fundamentals', 'Generative AI', 'LLMs', 'RAG', 'Agents', 'Automation', 'AI Engineering', 'Real Projects'].map((item) => (
              <span key={item} className="rounded-full border border-hairline bg-surface/70 px-3 py-1.5">
                {item}
              </span>
            ))}
          </motion.div>

          <motion.div {...fadeUp} transition={{ ...fadeUp.transition, delay: 0.4 }} className="mx-auto mt-12 grid max-w-3xl grid-cols-2 gap-4 border-t border-hairline pt-6 sm:grid-cols-4">
            {[
              { value: '4', label: 'learning layers' },
              { value: '6', label: 'simulations' },
              { value: '45+', label: 'knowledge nodes' },
              { value: '11', label: 'career paths' },
            ].map((stat) => (
              <div key={stat.label}>
                <div className="text-2xl font-black text-text-primary">{stat.value}</div>
                <div className="mt-1 text-[10px] font-mono uppercase tracking-[0.18em] text-text-secondary">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      <section {...fadeUp} className="space-y-6">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-[11px] font-mono uppercase tracking-[0.18em] text-accent">AI without the jargon</p>
            <h2 className="mt-2 text-3xl font-black text-text-primary">Learn the ideas that matter most.</h2>
          </div>
          <button onClick={() => setOnboardingOpen(true)} className="hidden rounded-full border border-hairline bg-surface px-4 py-2 text-xs font-semibold text-text-secondary sm:inline-flex hover:text-text-primary">
            Build my path
          </button>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {conceptCards.map((card) => (
            <Card3D key={card.title} className="h-full rounded-2xl">
              <div className="flex h-full flex-col rounded-2xl border border-hairline bg-surface/70 p-5 shadow-sm">
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-accent/10 text-accent border border-accent/20">
                  {card.icon}
                </div>
                <h3 className="text-lg font-bold text-text-primary">{card.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-text-secondary">{card.short}</p>
                <div className="mt-4 rounded-lg border border-hairline bg-elevated/50 px-3 py-2 text-[11px] font-mono uppercase tracking-[0.14em] text-accent">
                  {card.details}
                </div>
              </div>
            </Card3D>
          ))}
        </div>
      </section>

      <section {...fadeUp} className="space-y-5 rounded-[32px] border border-hairline bg-surface/60 p-6 sm:p-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[11px] font-mono uppercase tracking-[0.18em] text-accent">AI topic universe</p>
            <h2 className="mt-2 text-3xl font-black text-text-primary">Search the map of AI.</h2>
          </div>
          <div className="flex items-center gap-2 rounded-xl border border-hairline bg-elevated px-3 py-2 text-sm text-text-secondary">
            <Search className="h-4 w-4 text-accent" />
            <span>Search concepts</span>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {topicCards.map((item) => (
            <button key={item} onClick={() => setView('roadmap')} className="rounded-2xl border border-hairline bg-elevated/40 px-4 py-3 text-left text-sm font-medium text-text-primary transition hover:border-accent/40 hover:bg-accent/5">
              {item}
            </button>
          ))}
        </div>
      </section>

      <section {...fadeUp} className="space-y-5">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-[11px] font-mono uppercase tracking-[0.18em] text-accent">AI simulation lab</p>
            <h2 className="mt-2 text-3xl font-black text-text-primary">Experiment without writing code.</h2>
          </div>
          <button onClick={() => setView('simulations')} className="inline-flex items-center gap-2 rounded-full border border-hairline bg-surface px-4 py-2 text-xs font-semibold text-text-secondary hover:text-text-primary">
            Launch lab <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {simulationCards.map((card) => (
            <Card3D key={card.title} className="h-full rounded-2xl">
              <div className="flex h-full flex-col rounded-2xl border border-hairline bg-surface/70 p-5">
                <div className={`mb-4 flex h-10 w-10 items-center justify-center rounded-xl border ${card.accent === 'accent' ? 'bg-accent/10 text-accent border-accent/25' : card.accent === 'info' ? 'bg-info/10 text-info border-info/25' : card.accent === 'success' ? 'bg-success/10 text-success border-success/25' : 'bg-warning/10 text-warning border-warning/25'}`}>
                  {card.icon}
                </div>
                <h3 className="text-lg font-bold text-text-primary">{card.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-text-secondary">{card.description}</p>
                <div className="mt-4 flex items-center gap-2 text-xs font-semibold text-accent">
                  <Play className="h-3.5 w-3.5" />
                  Try it live
                </div>
              </div>
            </Card3D>
          ))}
        </div>
      </section>

      <section {...fadeUp} className="space-y-5 rounded-[32px] border border-hairline bg-surface/60 p-6 sm:p-8">
        <div>
          <p className="text-[11px] font-mono uppercase tracking-[0.18em] text-accent">Choose your AI career</p>
          <h2 className="mt-2 text-3xl font-black text-text-primary">Pick the path that fits your goals.</h2>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {careerCards.map((role) => (
            <button key={role} onClick={() => setView('careers')} className="rounded-2xl border border-hairline bg-elevated/50 p-4 text-left text-sm font-medium text-text-primary transition hover:border-accent/35 hover:bg-accent/5">
              <span className="flex items-center gap-2">
                <Briefcase className="h-4 w-4 text-accent" />
                {role}
              </span>
            </button>
          ))}
        </div>
      </section>

      <section {...fadeUp} className="space-y-5">
        <div>
          <p className="text-[11px] font-mono uppercase tracking-[0.18em] text-accent">Interactive tutorials</p>
          <h2 className="mt-2 text-3xl font-black text-text-primary">Learn by seeing, doing, and testing.</h2>
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          {tutorialCards.map((item, index) => (
            <Card3D key={item} className="h-full rounded-2xl">
              <div className="flex h-full flex-col rounded-2xl border border-hairline bg-surface/70 p-5">
                <div className="mb-4 flex items-center justify-between text-[11px] font-mono uppercase tracking-[0.14em] text-text-secondary">
                  <span>Lesson {index + 1}</span>
                  <span className="text-accent">{index < 3 ? 'Core' : 'Advanced'}</span>
                </div>
                <h3 className="text-lg font-bold text-text-primary">{item}</h3>
                <p className="mt-3 text-sm leading-relaxed text-text-secondary">
                  Simple explanation, visual diagram, practical example, and a guided challenge designed for beginners.
                </p>
                <button onClick={() => setView('roadmap')} className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-accent">
                  Open lesson <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </Card3D>
          ))}
        </div>
      </section>

      <section {...fadeUp} className="space-y-5 rounded-[32px] border border-hairline bg-surface/60 p-6 sm:p-8">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-[11px] font-mono uppercase tracking-[0.18em] text-accent">AI now</p>
            <h2 className="mt-2 text-3xl font-black text-text-primary">News from the AI ecosystem.</h2>
          </div>
          <button onClick={() => setView('radar')} className="inline-flex items-center gap-2 rounded-full border border-hairline bg-surface px-4 py-2 text-xs font-semibold text-text-secondary hover:text-text-primary">
            View radar <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          {newsCards.map((news) => (
            <div key={news.title} className="rounded-2xl border border-hairline bg-elevated/55 p-5">
              <div className="mb-3 flex items-center justify-between text-[10px] font-mono uppercase tracking-[0.16em] text-text-secondary">
                <span>{news.source}</span>
                <span className="rounded-full border border-accent/20 bg-accent/10 px-2 py-0.5 text-accent">{news.tag}</span>
              </div>
              <h3 className="text-lg font-bold text-text-primary">{news.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-text-secondary">
                Fresh signals, model updates, and research shifts that matter to builders, decision-makers, and AI learners.
              </p>
            </div>
          ))}
        </div>
      </section>

      <section {...fadeUp} className="space-y-5">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-[11px] font-mono uppercase tracking-[0.18em] text-accent">AI model radar</p>
            <h2 className="mt-2 text-3xl font-black text-text-primary">Track the latest models and capabilities.</h2>
          </div>
          <div className="rounded-full border border-hairline bg-surface px-4 py-2 text-xs font-semibold text-text-secondary">Updated weekly</div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {modelCards.map((model) => (
            <div key={model.name} className="rounded-2xl border border-hairline bg-surface/70 p-5">
              <div className="flex items-center justify-between gap-3">
                <h3 className="text-lg font-bold text-text-primary">{model.name}</h3>
                <span className="rounded-full border border-hairline bg-elevated px-2 py-0.5 text-[10px] font-mono uppercase tracking-[0.12em] text-text-secondary">{model.status}</span>
              </div>
              <p className="mt-2 text-sm text-text-secondary">{model.org} • {model.type}</p>
              <div className="mt-4 grid grid-cols-2 gap-2 text-xs text-text-secondary">
                <div className="rounded-lg border border-hairline bg-elevated/55 p-2">
                  <div className="font-mono uppercase tracking-[0.12em] text-text-secondary">Context</div>
                  <div className="mt-1 font-semibold text-text-primary">{model.window}</div>
                </div>
                <div className="rounded-lg border border-hairline bg-elevated/55 p-2">
                  <div className="font-mono uppercase tracking-[0.12em] text-text-secondary">Modalities</div>
                  <div className="mt-1 font-semibold text-text-primary">Text</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section {...fadeUp} className="space-y-5 rounded-[32px] border border-hairline bg-surface/60 p-6 sm:p-8">
        <div>
          <p className="text-[11px] font-mono uppercase tracking-[0.18em] text-accent">AI tools directory</p>
          <h2 className="mt-2 text-3xl font-black text-text-primary">Find the right tools for your workflow.</h2>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {toolCards.map((tool) => (
            <div key={tool.name} className="rounded-2xl border border-hairline bg-elevated/50 p-5">
              <div className="mb-3 flex items-center justify-between gap-3">
                <div className="h-10 w-10 rounded-xl bg-accent/10 text-accent border border-accent/20 flex items-center justify-center font-bold">AI</div>
                <span className="rounded-full border border-hairline bg-surface px-2 py-0.5 text-[10px] font-mono uppercase tracking-[0.12em] text-text-secondary">{tool.category}</span>
              </div>
              <h3 className="text-lg font-bold text-text-primary">{tool.name}</h3>
              <p className="mt-2 text-sm leading-relaxed text-text-secondary">{tool.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section {...fadeUp} className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-[32px] border border-hairline bg-surface/60 p-6 sm:p-8">
          <p className="text-[11px] font-mono uppercase tracking-[0.18em] text-accent">Atlas AI</p>
          <h2 className="mt-2 text-3xl font-black text-text-primary">Your personal tutor, always available.</h2>

          <div className="mt-5 flex flex-wrap gap-2 text-xs font-medium">
            {['Explain RAG like I’m 15', 'Why do we need embeddings?', 'Quiz me', 'What should I learn next?'].map((prompt) => (
              <button key={prompt} className="rounded-full border border-hairline bg-elevated px-3 py-1.5 text-text-secondary hover:text-text-primary">
                {prompt}
              </button>
            ))}
          </div>

          <div className="mt-6 rounded-2xl border border-hairline bg-elevated/60 p-4">
            <div className="mb-2 flex items-center gap-2 text-xs font-mono uppercase tracking-[0.12em] text-text-secondary">
              <span className="h-2 w-2 rounded-full bg-success" />
              Atlas AI
            </div>
            <p className="text-sm leading-relaxed text-text-primary">
              “RAG means giving the model access to the right context before it answers. Instead of asking it to memorize everything, you add relevant documents and let it reason from them.”
            </p>
          </div>
        </div>

        <div className="rounded-[32px] border border-hairline bg-surface/60 p-6 sm:p-8">
          <p className="text-[11px] font-mono uppercase tracking-[0.18em] text-accent">Progress</p>
          <h2 className="mt-2 text-3xl font-black text-text-primary">Keep moving forward.</h2>

          <div className="mt-6 space-y-4">
            {progressItems.map((item) => (
              <div key={item.label}>
                <div className="mb-1 flex items-center justify-between text-sm text-text-primary">
                  <span>{item.label}</span>
                  <span className="font-semibold text-accent">{item.value}</span>
                </div>
                <div className="h-2.5 rounded-full border border-hairline bg-elevated">
                  <div className="h-full rounded-full bg-gradient-to-r from-accent to-cyan-400" style={{ width: item.value }} />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 rounded-2xl border border-accent/20 bg-accent/5 p-4">
            <div className="flex items-center gap-2 text-accent">
              <TrendingUp className="h-4 w-4" />
              <span className="text-xs font-mono uppercase tracking-[0.14em]">Recommended next step</span>
            </div>
            <p className="mt-2 text-base font-semibold text-text-primary">Complete the RAG fundamentals path and build your first document Q&A project.</p>
          </div>
        </div>
      </section>

      <section className="rounded-[32px] border border-hairline bg-gradient-to-br from-accent/10 via-surface/60 to-violet-500/10 p-8 sm:p-12 text-center">
        <div className="mx-auto max-w-3xl">
          <p className="text-[11px] font-mono uppercase tracking-[0.18em] text-accent">Final CTA</p>
          <h2 className="mt-3 text-3xl font-black text-text-primary sm:text-5xl">Start with curiosity. Finish with capability.</h2>
          <p className="mt-4 text-base text-text-secondary">
            AI Atlas is designed to help complete beginners understand AI clearly, experiment confidently, and turn knowledge into real-world projects.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <button onClick={() => setView('roadmap')} className="inline-flex items-center gap-2 rounded-xl bg-accent px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-accent/25 transition hover:bg-accent-hover">
              Start learning
              <ArrowRight className="h-4 w-4" />
            </button>
            <button onClick={() => setView('simulations')} className="inline-flex items-center gap-2 rounded-xl border border-hairline bg-surface px-6 py-3 text-sm font-medium text-text-primary transition hover:bg-elevated">
              <Gauge className="h-4 w-4 text-accent" />
              Try simulations
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
