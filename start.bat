@echo off
title Code-a-Nova Portal Launcher
echo ========================================================
echo   Starting Code-a-Nova Hackathon Portal (Full-Stack)
echo ========================================================
echo.

echo [1/2] Starting Backend Server (Port 5000)...
start "Code-a-Nova Backend" cmd /k "cd /d "%~dp0server" && npm run dev"

echo [2/2] Starting Frontend Client (Port 5173)...
start "Code-a-Nova Frontend" cmd /k "cd /d "%~dp0client" && npm run dev"

echo.
echo ========================================================
echo   Servers are running!
echo   Frontend: http://localhost:5173
echo   Backend:  http://localhost:5000
echo ========================================================
echo.
echo Opening browser in 3 seconds...
powershell -Command "Start-Sleep -Seconds 3"
start http://localhost:5173
