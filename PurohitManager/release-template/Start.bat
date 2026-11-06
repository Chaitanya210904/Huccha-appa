@echo off
title PurohitManager - পুরোহিত व्यवस्थापक
echo ====================================================================
echo   Starting PurohitManager (Offline Vedic Priest Management)...
echo ====================================================================

if exist runtime\node.exe (
  set "NODE_BIN=runtime\node.exe"
) else (
  set "NODE_BIN=node"
)

start "" http://127.0.0.1:3456
"%NODE_BIN%" app\server\src\index.js

pause

