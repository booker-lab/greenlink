@echo off
setlocal enabledelayedexpansion
title GreenLink Web [PRODUCTION MODE]

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

echo [3/3] Building and Starting Consumer Web App (Production Mode)...
echo This may take a moment for the initial build...
if not exist "logs" mkdir logs

echo [EXEC] Running: npm run build --workspace=@greenlink/web
powershell -Command "npm run build --workspace=@greenlink/web 2>&1 | Tee-Object -FilePath logs\web.log"
if %errorlevel% neq 0 (
    echo [ERROR] Build failed.
    pause
    exit /b 1
)

echo [EXEC] Running: npm start --workspace=@greenlink/web
start "" "http://localhost:3000"
powershell -Command "npm start --workspace=@greenlink/web 2>&1 | Tee-Object -FilePath logs\web.log -Append"

if %errorlevel% neq 0 (
    echo.
    echo [CRITICAL ERROR] Server failed to start or crashed.
    echo Error Code: %errorlevel%
    pause
)

pause
