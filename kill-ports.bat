@echo off
echo Killing processes on ports 3000, 3001, 3002...

REM Kill port 3000
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :3000') do (
    if not "%%a"=="0" (
        echo Killing process %%a on port 3000
        taskkill /PID %%a /F >nul 2>&1
    )
)

REM Kill port 3001
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :3001') do (
    if not "%%a"=="0" (
        echo Killing process %%a on port 3001
        taskkill /PID %%a /F >nul 2>&1
    )
)

REM Kill port 3002
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :3002') do (
    if not "%%a"=="0" (
        echo Killing process %%a on port 3002
        taskkill /PID %%a /F >nul 2>&1
    )
)

echo All ports cleared!
pause