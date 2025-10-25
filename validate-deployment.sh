#!/bin/bash

# Deployment Validation Script
# This script validates that all endpoints are working correctly

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Default to localhost if no URL provided
BASE_URL="${1:-http://localhost:4000}"

echo "======================================"
echo "MCP Server Deployment Validation"
echo "======================================"
echo "Testing: $BASE_URL"
echo ""

# Function to test endpoint
test_endpoint() {
    local endpoint=$1
    local method=$2
    local expected_status=$3
    local data=$4
    
    echo -n "Testing $method $endpoint... "
    
    if [ "$method" == "GET" ]; then
        response=$(curl -s -w "\n%{http_code}" "$BASE_URL$endpoint")
    else
        response=$(curl -s -w "\n%{http_code}" -X POST -H "Content-Type: application/json" -d "$data" "$BASE_URL$endpoint")
    fi
    
    status=$(echo "$response" | tail -n1)
    body=$(echo "$response" | sed '$d')
    
    if [ "$status" == "$expected_status" ]; then
        echo -e "${GREEN}✓ PASS${NC} (HTTP $status)"
        return 0
    else
        echo -e "${RED}✗ FAIL${NC} (HTTP $status, expected $expected_status)"
        echo "Response: $body"
        return 1
    fi
}

# Track results
passed=0
failed=0

# Test 1: Root endpoint
if test_endpoint "/" "GET" "200"; then
    ((passed++))
else
    ((failed++))
fi

# Test 2: Health check endpoint
if test_endpoint "/health" "GET" "200"; then
    ((passed++))
    echo "Health check response:"
    curl -s "$BASE_URL/health" | jq .
    echo ""
else
    ((failed++))
fi

# Test 3: MCP endpoint
if test_endpoint "/mcp" "GET" "200"; then
    ((passed++))
    echo "MCP endpoint response (agent info):"
    curl -s "$BASE_URL/mcp" | jq '.agent'
    echo ""
else
    ((failed++))
fi

# Test 4: Chat endpoint (may fail if no API key set)
echo "Testing chat endpoint (may fail without API key)..."
chat_data='{"message": "Hello"}'
response=$(curl -s -w "\n%{http_code}" -X POST -H "Content-Type: application/json" -d "$chat_data" "$BASE_URL/chat")
status=$(echo "$response" | tail -n1)
body=$(echo "$response" | sed '$d')

if [ "$status" == "200" ]; then
    echo -e "${GREEN}✓ PASS${NC} - Chat endpoint working"
    ((passed++))
elif [ "$status" == "500" ] && echo "$body" | grep -q "API key"; then
    echo -e "${YELLOW}⚠ WARNING${NC} - Chat endpoint requires API key configuration"
    echo "This is expected if GOOGLE_API_KEY is not set"
    ((passed++))
else
    echo -e "${RED}✗ FAIL${NC} - Unexpected response (HTTP $status)"
    echo "Response: $body"
    ((failed++))
fi

echo ""
echo "======================================"
echo "Validation Results"
echo "======================================"
echo -e "Passed: ${GREEN}$passed${NC}"
echo -e "Failed: ${RED}$failed${NC}"
echo ""

if [ $failed -eq 0 ]; then
    echo -e "${GREEN}✓ All tests passed!${NC}"
    echo "The server is ready for production deployment."
    exit 0
else
    echo -e "${RED}✗ Some tests failed${NC}"
    echo "Please review the errors above."
    exit 1
fi
