#!/bin/bash
DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$DIR"

echo "===================================================================="
echo "    🪔 ಚೈತನ್ಯ ಕೃಪಾ ಮುಕ್ತಿ ಧಾಮ (Chaitanya Krupa Mukthi Dham)"
echo "    Starting application for Mac..."
echo "===================================================================="
echo ""

# 1. Check if Node.js is installed
if command -v node >/dev/null 2>&1; then
  NODE_BIN="node"
elif [ -f "/usr/local/bin/node" ]; then
  NODE_BIN="/usr/local/bin/node"
elif [ -f "/opt/homebrew/bin/node" ]; then
  NODE_BIN="/opt/homebrew/bin/node"
else
  echo "===================================================================="
  echo " [ACTION REQUIRED] Node.js is NOT installed on this Mac!"
  echo "===================================================================="
  echo ""
  echo " Purohit Manager needs Node.js to run offline."
  echo " Opening the download page in your web browser: https://nodejs.org"
  echo ""
  echo " 1. Download the macOS Installer (pkg LTS version)."
  echo " 2. Install it on your Mac."
  echo " 3. Double-click Start-Mac.command again!"
  echo "===================================================================="
  open "https://nodejs.org/en/download" 2>/dev/null || true
  read -p "Press [Enter] to exit..."
  exit 1
fi

# 2. Navigate to PurohitManager directory
if [ -d "$DIR/PurohitManager" ]; then
  cd "$DIR/PurohitManager"
fi

# 3. Check if dependencies are installed
if [ ! -d "node_modules" ]; then
  echo "[First-time setup] Installing necessary components..."
  npm install --omit=dev
fi

echo "App is starting..."
echo "Opening in your default browser at http://127.0.0.1:3456 ..."
echo ""
echo "--------------------------------------------------------------------"
echo " NOTE: Keep this Terminal window OPEN while using the app."
echo " When you are finished, simply close this window."
echo "--------------------------------------------------------------------"
echo ""

"$NODE_BIN" server/src/index.js
