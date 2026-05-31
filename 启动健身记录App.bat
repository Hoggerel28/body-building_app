@echo off
chcp 65001 >nul
cd /d "%~dp0"
echo ========================================
echo 正在启动 FitTrack 健身记录 App...
echo 地址：http://127.0.0.1:4173
echo.
echo 如果提示端口被占用，请先关闭旧的启动窗口。
echo 此窗口不要关闭，关闭后网页服务会停止。
echo ========================================
node server.js
pause
