#!/bin/bash

# StreamerLive Deployment Health Check
# Usage: ./check-deployment.sh

echo "🔍 StreamerLive Deployment Health Check"
echo "========================================"
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check backend
echo "1. Backend API Health..."
BACKEND_RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" http://139.59.242.118:3001/api/health)
if [ "$BACKEND_RESPONSE" = "200" ]; then
    echo -e "   ${GREEN}✓${NC} Backend: OK (HTTP 200)"
else
    echo -e "   ${RED}✗${NC} Backend: FAIL (HTTP $BACKEND_RESPONSE)"
fi
echo ""

# Check frontend
echo "2. Frontend Deployment..."
FRONTEND_RESPONSE=$(curl -s https://streamerlive.pages.dev)
if echo "$FRONTEND_RESPONSE" | grep -q "<!doctype html>"; then
    if echo "$FRONTEND_RESPONSE" | grep -q "script.*module.*src"; then
        echo -e "   ${GREEN}✓${NC} Frontend: React app deployed"
        echo "   $(echo "$FRONTEND_RESPONSE" | grep -o 'assets/index-[^"]*\.js' | head -1)"
    else
        echo -e "   ${YELLOW}⚠${NC} Frontend: HTML exists but no React bundle found"
    fi
else
    if [ "$FRONTEND_RESPONSE" = "frontend" ]; then
        echo -e "   ${RED}✗${NC} Frontend: Still showing placeholder text"
        echo -e "   ${YELLOW}⏳${NC} Cloudflare may still be building..."
    else
        echo -e "   ${YELLOW}?${NC} Frontend: Unexpected response"
    fi
fi
echo ""

# Check build files locally
echo "3. Local Build Verification..."
if [ -f "frontend/dist/index.html" ]; then
    ASSET_COUNT=$(find frontend/dist/assets -type f 2>/dev/null | wc -l)
    echo -e "   ${GREEN}✓${NC} Local build exists: $ASSET_COUNT asset files"
else
    echo -e "   ${RED}✗${NC} Local dist/ folder missing"
fi
echo ""

# Git status
echo "4. Git Status..."
cd /home/openclaw/.openclaw/agents/lambo/projects/streamerlive
CURRENT_COMMIT=$(git rev-parse --short HEAD)
REMOTE_COMMIT=$(git rev-parse --short origin/main)
if [ "$CURRENT_COMMIT" = "$REMOTE_COMMIT" ]; then
    echo -e "   ${GREEN}✓${NC} Local and remote in sync ($CURRENT_COMMIT)"
else
    echo -e "   ${YELLOW}⚠${NC} Local ($CURRENT_COMMIT) differs from remote ($REMOTE_COMMIT)"
fi
echo ""

echo "========================================"
echo "Check complete at $(date '+%Y-%m-%d %H:%M:%S UTC')"
echo ""
echo "💡 Tips:"
echo "   - If frontend still shows 'frontend', wait 2-5 min for Cloudflare"
echo "   - Check Cloudflare Pages dashboard for build logs"
echo "   - Verify build command is: npm run build"
echo "   - Verify output directory is: frontend/dist"
