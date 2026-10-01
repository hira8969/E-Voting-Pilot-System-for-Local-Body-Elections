@echo off
title E-Voting Fullstack Launcher
echo ===================================================
echo   E-Voting Pilot System - Full Stack Launcher
echo ===================================================

set "ROOT_DIR=%~dp0"

echo Launching Backend Microservices...
start "E-Voting Backend Launcher" cmd /k "call "%ROOT_DIR%Backend\start-backend.bat""

echo Launching Frontend Angular Application...
start "E-Voting Frontend" cmd /k "call "%ROOT_DIR%start-frontend.bat""

echo ===================================================
echo All launch processes started!
echo Frontend:         http://localhost:4200
echo Eureka Dashboard: http://localhost:8761
echo API Gateway:      http://localhost:8080
echo ===================================================
pause
