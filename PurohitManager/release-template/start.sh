#!/bin/bash
cd "$(dirname "$0")"

echo "===================================================================="
echo "  Starting PurohitManager (Offline Vedic Priest Management)..."
echo "===================================================================="

if [ -f "./runtime/bin/node" ]; then
  NODE_BIN="./runtime/bin/node"
else
  NODE_BIN="node"
fi

# Open browser if xdg-open available
if command -v xdg-open > /dev/null; then
  (sleep 1.5 && xdg-open "http://127.0.0.1:3456") &
fi

"$NODE_BIN" app/server/src/index.js

