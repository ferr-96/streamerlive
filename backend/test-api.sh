#!/bin/bash

API_URL="http://localhost:5000"

echo "🧪 StreamerLive API Test Suite"
echo "==============================="
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Test counter
PASSED=0
FAILED=0

test_endpoint() {
    local name=$1
    local method=$2
    local endpoint=$3
    local data=$4
    
    echo -n "Testing: $name ... "
    
    if [ -z "$data" ]; then
        response=$(curl -s -w "\n%{http_code}" -X "$method" "$API_URL$endpoint")
    else
        response=$(curl -s -w "\n%{http_code}" -X "$method" "$API_URL$endpoint" \
            -H "Content-Type: application/json" \
            -d "$data")
    fi
    
    http_code=$(echo "$response" | tail -n1)
    body=$(echo "$response" | sed '$d')
    
    if [ "$http_code" -ge 200 ] && [ "$http_code" -lt 300 ]; then
        echo -e "${GREEN}✓ PASSED${NC} (HTTP $http_code)"
        PASSED=$((PASSED + 1))
        return 0
    else
        echo -e "${RED}✗ FAILED${NC} (HTTP $http_code)"
        echo "  Response: $body"
        FAILED=$((FAILED + 1))
        return 1
    fi
}

# Check if server is running
echo -e "${YELLOW}Checking if server is running...${NC}"
if ! curl -s "$API_URL/api/health" > /dev/null; then
    echo -e "${RED}❌ Server is not running!${NC}"
    echo "Please start the server with: npm start"
    exit 1
fi
echo -e "${GREEN}✓ Server is running${NC}"
echo ""

# Run tests
echo "Running API tests..."
echo ""

test_endpoint "Health check" "GET" "/api/health"
test_endpoint "Get all banners" "GET" "/api/banners"
test_endpoint "Get active banners" "GET" "/api/banners?active=true"
test_endpoint "Get banner by ID" "GET" "/api/banners/1"
test_endpoint "Get all sections" "GET" "/api/sections"
test_endpoint "Get hero section" "GET" "/api/sections?sectionType=hero"
test_endpoint "Get section by ID" "GET" "/api/sections/1"
test_endpoint "Get settings" "GET" "/api/settings"

# Create a test banner
echo ""
echo "Testing CREATE operations..."
test_endpoint "Create banner" "POST" "/api/banners" '{
  "title": "Test Banner",
  "imageUrl": "https://example.com/test.jpg",
  "mediaType": "image",
  "position": 999,
  "active": true
}'

# Create a test section
test_endpoint "Create section" "POST" "/api/sections" '{
  "sectionType": "hero",
  "title": "Test Hero",
  "subtitle": "Test Subtitle",
  "content": {"test": true},
  "orderNum": 999,
  "active": true
}'

# Update settings
echo ""
echo "Testing UPDATE operations..."
test_endpoint "Update settings" "PUT" "/api/settings" '{
  "siteName": "StreamerLive Test"
}'

# Summary
echo ""
echo "==============================="
echo "Test Results:"
echo -e "  ${GREEN}Passed: $PASSED${NC}"
echo -e "  ${RED}Failed: $FAILED${NC}"
echo "==============================="

if [ $FAILED -eq 0 ]; then
    echo -e "${GREEN}✓ All tests passed!${NC}"
    exit 0
else
    echo -e "${RED}✗ Some tests failed${NC}"
    exit 1
fi
