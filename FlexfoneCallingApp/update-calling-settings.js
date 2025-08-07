const axios = require('axios');

// Configuration
const APP_ID = '17421586';
const DEVELOPER_ACCOUNT_API_KEY = 'eu1-0558-15c9-4670-b2a0-5c2f639cad80';

// HubSpot API base URL
const HUBSPOT_API_BASE = 'https://api.hubapi.com';

async function updateCallingSettings() {
  try {
    console.log('🔄 Updating calling settings...');
    
    const updateSettings = {
      "name": "Flexfone Calling",
      "url": "https://hubspot-public-app-boilerplate.vercel.app/flexfone-calling-widget",
      "height": 600,
      "width": 400,
      "isReady": true,
      "supportsInboundCalling": true,
      "usesCallingWindow": true,
      "usesRemote": true
    };
    
    try {
      const response = await axios.patch(
        `${HUBSPOT_API_BASE}/crm/v3/extensions/calling/${APP_ID}/settings?hapikey=${DEVELOPER_ACCOUNT_API_KEY}`,
        updateSettings,
        {
          headers: {
            'accept': 'application/json',
            'content-type': 'application/json'
          }
        }
      );
      
      console.log('✅ Calling settings updated successfully!');
      console.log('Response:', response.data);
      
    } catch (error) {
      console.log('❌ Failed to update calling settings:');
      console.log('Status:', error.response?.status);
      console.log('Error:', error.response?.data || error.message);
    }
    
    // Get current settings
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
    console.error('❌ Error updating calling settings:', error.response?.data || error.message);
  }
}

// Run the update
updateCallingSettings();
