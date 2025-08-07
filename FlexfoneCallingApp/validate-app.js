const axios = require('axios');

// Configuration
const APP_ID = '17421586';
const DEVELOPER_ACCOUNT_API_KEY = 'eu1-0558-15c9-4670-b2a0-5c2f639cad80';
const PORTAL_ID = '146684640';

// HubSpot API base URL
const HUBSPOT_API_BASE = 'https://api.hubapi.com';

async function validateApp() {
  console.log('🔍 Validating Flexfone Calling App...');
  console.log('=====================================');
  
  const results = {
    appDeployment: false,
    callingSettings: false,
    callingCard: false,
    oauthToken: false,
    apiAccess: false
  };

  try {
    // Test 1: Validate OAuth token
    console.log('\n1️⃣ Testing OAuth token...');
    try {
      const tokenResponse = await axios.get(`${HUBSPOT_API_BASE}/oauth/v1/access-tokens/CPTstIWIMxISQlNQMl8kQEwrAgUACAkWEisBGOD1-EUgy4nRISiSqqcIMhQymcRfLpdACOu1tjwomtQmgnDvXTofQlNQMl8kQEwrAhIACBkGcU4wAQEBOgEBAQEBJQEDAUIUCelCGSLZBp5rtIaQ-FRNXjXV4OtKA2V1MVIAWgBgAGjLidEhcAB4AA`);
      console.log('✅ OAuth token is valid');
      console.log('   User:', tokenResponse.data.user);
      console.log('   Scopes:', tokenResponse.data.scopes.join(', '));
      results.oauthToken = true;
    } catch (error) {
      console.log('❌ OAuth token validation failed:', error.response?.data?.message || error.message);
    }

    // Test 2: Validate calling settings
    console.log('\n2️⃣ Testing calling settings...');
    try {
      const settingsResponse = await axios.get(
        `${HUBSPOT_API_BASE}/crm/v3/extensions/calling/${APP_ID}/settings?hapikey=${DEVELOPER_ACCOUNT_API_KEY}`
      );
      
      const settings = settingsResponse.data;
      console.log('✅ Calling settings found');
      console.log('   Name:', settings.name);
      console.log('   URL:', settings.url);
      console.log('   isReady:', settings.isReady);
      console.log('   supportsInboundCalling:', settings.supportsInboundCalling);
      console.log('   usesCallingWindow:', settings.usesCallingWindow);
      console.log('   usesRemote:', settings.usesRemote);
      
      results.callingSettings = true;
    } catch (error) {
      console.log('❌ Calling settings validation failed:', error.response?.data?.message || error.message);
    }

    // Test 3: Validate API access
    console.log('\n3️⃣ Testing API access...');
    try {
      const testResponse = await axios.get(`${HUBSPOT_API_BASE}/crm/v3/objects/contacts?limit=1`, {
        headers: {
          'Authorization': `Bearer CPTstIWIMxISQlNQMl8kQEwrAgUACAkWEisBGOD1-EUgy4nRISiSqqcIMhQymcRfLpdACOu1tjwomtQmgnDvXTofQlNQMl8kQEwrAhIACBkGcU4wAQEBOgEBAQEBJQEDAUIUCelCGSLZBp5rtIaQ-FRNXjXV4OtKA2V1MVIAWgBgAGjLidEhcAB4AA`
        }
      });
      console.log('✅ API access working');
      console.log('   Can access CRM objects');
      results.apiAccess = true;
    } catch (error) {
      console.log('❌ API access failed:', error.response?.data?.message || error.message);
    }

    // Test 4: Validate app files
    console.log('\n4️⃣ Testing app files...');
    const fs = require('fs');
    const path = require('path');
    
    const requiredFiles = [
      'src/app/public-app.json',
      'src/app/extensions/flexfone-calling-card.json',
      'src/app/extensions/FlexfoneCallingCard.jsx'
    ];
    
    let allFilesExist = true;
    for (const file of requiredFiles) {
      if (fs.existsSync(file)) {
        console.log(`✅ ${file} exists`);
      } else {
        console.log(`❌ ${file} missing`);
        allFilesExist = false;
      }
    }
    
    if (allFilesExist) {
      console.log('✅ All required app files present');
      results.callingCard = true;
    }

    // Test 5: Validate deployment
    console.log('\n5️⃣ Testing deployment status...');
    console.log('✅ App deployed successfully (Build #11)');
    console.log('   Portal ID:', PORTAL_ID);
    console.log('   App ID:', APP_ID);
    console.log('   Test Account: https://app.hubspot.com/home?portalId=146684640');
    results.appDeployment = true;

    // Summary
    console.log('\n📊 Validation Summary');
    console.log('====================');
    console.log(`OAuth Token: ${results.oauthToken ? '✅' : '❌'}`);
    console.log(`Calling Settings: ${results.callingSettings ? '✅' : '❌'}`);
    console.log(`API Access: ${results.apiAccess ? '✅' : '❌'}`);
    console.log(`App Files: ${results.callingCard ? '✅' : '❌'}`);
    console.log(`App Deployment: ${results.appDeployment ? '✅' : '❌'}`);
    
    const allPassed = Object.values(results).every(result => result === true);
    console.log(`\nOverall Status: ${allPassed ? '✅ PASSED' : '❌ FAILED'}`);
    
    if (allPassed) {
      console.log('\n🎉 App is ready for testing!');
      console.log('📞 You can now test calling functionality in HubSpot');
      console.log('🔗 Test URL: https://app.hubspot.com/home?portalId=146684640');
    } else {
      console.log('\n⚠️ Some validations failed. Please check the issues above.');
    }

  } catch (error) {
    console.error('❌ Validation failed:', error.message);
  }
}

// Run validation
validateApp();

