@echo off
title GreenLink Error Monitor
echo [*] Starting GreenLink Error Monitor...
if not exist .venv\Scripts\python.exe (
    echo [ERROR] .venv not found. Please run setup_env.bat first.
    pause
    exit /b 1
)
.venv\Scripts\python.exe scripts\error_monitor.py --clear
pause
