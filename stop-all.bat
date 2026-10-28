@echo off
title E-Voting Process Cleanup
echo ===================================================
echo   Stopping lingering Java and Node processes...
echo ===================================================

echo [1/2] Terminating java.exe processes...
taskkill /F /IM java.exe 2>nul

echo [2/2] Terminating node.exe processes...
taskkill /F /IM node.exe 2>nul

echo ===================================================
echo Memory cleared! You can now start services cleanly.
echo ===================================================
pause
