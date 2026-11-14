@echo off
title Kantor Ternyata Begitu
cd /d "%~dp0"
echo Menyalakan Kantor Visual...
start "Kantor Visual (jangan ditutup)" /min python scripts\kantor_visual.py --tanpa-browser
timeout /t 2 /nobreak >nul
start "" chrome --new-window "http://localhost:8765"
if errorlevel 1 start "" "http://localhost:8765"
exit
