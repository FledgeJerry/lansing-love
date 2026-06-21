#!/bin/bash
# lansing.love deploy — build on Mac, rsync to Pi (never build on Pi, OOMs)
# Usage: ./deploy.sh

PI="pivision@100.95.158.115"
PI_PATH="/home/pivision/lansing-love"

echo "==> Building on Mac..."
npm run build

echo "==> Syncing .next to Pi..."
rsync -az --delete --exclude='node_modules' .next/ "$PI:$PI_PATH/.next/"

echo "==> Syncing .next/node_modules to Pi..."
rsync -az .next/node_modules/ "$PI:$PI_PATH/.next/node_modules/"

echo "==> Restarting on Pi..."
ssh "$PI" "source ~/.nvm/nvm.sh && pm2 restart lansing-love --update-env"

echo "==> Done. Verify: curl -s http://localhost:3001 | grep title"
