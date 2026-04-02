@echo off
title Luxury Lifestyle Dashboard
color 0A

echo ==========================================
echo   Luxury Lifestyle Dashboard - Launcher
echo ==========================================
echo.

:: Go to the actual app folder
cd /d "%~dp0artifacts\luxury-dashboard"

:: Check if node_modules exists
if not exist "node_modules\" (
    echo [!] node_modules not found. Installing dependencies...
    echo     This only happens once, please wait...
    echo.
    call npm install
    if errorlevel 1 (
        echo [ERROR] npm install failed. Make sure Node.js is installed.
        echo         Download it from: https://nodejs.org
        pause
        exit /b 1
    )
    echo.
    echo [OK] Dependencies installed!
    echo.
)

echo [OK] Starting the site...
echo.
echo  --> Open your browser and go to: http://localhost:3000
echo.
echo  (Press Ctrl+C to stop the server)
echo.

npm run dev

pause
