import React, { useState } from 'react';
import {
  Play,
  RotateCcw,
  Bot,
  Search,
  Calculator,
  Terminal,
  Database,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Sliders,
  Check,
  Workflow
} from 'lucide-react';
import { AgentStep } from '../../types/simulation';
import { CollapsibleSection } from '../ui/Toggle';
import { DocHeading, DocParagraph, DocList, DocNote } from '../docs/Documentation';

const PRESET_GOALS = [
  {
    id: 'goal-revenue-calc',
    title: 'Analyze Enterprise SaaS Unit Economics',
    description: 'Calculate LTV:CAC ratio and gross margin payback period from raw financial table in SQL database, then format executive summary.',
    recommendedTools: ['sql-db', 'python-sandbox', 'calculator'],
  },
  {
    id: 'goal-cve-investigation',
    title: 'Automated Cybersecurity CVE Triage',
    description: 'Search NVD database for CVE-2024-3094 vulnerability impact, check installed packages in local repo, and draft patch diff.',
    recommendedTools: ['web-search', 'python-sandbox'],
  },
  {
    id: 'goal-competitor-pricing',
    title: 'Competitive Market Intelligence Gathering',
    description: 'Search web for latest enterprise pricing of 3 competing vector database vendors and generate comparative markdown table.',
    recommendedTools: ['web-search', 'calculator'],
  }
];

const AVAILABLE_TOOLS = [
  { id: 'web-search', name: 'Google / Tavily Search', icon: <Search className="w-3.5 h-3.5" />, desc: 'Real-time web search and markdown scraping' },
  { id: 'python-sandbox', name: 'Isolated Python Sandbox', icon: <Terminal className="w-3.5 h-3.5" />, desc: 'Execute NumPy/Pandas code in microVM' },
  { id: 'sql-db', name: 'PostgreSQL Enterprise DB', icon: <Database className="w-3.5 h-3.5" />, desc: 'Read-only queries to enterprise data warehouse' },
  { id: 'calculator', name: 'High-Precision Math Engine', icon: <Calculator className="w-3.5 h-3.5" />, desc: 'Exact multi-decimal arithmetic calculations' },
];

export const AgentSimulator: React.FC = () => {
  const [selectedGoalId, setSelectedGoalId] = useState(PRESET_GOALS[0].id);
  const [enabledTools, setEnabledTools] = useState<string[]>(['sql-db', 'python-sandbox', 'calculator']);
  const [maxIterations, setMaxIterations] = useState(5);
  const [temperature, setTemperature] = useState(0.2);
  
  // Execution state
  const [isRunning, setIsRunning] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [steps, setSteps] = useState<AgentStep[]>([]);
  const [finalAnswer, setFinalAnswer] = useState<string | null>(null);

  const activeGoal = PRESET_GOALS.find((g) => g.id === selectedGoalId) || PRESET_GOALS[0];

  const conceptExplainer = {
    heading: 'What is an AI Agent?',
    intro: 'An AI agent is a system that can perceive its environment, reason about goals, and take actions through tools to accomplish tasks. Unlike a simple chatbot that only responds to prompts, an agent can plan, execute, observe results, and adapt its strategy autonomously.',
    keyPoints: [
      'Planning: The agent decomposes a complex goal into executable sub-tasks',
      'Tool Use: Agents call external tools (search, databases, code execution) to gather information',
      'Observation: The agent reads tool outputs and updates its understanding',
      'Reasoning: The agent evaluates observations and decides the next action',
      'Loop Control: Maximum iterations prevent infinite reasoning cycles',
    ],
    definition: 'Key Term: ReAct - a reasoning framework that interleaves Reasoning and Acting, allowing agents to think step-by-step while using tools.',
  };

  const toggleTool = (toolId: string) => {
    if (enabledTools.includes(toolId)) {
      if (enabledTools.length > 1) {
        setEnabledTools(enabledTools.filter((t) => t !== toolId));
      }
    } else {
      setEnabledTools([...enabledTools, toolId]);
    }
  };

  const handleRunSimulation = () => {
    if (isRunning) return;
    setIsRunning(true);
    setSteps([]);
    setFinalAnswer(null);
    setCurrentStepIndex(0);

    const simulationSteps: AgentStep[] = [
      {
        stepIndex: 1,
        phase: 'Planning',
        title: 'Decompose Goal & Formulate Action Plan',
        description: `Decomposing goal into sequential sub-tasks: 1) Query SQL database for SaaS ARR, CAC, and Churn; 2) Execute Python calculation in sandbox; 3) Synthesize executive recommendations.`,
        status: 'completed',
        timestamp: '00:00.25',
      },
      {
        stepIndex: 2,
        phase: 'Tool Selection',
        title: 'Dispatch Tool: PostgreSQL DB Query',
        description: 'Selected tool `PostgreSQL Enterprise DB` with read-only credentials to fetch cohort retention metrics.',
        toolUsed: 'PostgreSQL Enterprise DB',
        toolInput: `SELECT arr, cac, gross_margin, churn_rate FROM enterprise_metrics WHERE fiscal_year = 2025;`,
        status: 'completed',
        timestamp: '00:00.60',
      },
      {
        stepIndex: 3,
        phase: 'Observation',
        title: 'Environment Observation Received',
        description: 'Database query executed successfully in 12ms. Returned dataset record.',
        toolOutput: `{"arr": "$42.5M", "cac": "$14,200", "arpu": "$38,000", "gross_margin": 0.78, "churn_rate": 0.05}`,
        status: 'completed',
        timestamp: '00:01.10',
      },
      {
        stepIndex: 4,
        phase: 'Reasoning',
        title: 'Evaluate Observation & Compute Metrics',
        description: `Observation contains all required parameters. ARPU is $38k with 78% gross margin. Churn is 5%. Dispatching Python Sandbox to compute exact LTV and CAC payback period.`,
        toolUsed: 'Isolated Python Sandbox',
        toolInput: `def compute_ltv_cac(arpu=38000, margin=0.78, churn=0.05, cac=14200):
    ltv = (arpu * margin) / churn
    ratio = ltv / cac
    payback_months = (cac / (arpu * margin / 12))
    return {"ltv": ltv, "ratio": round(ratio, 2), "payback_months": round(payback_months, 1)}`,
        status: 'completed',
        timestamp: '00:01.80',
      },
      {
        stepIndex: 5,
        phase: 'Observation',
        title: 'Python Sandbox Execution Output',
        description: 'Code executed cleanly in microVM container with exit code 0.',
        toolOutput: `{"ltv": 592800.0, "ratio": 41.75, "payback_months": 5.8}`,
        status: 'completed',
        timestamp: '00:02.40',
      },
      {
        stepIndex: 6,
        phase: 'Final Answer',
        title: 'Convergence Reached: Deliver Executive Synthesis',
        description: `Unit economics analysis complete. The LTV:CAC ratio is an outstanding 41.75x with a fast 5.8-month CAC payback period, indicating aggressive expansion readiness.`,
        status: 'completed',
        timestamp: '00:02.95',
      },
    ];

    let currentIdx = 0;
    const interval = setInterval(() => {
      if (currentIdx < simulationSteps.length) {
        const nextStep = simulationSteps[currentIdx];
        setSteps((prev) => [...prev, nextStep]);
        setCurrentStepIndex(currentIdx + 1);
        currentIdx++;
      } else {
        clearInterval(interval);
        setIsRunning(false);
        setFinalAnswer(`### Executive SaaS Unit Economics Synthesis

- **Customer Lifetime Value (LTV)**: **$592,800** (based on $38k ARPU, 78% gross margin, and 5% churn).
- **LTV:CAC Ratio**: **41.75x** (benchmark for top-decile SaaS is > 4.0x).
- **CAC Payback Period**: **5.8 Months** (world-class efficiency; under 12 months is considered stellar).

**Strategic Recommendation**: The enterprise exhibits exceptional capital efficiency. Sales & marketing spend can be scaled up 3x without degrading payback economics.`);
      }
    }, 700);
  };

  return (
    <div className="space-y-5 text-xs">
      {/* Concept Explainer - W3Schools Style */}
      <CollapsibleSection
        title="Learn: What is an AI Agent?"
        icon={<DocHeading level={4} className="!mt-0 !mb-0">📚</DocHeading>}
        badge="Concept"
        defaultOpen={false}
      >
        <div className="space-y-3">
          <DocHeading level={3}>{conceptExplainer.heading}</DocHeading>
          <DocParagraph>{conceptExplainer.intro}</DocParagraph>
          <DocList items={conceptExplainer.keyPoints} />
          <DocNote type="tip" title="Key Term">
            {conceptExplainer.definition}
          </DocNote>
        </div>
      </CollapsibleSection>
      
      {/* Node-Based ReAct Cyclic Loop Visual Header */}
      <div className="p-4 rounded-xl bg-surface border border-hairline overflow-x-auto">
        <div className="text-[10px] font-mono uppercase tracking-wider text-text-secondary font-semibold mb-3 flex items-center gap-1.5">
          <Workflow className="w-3.5 h-3.5 text-accent" />
          Autonomous Agent Cognitive Cycle (ReAct State Loop)
        </div>

        <div className="flex items-center justify-between min-w-[700px] gap-2">
          {['Goal Formulation', 'Planning', 'Tool Dispatch', 'Environment Observation', 'Reflective Reasoning', 'Decision / Answer'].map((phase, idx) => (
            <React.Fragment key={idx}>
              <div className="flex items-center gap-2 p-2 rounded-lg bg-elevated/70 border border-hairline shrink-0">
                <span className="w-5 h-5 rounded-full bg-accent/15 border border-accent/30 text-accent font-mono text-[10px] flex items-center justify-center font-semibold">
                  {idx + 1}
                </span>
                <span className="font-semibold text-text-primary text-[11px]">{phase}</span>
              </div>
              {idx < 5 && (
                <ArrowRight className="w-3.5 h-3.5 text-text-secondary/60 shrink-0" />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* Left Column: Mission Setup & Available Tool Blocks (4 Cols) */}
        <div className="lg:col-span-4 space-y-4">
          
          {/* Goal Picker */}
          <div className="p-4 rounded-xl bg-surface border border-hairline space-y-3">
            <span className="font-mono text-[11px] uppercase tracking-wider text-text-secondary font-semibold">
              Autonomous Agent Goal
            </span>
            <div className="space-y-1.5">
              {PRESET_GOALS.map((goal) => (
                <button
                  key={goal.id}
                  onClick={() => {
                    setSelectedGoalId(goal.id);
                    setEnabledTools(goal.recommendedTools);
                  }}
                  className={`w-full text-left p-2.5 rounded-lg border transition-colors flex flex-col ${
                    selectedGoalId === goal.id
                      ? 'bg-accent/10 border-accent text-text-primary'
                      : 'bg-elevated/50 border-hairline hover:bg-elevated text-text-secondary'
                  }`}
                >
                  <span className="text-xs font-semibold text-text-primary">{goal.title}</span>
                  <p className="text-[10px] text-text-secondary mt-1 leading-snug line-clamp-2">
                    {goal.description}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* Visual Building Blocks: Tool Palette */}
          <div className="p-4 rounded-xl bg-surface border border-hairline space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[11px] uppercase tracking-wider text-text-secondary font-semibold">
                Agent Tool Palette
              </span>
              <span className="text-[10px] font-mono text-accent">
                {enabledTools.length} Equipped
              </span>
            </div>

            <div className="space-y-1.5">
              {AVAILABLE_TOOLS.map((tool) => {
                const isEnabled = enabledTools.includes(tool.id);
                return (
                  <button
                    key={tool.id}
                    onClick={() => toggleTool(tool.id)}
                    className={`w-full text-left p-2.5 rounded-lg border transition-all flex items-center justify-between ${
                      isEnabled
                        ? 'bg-surface border-accent/60 shadow-xs'
                        : 'bg-elevated/40 border-hairline opacity-60 hover:opacity-80'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div className={`p-1.5 rounded-md border ${isEnabled ? 'bg-accent/10 border-accent/30 text-accent' : 'bg-elevated border-hairline text-text-secondary'}`}>
                        {tool.icon}
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-text-primary">{tool.name}</div>
                        <div className="text-[10px] text-text-secondary">{tool.desc}</div>
                      </div>
                    </div>
                    <div className={`w-4 h-4 rounded flex items-center justify-center border ${isEnabled ? 'bg-accent border-accent text-white' : 'border-hairline bg-elevated'}`}>
                      {isEnabled && <Check className="w-3 h-3" />}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Execution Hyperparameters */}
          <div className="p-4 rounded-xl bg-surface border border-hairline space-y-3">
            <span className="font-mono text-[11px] uppercase tracking-wider text-text-secondary font-semibold">
              Execution Constraints
            </span>
            <div className="space-y-2">
              <div className="flex justify-between font-mono text-[11px]">
                <span className="text-text-secondary">Max Loop Iterations</span>
                <span className="text-accent">{maxIterations} turns</span>
              </div>
              <input
                type="range"
                min="3"
                max="10"
                value={maxIterations}
                onChange={(e) => setMaxIterations(Number(e.target.value))}
                className="w-full accent-accent bg-elevated h-1 rounded-lg cursor-pointer"
              />

              <div className="pt-2">
                <button
                  onClick={handleRunSimulation}
                  disabled={isRunning}
                  className="w-full py-2.5 rounded-lg bg-accent text-white font-semibold text-xs hover:bg-accent-hover transition-colors flex items-center justify-center gap-2 shadow-sm disabled:opacity-50"
                >
                  <Play className="w-3.5 h-3.5 fill-white" />
                  <span>Launch Agent Reasoning Loop</span>
                </button>
              </div>
            </div>
          </div>

        </div>

        {/* Right Column: Live Reasoning Trail & Telemetry (8 Cols) */}
        <div className="lg:col-span-8 space-y-4">
          
          {/* Step-by-Step Thought Action Observation Stream */}
          <div className="p-5 rounded-xl bg-surface border border-hairline space-y-4 min-h-[420px]">
            <div className="flex items-center justify-between pb-3 border-b border-hairline">
              <div className="flex items-center gap-2">
                <Bot className="w-4 h-4 text-accent" />
                <span className="font-mono text-xs font-semibold text-text-primary">
                  Agent Telemetry & Execution Trace
                </span>
              </div>
              {isRunning && (
                <span className="text-[11px] font-mono text-accent flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                  Executing turn {currentStepIndex}...
                </span>
              )}
            </div>

            {steps.length === 0 ? (
              <div className="h-64 flex flex-col items-center justify-center text-text-secondary/50 font-sans space-y-2">
                <Bot className="w-8 h-8 stroke-1 text-text-secondary/30" />
                <p>Click "Launch Agent Reasoning Loop" to observe the autonomous cycle.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {steps.map((step) => (
                  <div
                    key={step.stepIndex}
                    className="p-3.5 rounded-xl bg-elevated/60 border border-hairline space-y-2 animate-in fade-in slide-in-from-bottom-2 duration-150"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-accent/15 border border-accent/25 text-accent">
                          {step.phase}
                        </span>
                        <span className="text-xs font-semibold text-text-primary">
                          {step.title}
                        </span>
                      </div>
                      <span className="text-[10px] font-mono text-text-secondary">
                        {step.timestamp}
                      </span>
                    </div>

                    <p className="text-[11px] text-text-secondary leading-relaxed">
                      {step.description}
                    </p>

                    {step.toolInput && (
                      <div className="mt-2 p-2 rounded bg-surface border border-hairline font-mono text-[10px] text-accent overflow-x-auto">
                        <span className="text-text-secondary block mb-0.5">// Tool Invocation Payload</span>
                        {step.toolInput}
                      </div>
                    )}

                    {step.toolOutput && (
                      <div className="mt-2 p-2 rounded bg-surface border border-hairline font-mono text-[10px] text-success overflow-x-auto">
                        <span className="text-text-secondary block mb-0.5">// Environment Observation</span>
                        {step.toolOutput}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Final Converged Answer */}
          {finalAnswer && (
            <div className="p-5 rounded-xl bg-surface border border-success/40 shadow-sm space-y-3 animate-in fade-in duration-200">
              <div className="flex items-center gap-2 text-success font-semibold text-xs pb-2 border-b border-hairline">
                <CheckCircle2 className="w-4 h-4 text-success" />
                <span>Goal Successfully Accomplished</span>
              </div>
              <div className="prose-sm text-xs leading-relaxed text-text-primary whitespace-pre-line">
                {finalAnswer}
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
