@echo off
chcp 65001 >nul
echo 正在準備啟動應用程式，請稍候...
cd /d "%~dp0"
npm start
