@echo off
chcp 936 >nul
title 剧情文案编辑器 - 无垠娱乐
cd /d "%~dp0"

echo.
echo   ============================================
echo      剧情文案编辑器
echo   ============================================
echo.
echo   正在启动，请稍等几秒...
echo   浏览器会自动打开，不用自己输网址。
echo.
echo   改完文案点网页右上角的「保存」就行。
echo   全部弄完，直接关掉这个黑窗口即可。
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

echo   [!] 这台电脑上没找到 Python。
echo       请到 https://www.python.org/downloads/ 下载安装，
echo       安装时记得勾选 "Add Python to PATH"。
echo.

:end
pause
