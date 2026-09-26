import React, { useState } from 'react';
import {
  Workflow,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  DollarSign,
  Clock,
  Shield,
  Award,
  ArrowRight,
  TrendingUp,
  Cpu
} from 'lucide-react';
import { SCENARIO_MISSIONS, ScenarioMission, MissionChoice } from '../../data/missions';
import { useAppStore } from '../../store/useStore';
import { useUserStore } from '../../store/useUserStore';

export const ScenarioMissions: React.FC = () => {
  const { activeMissionId, setMission } = useAppStore();
  const { addXP } = useUserStore();

  const activeMission = SCENARIO_MISSIONS.find((m) => m.id === activeMissionId) || SCENARIO_MISSIONS[0];

  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [selectedChoices, setSelectedChoices] = useState<Record<number, MissionChoice>>({});
  const [isCompleted, setIsCompleted] = useState(false);

  // Compute aggregated dynamic consequences
  const currentMetrics = Object.values(selectedChoices).reduce(
    (acc, choice) => ({
      latencyMs: acc.latencyMs + choice.impactLatencyMs,
      monthlyCost: acc.monthlyCost + choice.impactMonthlyCost,
      accuracyScore: Math.min(100, Math.max(0, acc.accuracyScore + choice.impactAccuracyScore)),
      riskScore: Math.min(100, Math.max(0, acc.riskScore + choice.impactRiskScore)),
    }),
    { ...activeMission.baselineMetrics }
  );

  const currentStep = activeMission.steps[currentStepIndex];

  const handleSelectChoice = (choice: MissionChoice) => {
    const updated = {
      ...selectedChoices,
      [currentStepIndex]: choice,
    };
    setSelectedChoices(updated);

    if (currentStepIndex < activeMission.steps.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
    } else {
      setIsCompleted(true);
      addXP(250);
    }
  };

  const handleResetMission = () => {
    setSelectedChoices({});
    setCurrentStepIndex(0);
    setIsCompleted(false);
  };

  const handleSwitchMission = (missionId: string) => {
    setMission(missionId);
    setSelectedChoices({});
    setCurrentStepIndex(0);
    setIsCompleted(false);
  };

  return (
    <div className="space-y-6 text-xs">
      
      {/* Mission Switcher Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-hairline">
        {SCENARIO_MISSIONS.map((m) => {
          const isSelected = m.id === activeMission.id;
          return (
            <button
              key={m.id}
              onClick={() => handleSwitchMission(m.id)}
              className={`px-4 py-2 rounded-lg font-medium text-xs transition-all shrink-0 flex items-center gap-2 ${
                isSelected
                  ? 'bg-accent text-white shadow-sm'
                  : 'bg-surface border border-hairline text-text-secondary hover:text-text-primary hover:bg-elevated'
              }`}
            >
              <Workflow className="w-3.5 h-3.5" />
              <span>{m.title}</span>
              <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-surface/20 border border-hairline uppercase">
                {m.type}
              </span>
            </button>
          );
        })}
      </div>

      {/* Mission Header & Dynamic Consequence Cockpit */}
      <div className="p-5 rounded-2xl bg-surface border border-hairline space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-accent/15 border border-accent/25 text-accent font-semibold">
                {activeMission.roleBadge}
              </span>
              <span className="text-[10px] font-mono text-warning font-semibold">
                +250 XP Milestone
              </span>
            </div>
            <h2 className="text-base font-bold font-display text-text-primary">
              {activeMission.title}
            </h2>
            <p className="text-xs text-text-secondary max-w-3xl leading-relaxed">
              {activeMission.scenarioBrief}
            </p>
          </div>

          <button
            onClick={handleResetMission}
            className="p-2 rounded-lg bg-elevated border border-hairline text-text-secondary hover:text-text-primary transition-colors flex items-center gap-1.5 font-mono text-[11px]"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Mission</span>
          </button>
        </div>

        {/* Dynamic Telemetry Scoreboard */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 border-t border-hairline font-mono text-xs">
          
          <div className="p-3 rounded-xl bg-elevated/70 border border-hairline">
            <div className="text-[10px] text-text-secondary uppercase flex items-center gap-1">
              <Clock className="w-3 h-3 text-accent" />
              <span>{activeMission.type === 'engineering' ? 'Serving Latency' : 'Time-to-Value'}</span>
            </div>
            <div className="text-sm font-bold text-accent mt-0.5">
              {currentMetrics.latencyMs} {activeMission.type === 'engineering' ? 'ms' : 'days'}
            </div>
          </div>

          <div className="p-3 rounded-xl bg-elevated/70 border border-hairline">
            <div className="text-[10px] text-text-secondary uppercase flex items-center gap-1">
              <DollarSign className="w-3 h-3 text-success" />
              <span>Monthly Budget Run-Rate</span>
            </div>
            <div className="text-sm font-bold text-success mt-0.5">
              ${Math.round(currentMetrics.monthlyCost).toLocaleString()} / mo
            </div>
          </div>

          <div className="p-3 rounded-xl bg-elevated/70 border border-hairline">
            <div className="text-[10px] text-text-secondary uppercase flex items-center gap-1">
              <Award className="w-3 h-3 text-warning" />
              <span>{activeMission.type === 'engineering' ? 'Retrieval Precision' : 'Board Confidence'}</span>
            </div>
            <div className="text-sm font-bold text-warning mt-0.5">
              {currentMetrics.accuracyScore}%
            </div>
          </div>

          <div className="p-3 rounded-xl bg-elevated/70 border border-hairline">
            <div className="text-[10px] text-text-secondary uppercase flex items-center gap-1">
              <Shield className="w-3 h-3 text-danger" />
              <span>Enterprise Risk Score</span>
            </div>
            <div className={`text-sm font-bold mt-0.5 ${currentMetrics.riskScore > 50 ? 'text-danger' : 'text-text-primary'}`}>
              {currentMetrics.riskScore}/100 {currentMetrics.riskScore > 50 && '⚠️ High'}
            </div>
          </div>

        </div>
      </div>

      {/* Interactive Step Decision Flow */}
      {!isCompleted && currentStep && (
        <div className="p-6 rounded-2xl bg-surface border border-hairline space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-hairline">
            <span className="text-[11px] font-mono uppercase tracking-wider text-accent font-semibold">
              Decision Stage {currentStep.stepNumber} of {activeMission.steps.length}: {currentStep.phaseTitle}
            </span>
            <span className="text-[10px] font-mono text-text-secondary">
              Step {currentStepIndex + 1}/{activeMission.steps.length}
            </span>
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-bold font-display text-text-primary">
              {currentStep.question}
            </h3>
            <p className="text-xs text-text-secondary leading-relaxed bg-elevated/40 p-3 rounded-xl border border-hairline">
              Context: {currentStep.context}
            </p>
          </div>

          {/* Decision Choices */}
          <div className="space-y-3 pt-2">
            <span className="font-mono text-[11px] uppercase tracking-wider text-text-secondary font-semibold">
              Select Your Architectural Directive:
            </span>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {currentStep.choices.map((choice) => (
                <button
                  key={choice.id}
                  onClick={() => handleSelectChoice(choice)}
                  className="p-4 rounded-xl bg-elevated/50 border border-hairline hover:border-accent hover:bg-elevated transition-all text-left space-y-2 group shadow-2xs"
                >
                  <div className="text-xs font-bold text-text-primary group-hover:text-accent transition-colors flex items-center justify-between">
                    <span>{choice.label}</span>
                    <ArrowRight className="w-3.5 h-3.5 opacity-40 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
                  </div>
                  <p className="text-[11px] text-text-secondary leading-relaxed">
                    {choice.description}
                  </p>
                  <div className="pt-2 border-t border-hairline flex flex-wrap gap-2 text-[10px] font-mono">
                    <span className={choice.impactLatencyMs <= 0 ? 'text-success' : 'text-danger'}>
                      Latency: {choice.impactLatencyMs > 0 ? `+${choice.impactLatencyMs}` : choice.impactLatencyMs}ms
                    </span>
                    <span className={choice.impactMonthlyCost <= 0 ? 'text-success' : 'text-danger'}>
                      Cost: {choice.impactMonthlyCost > 0 ? `+$${choice.impactMonthlyCost}` : `-$${Math.abs(choice.impactMonthlyCost)}`}
                    </span>
                    <span className={choice.impactAccuracyScore >= 0 ? 'text-success' : 'text-danger'}>
                      Accuracy: {choice.impactAccuracyScore >= 0 ? `+${choice.impactAccuracyScore}` : choice.impactAccuracyScore}%
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Mission Debrief & Consequence Summary when Finished */}
      {isCompleted && (
        <div className="p-6 rounded-2xl bg-surface border border-success/40 space-y-5 animate-in fade-in duration-200">
          <div className="flex items-center justify-between pb-3 border-b border-hairline">
            <div className="flex items-center gap-2 text-success font-semibold text-xs">
              <CheckCircle2 className="w-5 h-5" />
              <span>Mission Successfully Concluded</span>
            </div>
            <span className="text-[11px] font-mono text-accent font-semibold px-2 py-0.5 rounded bg-accent/10 border border-accent/20">
              +250 XP Awarded
            </span>
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-bold font-display text-text-primary">
              Executive Debrief & Consequence Review
            </h3>
            <p className="text-xs text-text-secondary leading-relaxed">
              Your architectural decisions have yielded a production SLA of {currentMetrics.latencyMs}ms at ${Math.round(currentMetrics.monthlyCost).toLocaleString()}/mo with an accuracy score of {currentMetrics.accuracyScore}%.
            </p>
          </div>

          {/* Review Each Decision Made */}
          <div className="space-y-3">
            {activeMission.steps.map((step, idx) => {
              const choice = selectedChoices[idx];
              if (!choice) return null;
              return (
                <div key={idx} className="p-3.5 rounded-xl bg-elevated border border-hairline space-y-1.5">
                  <div className="flex items-center justify-between font-mono text-[10px]">
                    <span className="text-text-secondary uppercase">Stage {idx + 1}: {step.phaseTitle}</span>
                    <span className="text-accent font-semibold">{choice.label}</span>
                  </div>
                  <p className="text-xs text-text-primary leading-relaxed">
                    "{choice.consequenceFeedback}"
                  </p>
                </div>
              );
            })}
          </div>

          <div className="pt-3 border-t border-hairline flex justify-end">
            <button
              onClick={handleResetMission}
              className="px-5 py-2 rounded-lg bg-accent text-white font-medium text-xs hover:bg-accent-hover transition-colors"
            >
              Replay Mission with Alternative Decisions
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
