"""
Multilayer Perceptron (MLP) Neural Network Helper Utilities
College Micro-Project: Build a Multilayer Perceptron Neural Network for Classification
Dataset: Pima Indians Diabetes Database (National Institute of Diabetes and Digestive and Kidney Diseases)
"""

import io
import os
import numpy as np
import pandas as pd
from typing import Tuple, Dict, Any, List, Optional
from sklearn.model_selection import train_test_split
from sklearn.impute import SimpleImputer
from sklearn.preprocessing import StandardScaler
from sklearn.neural_network import MLPClassifier
from sklearn.metrics import (
    accuracy_score,
    precision_score,
    recall_score,
    f1_score,
    confusion_matrix,
    classification_report,
    roc_curve,
    auc,
    roc_auc_score
)
import matplotlib.pyplot as plt
import seaborn as sns

FEATURE_NAMES: List[str] = [
    "Pregnancies",
    "Glucose",
    "BloodPressure",
    "SkinThickness",
    "Insulin",
    "BMI",
    "DiabetesPedigreeFunction",
    "Age"
]

TARGET_NAME: str = "Outcome"

FEATURE_METADATA: Dict[str, Dict[str, Any]] = {
    "Pregnancies": {"label": "Pregnancies (count)", "unit": "count", "min": 0, "max": 20, "default": 3, "step": 1, "desc": "Number of times pregnant"},
    "Glucose": {"label": "Plasma Glucose Concentration", "unit": "mg/dL", "min": 40.0, "max": 250.0, "default": 120.0, "step": 1.0, "desc": "Oral glucose tolerance test (2-hour)"},
    "BloodPressure": {"label": "Diastolic Blood Pressure", "unit": "mm Hg", "min": 30.0, "max": 140.0, "default": 70.0, "step": 1.0, "desc": "Diastolic blood pressure"},
    "SkinThickness": {"label": "Triceps Skinfold Thickness", "unit": "mm", "min": 5.0, "max": 100.0, "default": 20.0, "step": 1.0, "desc": "Triceps skin fold thickness"},
    "Insulin": {"label": "2-Hour Serum Insulin", "unit": "mu U/ml", "min": 10.0, "max": 900.0, "default": 80.0, "step": 5.0, "desc": "2-Hour serum insulin"},
    "BMI": {"label": "Body Mass Index", "unit": "kg/m²", "min": 15.0, "max": 70.0, "default": 32.0, "step": 0.1, "desc": "Body mass index (weight in kg/(height in m)^2)"},
    "DiabetesPedigreeFunction": {"label": "Diabetes Pedigree Function", "unit": "score", "min": 0.05, "max": 2.50, "default": 0.37, "step": 0.01, "desc": "Genetic diabetes pedigree function score"},
    "Age": {"label": "Age", "unit": "years", "min": 21, "max": 100, "default": 33, "step": 1, "desc": "Age in years (cohort is female ≥ 21)"}
}

# Features where 0 is physiologically implausible and represents a missing record
ZERO_AS_MISSING_COLS = ["Glucose", "BloodPressure", "SkinThickness", "Insulin", "BMI"]


def load_dataset(file_path_or_buffer=None) -> pd.DataFrame:
    """
    Load the Pima Indians Diabetes dataset from a local CSV path or an uploaded file buffer.
    Falls back to 'diabetes.csv' in the project directory.
    """
    if file_path_or_buffer is not None:
        if isinstance(file_path_or_buffer, str) and os.path.exists(file_path_or_buffer):
            df = pd.read_csv(file_path_or_buffer)
        else:
            df = pd.read_csv(file_path_or_buffer)
    elif os.path.exists("diabetes.csv"):
        df = pd.read_csv("diabetes.csv")
    else:
        # Remote backup fallback
        url = "https://raw.githubusercontent.com/jbrownlee/Datasets/master/pima-indians-diabetes.data.csv"
        df = pd.read_csv(url, names=FEATURE_NAMES + [TARGET_NAME])

    # Validate column structure
    missing_cols = [col for col in FEATURE_NAMES if col not in df.columns]
    if missing_cols:
        raise ValueError(f"Uploaded CSV is missing required columns: {missing_cols}")
    if TARGET_NAME not in df.columns:
        raise ValueError(f"Uploaded CSV is missing target label column: '{TARGET_NAME}'")

    return df


def get_missing_zero_stats(df: pd.DataFrame) -> pd.DataFrame:
    """
    Calculate the count and percentage of biologically invalid zero values per feature.
    """
    stats = []
    total_rows = len(df)
    for col in FEATURE_NAMES:
        zero_count = int((df[col] == 0).sum())
        is_invalid_zero = col in ZERO_AS_MISSING_COLS
        stats.append({
            "Feature": col,
            "Zero Count": zero_count,
            "Zero %": round((zero_count / total_rows) * 100, 2),
            "Status": "Physiologically Invalid (Missing)" if is_invalid_zero and zero_count > 0 else ("Valid Zero" if not is_invalid_zero else "No Zeros")
        })
    return pd.DataFrame(stats)


def preprocess_and_split(
    df: pd.DataFrame,
    test_size: float = 0.20,
    random_state: int = 42,
    stratify: bool = True
) -> Tuple[np.ndarray, np.ndarray, np.ndarray, np.ndarray, SimpleImputer, StandardScaler, pd.DataFrame, pd.DataFrame]:
    """
    Strict Leakage-Free Preprocessing Pipeline:
    1. Separate features (X) and target (y)
    2. Split into train and test sets FIRST (stratified to maintain class balance)
    3. Replace biologically impossible zeros with NaN in both splits
    4. Fit SimpleImputer (median strategy) ONLY on X_train, then transform both X_train and X_test
    5. Fit StandardScaler ONLY on X_train, then transform both X_train and X_test
    """
    X = df[FEATURE_NAMES].copy()
    y = df[TARGET_NAME].values.astype(int)

    stratify_target = y if stratify else None
    X_train_raw, X_test_raw, y_train, y_test = train_test_split(
        X, y,
        test_size=test_size,
        random_state=random_state,
        stratify=stratify_target
    )

    # Convert invalid zeros to NaN
    X_train_nan = X_train_raw.copy()
    X_test_nan = X_test_raw.copy()

    for col in ZERO_AS_MISSING_COLS:
        X_train_nan[col] = X_train_nan[col].replace(0, np.nan)
        X_test_nan[col] = X_test_nan[col].replace(0, np.nan)

    # Fit Imputer strictly on Train
    imputer = SimpleImputer(strategy="median")
    X_train_imputed = imputer.fit_transform(X_train_nan)
    X_test_imputed = imputer.transform(X_test_nan)

    # Fit Scaler strictly on Train
    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train_imputed)
    X_test_scaled = scaler.transform(X_test_imputed)

    return (
        X_train_scaled,
        X_test_scaled,
        y_train,
        y_test,
        imputer,
        scaler,
        X_train_raw,
        X_test_raw
    )


def train_mlp_classifier(
    X_train: np.ndarray,
    y_train: np.ndarray,
    hidden_layer_sizes: Tuple[int, ...] = (16, 8),
    activation: str = "relu",
    solver: str = "adam",
    alpha: float = 0.0001,
    learning_rate_init: float = 0.01,
    max_iter: int = 500,
    random_state: int = 42
) -> MLPClassifier:
    """
    Instantiate and train scikit-learn MLPClassifier.
    Uses reproducible random state, early stopping capability, and extracts loss curve.
    """
    mlp = MLPClassifier(
        hidden_layer_sizes=hidden_layer_sizes,
        activation=activation,
        solver=solver,
        alpha=alpha,
        learning_rate_init=learning_rate_init,
        max_iter=max_iter,
        random_state=random_state,
        shuffle=True
    )
    mlp.fit(X_train, y_train)
    return mlp


def evaluate_mlp(
    mlp: MLPClassifier,
    X_test: np.ndarray,
    y_test: np.ndarray
) -> Dict[str, Any]:
    """
    Calculate thorough classification metrics:
    Accuracy, Precision, Recall, F1, Confusion Matrix, Classification Report, and ROC-AUC.
    """
    y_pred = mlp.predict(X_test)
    y_proba = mlp.predict_proba(X_test)[:, 1] if hasattr(mlp, "predict_proba") else None

    acc = accuracy_score(y_test, y_pred)
    prec = precision_score(y_test, y_pred, zero_division=0)
    rec = recall_score(y_test, y_pred, zero_division=0)
    f1 = f1_score(y_test, y_pred, zero_division=0)
    cm = confusion_matrix(y_test, y_pred)
    report_dict = classification_report(y_test, y_pred, output_dict=True, zero_division=0)
    report_text = classification_report(y_test, y_pred, zero_division=0)

    roc_data = None
    roc_auc = None
    if y_proba is not None:
        fpr, tpr, thresholds = roc_curve(y_test, y_proba)
        roc_auc = auc(fpr, tpr)
        roc_data = {"fpr": fpr.tolist(), "tpr": tpr.tolist(), "auc": roc_auc}

    tn, fp, fn, tp = cm.ravel()

    return {
        "accuracy": acc,
        "precision": prec,
        "recall": rec,
        "f1": f1,
        "confusion_matrix": cm,
        "breakdown": {"tn": int(tn), "fp": int(fp), "fn": int(fn), "tp": int(tp)},
        "classification_report_dict": report_dict,
        "classification_report_text": report_text,
        "roc_data": roc_data,
        "roc_auc": roc_auc,
        "n_test_samples": len(y_test),
        "n_iter": getattr(mlp, "n_iter_", 0),
        "loss_curve": getattr(mlp, "loss_curve_", [])
    }


def predict_single_patient(
    mlp: MLPClassifier,
    imputer: SimpleImputer,
    scaler: StandardScaler,
    features: Dict[str, float]
) -> Dict[str, Any]:
    """
    Preprocess and classify an individual patient record.
    Returns predicted class, class probabilities, and risk category.
    """
    raw_array = np.array([[features[col] for col in FEATURE_NAMES]])

    # Replace invalid zeros
    for idx, col in enumerate(FEATURE_NAMES):
        if col in ZERO_AS_MISSING_COLS and raw_array[0, idx] == 0:
            raw_array[0, idx] = np.nan

    imputed = imputer.transform(raw_array)
    scaled = scaler.transform(imputed)

    pred_class = int(mlp.predict(scaled)[0])
    probabilities = mlp.predict_proba(scaled)[0]

    prob_negative = float(probabilities[0])
    prob_positive = float(probabilities[1])

    return {
        "prediction_class": pred_class,
        "prediction_label": "Positive for Diabetes Risk" if pred_class == 1 else "Negative for Diabetes Risk",
        "prob_negative": prob_negative,
        "prob_positive": prob_positive,
        "confidence": prob_positive if pred_class == 1 else prob_negative
    }
