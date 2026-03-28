#!/bin/bash
set -e

SERVER="root@45.149.172.181"
KEY="$HOME/.ssh/anycourse_key"

echo "Deploying airwaves.fm to production..."

# Pre-flight: verify build passes locally
echo "Verifying local build..."
if ! npm run build > /dev/null 2>&1; then
  echo "Local build failed. Run 'npm run build' to see errors."
  exit 1
fi
echo "Local build passed"

# Push latest to GitHub
echo "Pushing to GitHub..."
git push origin main 2>&1 | tail -3

# Deploy on server
echo "Deploying on server..."
ssh -i "$KEY" -o StrictHostKeyChecking=no "$SERVER" bash -s << 'REMOTE'
cd /opt/airwaves

# Stop PM2 BEFORE pulling — prevents crash loop from missing .next
echo "  Stopping app..."
pm2 stop airwaves 2>/dev/null || true

echo "  Pulling latest..."
git fetch origin 2>&1 | tail -3
git reset --hard origin/main 2>&1 | tail -1
echo "  Synced to $(git rev-parse --short HEAD)"

echo "  Installing dependencies..."
npm install 2>&1 | tail -2

echo "  Building..."
if ! npm run build 2>&1 | tail -5; then
  echo "  Remote build failed — restarting previous version"
  pm2 restart airwaves --update-env 2>&1 | tail -3
  exit 1
fi

echo "  Starting app..."
pm2 restart airwaves --update-env 2>&1 | tail -3

# Health check with retry
echo "  Health check..."
sleep 3
for i in 1 2 3 4 5; do
  STATUS=$(curl -s -o /dev/null -w '%{http_code}' http://localhost:3000)
  if [ "$STATUS" = "200" ]; then
    echo "  Health check passed (HTTP $STATUS)"
    exit 0
  fi
  echo "  Attempt $i: HTTP $STATUS, retrying..."
  sleep 2
done
echo "  Health check failed after 5 attempts"
exit 1
REMOTE

echo ""
echo "Deployed to https://airwaves.fm"
