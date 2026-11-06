@echo off
setlocal EnableDelayedExpansion
title ಚೈತನ್ಯ ಕೃಪಾ ಮುಕ್ತಿ ಧಾಮ - Chaitanya Krupa Mukthi Dham
cd /d "%~dp0"

echo ====================================================================
echo     🪔 ಚೈತನ್ಯ ಕೃಪಾ ಮುಕ್ತಿ ಧಾಮ (Chaitanya Krupa Mukthi Dham)
echo ====================================================================
echo.

REM 1. Check if running inside unextracted ZIP file
if not exist "%~dp0PurohitManager" (
    if not exist "%~dp0server\src\index.js" (
        echo [ERROR] YOU ARE RUNNING FROM INSIDE THE ZIP FILE!
        echo.
        echo Please do NOT double-click the file inside the ZIP archive.
        echo 1. Close this window.
        echo 2. Right-click the ZIP file and choose "Extract All..."
        echo 3. Open the newly extracted regular folder.
        echo 4. Double-click "Start-Windows.bat" from there.
        echo ====================================================================
        pause
        exit /b 1
    )
)

REM 2. Check if Node.js is installed and functioning
node -v >nul 2>nul
if %errorlevel% neq 0 (
    echo ====================================================================
    echo  [ACTION REQUIRED] Node.js is NOT installed on this computer!
    echo ====================================================================
    echo.
    echo  Purohit Manager needs a free software called "Node.js" to run.
    echo.
    echo  Opening the official download page in your web browser now:
    echo  👉 https://nodejs.org/en/download
    echo.
    echo  EASY 3 STEPS:
    echo  1. Download the Windows Installer (LTS version).
    echo  2. Open the downloaded file and click "Next", "Next", "Finish".
    echo  3. After installation finishes, double-click "Start-Windows.bat" again!
    echo ====================================================================
    echo.
    start https://nodejs.org/en/download
    pause
    exit /b 1
)

REM 3. Navigate to PurohitManager directory
if exist "%~dp0PurohitManager\server\src\index.js" (
    cd /d "%~dp0PurohitManager"
)

REM 4. Check if dependencies are installed
if not exist "node_modules" (
    echo [First-time setup] Setting up components, please wait 1 minute...
    call npm install --omit=dev
    echo [Done] Setup complete!
    echo.
)

REM 5. Open browser and run server
echo App is starting...
echo Opening your web browser at: http://127.0.0.1:3456
echo.
echo --------------------------------------------------------------------
echo  NOTE: Keep this black window OPEN while using the application.
echo  When you are done, simply close this window.
echo --------------------------------------------------------------------
echo.

start "" "http://127.0.0.1:3456"
node server/src/index.js

echo.
echo ====================================================================
echo  Server has stopped.
echo ====================================================================
pause
