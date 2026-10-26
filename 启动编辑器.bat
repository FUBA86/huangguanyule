@echo off
title Story Editor - Economy Company Simulator
cd /d "%~dp0"

echo.
echo   Starting story editor, please wait a few seconds...
echo   The browser will open automatically.
echo   When finished, just close this window.
echo.

where python >nul 2>nul
if %errorlevel%==0 (
  python editor\server.py
  goto :end
)

where py >nul 2>nul
if %errorlevel%==0 (
  py editor\server.py
  goto :end
)

echo   [!] Python was not found on this computer.
echo       Please install it from https://www.python.org/downloads/
echo       During install, tick "Add Python to PATH".
echo.

:end
pause
