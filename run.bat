@echo off
echo ======================================================================
echo Build a Multilayer Perceptron Neural Network for Classification
echo College Machine Learning Micro-Project Automated Launcher
echo ======================================================================
echo.

:: Check if Python is installed
python --version >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Python is not installed or not added to PATH.
    echo Please install Python 3.10+ from https://www.python.org/ and check 'Add Python to PATH'.
    pause
    exit /b 1
)

:: Create Virtual Environment if it does not exist
if not exist "venv\" (
    echo [1/3] Creating Python Virtual Environment (venv)...
    python -m venv venv
    if %ERRORLEVEL% NEQ 0 (
        echo [ERROR] Failed to create virtual environment.
        pause
        exit /b 1
    )
) else (
    echo [1/3] Virtual environment (venv) already exists.
)

:: Activate Virtual Environment
echo [2/3] Activating Virtual Environment...
call venv\Scripts\activate.bat

:: Install / Upgrade requirements
echo [3/3] Installing / Verifying dependencies from requirements.txt...
pip install --upgrade pip
pip install -r requirements.txt

echo.
echo ======================================================================
echo Setup Complete! Starting Streamlit Web Application...
echo Browser will automatically open at http://localhost:8501
echo To stop the server, press Ctrl+C in this terminal.
echo ======================================================================
echo.

streamlit run app.py

pause
