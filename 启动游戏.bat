@echo off
chcp 936 >nul
title 无垠娱乐 CEO - 启动游戏
cd /d "%~dp0"

where python >nul 2>nul
if %errorlevel%==0 (
  python "%~dp0editor\server.py" --game
  goto :end
)

where py >nul 2>nul
if %errorlevel%==0 (
  py "%~dp0editor\server.py" --game
  goto :end
)

echo.
echo   [!] 这台电脑上没找到 Python。
echo       请到 https://www.python.org/downloads/ 下载安装，
echo       安装时记得勾选 "Add Python to PATH"。
echo.
pause

:end
