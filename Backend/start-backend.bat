@echo off
title E-Voting Backend Services Launcher
echo ===================================================
echo   Starting E-Voting Microservices in Sequence
echo ===================================================

echo [1/9] Starting Eureka Discovery Server (Port 8761)...
start "1. Eureka Server (8761)" cmd /k "cd /d d:\E-Voting Pilot System\Backend\eureka-server && java -jar target\eureka-server-1.0.0-SNAPSHOT.jar"
echo Waiting 10 seconds for Eureka to initialize...
timeout /t 10 /nobreak >nul

echo [2/9] Starting API Gateway (Port 8080)...
start "2. API Gateway (8080)" cmd /k "cd /d d:\E-Voting Pilot System\Backend\api-gateway && java -jar target\api-gateway-1.0.0-SNAPSHOT.jar"
echo Waiting 5 seconds for Gateway to register...
timeout /t 5 /nobreak >nul

echo [3/9] Starting Auth Service (Port 8086)...
start "3. Auth Service (8086)" cmd /k "cd /d d:\E-Voting Pilot System\Backend\auth-service && java -jar target\auth-service-1.0.0-SNAPSHOT.jar"

echo [4/9] Starting Voter Service (Port 8081)...
start "4. Voter Service (8081)" cmd /k "cd /d d:\E-Voting Pilot System\Backend\voter-service && java -jar target\voter-service-1.0.0-SNAPSHOT.jar"

echo [5/9] Starting Election Service (Port 8082)...
start "5. Election Service (8082)" cmd /k "cd /d d:\E-Voting Pilot System\Backend\election-service && java -jar target\election-service-1.0.0-SNAPSHOT.jar"

echo [6/9] Starting Candidate Service (Port 8083)...
start "6. Candidate Service (8083)" cmd /k "cd /d d:\E-Voting Pilot System\Backend\candidate-service && java -jar target\candidate-service-1.0.0-SNAPSHOT.jar"

echo [7/9] Starting Voting Service (Port 8084)...
start "7. Voting Service (8084)" cmd /k "cd /d d:\E-Voting Pilot System\Backend\voting-service && java -jar target\voting-service-1.0.0-SNAPSHOT.jar"

echo [8/9] Starting Result Service (Port 8085)...
start "8. Result Service (8085)" cmd /k "cd /d d:\E-Voting Pilot System\Backend\result-service && java -jar target\result-service-1.0.0-SNAPSHOT.jar"

echo [9/9] Starting Audit Service (Port 8087)...
start "9. Audit Service (8087)" cmd /k "cd /d d:\E-Voting Pilot System\Backend\audit-service && java -jar target\audit-service-1.0.0-SNAPSHOT.jar"

echo ===================================================
echo All services launched in separate windows!
echo Eureka Dashboard: http://localhost:8761
echo API Gateway:      http://localhost:8080
echo ===================================================
pause
