@echo off
chcp 65001 >nul 2>&1
title Simulation App

echo === Starting simulation app ===

echo [Backend] Starting server...
start "Simulation Server" cmd /c "cd /d %~dp0server && node src/index.js"

echo [Frontend] Starting web...
start "Simulation Web" cmd /c "cd /d %~dp0web && npx vite"

echo.
echo === Both services are starting ===
echo Close the Server/Web windows to stop them.
echo.
pause
