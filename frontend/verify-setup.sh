#!/bin/bash

echo "🔍 Verifying StreamerLive Frontend Setup..."
echo ""

# Check if backend is running
echo "1. Checking backend API..."
if curl -s http://localhost:5000/api/health > /dev/null 2>&1; then
    echo "   ✅ Backend is running on port 5000"
else
    echo "   ❌ Backend is not running. Start it with:"
    echo "      cd /home/openclaw/.openclaw/agents/lambo/projects/streamerlive/backend && npm start"
    exit 1
fi

# Check banners endpoint
echo ""
echo "2. Checking banners API..."
BANNER_COUNT=$(curl -s http://localhost:5000/api/banners | jq '.data | length' 2>/dev/null)
if [ "$BANNER_COUNT" -ge 0 ]; then
    echo "   ✅ Banners API working ($BANNER_COUNT banners)"
else
    echo "   ❌ Banners API error"
    exit 1
fi

# Check for banners with links
echo ""
echo "3. Checking banners with links..."
LINKED_BANNERS=$(curl -s http://localhost:5000/api/banners | jq '.data | map(select(.link != null and .link != "")) | length' 2>/dev/null)
echo "   ✅ Found $LINKED_BANNERS banner(s) with links"

# Check frontend files
echo ""
echo "4. Checking frontend files..."
FILES=(
    "src/pages/LandingPage.jsx"
    "src/pages/BannerManager.jsx"
    "src/services/api.js"
    "src/App.jsx"
    ".env"
)

for file in "${FILES[@]}"; do
    if [ -f "$file" ]; then
        echo "   ✅ $file"
    else
        echo "   ❌ Missing: $file"
    fi
done

# Check dependencies
echo ""
echo "5. Checking dependencies..."
if [ -d "node_modules" ]; then
    echo "   ✅ node_modules installed"
else
    echo "   ⚠️  node_modules not found. Run: npm install"
fi

# Summary
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ Setup verification complete!"
echo ""
echo "🚀 To start the frontend:"
echo "   npm run dev"
echo ""
echo "🌐 Access the application:"
echo "   Landing Page:    http://localhost:5173/"
echo "   Banner Manager:  http://localhost:5173/admin/banners"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
