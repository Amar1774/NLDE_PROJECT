import React, { useState } from 'react';
import {
  BookOpen,
  Brain,
  Code2,
  Layers,
  ArrowRight,
  Sparkles,
  Zap
} from 'lucide-react';

export const TheoryPage: React.FC = () => {
  // Interactive 1-Neuron Sandbox Simulator State
  const [x1, setX1] = useState(1.5);
  const [x2, setX2] = useState(-0.8);
  const [w1, setW1] = useState(0.8);
  const [w2, setW2] = useState(-1.2);
  const [bias, setBias] = useState(0.4);
  const [simActivation, setSimActivation] = useState<'relu' | 'sigmoid' | 'tanh'>('sigmoid');

  // Linear combination: z = w1*x1 + w2*x2 + b
  const z = w1 * x1 + w2 * x2 + bias;

  // Activation calculation
  let a = 0;
  if (simActivation === 'relu') {
    a = Math.max(0, z);
  } else if (simActivation === 'sigmoid') {
    a = 1 / (1 + Math.exp(-Math.max(-50, Math.min(50, z))));
  } else {
    a = Math.tanh(z);
  }

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Title */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-lg">
        <div className="flex items-center gap-2 text-cyan-400 font-bold text-xs uppercase tracking-wider">
          <BookOpen className="w-4 h-4" />
          Stage 6: Theoretical Foundations & Mathematical Formulations
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-white mt-1">
          Complete Guide to Multilayer Perceptrons (MLP)
        </h2>
        <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-3xl">
          An in-depth, beginner-friendly academic breakdown covering artificial neurons, weights, biases, non-linear activation functions, forward propagation, loss minimization, and backpropagation.
        </p>
      </div>

      {/* Interactive 1-Neuron Sandbox */}
      <div className="bg-gradient-to-br from-slate-900 via-indigo-950/40 to-slate-900 border border-cyan-500/30 rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex items-center gap-2">
          <Zap className="w-5 h-5 text-cyan-400" />
          <h3 className="text-base font-bold text-white">Interactive 1-Neuron Laboratory Simulator</h3>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed">
          Test the fundamental building block of all neural networks: calculate the linear sum z = w₁x₁ + w₂x₂ + b and observe non-linear activation a = f(z) in real time.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-2">
          {/* Inputs & Weights */}
          <div className="space-y-3 bg-slate-800/60 p-4 rounded-xl border border-slate-700/60">
            <div className="text-xs font-bold text-cyan-300 uppercase tracking-wide">
              Inputs ($x$) & Weights ($w$)
            </div>

            <div>
              <div className="flex justify-between text-xs text-slate-300 mb-1">
                <span>Input $x_1$:</span>
                <span className="font-mono text-cyan-400 font-bold">{x1.toFixed(2)}</span>
              </div>
              <input
                type="range"
                min="-3"
                max="3"
                step="0.1"
                value={x1}
                onChange={e => setX1(parseFloat(e.target.value))}
                className="w-full accent-cyan-400 h-1.5 bg-slate-700 rounded-lg cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs text-slate-300 mb-1">
                <span>Weight $w_1$:</span>
                <span className="font-mono text-cyan-400 font-bold">{w1.toFixed(2)}</span>
              </div>
              <input
                type="range"
                min="-3"
                max="3"
                step="0.1"
                value={w1}
                onChange={e => setW1(parseFloat(e.target.value))}
                className="w-full accent-cyan-400 h-1.5 bg-slate-700 rounded-lg cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs text-slate-300 mb-1">
                <span>Input $x_2$:</span>
                <span className="font-mono text-cyan-400 font-bold">{x2.toFixed(2)}</span>
              </div>
              <input
                type="range"
                min="-3"
                max="3"
                step="0.1"
                value={x2}
                onChange={e => setX2(parseFloat(e.target.value))}
                className="w-full accent-cyan-400 h-1.5 bg-slate-700 rounded-lg cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs text-slate-300 mb-1">
                <span>Weight $w_2$:</span>
                <span className="font-mono text-cyan-400 font-bold">{w2.toFixed(2)}</span>
              </div>
              <input
                type="range"
                min="-3"
                max="3"
                step="0.1"
                value={w2}
                onChange={e => setW2(parseFloat(e.target.value))}
                className="w-full accent-cyan-400 h-1.5 bg-slate-700 rounded-lg cursor-pointer"
              />
            </div>
          </div>

          {/* Bias & Activation */}
          <div className="space-y-4 bg-slate-800/60 p-4 rounded-xl border border-slate-700/60">
            <div className="text-xs font-bold text-cyan-300 uppercase tracking-wide">
              Bias & Activation Function
            </div>

            <div>
              <div className="flex justify-between text-xs text-slate-300 mb-1">
                <span>Bias Term ($b$):</span>
                <span className="font-mono text-cyan-400 font-bold">{bias.toFixed(2)}</span>
              </div>
              <input
                type="range"
                min="-3"
                max="3"
                step="0.1"
                value={bias}
                onChange={e => setBias(parseFloat(e.target.value))}
                className="w-full accent-cyan-400 h-1.5 bg-slate-700 rounded-lg cursor-pointer"
              />
              <span className="text-[10px] text-slate-400 block mt-1">
                Shifts activation threshold horizontally
              </span>
            </div>

            <div>
              <label className="block text-xs text-slate-300 mb-1">Activation Function $f(z)$:</label>
              <select
                value={simActivation}
                onChange={e => setSimActivation(e.target.value as any)}
                className="w-full bg-slate-800 border border-slate-700 text-slate-200 text-xs rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-cyan-500"
              >
                <option value="sigmoid">Sigmoid: 1 / (1 + e^-z)</option>
                <option value="relu">ReLU: max(0, z)</option>
                <option value="tanh">Tanh: (e^z - e^-z) / (e^z + e^-z)</option>
              </select>
            </div>
          </div>

          {/* Output Display */}
          <div className="bg-slate-800/90 p-4 rounded-xl border border-cyan-800/60 flex flex-col justify-between text-center">
            <div>
              <div className="text-xs font-bold text-cyan-300 uppercase tracking-wide">
                Neuron Output
              </div>
              <div className="mt-3 p-3 bg-slate-900 rounded-lg border border-slate-700/60 font-mono text-xs text-left space-y-1">
                <div className="text-slate-400">
                  z = (w₁ · x₁) + (w₂ · x₂) + b
                </div>
                <div className="text-slate-200">
                  z = ({w1.toFixed(2)} × {x1.toFixed(2)}) + ({w2.toFixed(2)} × {x2.toFixed(2)}) + {bias.toFixed(2)}
                </div>
                <div className="text-cyan-400 font-bold">
                  z = {z.toFixed(4)}
                </div>
              </div>
            </div>

            <div className="p-4 bg-slate-900/80 rounded-xl border border-cyan-500/30 mt-3">
              <div className="text-[11px] text-slate-400 uppercase">Activated Output a = f(z)</div>
              <div className="text-3xl font-extrabold text-cyan-300 mt-1 font-mono">
                {a.toFixed(4)}
              </div>
              <div className="text-[10px] text-slate-400 mt-1">
                {simActivation === 'sigmoid' && `Confidence: ${(a * 100).toFixed(1)}%`}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Comprehensive Academic Chapters */}
      <div className="space-y-6">
        {/* Chapter 1: Anatomy */}
        <section className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg space-y-3">
          <h3 className="text-lg font-bold text-cyan-400 flex items-center gap-2">
            <span>1. Anatomy of an Artificial Neuron (Perceptron)</span>
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            An artificial neuron mimics a biological neuron's cell body. Inputs arrive across synapses with variable transmission efficiencies (represented mathematically as <strong>weights</strong> $w_i$). The cell body accumulates incoming signals as a dot product, adds a baseline threshold (<strong>bias</strong> $b$), and applies an activation function:
          </p>
          <div className="p-4 bg-slate-800/60 rounded-xl border border-slate-700 font-mono text-xs text-cyan-300 overflow-x-auto">
            z = ∑ (w_i · x_i) + b = w^T x + b
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            - <strong>Weights ($w_i$):</strong> Control how strongly each clinical feature (e.g., Blood Glucose vs. Skinfold thickness) influences the outcome.
            <br />
            - <strong>Bias ($b$):</strong> Enables the neuron to activate even when all input features are zero, shifting the activation curve horizontally along the x-axis.
          </p>
        </section>

        {/* Chapter 2: Activation Functions */}
        <section className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg space-y-4">
          <h3 className="text-lg font-bold text-cyan-400">
            2. Non-Linear Activation Functions
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Without non-linear activations, stacking multiple hidden layers would simply result in repeated matrix multiplications—which collapse algebraically into a single linear transformation. Activations introduce non-linearity, allowing the network to satisfy the <strong>Universal Approximation Theorem</strong>.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-slate-800/60 rounded-xl border border-slate-700/60 space-y-2">
              <div className="font-bold text-white text-sm">ReLU (Rectified Linear)</div>
              <div className="font-mono text-cyan-300 text-xs">f(z) = max(0, z)</div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Standard in modern deep learning. Highly efficient to compute; avoids vanishing gradient problems for positive activations.
              </p>
            </div>

            <div className="p-4 bg-slate-800/60 rounded-xl border border-slate-700/60 space-y-2">
              <div className="font-bold text-white text-sm">Sigmoid (Logistic)</div>
              <div className="font-mono text-cyan-300 text-xs">f(z) = 1 / (1 + e^-z)</div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Squashes inputs smoothly into range (0, 1). Natural choice for the binary output node representing class probabilities.
              </p>
            </div>

            <div className="p-4 bg-slate-800/60 rounded-xl border border-slate-700/60 space-y-2">
              <div className="font-bold text-white text-sm">Tanh (Hyperbolic Tangent)</div>
              <div className="font-mono text-cyan-300 text-xs">f(z) = (e^z - e^-z)/(e^z + e^-z)</div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Zero-centered activation with outputs in range (-1, 1). Often converges faster than sigmoid in hidden layers.
              </p>
            </div>
          </div>
        </section>

        {/* Chapter 3: Forward Propagation */}
        <section className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg space-y-3">
          <h3 className="text-lg font-bold text-cyan-400">
            3. Forward Propagation
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            In forward propagation, feature vectors pass forward layer by layer from the input layer through the hidden layers until generating an output estimate:
          </p>
          <div className="p-4 bg-slate-800/60 rounded-xl border border-slate-700 font-mono text-xs text-slate-200 space-y-1 overflow-x-auto">
            <div>a^(0) = x &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(Input Layer: 8 clinical features)</div>
            <div>z^(l) = W^(l) · a^(l-1) + b^(l) &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(Weighted pre-activation at layer l)</div>
            <div>a^(l) = f(z^(l)) &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(Non-linear activation)</div>
            <div>ŷ = σ(z^(L)) &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(Output Layer Sigmoid probability)</div>
          </div>
        </section>

        {/* Chapter 4: Loss Function & Regularization */}
        <section className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg space-y-3">
          <h3 className="text-lg font-bold text-cyan-400">
            4. Loss Function: Binary Cross-Entropy (Log-Loss)
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            To quantify how wrong predictions are, we use <strong>Binary Cross-Entropy (Log-Loss)</strong> with an L2 weight regularization penalty:
          </p>
          <div className="p-4 bg-slate-800/60 rounded-xl border border-slate-700 font-mono text-xs text-cyan-300 overflow-x-auto">
            Loss = - (1/N) ∑ [ y_i · ln(ŷ_i) + (1 - y_i) · ln(1 - ŷ_i) ] + (α / 2) · ||W||²
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            If the true label y = 1 and the model predicts ŷ = 0.99, the loss is near zero. If the model predicts ŷ = 0.01, the loss approaches infinity. The L2 penalty (α / 2) ||W||² shrinks large weights, smoothing decision boundaries and preventing overfitting.
          </p>
        </section>

        {/* Chapter 5: Backpropagation */}
        <section className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg space-y-3">
          <h3 className="text-lg font-bold text-cyan-400">
            5. Backpropagation & Optimization (Adam / Gradient Descent)
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Training adjusts weights to minimize the loss function. The <strong>Backpropagation algorithm</strong> utilizes the <strong>Chain Rule of Calculus</strong> to calculate the partial derivative of the loss with respect to each weight:
          </p>
          <div className="p-4 bg-slate-800/60 rounded-xl border border-slate-700 font-mono text-xs text-slate-200 space-y-1 overflow-x-auto">
            <div>∂Loss / ∂W^(l) = (∂Loss / ∂z^(l)) · (a^(l-1))^T</div>
            <div>W_new = W_old - η · (∂Loss / ∂W)</div>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Where $\eta$ is the learning rate. In our project, the <strong>Adam optimizer</strong> enhances standard gradient descent by tracking exponentially decaying moving averages of past gradients (momentum) and past squared gradients (scaling).
          </p>
        </section>
      </div>
    </div>
  );
};
