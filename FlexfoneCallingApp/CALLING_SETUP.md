# Flexfone Calling App Setup

## Calling Settings Activation

For at aktivere calling funktionaliteten skal du kalde HubSpot's calling settings API.

### 1. Få din Developer Account API Key

1. Gå til [HubSpot Developer Account](https://developers.hubspot.com/)
2. Naviger til **Settings > Account Setup > Integrations > API Keys**
3. Kopier din **Developer Account API Key**

### 2. Opdater scriptet

Åbn `activate-calling-settings.js` og opdater:
```javascript
const DEVELOPER_ACCOUNT_API_KEY = 'din_developer_account_api_key';
```

### 3. Kør scriptet

```bash
node activate-calling-settings.js
```

### 4. Eller brug curl kommandoen

```bash
chmod +x curl-calling-settings.sh
# Opdater DEVELOPER_ACCOUNT_API_KEY i scriptet
./curl-calling-settings.sh
```

### 5. Manuel curl kommando

```bash
curl --request POST \
  --url 'https://api.hubapi.com/crm/v3/extensions/calling/17421586/settings?hapikey=DIN_API_KEY' \
  --header 'accept: application/json' \
  --header 'content-type: application/json' \
  --data '{
    "name": "Flexfone Calling Widget",
    "url": "https://your-backend-domain.com/flexfone-calling-widget",
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
```

## App Information

- **App ID**: 17421586
- **Portal ID**: 146684640
- **App Name**: FlexfoneCallingApp
- **App UID**: flexfone-calling-app

## Næste skridt

1. **Aktiver calling settings** via API
2. **Upload app** til HubSpot: `hs project upload`
3. **Start development**: `hs project dev`
4. **Test calling interface** i HubSpot test account

## Troubleshooting

### API Key ikke fundet
- Gå til HubSpot Developer Account
- Tjek at du har rettigheder til at se API Keys
- Opret en ny API Key hvis nødvendigt

### App ID ikke fundet
- Tjek at app ID'et er korrekt
- Verificer at app'en er oprettet i developer account

### 401 Unauthorized
- Tjek at API Key er korrekt
- Verificer at API Key har de nødvendige rettigheder

### 404 Not Found
- Tjek at App ID er korrekt
- Verificer at app'en er deployed til HubSpot

