# Flexfone Calling App

En simpel HubSpot public app til calling integration med Flexfone.

## Funktioner

- **Demo Calling Interface**: Simulerer opkald til kontakter
- **Contact Integration**: Læser telefonnummer fra HubSpot kontakter
- **Call Logging**: Log opkald til HubSpot (demo version)
- **Webhook Support**: Modtag events når kontakter opdateres

## Installation

### 1. Upload app til HubSpot
```bash
# Fra app mappen
hs project upload
```

### 2. Installer app i test account
```bash
# Få app ID fra developer account
hs app install --app-id YOUR_APP_ID
```

### 3. Start development
```bash
# Start local development
hs project dev
```

## Test Appen

### 1. Find en kontakt
- Gå til HubSpot test account
- Naviger til Contacts
- Vælg en kontakt med telefonnummer

### 2. Test calling interface
- Åbn kontaktens side
- Find "Flexfone Calling" tab
- Klik "Ring op (Demo)" knappen
- Se call status ændringer

### 3. Verificer call logging
- Efter et opkald, tjek at der vises en success besked
- Sidste opkald tidspunkt vises i interfacet

## Næste Skridt

### 1. Flexfone API Integration
```javascript
// I FlexfoneCallingCard.jsx, erstat makeCall funktionen:
const makeCall = async () => {
  // Kald Flexfone API
  const response = await fetch('https://api.flexfone.com/calls', {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer YOUR_FLEXFONE_TOKEN',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      phoneNumber: contactPhone,
      contactId: crmObject?.id
    })
  });
  
  // Håndter response
  if (response.ok) {
    setCallStatus('connected');
  }
};
```

### 2. HubSpot Calling API
```javascript
// Log opkald til HubSpot
const logCallToHubSpot = async () => {
  const response = await fetch(`/crm/v3/objects/calls`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      properties: {
        hs_call_status: 'COMPLETED',
        hs_call_duration: '120',
        hs_call_to_number: contactPhone,
        hs_call_from_number: 'YOUR_NUMBER'
      }
    })
  });
};
```

### 3. Remote Calling Setup
- Konfigurer Flexfone remote calling
- Sæt webhook endpoints op
- Test med rigtige opkald

## Konfiguration

### Environment Variables
```bash
FLEXFONE_API_KEY=your_flexfone_api_key
FLEXFONE_API_URL=https://api.flexfone.com
HUBSPOT_ACCESS_TOKEN=your_hubspot_access_token
```

### Webhook Endpoint
```javascript
// I din backend
app.post('/webhook', (req, res) => {
  const { subscriptionType, objectId, propertyName } = req.body;
  
  if (subscriptionType === 'contact.propertyChange' && 
      (propertyName === 'phone' || propertyName === 'mobilephone')) {
    // Håndter telefonnummer ændring
    console.log('Contact phone updated:', objectId);
  }
  
  res.status(200).send('OK');
});
```

## Troubleshooting

### App vises ikke
- Tjek at app er installeret: `hs app list`
- Verificer at development server kører: `hs project dev`
- Tjek browser console for fejl

### Opkald virker ikke
- Verificer at kontakt har telefonnummer
- Tjek network tab for API kald
- Se console logs for fejl

### Webhooks modtages ikke
- Verificer webhook URL i app konfiguration
- Tjek at backend server kører
- Test webhook endpoint manuelt

## Support

- **HubSpot Documentation**: [developers.hubspot.com](https://developers.hubspot.com/)
- **Flexfone API**: [docs.flexfone.com](https://docs.flexfone.com)
- **Issues**: Opret issue i GitHub repository

## License

MIT License

