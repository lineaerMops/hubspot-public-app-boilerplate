const axios = require('axios');

// Configuration
const ACCESS_TOKEN = 'CPTstIWIMxISQlNQMl8kQEwrAgUACAkWEisBGOD1-EUgy4nRISiSqqcIMhQymcRfLpdACOu1tjwomtQmgnDvXTofQlNQMl8kQEwrAhIACBkGcU4wAQEBOgEBAQEBJQEDAUIUCelCGSLZBp5rtIaQ-FRNXjXV4OtKA2V1MVIAWgBgAGjLidEhcAB4AA';

// HubSpot API base URL
const HUBSPOT_API_BASE = 'https://api.hubapi.com';

async function testToken() {
  try {
    console.log('🔍 Testing access token...');
    
    // Test 1: Get user info
    console.log('📋 Getting user info...');
    try {
      const userResponse = await axios.get(`${HUBSPOT_API_BASE}/oauth/v1/access-tokens/${ACCESS_TOKEN}`, {
        headers: {
          'Authorization': `Bearer ${ACCESS_TOKEN}`,
          'Content-Type': 'application/json'
        }
      });
      
      console.log('✅ Token is valid');
      console.log('User info:', userResponse.data);
      
    } catch (userError) {
      console.log('❌ Token validation failed:', userError.response?.data || userError.message);
    }
    
    // Test 2: Get developer account info
    console.log('📋 Getting developer account info...');
    try {
      const devResponse = await axios.get(`${HUBSPOT_API_BASE}/developer-hub/v3/account`, {
        headers: {
          'Authorization': `Bearer ${ACCESS_TOKEN}`,
          'Content-Type': 'application/json'
        }
      });
      
      console.log('✅ Developer account info:', devResponse.data);
      
    } catch (devError) {
      console.log('❌ Developer account info failed:', devError.response?.data || devError.message);
    }
    
    // Test 3: Get apps
    console.log('📋 Getting apps...');
    try {
      const appsResponse = await axios.get(`${HUBSPOT_API_BASE}/developer-hub/v3/apps`, {
        headers: {
          'Authorization': `Bearer ${ACCESS_TOKEN}`,
          'Content-Type': 'application/json'
        }
      });
      
      console.log('✅ Apps found:', appsResponse.data.results.length);
      appsResponse.data.results.forEach(app => {
        console.log(`- ${app.name} (${app.uid}) - ID: ${app.id}`);
      });
      
    } catch (appsError) {
      console.log('❌ Apps request failed:', appsError.response?.data || appsError.message);
    }
    
    // Test 4: Try different API versions
    console.log('📋 Testing different API versions...');
    const apiVersions = ['v1', 'v2', 'v3', 'v4'];
    
    for (const version of apiVersions) {
      try {
        const testResponse = await axios.get(`${HUBSPOT_API_BASE}/developer-hub/${version}/apps`, {
          headers: {
            'Authorization': `Bearer ${ACCESS_TOKEN}`,
            'Content-Type': 'application/json'
          }
        });
        
        console.log(`✅ API version ${version} works`);
        
      } catch (versionError) {
        console.log(`❌ API version ${version} failed:`, versionError.response?.status);
      }
    }
    
  } catch (error) {
    console.error('❌ Error testing token:', error.response?.data || error.message);
  }
}

// Run the test
testToken();
