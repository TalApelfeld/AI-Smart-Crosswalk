@echo off
echo Starting Smart Crosswalk System...
echo.
echo Starting Backend Server...
start "Backend Server" cmd /k "cd backend && npm start"
timeout /t 3 /nobreak >nul
echo Starting Frontend Server...
start "Frontend Server" cmd /k "cd frontend && npm run dev"
echo.
echo Both servers are starting in separate windows!
echo Backend: http://localhost:3000
echo Frontend: http://localhost:5173
pause
