@echo off
setlocal enabledelayedexpansion
title GreenLink Web Quick Launch

:: Check if running from root
if not exist "package.json" (
    echo [ERROR] Must run from project root directory.
    pause
    exit /b 1
)

echo [1/3] Checking Environment...
where npm >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] npm not found. Please install Node.js.
    pause
    exit /b 1
)

:: Ensure port 3000 is clean
echo [2/3] Cleaning existing Node processes...
taskkill /f /im node.exe /t >nul 2>&1

if not exist "node_modules\." (
    echo [INFO] node_modules missing. Installing dependencies...
    call npm install --legacy-peer-deps
)

echo [3/3] Starting Consumer Web App...
if not exist "logs" mkdir logs
start "" "http://localhost:3000"

:: Execute
echo [EXEC] Running: npm run dev --workspace=@greenlink/web
cmd /c "npm run dev --workspace=@greenlink/web > logs\web.log 2>&1"

if %errorlevel% neq 0 (
    echo.
    echo [CRITICAL ERROR] Server failed to start or crashed.
    echo Error Code: %errorlevel%
    pause
)

pause
