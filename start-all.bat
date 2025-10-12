@echo off
echo Starting all micro-frontend applications...

echo.
echo Starting Container (Host) on port 3000...
start "Container" cmd /k "cd container && npm start"

timeout /t 3 /nobreak > nul

echo.
echo Starting App1 (Remote) on port 3001...
start "App1" cmd /k "cd app1 && npm start"

timeout /t 3 /nobreak > nul

echo.
echo Starting App2 (Remote) on port 3002...
start "App2" cmd /k "cd app2 && npm start"

echo.
echo All applications are starting...
echo Container: http://localhost:3000
echo App1: http://localhost:3001  
echo App2: http://localhost:3002
echo.
echo Press any key to exit...
pause > nul