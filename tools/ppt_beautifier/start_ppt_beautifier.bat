@echo off
setlocal
chcp 65001 >nul
cd /d "%~dp0..\.."

if not exist "tools\ppt_beautifier\logs" mkdir "tools\ppt_beautifier\logs"

echo Starting PPT Beautifier...
echo Project: %CD%
echo.

powershell.exe -NoProfile -ExecutionPolicy Bypass -File "tools\ppt_beautifier\start_ppt_beautifier.ps1"

echo.
echo If this window shows an error, send the log file in tools\ppt_beautifier\logs to Codex.
pause
