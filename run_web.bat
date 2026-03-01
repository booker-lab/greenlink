@echo off
setlocal enabledelayedexpansion
title GreenLink Web Launcher (Turbopack)

:: Check if running from root
if not exist "package.json" (
    echo [ERROR] Must run from project root directory.
    pause
    exit /b 1
)

echo [1/3] Environment Pre-check...
where npm >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] npm not found. Please install Node.js.
    pause
    exit /b 1
)

:: Ensure port 3000 optimization
echo [2/3] Preparing workspace...
if not exist "node_modules\." (
    echo [INFO] node_modules missing. Installing dependencies...
    call npm install --legacy-peer-deps
)

echo [3/3] Launching Development Server (Turbo)...
if not exist "logs" mkdir logs

:: Start server in background with logging
echo [EXEC] Starting: npm run dev --filter=@greenlink/web
start /b cmd /c "npm run dev --filter=@greenlink/web > logs\web.log 2>&1"

:: Wait for compilation start (approx 4 seconds)
echo [WAIT] Waiting for server to initialize...
timeout /t 5 /nobreak >nul

:: Launch browser after delay
echo [OPEN] Launching: http://localhost:3000
start "" "http://localhost:3000"

echo.
echo ========================================================
echo [RUNNING] Consumer Web App is starting in the background.
echo [LOGS] Check logs/web.log for detailed startup status.
echo ========================================================
echo.

:: Keep window open for monitoring
echo [INFO] Press any key to stop monitoring log tail (Server will keep running).
powershell -NoProfile -Command "Get-Content logs\web.log -Wait -Tail 20"

pause

