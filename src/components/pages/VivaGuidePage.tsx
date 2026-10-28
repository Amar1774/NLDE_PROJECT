import React, { useState } from 'react';
import {
  GraduationCap,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  Award,
  BookOpen,
  CheckCircle2,
  AlertTriangle,
  FileText
} from 'lucide-react';

export const VivaGuidePage: React.FC = () => {
  const [openQ, setOpenQ] = useState<number | null>(0);

  const vivaQuestions = [
    {
      q: '1. What is a Multilayer Perceptron (MLP) and how does it differ from a Single-Layer Perceptron?',
      a: 'A single-layer perceptron contains only input and output nodes with a step function, which can only learn linearly separable decision hyperplanes (and famously fails on the XOR problem, as proven by Minsky & Papert in 1969). An MLP incorporates one or more hidden layers equipped with non-linear activation functions. By the Universal Approximation Theorem, an MLP with at least one non-linear hidden layer can approximate any continuous non-linear function.'
    },
    {
      q: '2. What is Data Leakage, and how does your project strictly prevent it?',
      a: 'Data leakage happens when information from outside the training dataset (such as mean, median, or standard deviation of the test set) is inadvertently used to transform or train the model. We strictly prevent leakage by splitting the raw dataset into Train and Test sets first. Both SimpleImputer (median) and StandardScaler (z-score normalization) are fitted solely on the training partition, and then used to transform the test partition.'
    },
    {
      q: '3. Why are zero values in Glucose, Blood Pressure, and BMI considered missing values rather than valid measurements?',
      a: 'While having 0 pregnancies is biologically valid, a living human cannot have a blood glucose of 0 mg/dL, blood pressure of 0 mm Hg, or BMI of 0 kg/m². In the historical NIDDK records, missing laboratory results were coded as 0. Leaving them as 0 would introduce severe artifacts in gradient calculations, which is why our pipeline replaces them with the training median.'
    },
    {
      q: '4. Why is feature scaling (StandardScaler) essential for training an MLP?',
      a: 'Neural network weights are updated using gradient descent: W_new = W_old - η · (∂L/∂W). When features have drastically differing scales (e.g., Insulin values reaching 846 μU/mL vs. Diabetes Pedigree Function at 0.37), the loss surface becomes highly eccentric and elongated, causing gradient oscillations and slow convergence. Z-score scaling (mean=0, std=1) creates spherical error contours, facilitating smooth, stable convergence.'
    },
    {
      q: '5. What role does the activation function play, and why did you use ReLU in hidden layers and Sigmoid in the output layer?',
      a: 'Without non-linear activations, multiple dense layers collapse into a single linear matrix multiplication. ReLU (max(0, z)) is used in hidden layers because it avoids vanishing gradient issues for positive inputs and accelerates convergence. Sigmoid (1 / (1 + e^-z)) is used in the output neuron to squash activations into the range (0, 1), providing calibrated probabilities for binary classification.'
    },
    {
      q: '6. Why is Accuracy alone not an adequate metric for diabetes classification?',
      a: 'In imbalanced medical datasets (here, ~65% non-diabetic and 35% diabetic), a naive baseline model that always guesses "Negative" achieves 65% accuracy while missing 100% of diabetic patients. In medicine, False Negatives (FN) carry grave clinical costs (delaying therapy for a diabetic patient). Hence, Recall (Sensitivity) and the harmonic F1-Score are vital metrics.'
    },
    {
      q: '7. How does the Backpropagation algorithm work?',
      a: 'Backpropagation uses the Chain Rule of Calculus to compute the partial derivative of the scalar loss function with respect to every weight and bias in the network: ∂L/∂W^(l) = (∂L/∂z^(l)) · (a^(l-1))^T. It propagates the error gradient backward from the output layer to the input layer, allowing optimizers like Adam to update parameters.'
    },
    {
      q: '8. What is the Adam optimizer, and what advantages does it offer over standard SGD?',
      a: 'Adam (Adaptive Moment Estimation) combines the benefits of Momentum (exponential moving average of gradients) and RMSProp (exponential moving average of squared gradients). It maintains individual adaptive learning rates for each parameter, making it robust against sparse gradients and noisy tabular clinical features.'
    },
    {
      q: '9. What does the L2 regularization parameter (alpha) do?',
      a: 'Alpha penalizes large weights by adding (alpha/2) · ||W||^2 to the loss function. This shrinkage penalty discourages the neural network from relying excessively on any single feature or fitting high-frequency training noise, thereby mitigating overfitting and improving generalization.'
    },
    {
      q: '10. What are the key limitations of this micro-project?',
      a: '1) Small dataset size (768 patient records). 2) Demographic specificity (exclusively adult female subjects of Pima Indian heritage). 3) Median imputation simplifies missing data uncertainty. 4) Lack of prospective clinical hospital validation. The project is an academic simulation, not a clinical diagnostic system.'
    }
  ];

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Title */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-lg">
        <div className="flex items-center gap-2 text-cyan-400 font-bold text-xs uppercase tracking-wider">
          <GraduationCap className="w-4 h-4" />
          Stage 7: College Laboratory Viva Voce & Demonstration Guide
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-white mt-1">
          Faculty Presentation Guide & Viva Voce Preparation
        </h2>
        <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-3xl">
          Comprehensive demonstration strategy, script for lab evaluators, top 10 examination questions with model answers, and project limitations.
        </p>
      </div>

      {/* 5-Step Faculty Walkthrough Demonstration Script */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex items-center gap-2 text-cyan-400 font-bold text-base">
          <Award className="w-5 h-5" />
          <h3>3-Minute Faculty Demonstration Walkthrough Script</h3>
        </div>
        <div className="space-y-3 text-xs sm:text-sm text-slate-300">
          <div className="p-3.5 bg-slate-800/60 rounded-xl border border-slate-700/60">
            <span className="font-bold text-cyan-300">Step 1: State Title & Project Scope</span>
            <p className="text-slate-400 mt-1 text-xs">
              "Respected Professor, my micro-project is titled <strong>'Build a Multilayer Perceptron Neural Network for Classification'</strong>. We evaluate feedforward non-linear classification on 768 patient instances from the NIDDK Pima Indians Diabetes database."
            </p>
          </div>

          <div className="p-3.5 bg-slate-800/60 rounded-xl border border-slate-700/60">
            <span className="font-bold text-cyan-300">Step 2: Demonstrate Leakage-Free Preprocessing</span>
            <p className="text-slate-400 mt-1 text-xs">
              Show the <strong>Dataset & Preprocessing</strong> tab. Highlight that Glucose, BP, and Insulin have biologically impossible 0s. Emphasize that your pipeline splits train/test first with stratification before computing medians and scaling parameters to guarantee zero data leakage.
            </p>
          </div>

          <div className="p-3.5 bg-slate-800/60 rounded-xl border border-slate-700/60">
            <span className="font-bold text-cyan-300">Step 3: Show Neural Architecture & Convergence</span>
            <p className="text-slate-400 mt-1 text-xs">
              Open <strong>Architecture & Training</strong>. Explain the conceptual diagram: 8 inputs → Hidden Layer 1 (16 ReLU) → Hidden Layer 2 (8 ReLU) → 1 Sigmoid output. Show the logarithmic loss curve smoothly converging over epochs using Adam optimizer.
            </p>
          </div>

          <div className="p-3.5 bg-slate-800/60 rounded-xl border border-slate-700/60">
            <span className="font-bold text-cyan-300">Step 4: Justify Metrics Beyond Accuracy</span>
            <p className="text-slate-400 mt-1 text-xs">
              Open <strong>Performance & Metrics</strong>. Point to the Confusion Matrix. Explain why Recall and F1-Score are vital in healthcare: missing a diabetic patient (False Negative) is clinically much more dangerous than a False Positive.
            </p>
          </div>

          <div className="p-3.5 bg-slate-800/60 rounded-xl border border-slate-700/60">
            <span className="font-bold text-cyan-300">Step 5: Interactive Single-Patient Prediction</span>
            <p className="text-slate-400 mt-1 text-xs">
              Go to <strong>Patient Prediction Lab</strong>. Select the "Elevated Risk Profile" preset and compute inference. Show the resulting class probability and reiterate the academic non-diagnostic disclaimer.
            </p>
          </div>
        </div>
      </div>

      {/* 10 Top Viva Voce Questions & Answers Accordion */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex items-center gap-2 text-cyan-400 font-bold text-base">
          <HelpCircle className="w-5 h-5" />
          <h3>Top 10 Frequently Asked Faculty Viva Voce Questions</h3>
        </div>

        <div className="space-y-2.5">
          {vivaQuestions.map((item, idx) => {
            const isOpen = openQ === idx;
            return (
              <div
                key={idx}
                className="rounded-xl border border-slate-800 bg-slate-800/50 overflow-hidden transition"
              >
                <button
                  onClick={() => setOpenQ(isOpen ? null : idx)}
                  className="w-full p-4 flex items-center justify-between text-left hover:bg-slate-800 transition"
                >
                  <span className="text-xs sm:text-sm font-semibold text-slate-200">
                    {item.q}
                  </span>
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4 text-cyan-400 shrink-0 ml-2" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-400 shrink-0 ml-2" />
                  )}
                </button>
                {isOpen && (
                  <div className="p-4 pt-1 text-xs sm:text-sm text-slate-300 border-t border-slate-700/60 leading-relaxed bg-slate-900/60">
                    {item.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Project Conclusion, Limitations & Attribution */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg space-y-3">
          <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
            <CheckCircle2 className="w-4 h-4" />
            Project Conclusion
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            The Multilayer Perceptron neural network successfully demonstrates non-linear pattern recognition on clinical diagnostic indicators. By imputing physiologically invalid zero entries on training splits and standardizing features, the network achieves consistent generalization across holdout test data. This confirms the efficacy of multi-layer architectures for tabular biological classification.
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg space-y-3">
          <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
            <AlertTriangle className="w-4 h-4" />
            Attribution & References
          </div>
          <div className="text-xs text-slate-300 space-y-2 leading-relaxed">
            <div>
              <strong>Dataset:</strong> National Institute of Diabetes and Digestive and Kidney Diseases (NIDDK), original donors Vincent Sigillito et al. (Johns Hopkins APL).
            </div>
            <div>
              <strong>Key References:</strong>
              <br />• Rumelhart, Hinton & Williams (1986). <em>Learning representations by back-propagating errors.</em> Nature.
              <br />• Pedregosa et al. (2011). <em>Scikit-learn: Machine Learning in Python.</em> JMLR.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
