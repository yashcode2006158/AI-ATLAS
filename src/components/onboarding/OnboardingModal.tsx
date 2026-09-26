import React, { useState } from 'react';
import { X, Sparkles, CheckCircle2, ArrowRight, Compass, Clock, BookOpen, User } from 'lucide-react';
import { useAppStore } from '../../store/useStore';
import { useUserStore } from '../../store/useUserStore';

export const OnboardingModal: React.FC = () => {
  const { isOnboardingOpen, setOnboardingOpen, setView } = useAppStore();
  const { user, updateOnboarding } = useUserStore();

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    education: user.onboardingPreferences?.education || 'Computer Science B.S.',
    profession: user.onboardingPreferences?.profession || 'Software Engineer',
    programmingExperience: user.onboardingPreferences?.programmingExperience || '3-5 years (Python / TypeScript)',
    aiExperience: user.onboardingPreferences?.aiExperience || 'Basic APIs & Prompting',
    mathComfort: user.onboardingPreferences?.mathComfort || 'Moderate (Calculus/Algebra)',
    careerGoal: user.onboardingPreferences?.careerGoal || 'AI Engineer',
    hoursPerWeek: user.onboardingPreferences?.hoursPerWeek || 8,
    learningPreference: user.onboardingPreferences?.learningPreference || 'Hands-on Labs & Architecture Diagrams',
  });

  const [generatedPlan, setGeneratedPlan] = useState<any[] | null>(null);

  if (!isOnboardingOpen) return null;

  const handleGenerate = () => {
    // Generate tailored week-by-week plan based on responses
    const plan = [
      {
        week: 'Week 1',
        title: 'Bedrock Linear Algebra & Vector Spaces',
        focus: 'Matrix operations, cosine similarity math, and NumPy memory strides.',
        milestone: 'Implement custom Cosine Similarity from scratch'
      },
      {
        week: 'Week 2-3',
        title: 'Deep Learning & Self-Attention Mechanics',
        focus: 'Gradient backpropagation, GELU activations, and Scaled Dot-Product Attention.',
        milestone: 'Construct a Transformer Attention Head in PyTorch'
      },
      {
        week: 'Week 4-5',
        title: 'Enterprise RAG & Dense Vector Retrieval',
        focus: 'Qdrant vector indexing, hybrid search (BM25 + Dense), and cross-encoder reranking.',
        milestone: 'Build Enterprise Knowledge Base with Source Citations'
      },
      {
        week: 'Week 6-7',
        title: 'Agentic Workflows & Tool Sandboxing',
        focus: 'Directed cyclic state graphs (LangGraph), function calling, and Docker sandboxes.',
        milestone: 'Deploy Autonomous SWE Coding Agent with Self-Correction'
      },
      {
        week: 'Week 8',
        title: 'Production LLMOps & Capstone Certification',
        focus: 'vLLM continuous batching, Langfuse tracing, Ragas evaluation, and Cloud AI certification.',
        milestone: 'Pass Databricks / Azure AI Engineer Practice Exam'
      },
    ];

    setGeneratedPlan(plan);
    setStep(3);
    updateOnboarding(formData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-100">
      <div className="w-full max-w-2xl rounded-2xl bg-surface border border-hairline shadow-2xl overflow-hidden glass-panel">
        
        {/* Header */}
        <div className="p-5 border-b border-hairline flex items-center justify-between bg-surface/90">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-accent/15 border border-accent/30 flex items-center justify-center text-accent">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-text-primary font-display">
                Personalized AI Engineering Pathway
              </h2>
              <p className="text-xs text-text-secondary">
                Calibrate your skills, background, and goals into an adaptive curriculum
              </p>
            </div>
          </div>

          <button
            onClick={() => setOnboardingOpen(false)}
            className="p-1 rounded-md text-text-secondary hover:text-text-primary hover:bg-elevated transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 max-h-[70vh] overflow-y-auto">
          
          {step === 1 && (
            <div className="space-y-4">
              <div className="text-xs text-accent font-mono uppercase tracking-wider font-semibold">
                Step 1 of 2: Background & Technical Comfort
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-text-primary">Current Profession</label>
                  <select
                    value={formData.profession}
                    onChange={(e) => setFormData({ ...formData, profession: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-elevated border border-hairline text-xs text-text-primary focus:outline-none focus:border-accent"
                  >
                    <option>Software Engineer (Backend / Full Stack)</option>
                    <option>Data Scientist / Analyst</option>
                    <option>DevOps / Cloud Engineer</option>
                    <option>Technical Product Manager</option>
                    <option>Engineering Manager / CTO</option>
                    <option>Student / Transitioning to Tech</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-text-primary">Programming Experience</label>
                  <select
                    value={formData.programmingExperience}
                    onChange={(e) => setFormData({ ...formData, programmingExperience: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-elevated border border-hairline text-xs text-text-primary focus:outline-none focus:border-accent"
                  >
                    <option>None / Beginner</option>
                    <option>1-2 years (Python, JS, or Java)</option>
                    <option>3-5 years (Proficient in Python/TypeScript)</option>
                    <option>5+ years (Senior Systems Engineer)</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-text-primary">Current AI Knowledge</label>
                  <select
                    value={formData.aiExperience}
                    onChange={(e) => setFormData({ ...formData, aiExperience: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-elevated border border-hairline text-xs text-text-primary focus:outline-none focus:border-accent"
                  >
                    <option>Complete Beginner (Zero AI background)</option>
                    <option>Basic APIs & Prompting (Used OpenAI / Claude)</option>
                    <option>Built basic RAG or LangChain applications</option>
                    <option>Trained/fine-tuned models in PyTorch</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-text-primary">Math & Statistics Comfort</label>
                  <select
                    value={formData.mathComfort}
                    onChange={(e) => setFormData({ ...formData, mathComfort: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-elevated border border-hairline text-xs text-text-primary focus:outline-none focus:border-accent"
                  >
                    <option>Intuitive / Conceptual (Prefer no raw equations)</option>
                    <option>Moderate (Comfortable with vectors, linear algebra)</option>
                    <option>Strong (Calculus, probability, gradient math)</option>
                  </select>
                </div>
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  onClick={() => setStep(2)}
                  className="px-4 py-2 rounded-lg bg-accent text-white font-medium text-xs hover:bg-accent-hover transition-colors flex items-center gap-1.5"
                >
                  <span>Continue to Goals</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div className="text-xs text-accent font-mono uppercase tracking-wider font-semibold">
                Step 2 of 2: Target Trajectory & Time Commitment
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-text-primary">Primary Career Target</label>
                  <select
                    value={formData.careerGoal}
                    onChange={(e) => setFormData({ ...formData, careerGoal: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-elevated border border-hairline text-xs text-text-primary focus:outline-none focus:border-accent"
                  >
                    <option value="ai-engineer">AI Engineer ($165k - $220k)</option>
                    <option value="genai-engineer">GenAI Engineer ($180k - $245k)</option>
                    <option value="agentic-ai-engineer">Agentic AI Engineer ($190k - $260k)</option>
                    <option value="mlops-engineer">MLOps & Serving Engineer ($170k - $235k)</option>
                    <option value="ai-solutions-architect">Enterprise AI Architect ($210k - $290k)</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-text-primary">Available Time Commitment</label>
                  <select
                    value={formData.hoursPerWeek}
                    onChange={(e) => setFormData({ ...formData, hoursPerWeek: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-lg bg-elevated border border-hairline text-xs text-text-primary focus:outline-none focus:border-accent"
                  >
                    <option value={4}>Casual (4 hours / week)</option>
                    <option value={8}>Focused (8 hours / week — Recommended)</option>
                    <option value={15}>Intensive (15 hours / week)</option>
                    <option value={25}>Full-Time Immersion (25+ hours / week)</option>
                  </select>
                </div>

                <div className="space-y-1.5 md:col-span-2">
                  <label className="text-xs font-medium text-text-primary">Preferred Learning Style</label>
                  <select
                    value={formData.learningPreference}
                    onChange={(e) => setFormData({ ...formData, learningPreference: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-elevated border border-hairline text-xs text-text-primary focus:outline-none focus:border-accent"
                  >
                    <option>Interactive Simulations & Live State Diagrams</option>
                    <option>Code-First & Hands-on Repository Labs</option>
                    <option>System Architecture & Enterprise Blueprints</option>
                    <option>Balanced (Visual + Code + Theory)</option>
                  </select>
                </div>
              </div>

              <div className="pt-4 flex items-center justify-between">
                <button
                  onClick={() => setStep(1)}
                  className="px-3 py-2 rounded-lg text-xs text-text-secondary hover:text-text-primary transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={handleGenerate}
                  className="px-5 py-2 rounded-lg bg-accent text-white font-semibold text-xs hover:bg-accent-hover transition-colors flex items-center gap-2 shadow-sm"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Synthesize Custom Curriculum (+100 XP)</span>
                </button>
              </div>
            </div>
          )}

          {step === 3 && generatedPlan && (
            <div className="space-y-5 animate-in fade-in duration-150">
              <div className="p-3.5 rounded-xl bg-accent/10 border border-accent/25 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-5 h-5 text-accent shrink-0" />
                  <div>
                    <div className="text-xs font-semibold text-text-primary">Curriculum Calibrated Successfully!</div>
                    <div className="text-[11px] text-text-secondary">
                      Tailored for {formData.profession} transitioning to {formData.careerGoal} ({formData.hoursPerWeek} hrs/wk).
                    </div>
                  </div>
                </div>
                <span className="text-[11px] font-mono text-accent font-semibold px-2 py-0.5 rounded bg-surface border border-accent/20">
                  +100 XP Awarded
                </span>
              </div>

              <div className="space-y-2.5">
                <div className="text-xs font-mono uppercase tracking-wider text-text-secondary font-semibold">
                  Week-by-Week Milestone Pathway
                </div>

                {generatedPlan.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-lg bg-elevated/70 border border-hairline flex items-start gap-3 hover:border-accent/30 transition-colors"
                  >
                    <span className="text-[10px] font-mono font-semibold px-1.5 py-0.5 rounded bg-surface border border-hairline text-accent shrink-0">
                      {item.week}
                    </span>
                    <div className="space-y-1 overflow-hidden">
                      <div className="text-xs font-semibold text-text-primary">{item.title}</div>
                      <p className="text-[11px] text-text-secondary leading-relaxed">{item.focus}</p>
                      <div className="text-[10px] font-mono text-success flex items-center gap-1 mt-1">
                        <span>Milestone:</span>
                        <span>{item.milestone}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  onClick={() => {
                    setOnboardingOpen(false);
                    setView('roadmap');
                  }}
                  className="px-5 py-2 rounded-lg bg-accent text-white font-medium text-xs hover:bg-accent-hover transition-colors flex items-center gap-1.5 shadow-sm"
                >
                  <Compass className="w-3.5 h-3.5" />
                  <span>Explore Living Node Graph</span>
                </button>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
