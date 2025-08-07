const express = require('express');
const axios = require('axios');
const app = express();

// Get port from environment or default to 3000
const port = process.env.PORT || 3000;

// CORS middleware for HubSpot domains
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Credentials', 'true');
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

// OAuth configuration - use environment variables for production
const CLIENT_ID = process.env.HUBSPOT_CLIENT_ID || '9055da32-6363-46ab-b4e7-1af284cf80de';
const CLIENT_SECRET = process.env.HUBSPOT_CLIENT_SECRET || '3da2d0e7-b8dc-4a5d-8ab9-30bf0ff188e2';
const REDIRECT_URI = process.env.REDIRECT_URI || 'https://hubspot-public-app-boilerplate.vercel.app/oauth-callback';
const SCOPES = 'crm.objects.contacts.read crm.objects.contacts.write';

app.use(express.json());

// Serve static files
app.use(express.static('public'));

// OAuth callback endpoint
app.get('/oauth-callback', async (req, res) => {
  const { code, state } = req.query;
  
  console.log('OAuth callback received:');
  console.log('Code:', code);
  console.log('State:', state);
  
  if (!code) {
    return res.status(400).send('Authorization code not found');
  }
  
  try {
    // Exchange authorization code for access token
    const tokenResponse = await axios.post('https://api.hubapi.com/oauth/v1/token', {
      grant_type: 'authorization_code',
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      redirect_uri: REDIRECT_URI,
      code: code
    }, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });
    
    const { access_token, refresh_token, expires_in } = tokenResponse.data;
    
    console.log('Access token received:', access_token);
    console.log('Token expires in:', expires_in, 'seconds');
    
    // Store tokens securely (in production, use a database)
    // For demo purposes, we'll just log them
    console.log('Refresh token:', refresh_token);
    
    // Redirect to success page
    res.send(`
      <html>
        <head>
          <title>OAuth Success</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            .success { color: green; }
            .info { background: #f0f0f0; padding: 10px; border-radius: 5px; margin: 10px 0; }
          </style>
        </head>
        <body>
          <h1 class="success">✅ OAuth Authorization Successful!</h1>
          <div class="info">
            <h3>Flexfone Calling App er nu forbundet til HubSpot</h3>
            <p><strong>Access Token:</strong> ${access_token.substring(0, 20)}...</p>
            <p><strong>Expires in:</strong> ${expires_in} seconds</p>
            <p><strong>Scopes:</strong> ${SCOPES}</p>
          </div>
          <div class="info">
            <h3>Næste skridt:</h3>
            <ol>
              <li>Gå til HubSpot test account</li>
              <li>Find en kontakt med telefonnummer</li>
              <li>Åbn "Flexfone Calling" tab</li>
              <li>Test calling funktionaliteten</li>
            </ol>
          </div>
          <p><a href="https://app.hubspot.com/home?portalId=146684640" target="_blank">Åbn HubSpot Test Account</a></p>
        </body>
      </html>
    `);
    
  } catch (error) {
    console.error('OAuth token exchange failed:', error.response?.data || error.message);
    res.status(500).send(`
      <html>
        <head>
          <title>OAuth Error</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            .error { color: red; }
          </style>
        </head>
        <body>
          <h1 class="error">❌ OAuth Authorization Failed</h1>
          <p>Error: ${error.response?.data?.message || error.message}</p>
          <p>Please check your CLIENT_ID and CLIENT_SECRET configuration.</p>
        </body>
      </html>
    `);
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Flexfone OAuth server is running' });
});

// Calling widget endpoint
app.get('/flexfone-calling-widget', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Flexfone Calling Widget</title>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          margin: 0;
          padding: 20px;
          background: #f8f9fa;
        }
        .widget-container {
          background: white;
          border-radius: 8px;
          padding: 20px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
          max-width: 400px;
        }
        .header {
          display: flex;
          align-items: center;
          margin-bottom: 20px;
        }
        .logo {
          width: 32px;
          height: 32px;
          background: #ff6b35;
          border-radius: 6px;
          margin-right: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: bold;
          font-size: 16px;
        }
        .title {
          font-size: 18px;
          font-weight: 600;
          color: #1a1a1a;
          margin: 0;
        }
        .status {
          display: inline-block;
          padding: 4px 12px;
          background: #10b981;
          color: white;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 500;
        }
        .phone-input {
          width: 100%;
          padding: 12px;
          border: 1px solid #d1d5db;
          border-radius: 6px;
          font-size: 16px;
          margin-bottom: 16px;
        }
        .call-button {
          width: 100%;
          padding: 12px;
          background: #ff6b35;
          color: white;
          border: none;
          border-radius: 6px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.2s;
        }
        .call-button:hover {
          background: #e55a2b;
        }
        .call-button:disabled {
          background: #9ca3af;
          cursor: not-allowed;
        }
        .info {
          margin-top: 16px;
          padding: 12px;
          background: #f3f4f6;
          border-radius: 6px;
          font-size: 14px;
          color: #6b7280;
        }
      </style>
    </head>
    <body>
      <div class="widget-container">
        <div class="header">
          <div class="logo">F</div>
          <div>
            <h1 class="title">Flexfone Calling</h1>
            <span class="status">Online</span>
          </div>
        </div>
        
        <input type="tel" class="phone-input" placeholder="Indtast telefonnummer" id="phoneNumber">
        
        <button class="call-button" onclick="makeCall()" id="callButton">
          Ring op
        </button>
        
        <div class="info">
          <strong>Demo Version</strong><br>
          Dette er en demo af Flexfone Calling integration.<br>
          I produktion vil dette integrere med Flexfone API.
        </div>
      </div>
      
      <script>
        // HubSpot Calling Extensions SDK Integration
        let isInitialized = false;
        let currentCall = null;
        
        // Listen for messages from HubSpot
        window.addEventListener('message', function(event) {
          console.log('Received message from HubSpot:', event.data);
          
          // Handle different message types
          if (event.data.type === 'INIT') {
            console.log('Initializing calling widget...');
            isInitialized = true;
            
            // Send ready response
            window.parent.postMessage({
              type: 'READY',
              data: {
                isReady: true,
                supportsCustomObjects: false,
                capabilities: {
                  canMakeCalls: true,
                  canReceiveCalls: true,
                  canLogCalls: true
                }
              }
            }, '*');
          }
          
          if (event.data.type === 'SYNC') {
            console.log('Received SYNC message from HubSpot');
            
            // Send sync response to HubSpot
            const syncResponse = {
              type: 'SYNC_RESPONSE',
              data: {
                isReady: true,
                isConnected: true,
                currentCall: currentCall,
                capabilities: {
                  canMakeCalls: true,
                  canReceiveCalls: true,
                  canLogCalls: true
                }
              }
            };
            
            console.log('Sending SYNC_RESPONSE to HubSpot:', syncResponse);
            window.parent.postMessage(syncResponse, '*');
            console.log('SYNC_RESPONSE sent successfully');
          }
          
          if (event.data.type === 'OUTGOING_CALL') {
            console.log('Making outgoing call:', event.data.data);
            makeCallFromHubSpot(event.data.data);
          }
          
          if (event.data.type === 'END_CALL') {
            console.log('Ending call');
            endCall();
          }
        });
        
        function makeCallFromHubSpot(callData) {
          const phoneNumber = callData.phoneNumber;
          const button = document.getElementById('callButton');
          
          button.disabled = true;
          button.textContent = 'Ringer...';
          
          // Start real call using WebRTC or phone API
          try {
            // Method 1: Try to use browser's phone capabilities
            if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
              console.log('Starting call using WebRTC...');
              
              // Create a simple WebRTC call simulation
              navigator.mediaDevices.getUserMedia({ audio: true })
                .then(stream => {
                  console.log('Audio stream obtained, simulating call...');
                  
                  // Simulate call connection
                  setTimeout(() => {
                    currentCall = {
                      id: Date.now(),
                      phoneNumber: phoneNumber,
                      status: 'connected',
                      startTime: new Date().toISOString()
                    };
                    
                    button.textContent = 'I samtale';
                    button.onclick = () => endCall();
                    
                    // Notify HubSpot that call started
                    window.parent.postMessage({
                      type: 'CALL_STARTED',
                      data: currentCall
                    }, '*');
                    
                    // Show call duration
                    const callDuration = setInterval(() => {
                      const duration = Math.floor((Date.now() - currentCall.startTime) / 1000);
                      button.textContent = `I samtale (${duration}s)`;
                    }, 1000);
                    
                    // Store interval for cleanup
                    currentCall.durationInterval = callDuration;
                    
                  }, 2000);
                })
                .catch(error => {
                  console.error('Could not access microphone:', error);
                  // Fallback to simple simulation
                  simulateCall(phoneNumber, button);
                });
            } else {
              // Fallback to simple simulation
              simulateCall(phoneNumber, button);
            }
          } catch (error) {
            console.error('Error starting call:', error);
            // Fallback to simple simulation
            simulateCall(phoneNumber, button);
          }
        }
        
        function simulateCall(phoneNumber, button) {
          console.log('Simulating call to:', phoneNumber);
          
          setTimeout(() => {
            currentCall = {
              id: Date.now(),
              phoneNumber: phoneNumber,
              status: 'connected',
              startTime: new Date().toISOString()
            };
            
            button.textContent = 'I samtale';
            button.onclick = () => endCall();
            
            // Notify HubSpot that call started
            window.parent.postMessage({
              type: 'CALL_STARTED',
              data: currentCall
            }, '*');
            
            // Show call duration
            const callDuration = setInterval(() => {
              const duration = Math.floor((Date.now() - currentCall.startTime) / 1000);
              button.textContent = `I samtale (${duration}s)`;
            }, 1000);
            
            // Store interval for cleanup
            currentCall.durationInterval = callDuration;
            
          }, 2000);
        }
        
        function endCall() {
          const button = document.getElementById('callButton');
          
          if (currentCall) {
            // Clear call duration interval
            if (currentCall.durationInterval) {
              clearInterval(currentCall.durationInterval);
            }
            
            // Calculate final duration
            const endTime = new Date();
            const startTime = new Date(currentCall.startTime);
            const duration = Math.floor((endTime - startTime) / 1000);
            
            // Update call data with duration
            const callData = {
              ...currentCall,
              endTime: endTime.toISOString(),
              duration: duration
            };
            
            // Notify HubSpot that call ended
            window.parent.postMessage({
              type: 'CALL_ENDED',
              data: callData
            }, '*');
            
            console.log(`Call ended. Duration: ${duration} seconds`);
            currentCall = null;
          }
          
          button.disabled = false;
          button.textContent = 'Ring op';
          button.onclick = () => makeCall();
        }
        
        function makeCall() {
          const phoneNumber = document.getElementById('phoneNumber').value;
          
          if (!phoneNumber) {
            alert('Indtast venligst et telefonnummer');
            return;
          }
          
          // Use HubSpot SDK if available
          if (window.parent && isInitialized) {
            window.parent.postMessage({
              type: 'OUTGOING_CALL',
              data: {
                phoneNumber: phoneNumber,
                callType: 'outbound'
              }
            }, '*');
          } else {
            // Fallback to local call
            makeCallFromHubSpot({ phoneNumber: phoneNumber });
          }
        }
        
        // Send ready signal when page loads
        window.addEventListener('load', function() {
          console.log('Calling widget loaded');
          window.parent.postMessage({
            type: 'WIDGET_READY',
            data: {
              isReady: true
            }
          }, '*');
        });
      </script>
    </body>
    </html>
  `);
});

// Start server (only if not in Vercel)
if (process.env.NODE_ENV !== 'production') {
  app.listen(port, () => {
    console.log(`🚀 Flexfone OAuth server running on http://localhost:${port}`);
    console.log(`📞 OAuth callback URL: http://localhost:${port}/oauth-callback`);
    console.log('');
    console.log('📋 For at teste appen:');
    console.log('1. Gå til HubSpot Developer Account');
    console.log('2. Find FlexfoneCallingApp');
    console.log('3. Kopier Client ID og Client Secret');
    console.log('4. Opdater CLIENT_ID og CLIENT_SECRET i denne fil');
    console.log('5. Test OAuth flow');
  });
}

module.exports = app;
