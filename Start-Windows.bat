@echo off
setlocal EnableDelayedExpansion

title Chaitanya Krupa Mukthi Dham - Purohit Manager

echo ====================================================================
echo     Chaitanya Krupa Mukthi Dham (Purohit Manager)
echo ====================================================================
echo.

:: 1. Working directory setup
set "SCRIPT_DIR=%~dp0"
cd /d "%SCRIPT_DIR%"

:: Check if unextracted ZIP
if not exist "%SCRIPT_DIR%PurohitManagerserversrcindex.js" (
    if not exist "%SCRIPT_DIR%serversrcindex.js" (
        echo ====================================================================
        echo  [ERROR] FILES NOT EXTRACTED!
        echo ====================================================================
        echo.
        echo  You are running this file directly from inside the ZIP file.
        echo.
        echo  HOW TO FIX:
        echo  1. Close this window.
        echo  2. Right-click the ZIP file and select 'Extract All...'.
        echo  3. Click 'Extract'.
        echo  4. Open the newly extracted folder and run Start-Windows.bat.
        echo.
        echo ====================================================================
        pause
        exit /b 1
    )
)

:: 2. Set App Directory
if exist "%SCRIPT_DIR%PurohitManagerserversrcindex.js" (
    set "APP_DIR=%SCRIPT_DIR%PurohitManager"
) else (
    set "APP_DIR=%SCRIPT_DIR%"
)
cd /d "%APP_DIR%"

:: 3. Detect Node.js
if exist "C:Program Files
odejs
ode.exe" set "PATH=C:Program Files
odejs;%PATH%"
if exist "C:Program Files (x86)
odejs
ode.exe" set "PATH=C:Program Files (x86)
odejs;%PATH%"
if exist "%ProgramW6432%
odejs
ode.exe" set "PATH=%ProgramW6432%
odejs;%PATH%"
if exist "%LOCALAPPDATA%Programs
ode
ode.exe" set "PATH=%LOCALAPPDATA%Programs
ode;%PATH%"

where node >nul 2>&1
if %errorlevel% neq 0 (
    echo ====================================================================
    echo  [ACTION REQUIRED] Node.js is NOT installed on this computer!
    echo ====================================================================
    echo.
    echo  This application requires Node.js to run offline.
    echo.
    echo  Opening official download page: https://nodejs.org/en/download
    echo.
    echo  HOW TO INSTALL (1 MINUTE):
    echo  1. In the web browser that opened, download the Windows Installer (.msi).
    echo  2. Open the downloaded .msi file and click Next -^> Next -^> Finish.
    echo  3. Once installed, double-click Start-Windows.bat again!
    echo.
    echo ====================================================================
    start https://nodejs.org/en/download
    echo.
    pause
    exit /b 1
)

echo [OK] Node.js is ready.
node -v
echo.

:: 4. Check dependencies
if not exist "node_modules" (
    echo ====================================================================
    echo  [First-time setup] Installing components, please wait 1 minute...
    echo ====================================================================
    call npm install --omit=dev
)

:: 5. Start Server and Browser
echo ====================================================================
echo  Starting Chaitanya Krupa Mukthi Dham...
echo  Opening web browser at: http://127.0.0.1:3456
echo ====================================================================
echo.
echo  Keep this black window OPEN while using the app.
echo  When done, simply close this window.
echo.

start "" "http://127.0.0.1:3456"

if exist serversrcindex.js (
    node serversrcindex.js
) else (
    node "%APP_DIR%serversrcindex.js"
)

echo.
echo ====================================================================
echo  Server has stopped.
echo ====================================================================
pause
