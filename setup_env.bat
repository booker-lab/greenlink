@echo off
setlocal enabledelayedexpansion

:: Set code page to UTF-8
chcp 65001 >nul

echo ======================================================
echo  GreenLink: Development Environment Setup
echo ======================================================

:: 1. Check Prerequisites
echo [1/4] Checking Prerequisites...

:check_node
where node >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo [MISSING] Node.js is not installed.
    set /p install_node="Would you like to install Node.js (LTS) using winget? (y/n): "
    if /i "!install_node!"=="y" (
        echo [INFO] Installing Node.js LTS...
        winget install OpenJS.NodeJS.LTS
        echo [SUCCESS] Node.js installation triggered. Please restart this script after it finishes.
        pause
        exit /b 0
    ) else (
        echo [ERROR] Node.js is required.
        pause
        exit /b 1
    )
)

:check_python
where python >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo [MISSING] Python is not installed.
    set /p install_py="Would you like to install Python 3.12 using winget? (y/n): "
    if /i "!install_py!"=="y" (
        echo [INFO] Installing Python 3.12...
        winget install Python.Python.3.12
        echo [SUCCESS] Python installation triggered. Please restart this script after it finishes.
        pause
        exit /b 0
    ) else (
        echo [ERROR] Python is required.
        pause
        exit /b 1
    )
)

echo [SUCCESS] Found Node, npm, and Python.

:: 2. Check/Install uv
echo [2/4] Checking 'uv' (Python package manager)...
where uv >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo [INFO] 'uv' not found. Installing uv...
    powershell -ExecutionPolicy ByPass -c "irm https://astral.sh/uv/install.ps1 | iex"
    set "PATH=%USERPROFILE%\.cargo\bin;%PATH%"
) else (
    echo [SUCCESS] 'uv' is already installed.
)

:: 3. Node dependencies
echo [3/4] Installing Node.js dependencies (npm)...
call npm install
if %ERRORLEVEL% neq 0 (
    echo [ERROR] npm install failed.
    pause
    exit /b 1
)

:: 4. Python Environment
echo [4/4] Setting up Python virtual environment...
if exist .venv (
    echo [INFO] Existing .venv found. Re-syncing...
) else (
    call uv venv .venv
)

echo [INFO] Installing Python packages from requirements.txt...
call uv pip install -r requirements.txt
if %ERRORLEVEL% neq 0 (
    echo [WARNING] Some python packages failed to install. Check requirements.txt
)

echo.
echo ======================================================
echo  [SUCCESS] Environment setup complete!
echo  Please copy your .env.local files manually.
echo ======================================================
pause
