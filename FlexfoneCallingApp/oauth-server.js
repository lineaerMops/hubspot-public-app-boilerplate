const express = require('express');
const axios = require('axios');
const app = express();

// Get port from environment or default to 3000
const port = process.env.PORT || 3000;

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
