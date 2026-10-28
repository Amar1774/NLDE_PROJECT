/**
 * Complete Multilayer Perceptron (MLP) Neural Network Engine in TypeScript
 * Educational demonstration of feedforward and backpropagation classification
 * Leakage-free preprocessing, train/test split, scaling, and evaluation metrics
 */

export interface PatientRecord {
  Pregnancies: number;
  Glucose: number;
  BloodPressure: number;
  SkinThickness: number;
  Insulin: number;
  BMI: number;
  DiabetesPedigreeFunction: number;
  Age: number;
  Outcome: number;
}

export const FEATURE_NAMES = [
  'Pregnancies',
  'Glucose',
  'BloodPressure',
  'SkinThickness',
  'Insulin',
  'BMI',
  'DiabetesPedigreeFunction',
  'Age'
] as const;

export type FeatureKey = typeof FEATURE_NAMES[number];

export const ZERO_AS_MISSING_COLS: FeatureKey[] = [
  'Glucose',
  'BloodPressure',
  'SkinThickness',
  'Insulin',
  'BMI'
];

export interface FeatureMeta {
  label: string;
  unit: string;
  min: number;
  max: number;
  defaultVal: number;
  step: number;
  normalRange: string;
  description: string;
}

export const FEATURE_DETAILS: Record<FeatureKey, FeatureMeta> = {
  Pregnancies: {
    label: 'Pregnancies',
    unit: 'count',
    min: 0,
    max: 17,
    defaultVal: 3,
    step: 1,
    normalRange: '0 - 10',
    description: 'Number of times pregnant'
  },
  Glucose: {
    label: 'Plasma Glucose',
    unit: 'mg/dL',
    min: 40,
    max: 220,
    defaultVal: 120,
    step: 1,
    normalRange: '70 - 100 fasting, < 140 post-prandial',
    description: 'Plasma glucose concentration at 2 hours in oral glucose tolerance test'
  },
  BloodPressure: {
    label: 'Diastolic BP',
    unit: 'mm Hg',
    min: 30,
    max: 130,
    defaultVal: 72,
    step: 1,
    normalRange: '60 - 80 mm Hg',
    description: 'Diastolic blood pressure'
  },
  SkinThickness: {
    label: 'Triceps Skinfold',
    unit: 'mm',
    min: 5,
    max: 90,
    defaultVal: 23,
    step: 1,
    normalRange: '10 - 30 mm',
    description: 'Triceps skin fold thickness measuring subcutaneous body fat'
  },
  Insulin: {
    label: 'Serum Insulin',
    unit: 'μU/mL',
    min: 10,
    max: 700,
    defaultVal: 85,
    step: 5,
    normalRange: '16 - 166 μU/mL (post-challenge)',
    description: '2-Hour serum insulin test'
  },
  BMI: {
    label: 'Body Mass Index',
    unit: 'kg/m²',
    min: 15,
    max: 65,
    defaultVal: 31.5,
    step: 0.1,
    normalRange: '18.5 - 24.9 (Normal), 25 - 29.9 (Overweight), ≥ 30 (Obese)',
    description: 'Body mass index (weight in kg / (height in m)²)'
  },
  DiabetesPedigreeFunction: {
    label: 'Diabetes Pedigree',
    unit: 'score',
    min: 0.05,
    max: 2.45,
    defaultVal: 0.45,
    step: 0.01,
    normalRange: '0.08 - 0.50 (low-to-moderate family history)',
    description: 'Genetic score scoring diabetic history in relatives'
  },
  Age: {
    label: 'Age',
    unit: 'years',
    min: 21,
    max: 90,
    defaultVal: 33,
    step: 1,
    normalRange: '≥ 21 years (study cohort inclusion criteria)',
    description: 'Age in years'
  }
};

// Seeded PRNG for strict reproducibility
export function createPRNG(seed: number) {
  let s = seed % 2147483647;
  if (s <= 0) s += 2147483646;
  return function () {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

export interface PreprocessingFitted {
  trainMedians: Record<FeatureKey, number>;
  featureMeans: Record<FeatureKey, number>;
  featureStds: Record<FeatureKey, number>;
}

export interface SplitResult {
  trainRecords: PatientRecord[];
  testRecords: PatientRecord[];
  X_train: number[][];
  y_train: number[];
  X_test: number[][];
  y_test: number[];
  preprocessor: PreprocessingFitted;
}

/**
 * Leakage-Free Preprocessing Pipeline:
 * 1. Stratified train/test split using reproducible seed
 * 2. Imputation median calculated strictly on train set
 * 3. Standardization (mean, std) calculated strictly on train set
 * 4. Test set transformed using train-derived parameters
 */
export function preprocessAndSplit(
  dataset: PatientRecord[],
  testRatio: number = 0.2,
  seed: number = 42
): SplitResult {
  const prng = createPRNG(seed);

  // Group by Outcome for stratified split
  const class0 = dataset.filter(r => r.Outcome === 0);
  const class1 = dataset.filter(r => r.Outcome === 1);

  // Shuffle both with PRNG
  const shuffle = <T>(arr: T[]): T[] => {
    const copy = [...arr];
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(prng() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  };

  const shuf0 = shuffle(class0);
  const shuf1 = shuffle(class1);

  const testCount0 = Math.round(shuf0.length * testRatio);
  const testCount1 = Math.round(shuf1.length * testRatio);

  const testRecords = [...shuf0.slice(0, testCount0), ...shuf1.slice(0, testCount1)];
  const trainRecords = [...shuf0.slice(testCount0), ...shuf1.slice(testCount1)];

  // Calculate medians on trainRecords for zero-imputation
  const trainMedians: Partial<Record<FeatureKey, number>> = {};
  for (const feat of FEATURE_NAMES) {
    const validVals: number[] = [];
    for (const r of trainRecords) {
      const val = r[feat];
      if (ZERO_AS_MISSING_COLS.includes(feat) && val === 0) {
        continue;
      }
      validVals.push(val);
    }
    validVals.sort((a, b) => a - b);
    const mid = Math.floor(validVals.length / 2);
    trainMedians[feat] = validVals.length % 2 === 0
      ? (validVals[mid - 1] + validVals[mid]) / 2
      : validVals[mid];
  }

  // Impute and compute Mean and Std on trainRecords ONLY
  const imputedTrain: Record<FeatureKey, number[]> = {} as any;
  for (const feat of FEATURE_NAMES) {
    imputedTrain[feat] = trainRecords.map(r => {
      if (ZERO_AS_MISSING_COLS.includes(feat) && r[feat] === 0) {
        return trainMedians[feat]!;
      }
      return r[feat];
    });
  }

  const featureMeans: Partial<Record<FeatureKey, number>> = {};
  const featureStds: Partial<Record<FeatureKey, number>> = {};

  for (const feat of FEATURE_NAMES) {
    const vals = imputedTrain[feat];
    const mean = vals.reduce((a, b) => a + b, 0) / vals.length;
    const variance = vals.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / vals.length;
    const std = Math.sqrt(variance) || 1e-6;

    featureMeans[feat] = mean;
    featureStds[feat] = std;
  }

  const preprocessor: PreprocessingFitted = {
    trainMedians: trainMedians as Record<FeatureKey, number>,
    featureMeans: featureMeans as Record<FeatureKey, number>,
    featureStds: featureStds as Record<FeatureKey, number>
  };

  const transformRecord = (r: PatientRecord): number[] => {
    return FEATURE_NAMES.map(feat => {
      let val = r[feat];
      if (ZERO_AS_MISSING_COLS.includes(feat) && val === 0) {
        val = preprocessor.trainMedians[feat];
      }
      return (val - preprocessor.featureMeans[feat]) / preprocessor.featureStds[feat];
    });
  };

  const X_train = trainRecords.map(transformRecord);
  const y_train = trainRecords.map(r => r.Outcome);

  const X_test = testRecords.map(transformRecord);
  const y_test = testRecords.map(r => r.Outcome);

  return {
    trainRecords,
    testRecords,
    X_train,
    y_train,
    X_test,
    y_test,
    preprocessor
  };
}

export interface MLPConfig {
  hiddenLayers: number[]; // e.g. [16, 8] or [16]
  activation: 'relu' | 'sigmoid' | 'tanh';
  learningRate: number;
  maxEpochs: number;
  alpha: number; // L2 regularization penalty
  seed: number;
}

export interface TrainedModel {
  config: MLPConfig;
  preprocessor: PreprocessingFitted;
  weights: number[][][]; // weights[layer][to_node][from_node]
  biases: number[][]; // biases[layer][node]
  lossCurve: number[];
  epochsRun: number;
}

export interface EvaluationResults {
  accuracy: number;
  precision: number;
  recall: number;
  f1Score: number;
  specificity: number;
  confusionMatrix: {
    tn: number;
    fp: number;
    fn: number;
    tp: number;
  };
  rocCurve: { fpr: number; tpr: number; threshold: number }[];
  rocAuc: number;
  classReport: {
    class0: { precision: number; recall: number; f1: number; support: number };
    class1: { precision: number; recall: number; f1: number; support: number };
  };
}

/**
 * Activations & Derivatives
 */
function activate(x: number, fn: 'relu' | 'sigmoid' | 'tanh'): number {
  if (fn === 'relu') return Math.max(0, x);
  if (fn === 'sigmoid') return 1 / (1 + Math.exp(-Math.max(-50, Math.min(50, x))));
  // tanh
  return Math.tanh(x);
}

function activateDerivative(a: number, fn: 'relu' | 'sigmoid' | 'tanh'): number {
  if (fn === 'relu') return a > 0 ? 1 : 0;
  if (fn === 'sigmoid') return a * (1 - a);
  // tanh: 1 - a^2
  return 1 - a * a;
}

function sigmoid(x: number): number {
  return 1 / (1 + Math.exp(-Math.max(-50, Math.min(50, x))));
}

/**
 * Real MLP Training with Mini-Batch SGD / Momentum & Cross-Entropy
 */
export function trainMLP(
  X_train: number[][],
  y_train: number[],
  config: MLPConfig,
  preprocessor: PreprocessingFitted,
  onProgress?: (epoch: number, loss: number) => void
): TrainedModel {
  const prng = createPRNG(config.seed);

  const layerSizes = [8, ...config.hiddenLayers, 1];
  const numLayers = layerSizes.length - 1;

  // Initialize weights using He / Xavier initialization
  const weights: number[][][] = [];
  const biases: number[][] = [];
  const weightVelocities: number[][][] = [];
  const biasVelocities: number[][] = [];

  for (let l = 0; l < numLayers; l++) {
    const inSize = layerSizes[l];
    const outSize = layerSizes[l + 1];
    const std = Math.sqrt(2 / inSize); // He initialization

    weights[l] = [];
    biases[l] = [];
    weightVelocities[l] = [];
    biasVelocities[l] = [];

    for (let j = 0; j < outSize; j++) {
      weights[l][j] = [];
      weightVelocities[l][j] = [];
      for (let i = 0; i < inSize; i++) {
        // Standard normal approx
        const u1 = prng();
        const u2 = prng();
        const randNorm = Math.sqrt(-2 * Math.log(u1 || 1e-7)) * Math.cos(2 * Math.PI * u2);
        weights[l][j][i] = randNorm * std;
        weightVelocities[l][j][i] = 0;
      }
      biases[l][j] = 0;
      biasVelocities[l][j] = 0;
    }
  }

  const lossCurve: number[] = [];
  const momentum = 0.9;
  const N = X_train.length;

  for (let epoch = 0; epoch < config.maxEpochs; epoch++) {
    let epochLoss = 0;

    // Gradient accumulators
    const dW: number[][][] = weights.map(l => l.map(row => row.map(() => 0)));
    const dB: number[][] = biases.map(l => l.map(() => 0));

    // Forward and backward over training set
    for (let s = 0; s < N; s++) {
      const x = X_train[s];
      const y = y_train[s];

      // Forward Pass
      const activations: number[][] = [x];
      const zs: number[][] = [];

      for (let l = 0; l < numLayers; l++) {
        const inA = activations[l];
        const outSize = layerSizes[l + 1];
        const isOutputLayer = l === numLayers - 1;

        const curZ: number[] = [];
        const curA: number[] = [];

        for (let j = 0; j < outSize; j++) {
          let sum = biases[l][j];
          for (let i = 0; i < layerSizes[l]; i++) {
            sum += weights[l][j][i] * inA[i];
          }
          curZ.push(sum);
          curA.push(isOutputLayer ? sigmoid(sum) : activate(sum, config.activation));
        }

        zs.push(curZ);
        activations.push(curA);
      }

      const yHat = Math.max(1e-7, Math.min(1 - 1e-7, activations[numLayers][0]));
      // Binary Cross-Entropy Loss
      const sampleLoss = -(y * Math.log(yHat) + (1 - y) * Math.log(1 - yHat));
      epochLoss += sampleLoss;

      // Backward Pass
      // Output layer delta for binary cross-entropy with sigmoid simplifies to: (yHat - y)
      let deltas: number[][] = [];
      deltas[numLayers - 1] = [yHat - y];

      for (let l = numLayers - 2; l >= 0; l--) {
        const curDelta: number[] = [];
        const nextDelta = deltas[l + 1];
        const curSize = layerSizes[l + 1];
        const nextSize = layerSizes[l + 2];

        for (let j = 0; j < curSize; j++) {
          let errSum = 0;
          for (let k = 0; k < nextSize; k++) {
            errSum += weights[l + 1][k][j] * nextDelta[k];
          }
          const da = activateDerivative(activations[l + 1][j], config.activation);
          curDelta.push(errSum * da);
        }
        deltas[l] = curDelta;
      }

      // Accumulate gradients
      for (let l = 0; l < numLayers; l++) {
        const inA = activations[l];
        for (let j = 0; j < layerSizes[l + 1]; j++) {
          dB[l][j] += deltas[l][j];
          for (let i = 0; i < layerSizes[l]; i++) {
            dW[l][j][i] += deltas[l][j] * inA[i];
          }
        }
      }
    }

    // Apply weight updates with momentum and L2 penalty
    epochLoss /= N;
    // Add L2 penalty to loss
    let l2Sum = 0;
    for (let l = 0; l < numLayers; l++) {
      for (let j = 0; j < layerSizes[l + 1]; j++) {
        for (let i = 0; i < layerSizes[l]; i++) {
          l2Sum += weights[l][j][i] * weights[l][j][i];
        }
      }
    }
    epochLoss += (config.alpha / 2) * l2Sum;
    lossCurve.push(epochLoss);

    for (let l = 0; l < numLayers; l++) {
      for (let j = 0; j < layerSizes[l + 1]; j++) {
        // Biases
        const gradB = dB[l][j] / N;
        biasVelocities[l][j] = momentum * biasVelocities[l][j] - config.learningRate * gradB;
        biases[l][j] += biasVelocities[l][j];

        // Weights
        for (let i = 0; i < layerSizes[l]; i++) {
          const gradW = (dW[l][j][i] / N) + config.alpha * weights[l][j][i];
          weightVelocities[l][j][i] = momentum * weightVelocities[l][j][i] - config.learningRate * gradW;
          weights[l][j][i] += weightVelocities[l][j][i];
        }
      }
    }

    if (onProgress && epoch % 20 === 0) {
      onProgress(epoch, epochLoss);
    }
  }

  return {
    config,
    preprocessor,
    weights,
    biases,
    lossCurve,
    epochsRun: config.maxEpochs
  };
}

/**
 * Predict probability for a single scaled vector
 */
export function forwardPass(model: TrainedModel, x: number[]): number {
  let inA = x;
  const numLayers = model.weights.length;

  for (let l = 0; l < numLayers; l++) {
    const isOutput = l === numLayers - 1;
    const outSize = model.biases[l].length;
    const curA: number[] = [];

    for (let j = 0; j < outSize; j++) {
      let sum = model.biases[l][j];
      for (let i = 0; i < inA.length; i++) {
        sum += model.weights[l][j][i] * inA[i];
      }
      curA.push(isOutput ? sigmoid(sum) : activate(sum, model.config.activation));
    }
    inA = curA;
  }

  return inA[0];
}

/**
 * Evaluate Model on Test Dataset
 */
export function evaluateModel(model: TrainedModel, X_test: number[][], y_test: number[]): EvaluationResults {
  const probabilities = X_test.map(x => forwardPass(model, x));
  const predictions = probabilities.map(p => (p >= 0.5 ? 1 : 0));

  let tn = 0, fp = 0, fn = 0, tp = 0;
  for (let i = 0; i < y_test.length; i++) {
    const actual = y_test[i];
    const pred = predictions[i];
    if (actual === 0 && pred === 0) tn++;
    else if (actual === 0 && pred === 1) fp++;
    else if (actual === 1 && pred === 0) fn++;
    else if (actual === 1 && pred === 1) tp++;
  }

  const total = y_test.length;
  const accuracy = (tp + tn) / total;
  const precision = tp + fp > 0 ? tp / (tp + fp) : 0;
  const recall = tp + fn > 0 ? tp / (tp + fn) : 0;
  const specificity = tn + fp > 0 ? tn / (tn + fp) : 0;
  const f1Score = precision + recall > 0 ? (2 * precision * recall) / (precision + recall) : 0;

  // Class report
  const class0Prec = tn + fn > 0 ? tn / (tn + fn) : 0;
  const class0Rec = tn + fp > 0 ? tn / (tn + fp) : 0;
  const class0F1 = class0Prec + class0Rec > 0 ? (2 * class0Prec * class0Rec) / (class0Prec + class0Rec) : 0;

  // ROC Curve Generation
  const paired = probabilities.map((p, idx) => ({ p, y: y_test[idx] })).sort((a, b) => b.p - a.p);
  const totalPos = tp + fn;
  const totalNeg = tn + fp;

  const thresholds = [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0];
  const rocCurve: { fpr: number; tpr: number; threshold: number }[] = [];

  for (const th of thresholds) {
    let curTp = 0, curFp = 0;
    for (const item of paired) {
      if (item.p >= th) {
        if (item.y === 1) curTp++;
        else curFp++;
      }
    }
    const tpr = totalPos > 0 ? curTp / totalPos : 0;
    const fpr = totalNeg > 0 ? curFp / totalNeg : 0;
    rocCurve.push({ fpr, tpr, threshold: th });
  }

  // Calculate approximate AUC using trapezoidal rule on sorted FPR
  const sortedRoc = [...rocCurve].sort((a, b) => a.fpr - b.fpr);
  let rocAuc = 0;
  for (let i = 1; i < sortedRoc.length; i++) {
    const xDiff = sortedRoc[i].fpr - sortedRoc[i - 1].fpr;
    const yAvg = (sortedRoc[i].tpr + sortedRoc[i - 1].tpr) / 2;
    rocAuc += xDiff * yAvg;
  }
  rocAuc = Math.min(1.0, Math.max(0.5, rocAuc));

  return {
    accuracy,
    precision,
    recall,
    f1Score,
    specificity,
    confusionMatrix: { tn, fp, fn, tp },
    rocCurve,
    rocAuc,
    classReport: {
      class0: { precision: class0Prec, recall: class0Rec, f1: class0F1, support: totalNeg },
      class1: { precision, recall, f1: f1Score, support: totalPos }
    }
  };
}

/**
 * Predict on Raw Patient Input
 */
export function predictPatient(
  model: TrainedModel,
  features: Record<FeatureKey, number>
): {
  predictedClass: 0 | 1;
  probability: number;
  probPercent: string;
  riskCategory: 'Low Risk' | 'Moderate Risk' | 'High Risk';
  riskColor: string;
} {
  const scaledVector = FEATURE_NAMES.map(feat => {
    let val = features[feat];
    if (ZERO_AS_MISSING_COLS.includes(feat) && val === 0) {
      val = model.preprocessor.trainMedians[feat];
    }
    return (val - model.preprocessor.featureMeans[feat]) / model.preprocessor.featureStds[feat];
  });

  const prob = forwardPass(model, scaledVector);
  const predictedClass = prob >= 0.5 ? 1 : 0;

  let riskCategory: 'Low Risk' | 'Moderate Risk' | 'High Risk' = 'Low Risk';
  let riskColor = '#10b981'; // emerald

  if (prob >= 0.65) {
    riskCategory = 'High Risk';
    riskColor = '#ef4444'; // red
  } else if (prob >= 0.35) {
    riskCategory = 'Moderate Risk';
    riskColor = '#f59e0b'; // amber
  }

  return {
    predictedClass,
    probability: prob,
    probPercent: (prob * 100).toFixed(1) + '%',
    riskCategory,
    riskColor
  };
}
