@echo off
set choice=2
if "%choice%"=="1" (
    echo 1
) else if "%choice%"=="2" (
    powershell -Command "echo test 2>&1 | Tee-Object -FilePath logs\test2.log"
)
