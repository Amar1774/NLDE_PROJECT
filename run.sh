#!/usr/bin/env bash
# ======================================================================
# Build a Multilayer Perceptron Neural Network for Classification
# Linux / macOS Automated Runner Script
# ======================================================================

set -e

echo "=== Build a Multilayer Perceptron Neural Network for Classification ==="

if ! command -v python3 &> /dev/null; then
    echo "[ERROR] python3 could not be found. Please install Python 3.10+."
    exit 1
fi

if [ ! -d "venv" ]; then
    echo "[1/3] Creating Python virtual environment (venv)..."
    python3 -m venv venv
fi

echo "[2/3] Activating virtual environment..."
source venv/bin/activate

echo "[3/3] Installing dependencies..."
pip install --upgrade pip
pip install -r requirements.txt

echo "Starting Streamlit application..."
streamlit run app.py
