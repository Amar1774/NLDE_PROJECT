"""
========================================================================================
PROJECT TITLE: Build a Multilayer Perceptron Neural Network for Classification
ACADEMIC LEVEL: College Machine Learning Micro-Project & Laboratory Demonstration
DATASET: Pima Indians Diabetes Database (National Institute of Diabetes and Digestive and Kidney Diseases)
FRAMEWORK: Streamlit, Scikit-learn (MLPClassifier), Pandas, NumPy, Matplotlib, Seaborn
========================================================================================
DISCLAIMER: This application is an educational demonstration designed for academic study
and laboratory demonstration. It is NOT a medical diagnostic device or healthcare system.
========================================================================================
"""

import streamlit as st
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.metrics import confusion_matrix
import io

# Import modular helper utilities
from model_utils import (
    FEATURE_NAMES,
    TARGET_NAME,
    FEATURE_METADATA,
    ZERO_AS_MISSING_COLS,
    load_dataset,
    get_missing_zero_stats,
    preprocess_and_split,
    train_mlp_classifier,
    evaluate_mlp,
    predict_single_patient
)

# ---------------------------------------------------------
# Page Configuration & Styling
# ---------------------------------------------------------
st.set_page_config(
    page_title="Build a Multilayer Perceptron Neural Network for Classification",
    page_icon="🧠",
    layout="wide",
    initial_sidebar_state="expanded"
)

# Custom Styling: Dark navy background with cyan & blue accents
st.markdown("""
<style>
    /* Dark Navy Palette Theme */
    .main {
        background-color: #0b1120;
        color: #f1f5f9;
    }
    .stApp {
        background-color: #0b1120;
    }
    h1, h2, h3 {
        color: #38bdf8 !important;
        font-family: 'Inter', -apple-system, sans-serif;
    }
    .metric-card {
        background: #1e293b;
        border: 1px solid #334155;
        border-radius: 12px;
        padding: 18px 24px;
        text-align: center;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.2);
    }
    .metric-val {
        font-size: 2.2rem;
        font-weight: 700;
        color: #06b6d4;
        margin-top: 4px;
    }
    .metric-lbl {
        font-size: 0.85rem;
        color: #94a3b8;
        text-transform: uppercase;
        letter-spacing: 0.05em;
    }
    .banner-box {
        background: linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0369a1 100%);
        border: 1px solid #0284c7;
        border-radius: 14px;
        padding: 24px;
        margin-bottom: 24px;
    }
    .disclaimer-box {
        background-color: rgba(239, 68, 68, 0.1);
        border-left: 4px solid #ef4444;
        padding: 12px 18px;
        border-radius: 6px;
        color: #fca5a5;
        margin-bottom: 20px;
    }
    .info-card {
        background: #1e293b;
        border-radius: 10px;
        border: 1px solid #334155;
        padding: 16px;
        margin-bottom: 16px;
    }
    .stButton>button {
        background: linear-gradient(90deg, #0284c7, #2563eb);
        color: white;
        font-weight: 600;
        border: none;
        border-radius: 8px;
        padding: 0.6rem 1.4rem;
        transition: all 0.2s ease-in-out;
    }
    .stButton>button:hover {
        background: linear-gradient(90deg, #0369a1, #1d4ed8);
        box-shadow: 0 4px 12px rgba(14, 165, 233, 0.3);
    }
</style>
""", unsafe_allow_html=True)


# ---------------------------------------------------------
# Sidebar Navigation & Hyperparameter Controls
# ---------------------------------------------------------
st.sidebar.image("https://img.icons8.com/fluency/96/artificial-intelligence.png", width=64)
st.sidebar.title("MLP Project Menu")
st.sidebar.caption("College Micro-Project Laboratory Dashboard")

menu_choice = st.sidebar.radio(
    "Navigation",
    [
        "1. Home & Project Objective",
        "2. Dataset & Preprocessing",
        "3. Network Architecture & Training",
        "4. Performance Evaluation",
        "5. Interactive Patient Prediction",
        "6. About Multilayer Perceptrons",
        "7. Viva Voce & Laboratory Guide"
    ]
)

st.sidebar.markdown("---")
st.sidebar.subheader("⚙️ Training Hyperparameters")
st.sidebar.caption("Fine-tune the MLPClassifier architecture:")

col_s1, col_s2 = st.sidebar.columns(2)
hidden_1 = col_s1.slider("Layer 1 Neurons", min_value=4, max_value=64, value=16, step=4)
hidden_2 = col_s2.slider("Layer 2 Neurons", min_value=0, max_value=32, value=8, step=2)

hidden_layers = (hidden_1,) if hidden_2 == 0 else (hidden_1, hidden_2)

activation_choice = st.sidebar.selectbox(
    "Activation Function",
    options=["relu", "logistic", "tanh"],
    index=0,
    help="Rectified Linear Unit (relu) is standard; Logistic (sigmoid) and Tanh are classical alternatives."
)

solver_choice = st.sidebar.selectbox(
    "Optimizer (Solver)",
    options=["adam", "sgd"],
    index=0,
    help="Adam is adaptive moment estimation, ideal for small-to-medium tabular sets."
)

learning_rate_val = st.sidebar.select_slider(
    "Initial Learning Rate",
    options=[0.0005, 0.001, 0.005, 0.01, 0.05, 0.1],
    value=0.01
)

max_iter_val = st.sidebar.slider("Maximum Iterations (Epochs)", min_value=100, max_value=1000, value=500, step=50)
random_seed = st.sidebar.number_input("Reproducibility Seed", value=42, step=1)
test_split_ratio = st.sidebar.slider("Test Split Size", min_value=0.10, max_value=0.40, value=0.20, step=0.05)


# ---------------------------------------------------------
# State Management & Pipeline Execution
# ---------------------------------------------------------
if "uploaded_file" not in st.session_state:
    st.session_state.uploaded_file = None

if "model_trained" not in st.session_state:
    st.session_state.model_trained = False

@st.cache_data
def get_cached_raw_data(file_bytes=None):
    if file_bytes is not None:
        return load_dataset(io.BytesIO(file_bytes))
    return load_dataset()

# Load dataset
try:
    if st.session_state.uploaded_file is not None:
        df = get_cached_raw_data(st.session_state.uploaded_file)
        data_source_label = "Custom Uploaded Dataset"
    else:
        df = get_cached_raw_data()
        data_source_label = "Pima Indians Diabetes Database (NIDDK)"
except Exception as e:
    st.error(f"Error loading dataset: {e}")
    df = pd.DataFrame()
    data_source_label = "Failed to load"


# Pipeline training helper cached with parameters
def run_pipeline():
    X_train_scaled, X_test_scaled, y_train, y_test, imputer, scaler, X_train_raw, X_test_raw = preprocess_and_split(
        df,
        test_size=test_split_ratio,
        random_state=int(random_seed),
        stratify=True
    )
    mlp = train_mlp_classifier(
        X_train_scaled,
        y_train,
        hidden_layer_sizes=hidden_layers,
        activation=activation_choice,
        solver=solver_choice,
        learning_rate_init=learning_rate_val,
        max_iter=int(max_iter_val),
        random_state=int(random_seed)
    )
    results = evaluate_mlp(mlp, X_test_scaled, y_test)
    return {
        "model": mlp,
        "imputer": imputer,
        "scaler": scaler,
        "results": results,
        "X_train": X_train_scaled,
        "X_test": X_test_scaled,
        "y_train": y_train,
        "y_test": y_test,
        "X_train_raw": X_train_raw,
        "X_test_raw": X_test_raw
    }

pipeline_bundle = run_pipeline() if not df.empty else None


# ---------------------------------------------------------
# PAGE 1: Home & Project Objective
# ---------------------------------------------------------
if menu_choice == "1. Home & Project Objective":
    st.markdown("""
    <div class="banner-box">
        <span style="background:#0284c7; color:white; padding:4px 12px; border-radius:20px; font-size:0.75rem; font-weight:700; text-transform:uppercase;">
            College Machine Learning Micro-Project
        </span>
        <h1 style="margin-top:12px; font-size:2.2rem; color:#38bdf8; font-weight:800; line-height:1.2;">
            Build a Multilayer Perceptron Neural Network for Classification
        </h1>
        <p style="color:#cbd5e1; font-size:1.05rem; margin-top:8px; max-width:900px;">
            A complete educational implementation showcasing how artificial neural networks learn non-linear decision boundaries
            from multivariate clinical indicators using the Pima Indians Diabetes dataset.
        </p>
    </div>
    """, unsafe_allow_html=True)

    st.markdown("""
    <div class="disclaimer-box">
        <strong>⚠️ Mandatory Academic & Medical Disclaimer:</strong><br>
        This micro-project is created strictly for academic research, demonstration of machine learning algorithms,
        and laboratory viva evaluation. It is <strong>NOT</strong> an accredited diagnostic tool and should never be used
        for actual clinical decision-making or personal health assessment.
    </div>
    """, unsafe_allow_html=True)

    col1, col2 = st.columns([3, 2])

    with col1:
        st.subheader("🎯 Project Objective")
        st.write("""
        The primary objective of this micro-project is to design, implement, rigorously evaluate, and explain
        a **Multilayer Perceptron (MLP)** feedforward artificial neural network trained to classify whether a patient
        exhibits signs of diabetes based on diagnostic measurements.
        
        Key competencies demonstrated:
        1. **Data Preprocessing & Leakage Prevention:** Identifying physiologically implausible zero-values (e.g., blood pressure or insulin = 0) and imputing/scaling strictly on training splits.
        2. **Neural Architecture Design:** Configuring multi-layer topologies with input, hidden, and output activation layers.
        3. **Optimization & Convergence:** Monitoring cross-entropy loss reduction across training iterations using the Adam optimizer.
        4. **Holistic Model Evaluation:** Demonstrating why *Accuracy alone is insufficient* in medical classification, emphasizing Precision, Recall, F1-Score, and Confusion Matrix trade-offs.
        5. **Interactive Inference:** Providing a single-sample prediction interface with confidence calibration.
        """)

        st.subheader("📖 What is a Multilayer Perceptron (MLP)?")
        st.write("""
        A **Multilayer Perceptron (MLP)** is a class of feedforward artificial neural network (ANN).
        Unlike a single-layer perceptron which can only solve linearly separable problems (failing on problems like XOR),
        an MLP consists of at least three layers of nodes:
        - **Input Layer:** Directly receives the 8 scaled diagnostic features.
        - **Hidden Layers:** One or more layers of non-linear artificial neurons that learn abstract hierarchical representations.
        - **Output Layer:** A classification neuron utilizing a logistic sigmoid function to generate class membership probabilities.
        
        Training is governed by the **Backpropagation algorithm**, which calculates the gradient of the loss function
        with respect to each weight via the chain rule of calculus, allowing the network to iteratively adjust its parameters.
        """)

    with col2:
        st.markdown("""
        <div class="info-card">
            <h4 style="color:#38bdf8; margin-top:0;">📊 Dataset At A Glance</h4>
            <ul style="color:#cbd5e1; font-size:0.95rem; line-height:1.8;">
                <li><strong>Dataset:</strong> Pima Indians Diabetes Database</li>
                <li><strong>Origin:</strong> National Institute of Diabetes and Digestive and Kidney Diseases (NIDDK)</li>
                <li><strong>Cohort:</strong> Females ≥ 21 years of Pima Indian heritage</li>
                <li><strong>Total Instances:</strong> 768 patient records</li>
                <li><strong>Input Features:</strong> 8 clinical & demographic predictors</li>
                <li><strong>Target:</strong> Binary (0 = Non-diabetic, 1 = Diabetic)</li>
                <li><strong>Current Source:</strong> """ + data_source_label + """</li>
            </ul>
        </div>
        """, unsafe_allow_html=True)

        st.markdown("""
        <div class="info-card">
            <h4 style="color:#38bdf8; margin-top:0;">🛠️ Tech Stack & Dependencies</h4>
            <ul style="color:#cbd5e1; font-size:0.95rem; line-height:1.8;">
                <li><strong>Language:</strong> Python 3.10+</li>
                <li><strong>GUI Framework:</strong> Streamlit</li>
                <li><strong>Machine Learning:</strong> Scikit-learn (<code>MLPClassifier</code>)</li>
                <li><strong>Data Processing:</strong> Pandas, NumPy</li>
                <li><strong>Visualization:</strong> Matplotlib, Seaborn</li>
            </ul>
        </div>
        """, unsafe_allow_html=True)

        st.info("💡 **Tip:** Use the sidebar on the left to navigate to different laboratory stages or alter hyperparameter settings!")


# ---------------------------------------------------------
# PAGE 2: Dataset & Preprocessing
# ---------------------------------------------------------
elif menu_choice == "2. Dataset & Preprocessing":
    st.title("📂 Dataset Exploration & Leakage-Free Preprocessing")
    st.caption("Inspect raw clinical attributes, invalid zero values, and the rigorous transformation pipeline.")

    # File uploader
    uploaded = st.file_uploader(
        "Upload a custom compatible CSV file (Must include all 8 Pima features and 'Outcome' column):",
        type=["csv"]
    )
    if uploaded is not None:
        st.session_state.uploaded_file = uploaded.getvalue()
        st.success("Custom CSV successfully loaded!")

    if df.empty:
        st.warning("No dataset loaded.")
        st.stop()

    tab1, tab2, tab3, tab4 = st.tabs(["Raw Data Overview", "Zero-Value Anomaly Analysis", "Feature Distributions", "Correlation Matrix"])

    with tab1:
        st.subheader("Raw Patient Records")
        c1, c2, c3, c4 = st.columns(4)
        c1.metric("Total Records", len(df))
        c2.metric("Feature Columns", len(FEATURE_NAMES))
        c3.metric("Non-Diabetic (Class 0)", int((df[TARGET_NAME] == 0).sum()))
        c4.metric("Diabetic (Class 1)", int((df[TARGET_NAME] == 1).sum()))

        st.dataframe(df.head(10), use_container_width=True)

        st.subheader("Descriptive Summary Statistics")
        st.dataframe(df.describe().T.style.format("{:.2f}"), use_container_width=True)

    with tab2:
        st.subheader("🔬 Biological Anomaly: The 'Zero as Missing' Problem")
        st.write("""
        In the raw Pima Indians dataset, missing laboratory values were historically coded as `0`.
        However, while having **0 pregnancies** is biologically valid, having **Glucose = 0**, **BloodPressure = 0**,
        **SkinThickness = 0**, **Insulin = 0**, or **BMI = 0** is physiologically impossible in a living patient.
        Treating these literal zeros as valid numbers would severely distort the neural network's gradient calculations.
        """)

        zero_stats = get_missing_zero_stats(df)
        st.dataframe(zero_stats, use_container_width=True)

        st.markdown("""
        <div class="info-card">
            <h4 style="color:#06b6d4;">🛡️ Data Leakage Prevention Guarantee</h4>
            <p style="color:#cbd5e1; font-size:0.9rem;">
                A common novice mistake in machine learning is calculating the median or standard deviation across the <em>entire dataset</em>
                before splitting. This leaks information from the test set into the training phase.<br><br>
                <strong>Our Implementation:</strong> The data is split into Train and Test sets <em>first</em>.
                Then, <code>SimpleImputer(strategy='median')</code> and <code>StandardScaler()</code> are fitted strictly
                on the training split and subsequently applied to transform the test split.
            </p>
        </div>
        """, unsafe_allow_html=True)

    with tab3:
        st.subheader("Feature Distributions by Diabetic Outcome")
        selected_feature = st.selectbox("Select feature to inspect histogram:", FEATURE_NAMES, index=1)

        fig, ax = plt.subplots(figsize=(8, 4))
        fig.patch.set_facecolor('#0f172a')
        ax.set_facecolor('#1e293b')

        sns.histplot(
            data=df,
            x=selected_feature,
            hue=TARGET_NAME,
            kde=True,
            palette=["#38bdf8", "#f43f5e"],
            ax=ax,
            bins=25
        )
        ax.set_title(f"Distribution of {selected_feature} by Class", color="#f8fafc", fontsize=12)
        ax.set_xlabel(selected_feature, color="#cbd5e1")
        ax.set_ylabel("Count", color="#cbd5e1")
        ax.tick_params(colors="#94a3b8")
        st.pyplot(fig)

    with tab4:
        st.subheader("Feature Correlation Heatmap")
        fig, ax = plt.subplots(figsize=(9, 6))
        fig.patch.set_facecolor('#0f172a')
        ax.set_facecolor('#1e293b')

        corr = df.corr()
        sns.heatmap(
            corr,
            annot=True,
            fmt=".2f",
            cmap="Blues",
            ax=ax,
            cbar=True,
            linewidths=0.5,
            linecolor='#334155'
        )
        ax.tick_params(colors="#cbd5e1", rotation=45)
        st.pyplot(fig)


# ---------------------------------------------------------
# PAGE 3: Network Architecture & Training
# ---------------------------------------------------------
elif menu_choice == "3. Network Architecture & Training":
    st.title("🧠 Neural Network Architecture & Training")
    st.caption("Observe the Multi-Layer Perceptron architecture and convergence dynamics.")

    if pipeline_bundle is None:
        st.warning("Pipeline is not ready.")
        st.stop()

    mlp = pipeline_bundle["model"]
    results = pipeline_bundle["results"]

    c1, c2, c3, c4 = st.columns(4)
    c1.metric("Input Neurons", len(FEATURE_NAMES))
    c2.metric("Hidden Layers", f"{len(hidden_layers)} layers: {hidden_layers}")
    c3.metric("Output Neurons", "1 (Binary)")
    c4.metric("Converged Epochs", f"{results['n_iter']} / {max_iter_val}")

    st.subheader("📐 Conceptual Architecture Visualization")
    st.write(
        "*Note: This diagram illustrates the conceptual feedforward topology connecting the 8 input features "
        "through the configured hidden layers to the binary classification output.*"
    )

    # Render an SVG conceptual neural network diagram
    layers = [len(FEATURE_NAMES)] + list(hidden_layers) + [1]
    layer_names = ["Input Layer"] + [f"Hidden {i+1}" for i in range(len(hidden_layers))] + ["Output Layer"]

    max_nodes = max(layers)
    svg_height = 340
    svg_width = 750

    svg_content = f"""<svg width="{svg_width}" height="{svg_height}" xmlns="http://www.w3.org/2000/svg" style="background:#0f172a; border-radius:12px; border:1px solid #334155;">"""

    col_gap = svg_width / (len(layers) + 1)
    node_positions = []

    for l_idx, num_nodes in enumerate(layers):
        x = col_gap * (l_idx + 1)
        nodes_in_layer = min(num_nodes, 10)  # limit display nodes for clarity
        y_gap = (svg_height - 60) / (nodes_in_layer + 1)
        positions = []
        for n_idx in range(nodes_in_layer):
            y = 40 + y_gap * (n_idx + 1)
            positions.append((x, y))
        node_positions.append((positions, num_nodes > 10))

    # Draw connection lines
    for l_idx in range(len(node_positions) - 1):
        curr_layer, _ = node_positions[l_idx]
        next_layer, _ = node_positions[l_idx + 1]
        for (x1, y1) in curr_layer:
            for (x2, y2) in next_layer:
                svg_content += f"""<line x1="{x1}" y1="{y1}" x2="{x2}" y2="{y2}" stroke="#334155" stroke-width="0.8" opacity="0.6"/>"""

    # Draw nodes
    for l_idx, (pos_list, truncated) in enumerate(node_positions):
        color = "#0284c7" if l_idx == 0 else ("#06b6d4" if l_idx < len(layers) - 1 else "#10b981")
        for x, y in pos_list:
            svg_content += f"""<circle cx="{x}" cy="{y}" r="8" fill="{color}" stroke="#ffffff" stroke-width="1.5"/>"""
        # Header label
        header_x = pos_list[0][0]
        svg_content += f"""<text x="{header_x}" y="24" fill="#94a3b8" font-size="11" font-weight="bold" text-anchor="middle">{layer_names[l_idx]}</text>"""
        svg_content += f"""<text x="{header_x}" y="{svg_height - 10}" fill="#38bdf8" font-size="10" text-anchor="middle">{layers[l_idx]} nodes</text>"""

    svg_content += "</svg>"
    st.components.v1.html(svg_content, height=360)

    st.subheader("📉 Training Loss Curve (Log-Loss Convergence)")
    loss_curve = results["loss_curve"]
    if loss_curve and len(loss_curve) > 0:
        fig, ax = plt.subplots(figsize=(9, 4))
        fig.patch.set_facecolor('#0f172a')
        ax.set_facecolor('#1e293b')

        ax.plot(range(1, len(loss_curve) + 1), loss_curve, color="#38bdf8", lw=2, label="Cross-Entropy Loss")
        ax.set_title(f"Optimization Loss Curve across {len(loss_curve)} Epochs ({solver_choice.upper()} Optimizer)", color="#f8fafc")
        ax.set_xlabel("Epoch / Iteration", color="#cbd5e1")
        ax.set_ylabel("Loss", color="#cbd5e1")
        ax.grid(True, linestyle="--", alpha=0.3, color="#64748b")
        ax.tick_params(colors="#94a3b8")
        ax.legend(facecolor='#1e293b', edgecolor='#334155', labelcolor='#f8fafc')
        st.pyplot(fig)
    else:
        st.info("Loss curve not available for current solver/setup.")


# ---------------------------------------------------------
# PAGE 4: Performance Evaluation
# ---------------------------------------------------------
elif menu_choice == "4. Performance Evaluation":
    st.title("📊 Model Performance & Critical Evaluation")
    st.caption("Quantitative test set assessment and clinical trade-off analysis.")

    if pipeline_bundle is None:
        st.warning("No trained model found.")
        st.stop()

    res = pipeline_bundle["results"]

    # Key metrics display
    c1, c2, c3, c4 = st.columns(4)
    c1.markdown(f"""
    <div class="metric-card">
        <div class="metric-lbl">Accuracy</div>
        <div class="metric-val">{res['accuracy'] * 100:.1f}%</div>
    </div>
    """, unsafe_allow_html=True)

    c2.markdown(f"""
    <div class="metric-card">
        <div class="metric-lbl">Precision (Diabetic)</div>
        <div class="metric-val">{res['precision'] * 100:.1f}%</div>
    </div>
    """, unsafe_allow_html=True)

    c3.markdown(f"""
    <div class="metric-card">
        <div class="metric-lbl">Recall / Sensitivity</div>
        <div class="metric-val">{res['recall'] * 100:.1f}%</div>
    </div>
    """, unsafe_allow_html=True)

    c4.markdown(f"""
    <div class="metric-card">
        <div class="metric-lbl">F1-Score</div>
        <div class="metric-val">{res['f1'] * 100:.1f}%</div>
    </div>
    """, unsafe_allow_html=True)

    st.markdown("---")

    # Important Academic Discussion: Why Accuracy is Not Enough
    st.markdown("""
    <div class="info-card" style="border-left: 4px solid #38bdf8;">
        <h4 style="color:#38bdf8; margin-top:0;">🎓 Key Viva Concept: Why Accuracy Alone Is Not Sufficient</h4>
        <p style="color:#cbd5e1; font-size:0.95rem; line-height:1.6;">
            In medical diagnosis and imbalanced classification tasks, <strong>Accuracy can be dangerously misleading</strong>.
            Consider a hypothetical dataset where 90% of individuals are healthy. A naive model that predicts "Negative" for every patient
            would achieve <strong>90% accuracy</strong>, yet fail to identify a single sick patient!
            <br><br>
            In healthcare, a <strong>False Negative (FN)</strong> (predicting a patient is healthy when they actually have diabetes)
            can lead to untreated diabetic complications, making <strong>Recall (Sensitivity)</strong> a vital metric.
            The <strong>F1-score</strong> provides the harmonic mean between Precision and Recall, reflecting genuine balanced performance.
        </p>
    </div>
    """, unsafe_allow_html=True)

    col_cm, col_rep = st.columns([1, 1])

    with col_cm:
        st.subheader("Confusion Matrix")
        cm = res["confusion_matrix"]
        b = res["breakdown"]

        fig, ax = plt.subplots(figsize=(5, 4))
        fig.patch.set_facecolor('#0f172a')
        ax.set_facecolor('#1e293b')

        sns.heatmap(
            cm,
            annot=True,
            fmt="d",
            cmap="Blues",
            cbar=False,
            ax=ax,
            xticklabels=["Predicted Neg (0)", "Predicted Pos (1)"],
            yticklabels=["Actual Neg (0)", "Actual Pos (1)"],
            annot_kws={"size": 14, "weight": "bold"}
        )
        ax.tick_params(colors="#cbd5e1")
        st.pyplot(fig)

        st.caption(f"**Breakdown:** True Negatives: {b['tn']} | False Positives: {b['fp']} | False Negatives: {b['fn']} | True Positives: {b['tp']}")

    with col_rep:
        st.subheader("Classification Report")
        st.text(res["classification_report_text"])

        if res["roc_auc"] is not None:
            st.metric("ROC-AUC Score", f"{res['roc_auc']:.3f}")


# ---------------------------------------------------------
# PAGE 5: Interactive Patient Prediction
# ---------------------------------------------------------
elif menu_choice == "5. Interactive Patient Prediction":
    st.title("🩺 Interactive Patient Risk Inference")
    st.caption("Input diagnostic measurements to calculate model-predicted diabetes risk.")

    st.markdown("""
    <div class="disclaimer-box">
        <strong>⚠️ Non-Diagnostic Simulation:</strong>
        This form serves solely as an interactive software demonstration of feedforward neural inference.
        It is strictly NOT clinical advice or medical diagnosis.
    </div>
    """, unsafe_allow_html=True)

    if pipeline_bundle is None:
        st.warning("Model not ready.")
        st.stop()

    mlp = pipeline_bundle["model"]
    imputer = pipeline_bundle["imputer"]
    scaler = pipeline_bundle["scaler"]

    col1, col2 = st.columns(2)

    with col1:
        st.subheader("Diagnostic Indicators")
        val_preg = st.slider("Pregnancies (Count)", 0, 17, 3, help="Number of pregnancies")
        val_glucose = st.slider("Plasma Glucose (mg/dL)", 50.0, 220.0, 120.0, step=1.0, help="2-hour oral glucose tolerance test. Normal fasting: < 100 mg/dL")
        val_bp = st.slider("Diastolic Blood Pressure (mm Hg)", 40.0, 130.0, 72.0, step=1.0, help="Normal diastolic: < 80 mm Hg")
        val_skin = st.slider("Triceps Skinfold Thickness (mm)", 5.0, 80.0, 23.0, step=1.0, help="Subcutaneous fat index")

    with col2:
        st.subheader("Patient Vitals & History")
        val_insulin = st.slider("2-Hour Serum Insulin (μU/mL)", 10.0, 600.0, 85.0, step=5.0, help="Normal postprandial insulin: 16-166 μU/mL")
        val_bmi = st.slider("Body Mass Index (BMI in kg/m²)", 15.0, 60.0, 31.5, step=0.1, help="Normal: 18.5 - 24.9 | Overweight: 25 - 29.9 | Obese: ≥ 30")
        val_dpf = st.slider("Diabetes Pedigree Function", 0.05, 2.4, 0.45, step=0.01, help="Genetic predisposition score")
        val_age = st.slider("Age (Years)", 21, 90, 33, step=1, help="Patient age in years")

    input_data = {
        "Pregnancies": val_preg,
        "Glucose": val_glucose,
        "BloodPressure": val_bp,
        "SkinThickness": val_skin,
        "Insulin": val_insulin,
        "BMI": val_bmi,
        "DiabetesPedigreeFunction": val_dpf,
        "Age": val_age
    }

    if st.button("🔮 Compute Neural Network Prediction", use_container_width=True):
        pred_res = predict_single_patient(mlp, imputer, scaler, input_data)
        p_class = pred_res["prediction_class"]
        p_neg = pred_res["prob_negative"] * 100
        p_pos = pred_res["prob_positive"] * 100

        st.markdown("---")
        st.subheader("Inference Result")

        res_col1, res_col2 = st.columns([1, 1])

        with res_col1:
            if p_class == 1:
                st.error(f"🔴 **Predicted Class: Positive for Diabetes Risk (Class 1)**")
            else:
                st.success(f"🟢 **Predicted Class: Negative for Diabetes Risk (Class 0)**")

            st.write(f"- **Probability of Class 0 (Non-Diabetic):** `{p_neg:.1f}%`")
            st.write(f"- **Probability of Class 1 (Diabetic):** `{p_pos:.1f}%`")

        with res_col2:
            st.write("**Probability Distribution Bar:**")
            st.progress(p_pos / 100)
            st.caption(f"Confidence score for diabetes risk: {p_pos:.1f}%")


# ---------------------------------------------------------
# PAGE 6: About Multilayer Perceptrons
# ---------------------------------------------------------
elif menu_choice == "6. About Multilayer Perceptrons":
    st.title("📚 Comprehensive Guide to Multilayer Perceptrons")
    st.caption("Theoretical fundamentals, mathematical formulations, and inner workings.")

    st.markdown("""
    ### 1. Structural Anatomy of an MLP
    An artificial neuron (perceptron) computes the weighted sum of its inputs, adds a bias term, and passes the result through an activation function:
    
    $$z = \\sum_{i=1}^{n} w_i x_i + b = \\mathbf{w}^T \\mathbf{x} + b$$
    $$a = f(z)$$
    
    Where:
    - $\\mathbf{x}$ is the input feature vector
    - $\\mathbf{w}$ represents connection weights (strength of association)
    - $b$ is the bias term (allows shifting the decision threshold)
    - $f(\\cdot)$ is the non-linear activation function
    - $a$ is the activated output of the neuron
    """)

    st.markdown("""
    ### 2. Common Activation Functions
    Without non-linear activation functions, no matter how many layers a neural network has, it would simply behave as a linear regression model.
    Non-linearities allow the network to model complex boundaries.
    
    - **ReLU (Rectified Linear Unit):** $f(z) = \\max(0, z)$. Fast computation, avoids vanishing gradient for positive values.
    - **Sigmoid / Logistic:** $f(z) = \\frac{1}{1 + e^{-z}}$. Maps outputs into the range $(0, 1)$, ideal for output probabilities.
    - **Tanh (Hyperbolic Tangent):** $f(z) = \\frac{e^z - e^{-z}}{e^z + e^{-z}}$. Zero-centered outputs in range $(-1, 1)$.
    """)

    st.markdown("""
    ### 3. Forward Propagation
    Information flows in a forward direction from input nodes through hidden layers to the output:
    
    $$\\mathbf{a}^{(1)} = \\mathbf{x}$$
    $$\\mathbf{z}^{(l)} = \\mathbf{W}^{(l)} \\mathbf{a}^{(l-1)} + \\mathbf{b}^{(l)}$$
    $$\\mathbf{a}^{(l)} = f(\\mathbf{z}^{(l)})$$
    
    For binary classification, the final layer produces $\\hat{y} = \\sigma(z^{(L)})$.
    """)

    st.markdown("""
    ### 4. Loss Function: Binary Cross-Entropy
    The divergence between predicted probabilities $\\hat{y}_i$ and actual ground truth $y_i \\in \\{0, 1\\}$ is quantified via Log-Loss:
    
    $$\\mathcal{L}(\\mathbf{w}, b) = - \\frac{1}{N} \\sum_{i=1}^N \\left[ y_i \\ln(\\hat{y}_i) + (1 - y_i) \\ln(1 - \\hat{y}_i) \\right] + \\frac{\\alpha}{2} \\|\\mathbf{w}\\|^2$$
    
    The second term represents $L_2$ weight regularization (shrinkage penalty controlled by `alpha`), preventing individual weights from exploding and reducing overfitting.
    """)

    st.markdown("""
    ### 5. Backpropagation & Optimization
    The backpropagation algorithm leverages the **Chain Rule of Calculus** to calculate partial derivatives:
    
    $$\\frac{\\partial \\mathcal{L}}{\\partial \\mathbf{W}^{(l)}} = \\frac{\\partial \\mathcal{L}}{\\partial \\mathbf{z}^{(l)}} \\cdot \\left(\\mathbf{a}^{(l-1)}\\right)^T$$
    
    The weights are updated iteratively using gradient descent (or Adam):
    
    $$\\mathbf{W}_{new} = \\mathbf{W}_{old} - \\eta \\frac{\\partial \\mathcal{L}}{\\partial \\mathbf{W}}$$
    
    Where $\\eta$ is the learning rate.
    """)


# ---------------------------------------------------------
# PAGE 7: Viva Voce & Laboratory Guide
# ---------------------------------------------------------
elif menu_choice == "7. Viva Voce & Laboratory Guide":
    st.title("🎓 College Viva Voce & Faculty Demonstration Guide")
    st.caption("Key conceptual questions, experimental conclusions, and project limitations.")

    st.subheader("💡 10 Frequently Asked Faculty Viva Questions")

    viva_qna = [
        ("Q1: Why is an MLP called a feedforward neural network?",
         "Because connections between the nodes do not form cycles or feedback loops. Information moves in only one direction: forward from input nodes through hidden layers to output nodes."),
        ("Q2: Why was feature scaling (StandardScaler) necessary before passing inputs into the MLP?",
         "Neural network weights are updated via gradient descent. Features on large numerical scales (e.g., Insulin up to 846 vs. DPF at 0.37) cause steep, elongated error surfaces, making convergence erratic and giving undue weight to large features. Scaling normalizes features to zero mean and unit variance."),
        ("Q3: How did you prevent Data Leakage during preprocessing?",
         "We performed train/test split prior to calculating missing value imputation medians and scaling parameters. The StandardScaler and SimpleImputer were fitted solely on the training set, and then used to transform both the train and test sets."),
        ("Q4: Why does a single-layer perceptron fail on XOR, while an MLP succeeds?",
         "A single-layer perceptron can only generate a linear hyperplane separator. XOR is not linearly separable. An MLP introduces hidden layers with non-linear activation functions that transform input space into a higher-dimensional representation where the classes become separable."),
        ("Q5: What is the purpose of the activation function?",
         "Without non-linear activations, successive matrix multiplications of hidden layers would collapse into a single linear transformation. Activations allow neural networks to approximate arbitrary non-linear functions (Universal Approximation Theorem)."),
        ("Q6: Why is Accuracy alone not a reliable metric for diabetes classification?",
         "In healthcare datasets with class imbalance, a model that predicts all cases as negative can achieve high accuracy while failing to detect disease. Recall (Sensitivity) is crucial to avoid False Negatives, and F1-score balances Precision and Recall."),
        ("Q7: What does the Adam optimizer do?",
         "Adam (Adaptive Moment Estimation) computes individual adaptive learning rates for different parameters from estimates of first and second moments of the gradients, combining benefits of AdaGrad and RMSProp."),
        ("Q8: How does L2 regularization (alpha) help the model?",
         "It adds a penalty proportional to the sum of squared weights to the loss function. This penalizes large weights, smoothing the decision surface and preventing the network from overfitting on training noise."),
        ("Q9: What is the role of the loss function?",
         "It quantitatively measures the discrepancy between predicted probability distribution and true binary labels. Minimizing binary cross-entropy drives the model toward optimal weight parameters."),
        ("Q10: What are the main limitations of this micro-project?",
         "Small sample size (768 records), demographic limitation (restricted to adult female Pima Indians), noisy zero-imputation, and lack of external temporal validation. It is suitable for academic learning, not clinical practice.")
    ]

    for q, a in viva_qna:
        with st.expander(f"📌 {q}"):
            st.write(a)

    st.markdown("---")
    st.subheader("📋 Project Conclusion & Attribution")
    st.write("""
    - **Conclusion:** A Multilayer Perceptron with two hidden layers (16, 8) trained with Adam optimizer demonstrates effective learning of non-linear risk boundaries from multivariate physiological indicators, achieving consistent performance on holdout test data.
    - **Dataset Attribution:** National Institute of Diabetes and Digestive and Kidney Diseases (NIDDK), original donors: Vincent Sigillito et al., Johns Hopkins University Applied Physics Laboratory.
    - **Academic References:**
        1. Rumelhart, D. E., Hinton, G. E., & Williams, R. J. (1986). Learning representations by back-propagating errors. Nature, 323(6088), 533-536.
        2. Pedregosa et al. (2011). Scikit-learn: Machine Learning in Python. Journal of Machine Learning Research.
        3. Smith, J. W., et al. (1988). Using the ADAP learning algorithm to forecast the onset of diabetes mellitus. In Proceedings of the Symposium on Computer Applications in Medical Care.
    """)
