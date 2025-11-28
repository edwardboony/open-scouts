#!/bin/bash

# Test Scout Cron Execution
# This script manually triggers the scout cron function for testing

# Check if environment variables are set
if [ -z "$SUPABASE_URL" ]; then
  echo "Error: SUPABASE_URL not set"
  echo "Usage: SUPABASE_URL=<url> SUPABASE_ANON_KEY=<key> ./test-scout-cron.sh"
  exit 1
fi

if [ -z "$SUPABASE_ANON_KEY" ]; then
  echo "Error: SUPABASE_ANON_KEY not set"
  echo "Usage: SUPABASE_URL=<url> SUPABASE_ANON_KEY=<key> ./test-scout-cron.sh"
  exit 1
fi

echo "Testing Scout Cron Function..."
echo "URL: $SUPABASE_URL/functions/v1/scout-cron"
echo ""

# Make the request
response=$(curl -s -w "\n%{http_code}" -X POST \
  "$SUPABASE_URL/functions/v1/scout-cron" \
  -H "Authorization: Bearer $SUPABASE_ANON_KEY" \
  -H "Content-Type: application/json")

# Extract response body and status code
http_code=$(echo "$response" | tail -n1)
response_body=$(echo "$response" | sed '$d')

echo "Status Code: $http_code"
echo "Response:"
echo "$response_body" | jq '.' 2>/dev/null || echo "$response_body"

if [ "$http_code" -eq 200 ]; then
  echo ""
  echo "✓ Success! Check your scout execution panel in the UI."
else
  echo ""
  echo "✗ Error occurred. Check the logs above."
  exit 1
fi
