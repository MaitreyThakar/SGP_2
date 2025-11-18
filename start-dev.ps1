# FinPridict Full Stack - Quick Start (PowerShell)
# Run with: .\start-dev.ps1

Write-Host "=====================================================" -ForegroundColor Cyan
Write-Host "FinPridict Full Stack - Quick Start" -ForegroundColor Cyan
Write-Host "=====================================================" -ForegroundColor Cyan
Write-Host ""

# Check Python
try {
    $pythonVersion = python --version 2>&1
    Write-Host "Python found: $pythonVersion" -ForegroundColor Green
} catch {
    Write-Host "Python not found. Please install Python 3.8+" -ForegroundColor Red
    exit 1
}

# Check Node
try {
    $nodeVersion = node --version 2>&1
    Write-Host "Node.js found: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "Node.js not found. Please install Node.js 18+" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "Starting services..." -ForegroundColor Yellow
Write-Host ""

# Backend Terminal
Write-Host "Starting Flask Backend..." -ForegroundColor Cyan
$backendScript = {
    Set-Location "d:\maitrey\SGP_2-main"
    & .\venv\Scripts\activate.ps1
    python app.py
}

# Frontend Terminal
Write-Host "Starting Next.js Frontend..." -ForegroundColor Cyan
$frontendScript = {
    Set-Location "d:\maitrey\SGP_2-main\frontend"
    npm run dev
}

# Start backend in new PowerShell window
Start-Process powershell -ArgumentList "-NoExit", "-Command", $backendScript -WindowStyle Normal

# Wait for backend to initialize
Write-Host "Waiting for backend to start..." -ForegroundColor Yellow
Start-Sleep -Seconds 3

# Start frontend in new PowerShell window
Start-Process powershell -ArgumentList "-NoExit", "-Command", $frontendScript -WindowStyle Normal

# Wait for frontend to initialize
Write-Host "Waiting for frontend to start..." -ForegroundColor Yellow
Start-Sleep -Seconds 5

# Open in browser
Write-Host ""
Write-Host "Opening application in default browser..." -ForegroundColor Cyan
Start-Sleep -Seconds 1
Start-Process "http://localhost:3000/prediction"

Write-Host ""
Write-Host "=====================================================" -ForegroundColor Green
Write-Host "FinPridict is running!" -ForegroundColor Green
Write-Host "=====================================================" -ForegroundColor Green
Write-Host ""
Write-Host "Frontend:  http://localhost:3000" -ForegroundColor Cyan
Write-Host "Backend:   http://localhost:5000" -ForegroundColor Cyan
Write-Host "Prediction Page: http://localhost:3000/prediction" -ForegroundColor Cyan
Write-Host ""
Write-Host "Two terminal windows have been opened:" -ForegroundColor Yellow
Write-Host "  - Backend Server (Flask)" -ForegroundColor Gray
Write-Host "  - Frontend Server (Next.js)" -ForegroundColor Gray
Write-Host ""
Write-Host "Keep both windows open while developing." -ForegroundColor Yellow
Write-Host ""
