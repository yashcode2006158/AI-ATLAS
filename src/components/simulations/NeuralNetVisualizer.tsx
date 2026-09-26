import React, { useState, useRef, useEffect } from 'react';
import { Play, RotateCcw, Sliders, Activity, Zap, Info } from 'lucide-react';
import { NeuralNetConfig } from '../../types/simulation';
import { CollapsibleSection } from '../ui/Toggle';
import { DocHeading, DocParagraph, DocList, DocNote } from '../docs/Documentation';

export const NeuralNetVisualizer: React.FC = () => {
  const [config, setConfig] = useState<NeuralNetConfig>({
    learningRate: 0.05,
    epochs: 100,
    activation: 'gelu',
    hiddenLayers: [4, 4],
    dataset: 'circles',
  });

  const [isTraining, setIsTraining] = useState(false);
  const [currentEpoch, setCurrentEpoch] = useState(0);
  const [lossHistory, setLossHistory] = useState<number[]>([]);
  const [activeSignalProgress, setActiveSignalProgress] = useState(0);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const trainLoopRef = useRef<any>(null);

  const conceptExplainer = {
    heading: 'What is a Neural Network?',
    intro: 'A neural network is a computational model inspired by biological neurons. It consists of layers of interconnected nodes (neurons) where each connection has a weight. Through forward propagation, inputs are transformed through weighted sums and activation functions to produce outputs. Training adjusts weights via backpropagation to minimize a loss function.',
    keyPoints: [
      'Forward Pass: Data flows from input layer through hidden layers to output, applying weights and activation functions.',
      'Activation Functions: Non-linear functions (GELU, ReLU, Tanh, Sigmoid) enable the network to learn complex patterns.',
      'Loss Function: Measures the difference between predictions and targets (e.g., cross-entropy for classification).',
      'Backpropagation: Gradients are computed backwards to update weights, reducing loss over time.',
      'Decision Boundary: The surface separating classes in feature space, visualized as a 2D projection.',
    ],
    definition: 'Key Term: Universal Approximation Theorem - a neural network with one hidden layer and enough neurons can approximate any continuous function.',
  };

  // Generate synthetic dataset points
  const generateDataset = (type: 'xor' | 'circles' | 'moons') => {
    const points: { x: number; y: number; label: number }[] = [];
    const count = 120;

    for (let i = 0; i < count; i++) {
      if (type === 'circles') {
        const isInner = i < count / 2;
        const r = isInner ? Math.random() * 0.45 : 0.65 + Math.random() * 0.3;
        const angle = Math.random() * Math.PI * 2;
        points.push({
          x: Math.cos(angle) * r,
          y: Math.sin(angle) * r,
          label: isInner ? 1 : 0,
        });
      } else if (type === 'xor') {
        const x = (Math.random() - 0.5) * 1.8;
        const y = (Math.random() - 0.5) * 1.8;
        const label = (x > 0 && y > 0) || (x < 0 && y < 0) ? 1 : 0;
        points.push({ x, y, label });
      } else {
        // Moons
        const isUpper = i < count / 2;
        const angle = Math.random() * Math.PI;
        const r = 0.6 + (Math.random() - 0.5) * 0.2;
        if (isUpper) {
          points.push({ x: Math.cos(angle) * r - 0.3, y: Math.sin(angle) * r - 0.1, label: 1 });
        } else {
          points.push({ x: Math.cos(angle) * r + 0.3, y: -Math.sin(angle) * r + 0.1, label: 0 });
        }
      }
    }
    return points;
  };

  const [points, setPoints] = useState(() => generateDataset('circles'));

  useEffect(() => {
    setPoints(generateDataset(config.dataset));
    setLossHistory([]);
    setCurrentEpoch(0);
  }, [config.dataset]);

  // Draw decision boundary and data points on canvas
  const drawDecisionBoundary = (epochProgress: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    ctx.clearRect(0, 0, width, height);

    // Render background classification grid
    const resolution = 24;
    const stepX = width / resolution;
    const stepY = height / resolution;

    for (let i = 0; i < resolution; i++) {
      for (let j = 0; j < resolution; j++) {
        const nx = (i / resolution) * 2 - 1;
        const ny = (j / resolution) * 2 - 1;

        // Simulated non-linear learned decision surface
        let pred = 0;
        if (config.dataset === 'circles') {
          const dist = Math.sqrt(nx * nx + ny * ny);
          const convergence = Math.min(1, epochProgress / 60);
          pred = 1 / (1 + Math.exp((dist - 0.55 * convergence) * 8));
        } else if (config.dataset === 'xor') {
          const convergence = Math.min(1, epochProgress / 60);
          pred = 1 / (1 + Math.exp(-nx * ny * 6 * convergence));
        } else {
          const convergence = Math.min(1, epochProgress / 60);
          pred = 1 / (1 + Math.exp(-(ny - Math.sin(nx * 2) * 0.4) * 6 * convergence));
        }

        ctx.fillStyle = pred > 0.5
          ? `rgba(91, 140, 255, ${0.12 + pred * 0.2})`
          : `rgba(239, 68, 68, ${0.12 + (1 - pred) * 0.2})`;
        ctx.fillRect(i * stepX, j * stepY, stepX + 1, stepY + 1);
      }
    }

    // Render Data Points
    points.forEach((pt) => {
      const px = ((pt.x + 1) / 2) * width;
      const py = ((-pt.y + 1) / 2) * height;

      ctx.beginPath();
      ctx.arc(px, py, 4.5, 0, Math.PI * 2);
      ctx.fillStyle = pt.label === 1 ? '#5B8CFF' : '#EF4444';
      ctx.fill();
      ctx.lineWidth = 1.5;
      ctx.strokeStyle = '#FFFFFF';
      ctx.stroke();
    });
  };

  useEffect(() => {
    drawDecisionBoundary(currentEpoch);
  }, [points, currentEpoch]);

  const handleStartTraining = () => {
    if (isTraining) return;
    setIsTraining(true);
    let epoch = 0;

    trainLoopRef.current = setInterval(() => {
      if (epoch < config.epochs) {
        epoch++;
        setCurrentEpoch(epoch);
        setActiveSignalProgress((p) => (p + 0.15) % 1);

        // Compute decaying loss
        const decay = Math.exp(-epoch * 0.05 * (config.learningRate / 0.05));
        const currentLoss = Number((0.72 * decay + 0.04 + Math.random() * 0.02).toFixed(4));
        setLossHistory((prev) => [...prev.slice(-30), currentLoss]);
      } else {
        clearInterval(trainLoopRef.current);
        setIsTraining(false);
      }
    }, 40);
  };

  const handleReset = () => {
    if (trainLoopRef.current) clearInterval(trainLoopRef.current);
    setIsTraining(false);
    setCurrentEpoch(0);
    setLossHistory([]);
    drawDecisionBoundary(0);
  };

  const layersStructure = [2, ...config.hiddenLayers, 1];

  return (
    <div className="space-y-5 text-xs">
      {/* Concept Explainer - W3Schools Style */}
      <CollapsibleSection
        title="Learn: What is a Neural Network?"
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
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* Left Column: Hyperparameters & Layer Architecture (4 Cols) */}
        <div className="lg:col-span-4 space-y-4">
          
          {/* Dataset Selector */}
          <div className="p-4 rounded-xl bg-surface border border-hairline space-y-2.5">
            <span className="font-mono text-[11px] uppercase tracking-wider text-text-secondary font-semibold">
              Classification Benchmark
            </span>
            <div className="grid grid-cols-3 gap-1.5 p-1 rounded-lg bg-elevated border border-hairline">
              {(['circles', 'xor', 'moons'] as const).map((ds) => (
                <button
                  key={ds}
                  onClick={() => setConfig({ ...config, dataset: ds })}
                  className={`py-1.5 rounded text-[11px] font-mono capitalize transition-colors ${
                    config.dataset === ds
                      ? 'bg-surface text-accent font-semibold shadow-xs'
                      : 'text-text-secondary hover:text-text-primary'
                  }`}
                >
                  {ds}
                </button>
              ))}
            </div>
          </div>

          {/* Activation Function */}
          <div className="p-4 rounded-xl bg-surface border border-hairline space-y-2.5">
            <span className="font-mono text-[11px] uppercase tracking-wider text-text-secondary font-semibold">
              Activation Function σ(z)
            </span>
            <div className="grid grid-cols-4 gap-1 p-1 rounded-lg bg-elevated border border-hairline">
              {(['gelu', 'relu', 'tanh', 'sigmoid'] as const).map((act) => (
                <button
                  key={act}
                  onClick={() => setConfig({ ...config, activation: act })}
                  className={`py-1 rounded text-[10px] font-mono uppercase transition-colors ${
                    config.activation === act
                      ? 'bg-surface text-accent font-semibold shadow-xs'
                      : 'text-text-secondary hover:text-text-primary'
                  }`}
                >
                  {act}
                </button>
              ))}
            </div>
            <p className="text-[10px] text-text-secondary leading-snug">
              {config.activation === 'gelu' && 'GELU: Smooth stochastic gating standard in modern transformers.'}
              {config.activation === 'relu' && 'ReLU: Fast linear threshold, prone to dying neuron deadlocks.'}
              {config.activation === 'tanh' && 'Tanh: Zero-centered bounded [-1, 1] smooth curve.'}
              {config.activation === 'sigmoid' && 'Sigmoid: Standard logistic curve [0, 1] probability squasher.'}
            </p>
          </div>

          {/* Training Hyperparameters */}
          <div className="p-4 rounded-xl bg-surface border border-hairline space-y-3">
            <span className="font-mono text-[11px] uppercase tracking-wider text-text-secondary font-semibold">
              Optimizer Parameters
            </span>

            <div className="space-y-2">
              <div className="flex justify-between font-mono text-[11px]">
                <span className="text-text-secondary">Learning Rate (η)</span>
                <span className="text-accent">{config.learningRate}</span>
              </div>
              <input
                type="range"
                min="0.01"
                max="0.2"
                step="0.01"
                value={config.learningRate}
                onChange={(e) => setConfig({ ...config, learningRate: Number(e.target.value) })}
                className="w-full accent-accent bg-elevated h-1 rounded-lg cursor-pointer"
              />

              <div className="flex justify-between font-mono text-[11px] pt-1">
                <span className="text-text-secondary">Epochs</span>
                <span className="text-accent">{config.epochs}</span>
              </div>
              <input
                type="range"
                min="50"
                max="300"
                step="25"
                value={config.epochs}
                onChange={(e) => setConfig({ ...config, epochs: Number(e.target.value) })}
                className="w-full accent-accent bg-elevated h-1 rounded-lg cursor-pointer"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleStartTraining}
              disabled={isTraining}
              className="flex-1 py-2.5 rounded-xl bg-accent text-white font-semibold text-xs hover:bg-accent-hover transition-colors flex items-center justify-center gap-2 shadow-sm disabled:opacity-50"
            >
              <Play className="w-3.5 h-3.5 fill-white" />
              <span>{isTraining ? `Training (Epoch ${currentEpoch})` : 'Train Neural Network'}</span>
            </button>
            <button
              onClick={handleReset}
              className="p-2.5 rounded-xl bg-elevated border border-hairline text-text-secondary hover:text-text-primary transition-colors"
              title="Reset Weights"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>

        </div>

        {/* Right Column: Interactive Network Diagram & Decision Boundary (8 Cols) */}
        <div className="lg:col-span-8 space-y-4">
          
          {/* Top: Animated Synaptic Architecture Visualizer */}
          <div className="p-4 rounded-xl bg-surface border border-hairline space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[11px] uppercase tracking-wider text-text-secondary font-semibold flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-accent" />
                Synaptic Layer Graph: [{layersStructure.join(' → ')}]
              </span>
              <span className="text-[10px] font-mono text-accent">
                {isTraining ? 'Forward Pass Active' : 'Ready'}
              </span>
            </div>

            <div className="h-40 w-full flex items-center justify-around relative bg-elevated/40 rounded-lg p-2 overflow-hidden">
              {layersStructure.map((neuronCount, layerIdx) => (
                <div key={layerIdx} className="flex flex-col items-center justify-around h-full z-10">
                  <span className="text-[9px] font-mono text-text-secondary mb-1">
                    {layerIdx === 0 ? 'Input' : layerIdx === layersStructure.length - 1 ? 'Output' : `Hidden ${layerIdx}`}
                  </span>
                  <div className="flex flex-col gap-2 justify-center flex-1">
                    {Array.from({ length: neuronCount }).map((_, nIdx) => (
                      <div
                        key={nIdx}
                        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center font-mono text-[9px] transition-all ${
                          isTraining
                            ? 'bg-accent/20 border-accent shadow-xs shadow-accent/40 animate-pulse'
                            : 'bg-surface border-hairline text-text-primary'
                        }`}
                      >
                        w
                      </div>
                    ))}
                  </div>
                </div>
              ))}

              {/* Connecting Synaptic Link Lines (SVG) */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-40">
                <line x1="15%" y1="35%" x2="40%" y2="25%" stroke="#5B8CFF" strokeWidth="1.5" />
                <line x1="15%" y1="35%" x2="40%" y2="50%" stroke="#5B8CFF" strokeWidth="1" />
                <line x1="15%" y1="65%" x2="40%" y2="50%" stroke="#5B8CFF" strokeWidth="1" />
                <line x1="15%" y1="65%" x2="40%" y2="75%" stroke="#5B8CFF" strokeWidth="1.5" />
                <line x1="40%" y1="50%" x2="65%" y2="50%" stroke="#38BDF8" strokeWidth="1.5" />
                <line x1="65%" y1="50%" x2="88%" y2="50%" stroke="#38C793" strokeWidth="2" />
              </svg>
            </div>
          </div>

          {/* Bottom Split: Decision Boundary Canvas & Convergence Loss Curve */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Decision Boundary Surface */}
            <div className="p-4 rounded-xl bg-surface border border-hairline space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[11px] uppercase tracking-wider text-text-secondary font-semibold">
                  Learned Decision Boundary
                </span>
                <span className="text-[10px] font-mono text-text-secondary">
                  Epoch {currentEpoch} / {config.epochs}
                </span>
              </div>
              <div className="aspect-square w-full rounded-lg overflow-hidden border border-hairline bg-base flex items-center justify-center">
                <canvas
                  ref={canvasRef}
                  width={280}
                  height={280}
                  className="w-full h-full object-contain"
                />
              </div>
            </div>

            {/* Convergence Loss Plot */}
            <div className="p-4 rounded-xl bg-surface border border-hairline flex flex-col justify-between space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[11px] uppercase tracking-wider text-text-secondary font-semibold">
                  Cross-Entropy Loss Curve
                </span>
                <span className="text-[10px] font-mono text-accent">
                  Loss: {lossHistory[lossHistory.length - 1] ?? '0.7200'}
                </span>
              </div>

              <div className="h-48 w-full bg-elevated/40 rounded-lg p-3 border border-hairline flex items-end gap-1 overflow-hidden">
                {lossHistory.length === 0 ? (
                  <div className="w-full h-full flex items-center justify-center text-[10px] font-mono text-text-secondary/50">
                    Run training to observe gradient convergence
                  </div>
                ) : (
                  lossHistory.map((val, i) => {
                    const heightPercent = Math.min(100, Math.max(5, (val / 0.8) * 100));
                    return (
                      <div
                        key={i}
                        style={{ height: `${heightPercent}%` }}
                        className="flex-1 bg-accent/70 rounded-t-xs transition-all duration-75 hover:bg-accent"
                      />
                    );
                  })
                )}
              </div>

              <div className="p-2 rounded bg-elevated/70 border border-hairline font-mono text-[10px] text-text-secondary flex justify-between">
                <span>Init: 0.7200</span>
                <span>Converged: {lossHistory[lossHistory.length - 1] || '--'}</span>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
