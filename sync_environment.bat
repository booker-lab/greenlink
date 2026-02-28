@echo off
setlocal enabledelayedexpansion
:: ANSI(CP949) 인코딩 유지 - 한글 출력용
chcp 949 >nul

echo ======================================================
echo  GreenLink: Universal Environment Sync (PC/Laptop)
echo ======================================================

:: 1. 필수 도구 점검 (Git, Node, Python)
echo [*] Checking Core Tools...
git --version >nul 2>&1 || (echo [ERROR] Git is not installed. && pause && exit /b 1)
node --version >nul 2>&1 || (echo [ERROR] Node.js is not installed. && pause && exit /b 1)
python --version >nul 2>&1 || (echo [ERROR] Python is not installed. && pause && exit /b 1)

:: 2. uv (Python Package Manager) 설치 및 설정
echo [*] Checking uv (Python Manager)...
where uv >nul 2>&1
if errorlevel 1 (
    echo [INFO] uv not found. Installing uv...
    powershell -ExecutionPolicy ByPass -c "irm https://astral.sh/uv/install.ps1 | iex"
    set "PATH=%USERPROFILE%\.local\bin;%PATH%"
)

:: 3. Python 가상환경 및 의존성 동기화
echo [*] Syncing Python dependencies (.venv)...
if not exist .venv (
    uv venv
)
call .venv\Scripts\activate.bat
uv pip install -r requirements.txt
if errorlevel 1 (
    echo [WARNING] Root requirements installation failed.
)

:: 4. Node.js 의존성 동기화 (pnpm/npm)
echo [*] Syncing Node.js dependencies (Monorepo)...
call npm install
if errorlevel 1 (
    echo [ERROR] npm install failed.
    pause
    exit /b 1
)

:: 5. 플러그인 및 서브모듈 동기화
echo [*] Syncing Git Submodules...
git submodule update --init --recursive
if errorlevel 1 (
    echo [WARNING] Submodule update failed.
)

:: 6. 플러그인 내부 의존성 강제 업데이트
echo [*] Bootstrapping Agent Rules...
if exist .agents\tech-stack-organizer\tools\automation\bootstrap-rules.py (
    .venv\Scripts\python.exe .agents\tech-stack-organizer\tools\automation\bootstrap-rules.py
)

echo.
echo ======================================================
echo  [SUCCESS] Environment Synchronization Complete!
echo  --------------------------------------------------
echo  [REMINDER] 다음 파일들을 수동으로 복사해야 합니다:
echo  1. apps/web/.env.local
echo  2. apps/admin/.env.local
echo  3. apps/driver/.env.local
echo ======================================================
pause
exit /b 0
