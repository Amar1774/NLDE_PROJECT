import React from 'react';
import {
  Brain,
  ShieldAlert,
  Target,
  Layers,
  ArrowRight,
  Database,
  Cpu,
  GraduationCap
} from 'lucide-react';

interface OverviewPageProps {
  onNavigate: (page: string) => void;
  totalRecords: number;
}

export const OverviewPage: React.FC<OverviewPageProps> = ({ onNavigate, totalRecords }) => {
  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* College Micro-Project Hero Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-indigo-950/70 to-cyan-950/80 border border-cyan-500/30 p-6 md:p-8 shadow-2xl">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/20 border border-cyan-400/40 text-cyan-300 text-xs font-bold tracking-wide uppercase mb-3">
            <GraduationCap className="w-3.5 h-3.5" />
            College Machine Learning Laboratory Micro-Project
          </div>

          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight leading-tight">
            Build a Multilayer Perceptron Neural Network for Classification
          </h1>

          <p className="mt-3 text-slate-300 text-sm sm:text-base max-w-3xl leading-relaxed">
            An end-to-end artificial intelligence laboratory demonstration exploring how deep feedforward
            neural networks process multivariate clinical indicators, map non-linear boundaries, and classify
            binary diabetes outcomes using the benchmark Pima Indians Diabetes dataset.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <button
              onClick={() => onNavigate('dataset')}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs sm:text-sm shadow-lg shadow-cyan-600/30 transition"
            >
              Explore Dataset & Preprocessing
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => onNavigate('architecture')}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold text-xs sm:text-sm transition"
            >
              View Neural Architecture & Train
            </button>
            <button
              onClick={() => onNavigate('python')}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-900/60 hover:bg-emerald-800/80 text-emerald-300 border border-emerald-700/50 font-semibold text-xs sm:text-sm transition"
            >
              Get Python / Windows 11 Package
            </button>
            <button
              onClick={() => onNavigate('report')}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs sm:text-sm shadow-lg shadow-indigo-600/30 transition"
            >
              📄 College Report (.docx & PDF)
            </button>
          </div>
        </div>
      </div>

      {/* Mandatory Academic & Medical Disclaimer */}
      <div className="p-4 rounded-xl bg-red-950/40 border border-red-800/60 flex items-start gap-3.5 text-red-200">
        <ShieldAlert className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
        <div className="text-xs sm:text-sm leading-relaxed">
          <strong className="font-semibold text-red-300">Mandatory Educational & Non-Diagnostic Notice:</strong>{' '}
          This micro-project is designed exclusively for academic laboratory instruction, curriculum grading,
          and artificial neural network demonstration. It is <strong>NOT</strong> an accredited diagnostic tool
          and must never be used for real-life clinical diagnoses, health screening, or medical treatment decisions.
        </div>
      </div>

      {/* Core Project Objectives Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Objectives */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-lg">
          <div className="flex items-center gap-2.5 text-cyan-400 font-bold text-base mb-4">
            <Target className="w-5 h-5" />
            <h3>Project Learning Objectives</h3>
          </div>
          <ul className="space-y-3 text-xs sm:text-sm text-slate-300">
            <li className="flex items-start gap-2.5">
              <span className="w-5 h-5 rounded-full bg-cyan-950 border border-cyan-800 flex items-center justify-center text-cyan-400 text-xs font-mono shrink-0">1</span>
              <span><strong>Data Preprocessing & Anomaly Rectification:</strong> Detect physiologically implausible 0 values in clinical variables (e.g., Blood Pressure, Glucose, Insulin) and handle them via median imputation.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="w-5 h-5 rounded-full bg-cyan-950 border border-cyan-800 flex items-center justify-center text-cyan-400 text-xs font-mono shrink-0">2</span>
              <span><strong>Zero Data Leakage Protocol:</strong> Partition train/test splits prior to fitting imputers and standardizers to prevent test set information contamination.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="w-5 h-5 rounded-full bg-cyan-950 border border-cyan-800 flex items-center justify-center text-cyan-400 text-xs font-mono shrink-0">3</span>
              <span><strong>Neural Network Architecture:</strong> Construct feedforward multi-layer perceptron topologies with configurable hidden layers and non-linear activations.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="w-5 h-5 rounded-full bg-cyan-950 border border-cyan-800 flex items-center justify-center text-cyan-400 text-xs font-mono shrink-0">4</span>
              <span><strong>Rigorous Model Evaluation:</strong> Prove why accuracy alone is insufficient in healthcare datasets through Confusion Matrix, Precision, Recall, and F1 analysis.</span>
            </li>
          </ul>
        </div>

        {/* What is an MLP */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-lg">
          <div className="flex items-center gap-2.5 text-cyan-400 font-bold text-base mb-4">
            <Brain className="w-5 h-5" />
            <h3>What is a Multilayer Perceptron (MLP)?</h3>
          </div>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            A <strong>Multilayer Perceptron (MLP)</strong> is a foundational class of feedforward Artificial Neural Networks (ANN).
            While single-layer perceptrons can only classify linearly separable patterns (failing on problems like XOR),
            an MLP introduces one or more <strong>hidden layers</strong> equipped with non-linear activation functions (such as ReLU, Sigmoid, or Tanh).
          </p>
          <div className="mt-4 grid grid-cols-3 gap-2 text-center">
            <div className="p-3 bg-slate-800/60 rounded-xl border border-slate-700/60">
              <div className="text-cyan-400 font-bold text-sm">8 Nodes</div>
              <div className="text-[11px] text-slate-400 mt-1">Input Layer</div>
            </div>
            <div className="p-3 bg-slate-800/60 rounded-xl border border-slate-700/60">
              <div className="text-cyan-400 font-bold text-sm">Configurable</div>
              <div className="text-[11px] text-slate-400 mt-1">Hidden Layers</div>
            </div>
            <div className="p-3 bg-slate-800/60 rounded-xl border border-slate-700/60">
              <div className="text-emerald-400 font-bold text-sm">1 Node</div>
              <div className="text-[11px] text-slate-400 mt-1">Sigmoid Output</div>
            </div>
          </div>
          <p className="mt-4 text-xs text-slate-400">
            Governed by the <strong>Universal Approximation Theorem</strong>, an MLP with non-linear activations can approximate any continuous function given adequate neuron capacity.
          </p>
        </div>
      </div>

      {/* Dataset & Tech Specifications */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5">
          <div className="flex items-center gap-2 text-blue-400 text-xs font-bold uppercase tracking-wider mb-2">
            <Database className="w-4 h-4" />
            Benchmark Dataset
          </div>
          <div className="text-lg font-bold text-white">Pima Indians Diabetes</div>
          <div className="text-xs text-slate-400 mt-1">
            Origin: National Institute of Diabetes and Digestive and Kidney Diseases (NIDDK)
          </div>
          <div className="mt-3 text-xs text-slate-300 space-y-1">
            <div>• {totalRecords} total patient observations</div>
            <div>• 8 continuous clinical predictors</div>
            <div>• Binary target: 0 (Negative) vs 1 (Positive)</div>
          </div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5">
          <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold uppercase tracking-wider mb-2">
            <Layers className="w-4 h-4" />
            Mathematical Core
          </div>
          <div className="text-lg font-bold text-white">Backpropagation & Adam</div>
          <div className="text-xs text-slate-400 mt-1">
            Optimization & Loss Formulation
          </div>
          <div className="mt-3 text-xs text-slate-300 space-y-1">
            <div>• Loss: Binary Cross-Entropy (Log-Loss)</div>
            <div>• Regularization: L2 Weight Decay (α = 0.0001)</div>
            <div>• Gradients: Chain rule backward passes</div>
          </div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5">
          <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-2">
            <Cpu className="w-4 h-4" />
            Dual-Platform Architecture
          </div>
          <div className="text-lg font-bold text-white">Interactive Web & Python</div>
          <div className="text-xs text-slate-400 mt-1">
            Full Python Streamlit + React Engine
          </div>
          <div className="mt-3 text-xs text-slate-300 space-y-1">
            <div>• Real-time browser simulation & inference</div>
            <div>• Complete Python scripts (<code>app.py</code>)</div>
            <div>• 1-click Windows 11 runner (<code>run.bat</code>)</div>
          </div>
        </div>
      </div>
    </div>
  );
};
