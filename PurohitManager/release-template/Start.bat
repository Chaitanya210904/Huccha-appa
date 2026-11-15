@echo off
:: Re-launch in persistent cmd /k if double-clicked
if not "%~1"=="__RUNNING_INTERACTIVE__" (
    cmd /k ""%~f0" __RUNNING_INTERACTIVE__"
    exit /b
)
shift

chcp 65001 >nul 2>&1
title PurohitManager - Chaitanya Krupa Mukthi Dham
cd /d "%~dp0"

echo ====================================================================
echo   Starting PurohitManager (Offline Vedic Priest Management)...
echo ====================================================================
echo.

if exist runtime\node.exe (
    set "NODE_BIN=runtime\node.exe"
) else (
    where node >nul 2>&1
    if %errorlevel% neq 0 (
        echo [ERROR] Node.js is NOT installed on this computer!
        echo Opening download page: https://nodejs.org/en/download
        start https://nodejs.org/en/download
        pause
        exit /b 1
    )
    set "NODE_BIN=node"
)

start "" http://127.0.0.1:3456
"%NODE_BIN%" app\server\src\index.js

echo.
echo ====================================================================
echo  Server has stopped.
echo ====================================================================
pause
