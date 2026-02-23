@echo off
echo ============================================================
echo JRU Robot Admin Website - React App
echo ============================================================
echo.
echo This will start:
echo 1. Backend API (port 8000) - in background
echo 2. React dev server (port 3000) - main window
echo.
echo Make sure you have:
echo - Node.js installed
echo - Dependencies installed: npm install
echo - Backend dependencies: pip install -r admin-panel/requirements.txt
echo.
echo ============================================================
echo.

REM Start backend in background
echo Starting backend API...
start /B "Backend API" cmd /c "cd admin-panel && python admin_panel_backend_supabase.py"

REM Wait a bit for backend to start
timeout /t 3 /nobreak > nul

echo Backend started on http://localhost:8000
echo.
echo Starting React app...
echo React app will open on http://localhost:3000
echo.

cd admin-website
npm start

pause
