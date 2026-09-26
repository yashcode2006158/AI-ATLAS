import React, { useState } from 'react';
import {
  Layers,
  ArrowRight,
  Shield,
  Zap,
  DollarSign,
  Cpu,
  Clock,
  ExternalLink,
  CheckCircle2,
  Info
} from 'lucide-react';
import { ENTERPRISE_ARCHITECTURES } from '../../data/enterpriseArchitectures';
import { ArchitectureComponent } from '../../types/enterprise';
import { useAppStore } from '../../store/useStore';

export const EnterpriseLab: React.FC = () => {
  const { activeArchitectureId, setArchitecture } = useAppStore();

  const activeArch = ENTERPRISE_ARCHITECTURES.find((a) => a.id === activeArchitectureId) || ENTERPRISE_ARCHITECTURES[0];
  const [selectedComponent, setSelectedComponent] = useState<ArchitectureComponent>(activeArch.components[0]);

  // Update selected component when architecture changes
  const handleSelectArch = (archId: string) => {
    setArchitecture(archId);
    const newArch = ENTERPRISE_ARCHITECTURES.find((a) => a.id === archId) || ENTERPRISE_ARCHITECTURES[0];
    setSelectedComponent(newArch.components[0]);
  };

  return (
    <div className="space-y-6 text-xs">
      
      {/* Architecture Selector Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-hairline">
        {ENTERPRISE_ARCHITECTURES.map((arch) => {
          const isActive = arch.id === activeArch.id;
          return (
            <button
              key={arch.id}
              onClick={() => handleSelectArch(arch.id)}
              className={`px-3.5 py-2 rounded-lg font-medium text-xs transition-all shrink-0 flex items-center gap-2 ${
                isActive
                  ? 'bg-accent text-white shadow-sm'
                  : 'bg-surface border border-hairline text-text-secondary hover:text-text-primary hover:bg-elevated'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>{arch.title}</span>
            </button>
          );
        })}
      </div>

      {/* Blueprint Header Brief */}
      <div className="p-5 rounded-2xl bg-surface border border-hairline space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-accent/15 border border-accent/25 text-accent font-semibold">
                {activeArch.category} Architecture
              </span>
              <span className="text-[10px] font-mono text-text-secondary">
                {activeArch.difficulty} Level
              </span>
            </div>
            <h2 className="text-base font-bold font-display text-text-primary">
              {activeArch.title}
            </h2>
            <p className="text-xs text-text-secondary max-w-3xl leading-relaxed">
              {activeArch.description}
            </p>
          </div>

          {/* Key Enterprise Metrics Badge Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 font-mono text-[11px]">
            <div className="p-2.5 rounded-lg bg-elevated border border-hairline text-center">
              <span className="text-text-secondary text-[9px] uppercase block">Latency</span>
              <span className="text-accent font-bold">{activeArch.keyMetrics.latency}</span>
            </div>
            <div className="p-2.5 rounded-lg bg-elevated border border-hairline text-center">
              <span className="text-text-secondary text-[9px] uppercase block">Unit Cost</span>
              <span className="text-success font-bold">{activeArch.keyMetrics.estimatedCost}</span>
            </div>
            <div className="p-2.5 rounded-lg bg-elevated border border-hairline text-center">
              <span className="text-text-secondary text-[9px] uppercase block">Availability</span>
              <span className="text-text-primary font-bold">{activeArch.keyMetrics.availability}</span>
            </div>
            <div className="p-2.5 rounded-lg bg-elevated border border-hairline text-center">
              <span className="text-text-secondary text-[9px] uppercase block">Throughput</span>
              <span className="text-warning font-bold">{activeArch.keyMetrics.throughput}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Interactive Component Topology Graph (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="p-5 rounded-2xl bg-surface border border-hairline space-y-4">
            <div className="flex items-center justify-between border-b border-hairline pb-2.5">
              <span className="font-mono text-[11px] uppercase tracking-wider text-text-secondary font-semibold">
                Clickable Architecture Components (Click to Inspect)
              </span>
              <span className="text-[10px] font-mono text-accent">
                {activeArch.components.length} Pipeline Stages
              </span>
            </div>

            {/* Component Flow Nodes */}
            <div className="space-y-3">
              {activeArch.components.map((comp, idx) => {
                const isSelected = selectedComponent?.id === comp.id;
                return (
                  <div key={comp.id} className="space-y-1">
                    <button
                      onClick={() => setSelectedComponent(comp)}
                      className={`w-full text-left p-3.5 rounded-xl border transition-all flex items-center justify-between ${
                        isSelected
                          ? 'bg-accent/10 border-accent shadow-md shadow-accent/10'
                          : 'bg-elevated/40 border-hairline hover:bg-elevated text-text-secondary hover:text-text-primary'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className={`w-6 h-6 rounded-lg font-mono text-[11px] flex items-center justify-center font-semibold border ${
                          isSelected ? 'bg-accent text-white border-accent' : 'bg-surface border-hairline text-text-secondary'
                        }`}>
                          {idx + 1}
                        </span>
                        <div>
                          <div className="text-xs font-bold text-text-primary flex items-center gap-2">
                            {comp.name}
                            <span className="text-[9px] font-mono uppercase px-1.5 py-0.2 rounded bg-surface border border-hairline text-text-secondary font-normal">
                              {comp.type}
                            </span>
                          </div>
                          <p className="text-[11px] text-text-secondary line-clamp-1 mt-0.5">
                            {comp.purpose}
                          </p>
                        </div>
                      </div>

                      <ArrowRight className={`w-4 h-4 shrink-0 transition-transform ${isSelected ? 'text-accent translate-x-1' : 'text-text-secondary/40'}`} />
                    </button>

                    {idx < activeArch.components.length - 1 && (
                      <div className="pl-6 py-0.5 text-text-secondary/40 font-mono text-[9px] flex items-center gap-1">
                        <span className="w-[1.5px] h-3 bg-hairline" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Deep Architectural Telemetry & Specs Drawer (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          {selectedComponent && (
            <div className="p-5 rounded-2xl bg-surface border border-hairline space-y-5">
              
              {/* Component Header */}
              <div className="space-y-1.5 pb-3 border-b border-hairline">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded bg-accent/10 border border-accent/20 text-accent font-semibold">
                    {selectedComponent.type}
                  </span>
                </div>
                <h3 className="text-sm font-bold font-display text-text-primary">
                  {selectedComponent.name}
                </h3>
                <p className="text-xs text-text-secondary leading-relaxed">
                  {selectedComponent.purpose}
                </p>
              </div>

              {/* Why It Exists */}
              <div className="space-y-1.5">
                <span className="font-mono text-[11px] uppercase tracking-wider text-text-secondary font-semibold">
                  Why It Exists
                </span>
                <p className="text-text-primary leading-relaxed bg-elevated/40 p-3 rounded-lg border border-hairline">
                  {selectedComponent.whyItExists}
                </p>
              </div>

              {/* Candidate Technologies Comparison */}
              <div className="space-y-2">
                <span className="font-mono text-[11px] uppercase tracking-wider text-text-secondary font-semibold">
                  Candidate Enterprise Technologies
                </span>
                <div className="space-y-2">
                  {selectedComponent.candidateTechnologies.map((tech, idx) => (
                    <div
                      key={idx}
                      className={`p-3 rounded-lg border space-y-1.5 ${
                        tech.isRecommended
                          ? 'bg-accent/5 border-accent/40'
                          : 'bg-elevated/40 border-hairline'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-text-primary flex items-center gap-1.5">
                          {tech.name}
                          {tech.isRecommended && (
                            <span className="text-[9px] font-mono text-accent px-1.5 py-0.2 rounded bg-accent/15 border border-accent/20">
                              Recommended
                            </span>
                          )}
                        </span>
                      </div>
                      <p className="text-[11px] text-text-secondary leading-snug">
                        {tech.description}
                      </p>
                      <div className="flex items-center gap-4 text-[10px] font-mono pt-1">
                        <span className="text-success">+ {tech.pros}</span>
                        <span className="text-danger">- {tech.cons}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Security Considerations */}
              <div className="space-y-1.5">
                <span className="font-mono text-[11px] uppercase tracking-wider text-danger font-semibold flex items-center gap-1">
                  <Shield className="w-3.5 h-3.5 text-danger" />
                  Security & Access Control Considerations
                </span>
                <ul className="space-y-1">
                  {selectedComponent.securityConsiderations.map((sec, idx) => (
                    <li key={idx} className="text-text-secondary leading-relaxed flex items-start gap-1.5">
                      <span className="text-danger font-mono">•</span>
                      <span>{sec}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Scaling & Cost Considerations */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-hairline">
                <div className="space-y-1">
                  <span className="font-mono text-[10px] uppercase tracking-wider text-text-secondary font-semibold flex items-center gap-1">
                    <Zap className="w-3 h-3 text-warning" />
                    Scaling Strategy
                  </span>
                  <ul className="space-y-1 text-[11px] text-text-secondary">
                    {selectedComponent.scalingConsiderations.map((scale, i) => (
                      <li key={i}>• {scale}</li>
                    ))}
                  </ul>
                </div>

                <div className="space-y-1">
                  <span className="font-mono text-[10px] uppercase tracking-wider text-text-secondary font-semibold flex items-center gap-1">
                    <DollarSign className="w-3 h-3 text-success" />
                    FinOps & Cost
                  </span>
                  <ul className="space-y-1 text-[11px] text-text-secondary">
                    {selectedComponent.costConsiderations.map((cost, i) => (
                      <li key={i}>• {cost}</li>
                    ))}
                  </ul>
                </div>
              </div>

            </div>
          )}
        </div>

      </div>
    </div>
  );
};
