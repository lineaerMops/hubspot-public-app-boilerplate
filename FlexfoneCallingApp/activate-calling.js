const axios = require('axios');

// Configuration
const ACCESS_TOKEN = 'CPTstIWIMxISQlNQMl8kQEwrAgUACAkWEisBGOD1-EUgy4nRISiSqqcIMhQymcRfLpdACOu1tjwomtQmgnDvXTofQlNQMl8kQEwrAhIACBkGcU4wAQEBOgEBAQEBJQEDAUIUCelCGSLZBp5rtIaQ-FRNXjXV4OtKA2V1MVIAWgBgAGjLidEhcAB4AA';
const PORTAL_ID = '146684640'; // Test account portal ID

// HubSpot API base URL
const HUBSPOT_API_BASE = 'https://api.hubapi.com';

async function activateCallingSettings() {
  try {
    console.log('🚀 Activating calling settings for Flexfone app...');
    
    // Step 1: Get app information
    console.log('📋 Getting app information...');
    const appResponse = await axios.get(`${HUBSPOT_API_BASE}/developer-hub/v3/apps`, {
      headers: {
        'Authorization': `Bearer ${ACCESS_TOKEN}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('Apps found:', appResponse.data.results.length);
    
    // Find our Flexfone app
    const flexfoneApp = appResponse.data.results.find(app => 
      app.name === 'FlexfoneCallingApp' || app.uid === 'flexfone-calling-app'
    );
    
    if (!flexfoneApp) {
      console.log('❌ Flexfone app not found in developer account');
      return;
    }
    
    console.log('✅ Found Flexfone app:', flexfoneApp.name, 'ID:', flexfoneApp.id);
    
    // Step 2: Activate calling settings using the correct endpoint
    console.log('📞 Activating calling settings...');
    
    const callingSettings = {
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
    
    // Try different calling settings endpoints
    const endpoints = [
      `${HUBSPOT_API_BASE}/developer-hub/v3/apps/${flexfoneApp.id}/calling/settings`,
      `${HUBSPOT_API_BASE}/developer-hub/v3/apps/calling/settings`,
      `${HUBSPOT_API_BASE}/developer-hub/v3/apps/${flexfoneApp.id}/settings/calling`,
      `${HUBSPOT_API_BASE}/developer-hub/v3/apps/${flexfoneApp.id}/extensions/calling`
    ];
    
    for (const endpoint of endpoints) {
      try {
        console.log(`🔧 Trying endpoint: ${endpoint}`);
        
        const activateResponse = await axios.post(
          endpoint,
          callingSettings,
          {
            headers: {
              'Authorization': `Bearer ${ACCESS_TOKEN}`,
              'Content-Type': 'application/json'
            }
          }
        );
        
        console.log('✅ Calling settings activated successfully!');
        console.log('Response:', activateResponse.data);
        return;
        
      } catch (activateError) {
        console.log(`❌ Failed for endpoint ${endpoint}:`, activateError.response?.status, activateError.response?.data?.message || activateError.message);
      }
    }
    
    console.log('⚠️ Could not activate calling settings via API');
    console.log('This might need to be done manually in the HubSpot developer portal');
    
    // Step 3: Check current calling settings
    console.log('🔍 Checking current calling settings...');
    try {
      const settingsResponse = await axios.get(
        `${HUBSPOT_API_BASE}/developer-hub/v3/apps/${flexfoneApp.id}/calling/settings`,
        {
          headers: {
            'Authorization': `Bearer ${ACCESS_TOKEN}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      console.log('Current calling settings:', settingsResponse.data);
      
    } catch (settingsError) {
      console.log('Could not retrieve calling settings:', settingsError.response?.data || settingsError.message);
    }
    
  } catch (error) {
    console.error('❌ Error activating calling settings:', error.response?.data || error.message);
  }
}

// Run the activation
activateCallingSettings();
