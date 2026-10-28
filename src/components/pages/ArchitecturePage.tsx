import React, { useState } from 'react';
import {
  Network,
  Cpu,
  Layers,
  Activity,
  Play,
  Info,
  CheckCircle2,
  Sparkles
} from 'lucide-react';
import {
  MLPConfig,
  TrainedModel,
  FEATURE_NAMES
} from '../../ml/mlpEngine.ts';

interface ArchitecturePageProps {
  config: MLPConfig;
  model: TrainedModel | null;
  onTrain: () => void;
  isTraining: boolean;
  trainingEpoch: number;
}

export const ArchitecturePage: React.FC<ArchitecturePageProps> = ({
  config,
  model,
  onTrain,
  isTraining,
  trainingEpoch
}) => {
  const [hoveredNode, setHoveredNode] = useState<{ layer: string; index: number; label: string } | null>(null);

  // Layers list
  const layerStructure = [
    { name: 'Input Layer', count: 8, color: '#38bdf8', desc: '8 Standardized Clinical Predictors' },
    ...config.hiddenLayers.map((nodes, idx) => ({
      name: `Hidden Layer ${idx + 1}`,
      count: nodes,
      color: '#06b6d4',
      desc: `${nodes} Non-Linear Neurons (${config.activation.toUpperCase()})`
    })),
    { name: 'Output Layer', count: 1, color: '#10b981', desc: '1 Sigmoid Unit (P(y=1|x))' }
  ];

  // SVG Architecture coordinates
  const svgWidth = 840;
  const svgHeight = 360;
  const colSpacing = svgWidth / (layerStructure.length + 1);

  const layerCoords = layerStructure.map((layer, lIdx) => {
    const x = colSpacing * (lIdx + 1);
    const displayCount = Math.min(layer.count, 8);
    const ySpacing = (svgHeight - 80) / (displayCount + 1);
    const nodes = [];
    for (let n = 0; n < displayCount; n++) {
      nodes.push({
        x,
        y: 50 + ySpacing * (n + 1),
        nodeIdx: n,
        actualTotal: layer.count
      });
    }
    return { layer, x, nodes, isTruncated: layer.count > 8 };
  });

  // Calculate total trainable parameters
  let totalParams = 0;
  const fullLayerSizes = [8, ...config.hiddenLayers, 1];
  for (let l = 0; l < fullLayerSizes.length - 1; l++) {
    const weights = fullLayerSizes[l] * fullLayerSizes[l + 1];
    const biases = fullLayerSizes[l + 1];
    totalParams += weights + biases;
  }

  // Loss curve data points
  const lossCurve = model?.lossCurve || [];
  const minLoss = lossCurve.length > 0 ? Math.min(...lossCurve).toFixed(4) : 'N/A';
  const finalLoss = lossCurve.length > 0 ? lossCurve[lossCurve.length - 1].toFixed(4) : 'N/A';

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Title & Status */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-lg">
        <div>
          <div className="flex items-center gap-2 text-cyan-400 font-bold text-xs uppercase tracking-wider">
            <Network className="w-4 h-4" />
            Stage 3: Neural Architecture & Training Convergence
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white mt-1">
            Feedforward Multilayer Perceptron Topology
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
            Configure hidden topologies, observe synaptic connectivity, and watch iterative cross-entropy loss reduction in real time.
          </p>
        </div>

        <button
          onClick={onTrain}
          disabled={isTraining}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm text-white transition shadow-lg ${
            isTraining
              ? 'bg-cyan-800 cursor-not-allowed opacity-80'
              : 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 shadow-cyan-500/25'
          }`}
        >
          <Play className={`w-4 h-4 ${isTraining ? 'animate-spin' : ''}`} />
          {isTraining ? `Training Epoch ${trainingEpoch}...` : 'Train MLP Network'}
        </button>
      </div>

      {/* Network Stats Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 text-center">
          <div className="text-xs uppercase text-slate-400 font-medium">Topology</div>
          <div className="text-lg sm:text-xl font-bold text-cyan-400 mt-1 font-mono">
            8 → {config.hiddenLayers.join(' → ')} → 1
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">Input → Hidden → Output</div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 text-center">
          <div className="text-xs uppercase text-slate-400 font-medium">Total Parameters</div>
          <div className="text-lg sm:text-xl font-bold text-blue-400 mt-1 font-mono">
            {totalParams}
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">Weights & Biases</div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 text-center">
          <div className="text-xs uppercase text-slate-400 font-medium">Activation Function</div>
          <div className="text-lg sm:text-xl font-bold text-emerald-400 mt-1 font-mono uppercase">
            {config.activation}
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">Hidden non-linearity</div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 text-center">
          <div className="text-xs uppercase text-slate-400 font-medium">Training Epochs</div>
          <div className="text-lg sm:text-xl font-bold text-purple-400 mt-1 font-mono">
            {model?.epochsRun || 0} / {config.maxEpochs}
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">Loss: {finalLoss}</div>
        </div>
      </div>

      {/* Conceptual Architecture Visualizer */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-white">Conceptual Neural Network Architecture</h3>
              <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded bg-blue-950 text-blue-400 border border-blue-800/60">
                Interactive Diagram
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              *Diagram reflects the <strong>conceptual feedforward architecture</strong> of artificial neurons and synaptic projections. Hover over nodes to inspect representations.
            </p>
          </div>

          {hoveredNode && (
            <div className="text-xs font-mono bg-cyan-950/70 border border-cyan-800 text-cyan-300 px-3 py-1 rounded-lg">
              {hoveredNode.layer}: <strong>{hoveredNode.label}</strong>
            </div>
          )}
        </div>

        {/* SVG Canvas */}
        <div className="overflow-x-auto bg-[#0a0f1d] rounded-xl border border-slate-800/80 p-2">
          <svg
            viewBox={`0 0 ${svgWidth} ${svgHeight}`}
            className="w-full h-auto min-w-[700px] select-none"
          >
            {/* Synaptic Connection Lines */}
            {layerCoords.map((layerObj, lIdx) => {
              if (lIdx === layerCoords.length - 1) return null;
              const nextLayerObj = layerCoords[lIdx + 1];

              return layerObj.nodes.map((fromNode, nIdx) =>
                nextLayerObj.nodes.map((toNode, tIdx) => {
                  const key = `conn-${lIdx}-${nIdx}-${tIdx}`;
                  return (
                    <line
                      key={key}
                      x1={fromNode.x}
                      y1={fromNode.y}
                      x2={toNode.x}
                      y2={toNode.y}
                      stroke="#1e293b"
                      strokeWidth="1"
                      className="hover:stroke-cyan-500 hover:stroke-width-2 transition"
                    />
                  );
                })
              );
            })}

            {/* Nodes */}
            {layerCoords.map((layerObj, lIdx) => (
              <g key={`layer-${lIdx}`}>
                {/* Layer Title Header */}
                <text
                  x={layerObj.x}
                  y="26"
                  fill="#94a3b8"
                  fontSize="11"
                  fontWeight="bold"
                  textAnchor="middle"
                >
                  {layerObj.layer.name}
                </text>

                {/* Node count sub-label */}
                <text
                  x={layerObj.x}
                  y="345"
                  fill="#38bdf8"
                  fontSize="10"
                  fontFamily="monospace"
                  textAnchor="middle"
                >
                  {layerObj.layer.count} {layerObj.layer.count === 1 ? 'Neuron' : 'Neurons'}
                </text>

                {layerObj.nodes.map((node, nIdx) => {
                  const isInput = lIdx === 0;
                  const isOutput = lIdx === layerCoords.length - 1;
                  const nodeLabel = isInput
                    ? FEATURE_NAMES[nIdx]
                    : isOutput
                    ? 'P(Diabetes=1)'
                    : `Neuron ${nIdx + 1}`;

                  return (
                    <g
                      key={`node-${lIdx}-${nIdx}`}
                      onMouseEnter={() =>
                        setHoveredNode({
                          layer: layerObj.layer.name,
                          index: nIdx,
                          label: nodeLabel
                        })
                      }
                      onMouseLeave={() => setHoveredNode(null)}
                      className="cursor-pointer group"
                    >
                      <circle
                        cx={node.x}
                        cy={node.y}
                        r="11"
                        fill={isInput ? '#0284c7' : isOutput ? '#10b981' : '#06b6d4'}
                        stroke="#f8fafc"
                        strokeWidth="1.5"
                        className="group-hover:scale-125 transition-transform"
                      />
                      {/* Inner glow */}
                      <circle
                        cx={node.x}
                        cy={node.y}
                        r="4"
                        fill="#ffffff"
                        opacity="0.8"
                      />

                      {/* Input node label on left */}
                      {isInput && (
                        <text
                          x={node.x - 16}
                          y={node.y + 3}
                          fill="#cbd5e1"
                          fontSize="9"
                          textAnchor="end"
                          fontFamily="sans-serif"
                        >
                          {FEATURE_NAMES[nIdx]}
                        </text>
                      )}

                      {/* Output node label on right */}
                      {isOutput && (
                        <text
                          x={node.x + 18}
                          y={node.y + 3}
                          fill="#34d399"
                          fontSize="10"
                          fontWeight="bold"
                          textAnchor="start"
                        >
                          ŷ ∈ [0, 1]
                        </text>
                      )}
                    </g>
                  );
                })}
              </g>
            ))}
          </svg>
        </div>
      </div>

      {/* Real Training Loss Convergence Chart */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-cyan-400" />
              <h3 className="text-base font-bold text-white">Binary Cross-Entropy Loss Curve</h3>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Empirical optimization loss plotted over {lossCurve.length} training epochs using Adam optimizer.
            </p>
          </div>

          <div className="flex items-center gap-3 text-xs font-mono">
            <span className="text-slate-400">Initial: <strong className="text-slate-200">{lossCurve[0]?.toFixed(4) || '—'}</strong></span>
            <span className="text-slate-400">Minimum: <strong className="text-cyan-400">{minLoss}</strong></span>
            <span className="text-slate-400">Final: <strong className="text-emerald-400">{finalLoss}</strong></span>
          </div>
        </div>

        {/* Loss SVG Line Chart */}
        {lossCurve.length > 0 ? (
          <div className="bg-[#0a0f1d] rounded-xl border border-slate-800/80 p-4">
            <div className="h-48 w-full relative">
              <svg viewBox="0 0 800 180" className="w-full h-full preserve-3d" preserveAspectRatio="none">
                {/* Horizontal gridlines */}
                {[0.25, 0.5, 0.75].map((ratio, i) => (
                  <line
                    key={i}
                    x1="40"
                    y1={180 * ratio}
                    x2="780"
                    y2={180 * ratio}
                    stroke="#1e293b"
                    strokeDasharray="4 4"
                  />
                ))}

                {/* Plot Polyline */}
                {(() => {
                  const maxL = Math.max(...lossCurve) * 1.05 || 1;
                  const minL = Math.max(0, Math.min(...lossCurve) * 0.95);
                  const range = maxL - minL || 1;

                  const points = lossCurve.map((val, idx) => {
                    const x = 50 + (idx / (lossCurve.length - 1)) * 720;
                    const y = 160 - ((val - minL) / range) * 140;
                    return `${x},${y}`;
                  }).join(' ');

                  return (
                    <>
                      {/* Gradient area */}
                      <polygon
                        points={`50,165 ${points} 770,165`}
                        fill="url(#lossGrad)"
                        opacity="0.3"
                      />
                      <polyline
                        fill="none"
                        stroke="#06b6d4"
                        strokeWidth="2.5"
                        points={points}
                      />
                      <defs>
                        <linearGradient id="lossGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.8" />
                          <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.0" />
                        </linearGradient>
                      </defs>
                    </>
                  );
                })()}
              </svg>
            </div>
            <div className="flex justify-between text-[11px] font-mono text-slate-500 mt-2 px-6">
              <span>Epoch 1</span>
              <span>Epoch {Math.floor(lossCurve.length / 2)}</span>
              <span>Epoch {lossCurve.length} (Convergence)</span>
            </div>
          </div>
        ) : (
          <div className="h-48 flex items-center justify-center bg-[#0a0f1d] rounded-xl border border-slate-800 text-slate-500 text-xs">
            Click 'Train MLP Network' to generate real loss convergence curve.
          </div>
        )}
      </div>
    </div>
  );
};
