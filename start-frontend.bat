@echo off
title E-Voting Frontend Launcher
echo ===================================================
echo   Starting E-Voting Angular Frontend (Port 4200)
echo ===================================================

if exist "D:\nodejs\node.exe" (
    set "PATH=D:\nodejs;%PATH%"
)

cd /d "%~dp0frontend"
npm start
