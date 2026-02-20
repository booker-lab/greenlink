@echo off
setlocal
cd /d %~dp0

echo [ GreenLink v2 - Starting Project ]
echo 1. Run All Apps (Web, Admin, Driver)
echo 2. Run Consumer Web App only (Port 3000)
echo 3. Run Admin App only (Port 3001)
echo 4. Run Driver App only (Port 3002)
echo ------------------------------------------
set /p choice="Select an option (1-4): "

where npm >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] npm is not installed. Please install Node.js (which includes npm) first.
    pause
    exit /b 1
)

if not exist "node_modules" (
    echo [INFO] node_modules not found. Installing dependencies...
    call npm install
)

if "%choice%"=="1" (
    echo [INFO] Starting all apps with Turbopack...
    if not exist "logs" mkdir logs
    start "" "http://localhost:3000"
    start "" "http://localhost:3001"
    start "" "http://localhost:3002"
    :: Start dev and pipe to logs
    start "Web App" cmd /c "npm run dev --workspace=@greenlink/web > logs\web.log 2>&1"
    start "Admin App" cmd /c "npm run dev --workspace=@greenlink/admin > logs\admin.log 2>&1"
    start "Driver App" cmd /c "npm run dev --workspace=@greenlink/driver > logs\driver.log 2>&1"
    echo [INFO] All apps started in background. Monitor via error_monitor.py.
) else if "%choice%"=="2" (
    echo [INFO] Starting Consumer Web App...
    if not exist "logs" mkdir logs
    start "" "http://localhost:3000"
    call npm run dev --workspace=@greenlink/web 2>&1 ^| tee logs\web.log
) else if "%choice%"=="3" (
    echo [INFO] Starting Admin App...
    if not exist "logs" mkdir logs
    start "" "http://localhost:3001"
    call npm run dev --workspace=@greenlink/admin 2>&1 ^| tee logs\admin.log
) else if "%choice%"=="4" (
    echo [INFO] Starting Driver App...
    if not exist "logs" mkdir logs
    start "" "http://localhost:3002"
    call npm run dev --workspace=@greenlink/driver 2>&1 ^| tee logs\driver.log
) else (
    echo [ERROR] Invalid choice.
)

endlocal
pause
