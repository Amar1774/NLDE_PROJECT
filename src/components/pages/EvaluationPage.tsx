import React, { useState } from 'react';
import {
  BarChart3,
  AlertCircle,
  HelpCircle,
  Target,
  CheckCircle,
  TrendingUp,
  Activity,
  Layers
} from 'lucide-react';
import { EvaluationResults } from '../../ml/mlpEngine.ts';

interface EvaluationPageProps {
  results: EvaluationResults | null;
  testCount: number;
}

export const EvaluationPage: React.FC<EvaluationPageProps> = ({ results, testCount }) => {
  const [activeCell, setActiveCell] = useState<'tn' | 'fp' | 'fn' | 'tp' | null>(null);

  if (!results) {
    return (
      <div className="p-12 text-center text-slate-400 bg-slate-900 border border-slate-800 rounded-2xl max-w-xl mx-auto">
        <Activity className="w-8 h-8 text-cyan-400 mx-auto animate-pulse mb-3" />
        <h3 className="text-lg font-bold text-white">No Model Trained Yet</h3>
        <p className="text-xs text-slate-400 mt-1">Please train the MLP network to view test set performance metrics.</p>
      </div>
    );
  }

  const { accuracy, precision, recall, f1Score, specificity, confusionMatrix: cm, rocAuc, classReport } = results;

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Title */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-lg">
        <div className="flex items-center gap-2 text-cyan-400 font-bold text-xs uppercase tracking-wider">
          <BarChart3 className="w-4 h-4" />
          Stage 4: Quantitative Performance & Model Evaluation
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-white mt-1">
          Holdout Test Set Classification Metrics
        </h2>
        <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-3xl">
          Evaluated on <strong>{testCount} unseen test samples</strong> partitioned via stratified sampling prior to all preprocessing steps.
        </p>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 text-center shadow">
          <div className="text-[11px] uppercase tracking-wider text-slate-400 font-medium">Accuracy</div>
          <div className="text-2xl font-extrabold text-cyan-400 mt-1">
            {(accuracy * 100).toFixed(1)}%
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5">Overall Correct</div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 text-center shadow">
          <div className="text-[11px] uppercase tracking-wider text-slate-400 font-medium">Precision (PPV)</div>
          <div className="text-2xl font-extrabold text-blue-400 mt-1">
            {(precision * 100).toFixed(1)}%
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5">TP / (TP + FP)</div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 text-center shadow">
          <div className="text-[11px] uppercase tracking-wider text-slate-400 font-medium">Recall (Sensitivity)</div>
          <div className="text-2xl font-extrabold text-emerald-400 mt-1">
            {(recall * 100).toFixed(1)}%
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5">TP / (TP + FN)</div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 text-center shadow">
          <div className="text-[11px] uppercase tracking-wider text-slate-400 font-medium">F1-Score</div>
          <div className="text-2xl font-extrabold text-purple-400 mt-1">
            {(f1Score * 100).toFixed(1)}%
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5">Harmonic Mean</div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 text-center shadow">
          <div className="text-[11px] uppercase tracking-wider text-slate-400 font-medium">Specificity (TNR)</div>
          <div className="text-2xl font-extrabold text-amber-400 mt-1">
            {(specificity * 100).toFixed(1)}%
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5">TN / (TN + FP)</div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 text-center shadow">
          <div className="text-[11px] uppercase tracking-wider text-slate-400 font-medium">ROC-AUC</div>
          <div className="text-2xl font-extrabold text-rose-400 mt-1">
            {rocAuc.toFixed(3)}
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5">Area Under Curve</div>
        </div>
      </div>

      {/* Critical Academic Discussion: Why Accuracy Alone is Insufficient */}
      <div className="bg-gradient-to-br from-cyan-950/40 via-slate-900 to-slate-900 border-l-4 border-cyan-400 border-r border-t border-b border-slate-800 rounded-2xl p-6 shadow-xl">
        <div className="flex items-start gap-4">
          <div className="p-2.5 rounded-xl bg-cyan-500/20 text-cyan-400 shrink-0">
            <AlertCircle className="w-6 h-6" />
          </div>
          <div className="space-y-2 text-xs sm:text-sm text-slate-300">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              🎓 Critical Academic Insight: Why Accuracy Alone Is Not Sufficient
            </h3>
            <p className="leading-relaxed">
              In clinical medicine and machine learning classification, relying exclusively on <strong>Accuracy</strong> can be dangerous and misleading due to two primary phenomena:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
              <div className="p-3.5 bg-slate-800/60 rounded-xl border border-slate-700/60">
                <div className="font-semibold text-cyan-300 text-xs uppercase tracking-wide">
                  1. The Accuracy Paradox in Imbalanced Sets
                </div>
                <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">
                  In a disease dataset where 90% of samples are negative, a naive baseline classifier that trivially outputs "Negative" for every single person achieves a deceivingly high <strong>90% Accuracy</strong>, yet fails to detect a single sick patient (0% Recall).
                </p>
              </div>

              <div className="p-3.5 bg-slate-800/60 rounded-xl border border-slate-700/60">
                <div className="font-semibold text-rose-300 text-xs uppercase tracking-wide">
                  2. Asymmetric Clinical Cost of False Negatives
                </div>
                <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">
                  In screening, a <strong>False Negative (FN)</strong> means a diabetic patient is told they are healthy, delaying essential care. In contrast, a False Positive causes inconvenience and re-testing. Therefore, <strong>Recall (Sensitivity)</strong> and the balanced <strong>F1-Score</strong> are far more critical than raw accuracy.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Confusion Matrix & Classification Report Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Confusion Matrix Interactive Heatmap */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white">Interactive Confusion Matrix</h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Click any quadrant to view clinical interpretation and formula.
              </p>
            </div>
            <span className="text-[11px] font-mono text-cyan-400 bg-cyan-950/60 px-2 py-1 rounded border border-cyan-800">
              N = {testCount}
            </span>
          </div>

          {/* Matrix Grid */}
          <div className="pt-2">
            <div className="grid grid-cols-2 gap-3 text-center">
              {/* True Negative */}
              <button
                onClick={() => setActiveCell('tn')}
                className={`p-4 rounded-xl border transition-all text-left relative overflow-hidden ${
                  activeCell === 'tn'
                    ? 'bg-emerald-950/80 border-emerald-400 ring-2 ring-emerald-500/30'
                    : 'bg-slate-800/80 border-slate-700 hover:border-emerald-500/50'
                }`}
              >
                <div className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider">
                  True Negative (TN)
                </div>
                <div className="text-3xl font-extrabold text-white mt-1 font-mono">
                  {cm.tn}
                </div>
                <div className="text-[11px] text-slate-400 mt-1">
                  Actual: 0 | Predicted: 0
                </div>
                <div className="text-[10px] text-emerald-300/80 mt-1 font-mono">
                  {((cm.tn / testCount) * 100).toFixed(1)}% of test set
                </div>
              </button>

              {/* False Positive */}
              <button
                onClick={() => setActiveCell('fp')}
                className={`p-4 rounded-xl border transition-all text-left relative overflow-hidden ${
                  activeCell === 'fp'
                    ? 'bg-amber-950/80 border-amber-400 ring-2 ring-amber-500/30'
                    : 'bg-slate-800/80 border-slate-700 hover:border-amber-500/50'
                }`}
              >
                <div className="text-[10px] uppercase font-bold text-amber-400 tracking-wider">
                  False Positive (FP - Type I)
                </div>
                <div className="text-3xl font-extrabold text-white mt-1 font-mono">
                  {cm.fp}
                </div>
                <div className="text-[11px] text-slate-400 mt-1">
                  Actual: 0 | Predicted: 1
                </div>
                <div className="text-[10px] text-amber-300/80 mt-1 font-mono">
                  {((cm.fp / testCount) * 100).toFixed(1)}% of test set
                </div>
              </button>

              {/* False Negative */}
              <button
                onClick={() => setActiveCell('fn')}
                className={`p-4 rounded-xl border transition-all text-left relative overflow-hidden ${
                  activeCell === 'fn'
                    ? 'bg-rose-950/80 border-rose-400 ring-2 ring-rose-500/30'
                    : 'bg-slate-800/80 border-slate-700 hover:border-rose-500/50'
                }`}
              >
                <div className="text-[10px] uppercase font-bold text-rose-400 tracking-wider">
                  False Negative (FN - Type II)
                </div>
                <div className="text-3xl font-extrabold text-white mt-1 font-mono">
                  {cm.fn}
                </div>
                <div className="text-[11px] text-slate-400 mt-1">
                  Actual: 1 | Predicted: 0
                </div>
                <div className="text-[10px] text-rose-300/80 mt-1 font-mono">
                  {((cm.fn / testCount) * 100).toFixed(1)}% of test set
                </div>
              </button>

              {/* True Positive */}
              <button
                onClick={() => setActiveCell('tp')}
                className={`p-4 rounded-xl border transition-all text-left relative overflow-hidden ${
                  activeCell === 'tp'
                    ? 'bg-cyan-950/80 border-cyan-400 ring-2 ring-cyan-500/30'
                    : 'bg-slate-800/80 border-slate-700 hover:border-cyan-500/50'
                }`}
              >
                <div className="text-[10px] uppercase font-bold text-cyan-400 tracking-wider">
                  True Positive (TP)
                </div>
                <div className="text-3xl font-extrabold text-white mt-1 font-mono">
                  {cm.tp}
                </div>
                <div className="text-[11px] text-slate-400 mt-1">
                  Actual: 1 | Predicted: 1
                </div>
                <div className="text-[10px] text-cyan-300/80 mt-1 font-mono">
                  {((cm.tp / testCount) * 100).toFixed(1)}% of test set
                </div>
              </button>
            </div>

            {/* Explanation card for selected cell */}
            <div className="mt-4 p-3 bg-slate-800/60 rounded-xl border border-slate-700 text-xs text-slate-300">
              {activeCell === 'tn' && (
                <div>
                  <strong className="text-emerald-400">True Negative:</strong> Non-diabetic patients correctly classified as non-diabetic by the MLP.
                </div>
              )}
              {activeCell === 'fp' && (
                <div>
                  <strong className="text-amber-400">False Positive (Type I Error):</strong> Healthy patient predicted as diabetic. Leads to false alarm and secondary testing.
                </div>
              )}
              {activeCell === 'fn' && (
                <div>
                  <strong className="text-rose-400">False Negative (Type II Error):</strong> Diabetic patient misclassified as healthy. <em>Clinically the most critical error to minimize</em>.
                </div>
              )}
              {activeCell === 'tp' && (
                <div>
                  <strong className="text-cyan-400">True Positive:</strong> Diabetic patients accurately detected by the neural network.
                </div>
              )}
              {!activeCell && (
                <div className="text-slate-400 italic">
                  Tip: Click on any matrix quadrant above to see its mathematical definition and clinical significance.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Classification Report Table */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white">Detailed Classification Report</h3>
            <span className="text-[11px] text-slate-400 font-mono">Per-Class Metrics</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse font-mono">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-800/60 text-slate-300 font-sans font-semibold">
                  <th className="p-3">Class</th>
                  <th className="p-3">Precision</th>
                  <th className="p-3">Recall</th>
                  <th className="p-3">F1-Score</th>
                  <th className="p-3">Support</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                <tr className="hover:bg-slate-800/30">
                  <td className="p-3 font-sans font-semibold text-slate-200">
                    Class 0 (Non-Diabetic)
                  </td>
                  <td className="p-3 text-cyan-300">{(classReport.class0.precision * 100).toFixed(1)}%</td>
                  <td className="p-3 text-emerald-300">{(classReport.class0.recall * 100).toFixed(1)}%</td>
                  <td className="p-3 text-purple-300">{(classReport.class0.f1 * 100).toFixed(1)}%</td>
                  <td className="p-3 text-slate-400">{classReport.class0.support}</td>
                </tr>
                <tr className="hover:bg-slate-800/30">
                  <td className="p-3 font-sans font-semibold text-slate-200">
                    Class 1 (Diabetic)
                  </td>
                  <td className="p-3 text-cyan-300">{(classReport.class1.precision * 100).toFixed(1)}%</td>
                  <td className="p-3 text-emerald-300">{(classReport.class1.recall * 100).toFixed(1)}%</td>
                  <td className="p-3 text-purple-300">{(classReport.class1.f1 * 100).toFixed(1)}%</td>
                  <td className="p-3 text-slate-400">{classReport.class1.support}</td>
                </tr>
                <tr className="border-t border-slate-700 bg-slate-800/40 font-bold">
                  <td className="p-3 font-sans text-white">Macro Average</td>
                  <td className="p-3 text-cyan-300">
                    {(((classReport.class0.precision + classReport.class1.precision) / 2) * 100).toFixed(1)}%
                  </td>
                  <td className="p-3 text-emerald-300">
                    {(((classReport.class0.recall + classReport.class1.recall) / 2) * 100).toFixed(1)}%
                  </td>
                  <td className="p-3 text-purple-300">
                    {(((classReport.class0.f1 + classReport.class1.f1) / 2) * 100).toFixed(1)}%
                  </td>
                  <td className="p-3 text-slate-300">{testCount}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="p-3 bg-slate-800/50 rounded-xl border border-slate-700/60 text-xs text-slate-300 space-y-1">
            <div className="font-semibold text-white">Formulas for Lab Examination:</div>
            <div>• <strong>Precision:</strong> TP / (TP + FP)</div>
            <div>• <strong>Recall:</strong> TP / (TP + FN)</div>
            <div>• <strong>F1-Score:</strong> 2 × (Precision × Recall) / (Precision + Recall)</div>
          </div>
        </div>
      </div>
    </div>
  );
};
