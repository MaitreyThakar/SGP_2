@echo off
REM Quick Start Script for FinPridict Full Stack
REM This script opens two terminals - one for Flask, one for Next.js

echo =====================================================
echo FinPridict Full Stack - Quick Start
echo =====================================================
echo.
echo Starting Backend (Flask) and Frontend (Next.js)...
echo.

REM Check if Python is installed
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo Error: Python is not installed or not in PATH
    pause
    exit /b 1
)

REM Check if Node is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo Error: Node.js is not installed or not in PATH
    pause
    exit /b 1
)

REM Start Backend in new window
echo Starting Flask Backend...
start "FinPridict Backend" cmd /k "cd /d d:\maitrey\SGP_2-main && venv\Scripts\activate && python app.py"

REM Wait a bit for backend to start
timeout /t 3 /nobreak

REM Start Frontend in new window
echo Starting Next.js Frontend...
start "FinPridict Frontend" cmd /k "cd /d d:\maitrey\SGP_2-main\frontend && npm run dev"

REM Wait for servers to start
timeout /t 5 /nobreak

REM Open browser
echo Opening application in browser...
timeout /t 2 /nobreak
start http://localhost:3000/prediction

echo.
echo =====================================================
echo FinPridict is running!
echo =====================================================
echo.
echo Frontend: http://localhost:3000
echo Backend:  http://localhost:5000
echo Prediction Page: http://localhost:3000/prediction
echo.
echo Press any key to close this window...
pause
