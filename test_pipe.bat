@echo off
if 1==1 (
    powershell -Command "echo hello 2>&1 | Tee-Object -FilePath logs\test.log"
)
