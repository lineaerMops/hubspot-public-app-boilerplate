#!/bin/bash

# Flexfone Calling Settings Activation Script
# Update these values before running:

APP_ID="17421586"
DEVELOPER_ACCOUNT_API_KEY="eu1-0558-15c9-4670-b2a0-5c2f639cad80"

echo "🚀 Activating calling settings for Flexfone app..."
echo "App ID: $APP_ID"
echo ""

if [ "$DEVELOPER_ACCOUNT_API_KEY" = "your_developer_account_api_key" ]; then
    echo "❌ Please update DEVELOPER_ACCOUNT_API_KEY in this script"
    echo "📋 To get your API key:"
    echo "1. Go to HubSpot Developer Account"
    echo "2. Navigate to Settings > Account Setup > Integrations > API Keys"
    echo "3. Copy your Developer Account API Key"
    exit 1
fi

echo "📞 Adding calling widget settings..."

curl --request POST \
  --url "https://api.hubapi.com/crm/v3/extensions/calling/$APP_ID/settings?hapikey=$DEVELOPER_ACCOUNT_API_KEY" \
  --header 'accept: application/json' \
  --header 'content-type: application/json' \
  --data '{
    "name": "Flexfone Calling Widget",
    "url": "https://hubspot-public-app-boilerplate.vercel.app/flexfone-calling-widget",
    "height": 600,
    "width": 400,
    "isReady": true,
    "supportsInboundCalling": true,
    "usesCallingWindow": true,
    "usesRemote": true,
    "supportedCallTypes": ["outbound", "inbound"],
    "supportedObjectTypes": ["contact", "company"],
    "capabilities": {
      "canMakeCalls": true,
      "canReceiveCalls": true,
      "canLogCalls": true,
      "canRecordCalls": false,
      "canTransferCalls": true,
      "canHoldCalls": true,
      "canMuteCalls": true
    },
    "settings": {
      "defaultOutboundNumber": "",
      "callerId": "",
      "timezone": "Europe/Copenhagen"
    }
  }'

echo ""
echo "🔍 Getting current calling settings..."

curl --request GET \
  --url "https://api.hubapi.com/crm/v3/extensions/calling/$APP_ID/settings?hapikey=$DEVELOPER_ACCOUNT_API_KEY" \
  --header 'accept: application/json'

echo ""
echo "✅ Script completed!"
