@echo off
title E-Voting Fullstack Launcher
echo ===================================================
echo   E-Voting Pilot System - Full Stack Launcher
echo ===================================================

set "ROOT_DIR=%~dp0"

echo Launching Backend Microservices...
call "%ROOT_DIR%Backend\start-backend.bat"
