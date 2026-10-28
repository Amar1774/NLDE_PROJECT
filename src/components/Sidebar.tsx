import React from 'react';
import {
  LayoutDashboard,
  Database,
  Network,
  BarChart3,
  Stethoscope,
  BookOpen,
  GraduationCap,
  FileCode2,
  FileText,
  Sliders,
  Play
} from 'lucide-react';
import { MLPConfig } from '../ml/mlpEngine.ts';

interface SidebarProps {
  currentPage: string;
  onSelectPage: (page: string) => void;
  config: MLPConfig;
  onChangeConfig: (newConfig: MLPConfig) => void;
  onTrain: () => void;
  isTraining: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentPage,
  onSelectPage,
  config,
  onChangeConfig,
  onTrain,
  isTraining
}) => {
  const navItems = [
    { id: 'overview', label: '1. Overview & Objective', icon: LayoutDashboard },
    { id: 'dataset', label: '2. Dataset & Preprocessing', icon: Database },
    { id: 'architecture', label: '3. Architecture & Training', icon: Network },
    { id: 'evaluation', label: '4. Performance & Metrics', icon: BarChart3 },
    { id: 'prediction', label: '5. Patient Prediction Lab', icon: Stethoscope },
    { id: 'theory', label: '6. About Multilayer Perceptrons', icon: BookOpen },
    { id: 'viva', label: '7. Viva Voce & Lab Guide', icon: GraduationCap },
    { id: 'python', label: '8. Python Code & Setup', icon: FileCode2 },
    { id: 'report', label: '9. College Report Document', icon: FileText },
  ];

  return (
    <aside className="w-full lg:w-72 bg-[#0d1527] border-r border-slate-800 flex flex-col shrink-0 lg:min-h-[calc(100vh-65px)]">
      {/* Navigation Menu */}
      <div className="p-4 border-b border-slate-800/80">
        <div className="text-[11px] font-bold tracking-wider text-slate-400 uppercase mb-2 px-2 flex items-center justify-between">
          <span>Project Stages</span>
          <span className="text-[10px] text-cyan-400 font-mono">v1.0</span>
        </div>
        <nav className="space-y-1">
          {navItems.map(item => {
            const Icon = item.icon;
            const active = currentPage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectPage(item.id)}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-xs font-medium transition text-left ${
                  active
                    ? 'bg-gradient-to-r from-cyan-900/60 to-blue-900/40 text-cyan-300 border-l-2 border-cyan-400 font-semibold shadow-sm'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <Icon className={`w-4 h-4 shrink-0 ${active ? 'text-cyan-400' : 'text-slate-400'}`} />
                <span className="truncate">{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Hyperparameter Configuration Panel */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div className="space-y-3.5">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-300">
            <Sliders className="w-3.5 h-3.5 text-cyan-400" />
            <span>Hyperparameters</span>
          </div>

          {/* Layer 1 Nodes */}
          <div>
            <div className="flex justify-between text-[11px] text-slate-300 mb-1">
              <span>Hidden Layer 1 Nodes</span>
              <span className="text-cyan-400 font-mono font-semibold">{config.hiddenLayers[0]}</span>
            </div>
            <input
              type="range"
              min="4"
              max="48"
              step="4"
              value={config.hiddenLayers[0]}
              onChange={e => {
                const val = parseInt(e.target.value);
                const second = config.hiddenLayers[1] ?? 8;
                onChangeConfig({ ...config, hiddenLayers: second > 0 ? [val, second] : [val] });
              }}
              className="w-full accent-cyan-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
            />
          </div>

          {/* Layer 2 Nodes */}
          <div>
            <div className="flex justify-between text-[11px] text-slate-300 mb-1">
              <span>Hidden Layer 2 Nodes</span>
              <span className="text-cyan-400 font-mono font-semibold">{config.hiddenLayers[1] ?? 0}</span>
            </div>
            <input
              type="range"
              min="0"
              max="24"
              step="2"
              value={config.hiddenLayers[1] ?? 0}
              onChange={e => {
                const val = parseInt(e.target.value);
                const first = config.hiddenLayers[0];
                onChangeConfig({ ...config, hiddenLayers: val > 0 ? [first, val] : [first] });
              }}
              className="w-full accent-cyan-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
            />
            <span className="text-[10px] text-slate-500">Set to 0 for a single hidden layer</span>
          </div>

          {/* Activation Function */}
          <div>
            <label className="block text-[11px] text-slate-300 mb-1">Activation Function</label>
            <select
              value={config.activation}
              onChange={e => onChangeConfig({ ...config, activation: e.target.value as any })}
              className="w-full bg-slate-800 border border-slate-700 text-slate-200 text-xs rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-cyan-500"
            >
              <option value="relu">ReLU (Rectified Linear)</option>
              <option value="sigmoid">Sigmoid (Logistic)</option>
              <option value="tanh">Tanh (Hyperbolic Tangent)</option>
            </select>
          </div>

          {/* Learning Rate */}
          <div>
            <label className="block text-[11px] text-slate-300 mb-1">Learning Rate (η)</label>
            <select
              value={config.learningRate}
              onChange={e => onChangeConfig({ ...config, learningRate: parseFloat(e.target.value) })}
              className="w-full bg-slate-800 border border-slate-700 text-slate-200 text-xs rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-cyan-500"
            >
              <option value="0.001">0.001 (Slow & Steady)</option>
              <option value="0.005">0.005 (Balanced)</option>
              <option value="0.01">0.01 (Default Recommended)</option>
              <option value="0.03">0.03 (Fast Convergence)</option>
              <option value="0.05">0.05 (High)</option>
            </select>
          </div>

          {/* Max Epochs */}
          <div>
            <div className="flex justify-between text-[11px] text-slate-300 mb-1">
              <span>Max Epochs (Iterations)</span>
              <span className="text-cyan-400 font-mono font-semibold">{config.maxEpochs}</span>
            </div>
            <input
              type="range"
              min="100"
              max="600"
              step="50"
              value={config.maxEpochs}
              onChange={e => onChangeConfig({ ...config, maxEpochs: parseInt(e.target.value) })}
              className="w-full accent-cyan-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
            />
          </div>

          {/* Random Seed */}
          <div>
            <div className="flex justify-between text-[11px] text-slate-300 mb-1">
              <span>Random Seed (Reproducibility)</span>
              <span className="text-cyan-400 font-mono font-semibold">{config.seed}</span>
            </div>
            <input
              type="number"
              value={config.seed}
              onChange={e => onChangeConfig({ ...config, seed: parseInt(e.target.value) || 42 })}
              className="w-full bg-slate-800 border border-slate-700 text-slate-200 text-xs rounded-lg px-2.5 py-1 focus:outline-none focus:border-cyan-500"
            />
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-4 mt-4 border-t border-slate-800">
          <button
            onClick={onTrain}
            disabled={isTraining}
            className={`w-full py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition shadow-lg ${
              isTraining
                ? 'bg-slate-700 text-slate-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white shadow-cyan-600/30'
            }`}
          >
            <Play className={`w-3.5 h-3.5 ${isTraining ? 'animate-spin' : ''}`} />
            {isTraining ? 'Training Network...' : 'Train MLP Network'}
          </button>
        </div>
      </div>
    </aside>
  );
};
