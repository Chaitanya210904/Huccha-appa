@echo off
:: ====================================================================
:: Prevent window from closing immediately on error or exit
:: Re-launch in persistent cmd /k if double-clicked
:: ====================================================================
if not "%~1"=="__RUNNING_INTERACTIVE__" (
    cmd /k ""%~f0" __RUNNING_INTERACTIVE__"
    exit /b
)
shift

chcp 65001 >nul 2>&1
setlocal EnableDelayedExpansion

title Chaitanya Krupa Mukthi Dham - Purohit Manager

echo ====================================================================
echo     Chaitanya Krupa Mukthi Dham (Purohit Manager)
echo ====================================================================
echo.

:: 1. Verify working directory
set "SCRIPT_DIR=%~dp0"
cd /d "%SCRIPT_DIR%"

:: Check if running from inside unextracted ZIP file
if not exist "%SCRIPT_DIR%PurohitManager\server\src\index.js" (
    if not exist "%SCRIPT_DIR%server\src\index.js" (
        echo ====================================================================
        echo  [ERROR / ದೋಷ] RUNNING INSIDE ZIP FILE / ಫೈಲ್ ಸರಿಯಾಗಿ ಅನ್‌ಜಿಪ್ ಆಗಿಲ್ಲ!
        echo ====================================================================
        echo.
        echo  You double-clicked this file directly inside the ZIP archive.
        echo  Windows cannot run programs directly inside compressed zip files.
        echo.
        echo  HOW TO FIX (30 SECONDS):
        echo  1. Close this window.
        echo  2. Right-click the downloaded ZIP file.
        echo  3. Choose "Extract All..." (ಎಲ್ಲವನ್ನೂ ಹೊರತೆಗೆಯಿರಿ).
        echo  4. Click "Extract" to finish.
        echo  5. Open the newly extracted regular folder and double-click:
        echo     "Start-Windows.bat"
        echo.
        echo ====================================================================
        pause
        exit /b 1
    )
)

:: 2. Determine App Directory
if exist "%SCRIPT_DIR%PurohitManager\server\src\index.js" (
    set "APP_DIR=%SCRIPT_DIR%PurohitManager"
) else (
    set "APP_DIR=%SCRIPT_DIR%"
)
cd /d "%APP_DIR%"

:: 3. Check if Node.js is installed on this computer
where node >nul 2>&1
if %errorlevel% neq 0 (
    echo ====================================================================
    echo  [ACTION REQUIRED] Node.js is NOT installed on this computer!
    echo  (ಈ ಕಂಪ್ಯೂಟರ್‌ನಲ್ಲಿ Node.js ಸಾಫ್ಟ್‌ವೇರ್ ಇನ್‌ಸ್ಟಾಲ್ ಆಗಿಲ್ಲ)
    echo ====================================================================
    echo.
    echo  Purohit Manager runs 100%% offline, but requires Node.js (free runtime).
    echo.
    echo  Opening official Node.js download page in your web browser now...
    echo  👉 https://nodejs.org/en/download
    echo.
    echo  QUICK 3 STEPS:
    echo  1. Download the Windows Installer (.msi) - LTS version (Recommended).
    echo  2. Open the downloaded file and click "Next", "Next", "Finish".
    echo  3. After installation completes, double-click "Start-Windows.bat" again!
    echo.
    echo ====================================================================
    start https://nodejs.org/en/download
    echo.
    echo Press any key to exit after you have installed Node.js...
    pause >nul
    exit /b 1
)

echo [OK] Node.js is installed.
node -v
echo.

:: 4. Check dependencies (node_modules)
if not exist "node_modules" (
    echo ====================================================================
    echo  [First-time setup] Setting up offline components...
    echo  Please wait, this takes about 1-2 minutes...
    echo ====================================================================
    call npm install --omit=dev
    if %errorlevel% neq 0 (
        echo.
        echo [Notice] Attempting server start...
    )
)

:: 5. Start Application Server
echo.
echo ====================================================================
echo  Starting Chaitanya Krupa Mukthi Dham...
echo  Opening web browser at: http://127.0.0.1:3456
echo ====================================================================
echo.
echo  NOTE: Keep this black Command Prompt window OPEN while using the app.
echo  When you are done, simply close this window.
echo --------------------------------------------------------------------
echo.

start "" "http://127.0.0.1:3456"

if exist server\src\index.js (
    node server\src\index.js
) else (
    node "%APP_DIR%\server\src\index.js"
)

echo.
echo ====================================================================
echo  Application server has stopped.
echo ====================================================================
pause
