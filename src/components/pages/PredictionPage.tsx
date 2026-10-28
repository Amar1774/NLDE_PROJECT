import React, { useState } from 'react';
import {
  Stethoscope,
  ShieldAlert,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  ArrowRight,
  TrendingUp,
  Activity
} from 'lucide-react';
import {
  TrainedModel,
  FEATURE_NAMES,
  FEATURE_DETAILS,
  FeatureKey,
  predictPatient
} from '../../ml/mlpEngine.ts';

interface PredictionPageProps {
  model: TrainedModel | null;
}

export const PredictionPage: React.FC<PredictionPageProps> = ({ model }) => {
  // Clinical feature inputs state
  const [features, setFeatures] = useState<Record<FeatureKey, number>>({
    Pregnancies: 3,
    Glucose: 120,
    BloodPressure: 72,
    SkinThickness: 23,
    Insulin: 85,
    BMI: 31.5,
    DiabetesPedigreeFunction: 0.45,
    Age: 33
  });

  const [hasPredicted, setHasPredicted] = useState(false);
  const [predictionResult, setPredictionResult] = useState<any>(null);

  // Preset clinical scenarios for easy demonstration
  const loadPreset = (presetName: 'healthy' | 'borderline' | 'highrisk') => {
    if (presetName === 'healthy') {
      setFeatures({
        Pregnancies: 1,
        Glucose: 88,
        BloodPressure: 68,
        SkinThickness: 18,
        Insulin: 60,
        BMI: 22.4,
        DiabetesPedigreeFunction: 0.18,
        Age: 24
      });
    } else if (presetName === 'borderline') {
      setFeatures({
        Pregnancies: 3,
        Glucose: 135,
        BloodPressure: 78,
        SkinThickness: 28,
        Insulin: 110,
        BMI: 28.5,
        DiabetesPedigreeFunction: 0.42,
        Age: 38
      });
    } else {
      setFeatures({
        Pregnancies: 6,
        Glucose: 180,
        BloodPressure: 86,
        SkinThickness: 38,
        Insulin: 210,
        BMI: 36.8,
        DiabetesPedigreeFunction: 0.95,
        Age: 52
      });
    }
    setHasPredicted(false);
  };

  const handlePredict = () => {
    if (!model) return;
    const res = predictPatient(model, features);
    setPredictionResult(res);
    setHasPredicted(true);
  };

  if (!model) {
    return (
      <div className="p-12 text-center text-slate-400 bg-slate-900 border border-slate-800 rounded-2xl max-w-xl mx-auto">
        <Activity className="w-8 h-8 text-cyan-400 mx-auto animate-pulse mb-3" />
        <h3 className="text-lg font-bold text-white">Neural Network Not Trained Yet</h3>
        <p className="text-xs text-slate-400 mt-1">Please train the model first to run interactive patient risk inference.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Title */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-lg">
        <div className="flex items-center gap-2 text-cyan-400 font-bold text-xs uppercase tracking-wider">
          <Stethoscope className="w-4 h-4" />
          Stage 5: Interactive Single-Sample Patient Risk Inference
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-white mt-1">
          Multilayer Perceptron Forward-Pass Prediction
        </h2>
        <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-3xl">
          Enter patient measurements or select clinical presets to evaluate the neural network's forward-pass decision boundaries in real time.
        </p>
      </div>

      {/* Mandatory Academic Disclaimer */}
      <div className="p-4 rounded-xl bg-red-950/40 border border-red-800/60 flex items-start gap-3.5 text-red-200">
        <ShieldAlert className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
        <div className="text-xs sm:text-sm leading-relaxed">
          <strong className="font-semibold text-red-300">Mandatory Medical Warning:</strong>{' '}
          This interactive form is strictly an algorithmic demonstration of feedforward artificial neural networks.
          It does <strong>NOT</strong> constitute a clinical diagnosis or medical assessment. No medical treatment decisions should ever be made based on these outputs.
        </div>
      </div>

      {/* Presets Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900 border border-slate-800 p-4 rounded-xl">
        <span className="text-xs font-semibold text-slate-300">Clinical Demo Presets:</span>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => loadPreset('healthy')}
            className="px-3 py-1.5 rounded-lg bg-emerald-950/70 hover:bg-emerald-900 border border-emerald-800/60 text-emerald-300 text-xs font-medium transition"
          >
            🟢 Low Risk Profile (Healthy)
          </button>
          <button
            onClick={() => loadPreset('borderline')}
            className="px-3 py-1.5 rounded-lg bg-amber-950/70 hover:bg-amber-900 border border-amber-800/60 text-amber-300 text-xs font-medium transition"
          >
            🟡 Borderline / Pre-Diabetic Profile
          </button>
          <button
            onClick={() => loadPreset('highrisk')}
            className="px-3 py-1.5 rounded-lg bg-rose-950/70 hover:bg-rose-900 border border-rose-800/60 text-rose-300 text-xs font-medium transition"
          >
            🔴 Elevated Risk Profile
          </button>
        </div>
      </div>

      {/* Input Form & Result Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sliders (2 Columns in 2/3 space) */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-5">
          <h3 className="text-base font-bold text-white flex items-center justify-between">
            <span>Diagnostic Measurements</span>
            <span className="text-xs text-slate-400 font-normal">8 Continuous Clinical Predictors</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {FEATURE_NAMES.map(feat => {
              const meta = FEATURE_DETAILS[feat];
              const curVal = features[feat];

              return (
                <div key={feat} className="space-y-1.5 p-3 rounded-xl bg-slate-800/40 border border-slate-700/50">
                  <div className="flex justify-between items-baseline">
                    <label className="text-xs font-semibold text-slate-200">
                      {meta.label}
                    </label>
                    <span className="text-xs font-mono font-bold text-cyan-400">
                      {curVal} {meta.unit}
                    </span>
                  </div>

                  <input
                    type="range"
                    min={meta.min}
                    max={meta.max}
                    step={meta.step}
                    value={curVal}
                    onChange={e => {
                      setFeatures({ ...features, [feat]: parseFloat(e.target.value) });
                      setHasPredicted(false);
                    }}
                    className="w-full accent-cyan-500 h-1.5 bg-slate-700 rounded-lg cursor-pointer"
                  />

                  <div className="flex justify-between text-[10px] text-slate-400">
                    <span>Range: {meta.min} - {meta.max}</span>
                    <span className="text-slate-500 truncate max-w-[140px] text-right" title={meta.normalRange}>
                      Normal: {meta.normalRange}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          <button
            onClick={handlePredict}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-sm shadow-lg shadow-cyan-500/25 transition flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            Compute Forward Propagation Prediction
          </button>
        </div>

        {/* Prediction Results Panel (1/3 space) */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-white mb-4">Neural Network Output</h3>

            {hasPredicted && predictionResult ? (
              <div className="space-y-5 animate-in fade-in duration-300">
                {/* Result Box */}
                <div
                  className="p-5 rounded-xl border text-center"
                  style={{
                    backgroundColor: `${predictionResult.riskColor}15`,
                    borderColor: `${predictionResult.riskColor}50`
                  }}
                >
                  <div
                    className="text-xs font-bold uppercase tracking-wider"
                    style={{ color: predictionResult.riskColor }}
                  >
                    {predictionResult.riskCategory}
                  </div>
                  <div className="text-2xl font-extrabold text-white mt-2">
                    {predictionResult.predictedClass === 1
                      ? 'Positive (Class 1)'
                      : 'Negative (Class 0)'}
                  </div>
                  <div className="text-xs text-slate-300 mt-1">
                    {predictionResult.predictedClass === 1
                      ? 'Model suggests elevated diabetes risk markers'
                      : 'Model suggests baseline non-diabetic profile'}
                  </div>
                </div>

                {/* Probability Bar */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs text-slate-300">
                    <span>Diabetes Risk Probability:</span>
                    <span className="font-mono font-bold text-cyan-400">
                      {predictionResult.probPercent}
                    </span>
                  </div>

                  <div className="h-3 w-full bg-slate-800 rounded-full overflow-hidden p-0.5 border border-slate-700">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${Math.min(100, Math.max(0, predictionResult.probability * 100))}%`,
                        backgroundColor: predictionResult.riskColor
                      }}
                    />
                  </div>

                  <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                    <span>0% (Negative)</span>
                    <span>Threshold: 50%</span>
                    <span>100% (Positive)</span>
                  </div>
                </div>

                {/* Probability Breakdown */}
                <div className="p-3 bg-slate-800/60 rounded-xl border border-slate-700 text-xs space-y-1.5 font-mono">
                  <div className="flex justify-between text-slate-300">
                    <span>P(Outcome = 0):</span>
                    <span className="text-emerald-400 font-bold">
                      {((1 - predictionResult.probability) * 100).toFixed(1)}%
                    </span>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span>P(Outcome = 1):</span>
                    <span className="text-rose-400 font-bold">
                      {(predictionResult.probability * 100).toFixed(1)}%
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-8 text-center text-slate-500 text-xs">
                <Activity className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                Adjust values on the left and click <strong>'Compute Forward Propagation Prediction'</strong> to view classified risk.
              </div>
            )}
          </div>

          <div className="mt-6 pt-4 border-t border-slate-800 text-[11px] text-slate-500 text-center">
            Predictions computed via standardized forward pass z = W · a + b and logistic sigmoid activation σ(z).
          </div>
        </div>
      </div>
    </div>
  );
};
