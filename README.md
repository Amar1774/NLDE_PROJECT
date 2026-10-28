# Build a Multilayer Perceptron Neural Network for Classification

**Academic Level:** College Machine Learning Micro-Project / Laboratory Demonstration  
**Author / Student:** College Engineering & Computer Science Laboratory  
**Technology Stack:** Python 3.10+, Streamlit, Scikit-learn (`MLPClassifier`), Pandas, NumPy, Matplotlib, Seaborn  
**Dataset:** Pima Indians Diabetes Database (National Institute of Diabetes and Digestive and Kidney Diseases - NIDDK)  

---

## 🎯 1. Project Objective

The objective of this college micro-project is to design, implement, rigorously evaluate, and demonstrate a **Multilayer Perceptron (MLP)** Artificial Neural Network for binary classification. Using the well-known Pima Indians Diabetes dataset, the project illustrates how an artificial neural network with non-linear activation functions learns decision boundaries from multivariate clinical measurements.

> **⚠️ Mandatory Medical & Academic Disclaimer:**  
> This project is designed strictly for **educational and laboratory demonstration purposes**. It is **not** a certified medical diagnostic device or clinical decision-support system. Predictions represent statistical patterns and should never be interpreted as clinical diagnoses.

---

## 🏗️ 2. Repository Structure

```text
├── app.py              # Main Streamlit web application with multi-page navigation
├── model_utils.py      # Core ML pipeline: Data loading, zero-handling, imputation, scaling, MLP training & metrics
├── diabetes.csv        # Pima Indians Diabetes dataset (768 patient records, 8 features, 1 binary target)
├── requirements.txt    # Python dependencies with minimum version pins
├── run.bat             # Automated 1-click Windows 11 launcher script (creates venv, installs, runs app)
├── run.sh              # Linux / macOS shell launcher script
└── README.md           # Comprehensive project documentation, setup guide, and viva preparation
```

---

## 💻 3. Step-by-Step Windows 11 & VS Code Setup Guide

Follow these exact steps to run the project locally on **Windows 11** using **Visual Studio Code**:

### Prerequisites
1. **Python 3.10 or higher** installed from [python.org](https://www.python.org/downloads/).  
   *Important during installation:* Check the box that says **"Add python.exe to PATH"**.
2. **Visual Studio Code (VS Code)** installed.

### Option A: Automated Launch (Fastest)
1. Double-click `run.bat` in the project directory.
2. The script will automatically check for Python, set up a virtual environment (`venv`), install all required dependencies, and launch the Streamlit dashboard in your default browser at `http://localhost:8501`.

---

### Option B: Manual Execution via VS Code Terminal

#### Step 1: Open the Project in VS Code
1. Open VS Code.
2. Click **File > Open Folder...** and select the folder containing this project.

#### Step 2: Open an Integrated Terminal
1. Press ``Ctrl + ` `` (Backtick) or go to **Terminal > New Terminal**.
2. Ensure the terminal is open in the project root directory.

#### Step 3: Create a Python Virtual Environment
Run the following command:
```bash
python -m venv venv
```

#### Step 4: Activate the Virtual Environment
- **Command Prompt (cmd):**
  ```cmd
  venv\Scripts\activate.bat
  ```
- **PowerShell:**
  ```powershell
  Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
  .\venv\Scripts\Activate.ps1
  ```
*(You will see `(venv)` prepended to your command prompt line).*

#### Step 5: Upgrade Pip & Install Dependencies
```bash
python -m pip install --upgrade pip
pip install -r requirements.txt
```

#### Step 6: Launch the Streamlit Application
```bash
streamlit run app.py
```
VS Code will launch the local development server and open `http://localhost:8501` in your browser.

---

## 🔬 4. Machine Learning Pipeline Details

### 4.1 Dataset & Feature Definition
The dataset contains 768 patient records of female subjects of Pima heritage aged 21 and older:
1. `Pregnancies`: Number of times pregnant
2. `Glucose`: Plasma glucose concentration at 2 hours in an oral glucose tolerance test
3. `BloodPressure`: Diastolic blood pressure ($mm\ Hg$)
4. `SkinThickness`: Triceps skinfold thickness ($mm$)
5. `Insulin`: 2-Hour serum insulin ($\\mu U/ml$)
6. `BMI`: Body Mass Index ($weight\ in\ kg / (height\ in\ m)^2$)
7. `DiabetesPedigreeFunction`: Genetic diabetes predisposition score
8. `Age`: Age in years
9. `Outcome`: Target classification label ($0 = \text{Non-diabetic}, 1 = \text{Diabetic}$)

### 4.2 Handling Biologically Invalid Zero Values
In this dataset, missing laboratory readings were historically encoded as `0`. While `0` is a valid entry for `Pregnancies`, a value of `0` for `Glucose`, `BloodPressure`, `SkinThickness`, `Insulin`, or `BMI` is biologically incompatible with life.
- These invalid zeros are identified and treated as missing values (`NaN`).
- A `SimpleImputer` with a **median** strategy is employed to replace missing entries robustly against skewness.

### 4.3 Strict Leakage-Free Preprocessing
A critical grading criterion in academic ML projects is avoiding **Data Leakage**:
1. The raw dataset is split into **Train (80%)** and **Test (20%)** partitions first, using stratified sampling to preserve the 65:35 class distribution.
2. `SimpleImputer` is **fitted exclusively on the training split** and then used to transform both splits.
3. `StandardScaler` (z-score normalization: $\mu=0, \sigma=1$) is **fitted exclusively on the imputed training split** and then used to transform both splits.
This ensures test set statistics never leak into model parameter estimation.

### 4.4 Neural Network Architecture (`MLPClassifier`)
The Multilayer Perceptron consists of:
- **Input Layer:** 8 neurons corresponding to the 8 standardized features.
- **Hidden Layers:** Configurable (default: 2 hidden layers with 16 and 8 neurons).
- **Activation Function:** Rectified Linear Unit ($\text{ReLU}(z) = \max(0, z)$), with options for Logistic Sigmoid and Tanh.
- **Output Layer:** 1 binary classification neuron equipped with a Logistic Sigmoid activation.
- **Optimizer:** Adam (Adaptive Moment Estimation) with $L_2$ weight penalty (`alpha = 0.0001`).
- **Loss Function:** Binary Cross-Entropy (Log-Loss):
  $$\mathcal{L} = -\frac{1}{N} \sum_{i=1}^N \left[ y_i \ln \hat{y}_i + (1 - y_i) \ln (1 - \hat{y}_i) \right]$$

---

## 📊 5. Evaluation Metrics: Why Accuracy is Not Enough

In binary medical classification:
- **Accuracy:** Measures overall correctness $\frac{TP + TN}{TP + TN + FP + FN}$. However, if 70% of samples are negative, a dummy model predicting all negatives scores 70% accuracy while failing 100% of diabetic patients.
- **Recall (Sensitivity):** $\frac{TP}{TP + FN}$. In healthcare, a **False Negative (FN)** is catastrophic (a diabetic patient is sent home undiagnosed). Maximizing recall is paramount.
- **Precision:** $\frac{TP}{TP + FP}$. Minimizes False Positives (preventing unnecessary patient anxiety and invasive follow-up testing).
- **F1-Score:** Harmonic mean of Precision and Recall:
  $$\text{F1} = 2 \times \frac{\text{Precision} \times \text{Recall}}{\text{Precision} + \text{Recall}}$$
- **Confusion Matrix:** Explicit $2 \times 2$ grid reporting True Negatives, False Positives, False Negatives, and True Positives.
- **ROC-AUC:** Area under the Receiver Operating Characteristic curve, assessing discrimination ability across all classification thresholds.

---

## 👨‍🏫 6. How to Demonstrate to a Faculty Member / Examiner

When presenting this micro-project to your college professor or external viva examiner:

1. **State the Exact Title & Objective:**  
   *"Respected Professor, my micro-project is titled 'Build a Multilayer Perceptron Neural Network for Classification'. The objective is to demonstrate non-linear pattern recognition on the Pima Indians Diabetes dataset using a feedforward neural network."*
2. **Highlight the Preprocessing Pipeline:**  
   Navigate to the **Dataset & Preprocessing** tab. Show how columns like `Glucose` and `Insulin` contained biologically invalid zeros. Explain that your code splits the dataset *before* fitting the `SimpleImputer` and `StandardScaler` to prevent data leakage.
3. **Explain the Architecture:**  
   Navigate to **Network Architecture & Training**. Walk the examiner through the conceptual architecture diagram (8 input nodes $\rightarrow$ Layer 1 [16 nodes] $\rightarrow$ Layer 2 [8 nodes] $\rightarrow$ Output node). Show the Log-Loss convergence curve over 500 epochs.
4. **Defend Metric Selection:**  
   Navigate to **Performance Evaluation**. Show the Confusion Matrix and explain why you prioritized **Recall and F1-Score** alongside overall Accuracy.
5. **Demonstrate Real-Time Inference:**  
   Navigate to **Interactive Patient Prediction**. Adjust glucose (e.g. to 180 mg/dL) and BMI (e.g. to 38.0) and click *Compute Prediction*. Show the predicted risk probability and reiterate the non-diagnostic academic disclaimer.

---

## ❓ 7. Top 10 Faculty Viva Questions & Model Answers

1. **Q: Why use an MLP instead of a simple Perceptron?**  
   *A:* A single-layer Perceptron can only solve linearly separable problems. An MLP uses hidden layers with non-linear activation functions (Universal Approximation Theorem) to learn non-linear decision boundaries.
2. **Q: What is the role of the activation function?**  
   *A:* Without non-linear activations, successive layer matrix multiplications would reduce to a single linear transformation, preventing the network from learning complex non-linear relationships.
3. **Q: Why is feature scaling mandatory for neural networks?**  
   *A:* Gradient descent updates weights proportionally to inputs. If features have vastly different scales (e.g., Insulin $\approx 300$ vs. Pedigree Function $\approx 0.5$), gradient updates become erratic and slow. Z-score scaling ensures smooth spherical error contours.
4. **Q: What is Backpropagation?**  
   *A:* Backpropagation is the algorithm that computes the gradient of the loss function with respect to each network weight using the Chain Rule of Calculus, propagating the error backward from output to input.
5. **Q: Why is Adam optimizer preferred over standard SGD here?**  
   *A:* Adam computes individual adaptive learning rates using first-order (momentum) and second-order (RMSProp) running averages of gradients, leading to faster and more reliable convergence on noisy tabular data.
6. **Q: What is Data Leakage and how did you prevent it?**  
   *A:* Data leakage occurs when test set distribution parameters (mean, median, standard deviation) leak into the training phase. We prevented it by splitting into train/test first, and fitting transformers solely on the train split.
7. **Q: What is L2 regularization (alpha)?**  
   *A:* It adds a penalty $\frac{\alpha}{2} \|\mathbf{w}\|^2$ to the loss function. This penalizes large weights, preventing individual neurons from memorizing noise and reducing overfitting.
8. **Q: Why is accuracy insufficient in medical machine learning?**  
   *A:* Accuracy conceals class imbalance and treats False Negatives and False Positives equally. In medicine, missing a sick patient (False Negative) has higher clinical cost than a False Positive.
9. **Q: What is the purpose of the bias neuron?**  
   *A:* The bias allows shifting the activation function curve along the input axis independently of feature inputs, analogous to the intercept term in a linear equation ($y = mx + c$).
10. **Q: What are the primary limitations of this project?**  
    *A:* Small cohort size (768 female records), specific demographic restriction to Pima heritage, reliance on median imputation for noisy zero readings, and lack of external hospital cohort validation.

---

## 📚 8. References & Citations

1. **Dataset Origin:** National Institute of Diabetes and Digestive and Kidney Diseases (NIDDK), original donors Vincent Sigillito et al., Johns Hopkins University Applied Physics Laboratory (1988).
2. **Backpropagation Foundation:** Rumelhart, D. E., Hinton, G. E., & Williams, R. J. (1986). *Learning representations by back-propagating errors.* Nature, 323(6088), 533-536.
3. **Scikit-Learn Framework:** Pedregosa et al. (2011). *Scikit-learn: Machine Learning in Python.* Journal of Machine Learning Research (JMLR), 12, 2825-2830.
4. **Adam Optimizer:** Kingma, D. P., & Ba, J. (2014). *Adam: A Method for Stochastic Optimization.* arXiv:1412.6980.

---
*Developed for College Machine Learning Laboratory Curriculum.*
