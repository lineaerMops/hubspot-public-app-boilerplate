const axios = require('axios');

// Configuration - you'll need to update these values
const APP_ID = '17421586'; // From the token info we got earlier
const DEVELOPER_ACCOUNT_API_KEY = 'eu1-0558-15c9-4670-b2a0-5c2f639cad80'; // You need to get this from HubSpot developer account
const PORTAL_ID = '146684640';

// HubSpot API base URL
const HUBSPOT_API_BASE = 'https://api.hubapi.com';

async function activateCallingSettings() {
  try {
    console.log('🚀 Activating calling settings for Flexfone app...');
    console.log('App ID:', APP_ID);
    console.log('Portal ID:', PORTAL_ID);
    
    if (DEVELOPER_ACCOUNT_API_KEY === 'your_developer_account_api_key') {
      console.log('❌ Please update DEVELOPER_ACCOUNT_API_KEY in this script');
      console.log('📋 To get your API key:');
      console.log('1. Go to HubSpot Developer Account');
      console.log('2. Navigate to Settings > Account Setup > Integrations > API Keys');
      console.log('3. Copy your Developer Account API Key');
      return;
    }
    
    // Step 1: Add calling widget settings
    console.log('📞 Adding calling widget settings...');
    
    const callingSettings = {
      "name": "Flexfone Calling",
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
    };
    
    try {
      const response = await axios.patch(
        `${HUBSPOT_API_BASE}/crm/v3/extensions/calling/${APP_ID}/settings?hapikey=${DEVELOPER_ACCOUNT_API_KEY}`,
        callingSettings,
        {
          headers: {
            'accept': 'application/json',
            'content-type': 'application/json'
          }
        }
      );
      
      console.log('✅ Calling settings activated successfully!');
      console.log('Response:', response.data);
      
    } catch (error) {
      console.log('❌ Failed to activate calling settings:');
      console.log('Status:', error.response?.status);
      console.log('Error:', error.response?.data || error.message);
      
      if (error.response?.status === 401) {
        console.log('🔑 Authentication failed. Please check your DEVELOPER_ACCOUNT_API_KEY');
      } else if (error.response?.status === 404) {
        console.log('🔍 App not found. Please check your APP_ID');
      }
    }
    
    // Step 2: Get current calling settings
    console.log('🔍 Getting current calling settings...');
    try {
      const getResponse = await axios.get(
        `${HUBSPOT_API_BASE}/crm/v3/extensions/calling/${APP_ID}/settings?hapikey=${DEVELOPER_ACCOUNT_API_KEY}`,
        {
          headers: {
            'accept': 'application/json'
          }
        }
      );
      
      console.log('Current calling settings:', getResponse.data);
      
    } catch (getError) {
      console.log('Could not retrieve calling settings:', getError.response?.data || getError.message);
    }
    
  } catch (error) {
    console.error('❌ Error activating calling settings:', error.response?.data || error.message);
  }
}

// Run the activation
activateCallingSettings();
