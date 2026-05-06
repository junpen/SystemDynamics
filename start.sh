#!/bin/bash
# 一键启动前端和后端

ROOT_DIR="$(cd "$(dirname "$0")" && pwd)"

echo "=== Starting simulation app ==="

# 启动后端
echo "[Backend] Starting server..."
(cd "$ROOT_DIR/server" && node src/index.js) &
SERVER_PID=$!

# 启动前端
echo "[Frontend] Starting web..."
(cd "$ROOT_DIR/web" && npx vite) &
WEB_PID=$!

echo ""
echo "=== Both services are running ==="
echo "  Backend PID: $SERVER_PID"
echo "  Frontend PID: $WEB_PID"
echo "  Press Ctrl+C to stop both"
echo ""

# 捕获 Ctrl+C，同时关闭两个进程
trap "echo ''; echo 'Stopping...'; kill $SERVER_PID $WEB_PID 2>/dev/null; exit 0" INT TERM

# 等待任意子进程退出
wait
