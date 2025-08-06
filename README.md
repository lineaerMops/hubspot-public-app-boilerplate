# HubSpot Public App Boilerplate

🚀 En komplet boilerplate til at oprette HubSpot public apps med UI extensions og OAuth integration.

## Prerequisites

1. **HubSpot Developer Account**
   - Opret en developer account på [HubSpot Developers](https://developers.hubspot.com/)
   - Sign up for UI extensions for public apps beta

2. **HubSpot CLI**
   ```bash
   npm install -g @hubspot/cli@latest
   hs auth
   ```

3. **Test Account**
   - Opret en test account i din developer account
   - Dette er hvor du tester din app

## Hurtig Start

### 1. Clone Boilerplate
```bash
git clone https://github.com/your-username/hubspot-public-app-boilerplate.git
cd hubspot-public-app-boilerplate
```

### 2. Opret App
```bash
# Gør scriptet eksekverbart
chmod +x create-hubspot-app.sh

# Opret calling app
./create-hubspot-app.sh "MyCallingApp" "Calling integration med Flexfone" "crm.objects.contacts.read,calling.read,calling.write"

# Opret CRM app
./create-hubspot-app.sh "MyCRMApp" "CRM data integration" "crm.objects.contacts.read,crm.objects.contacts.write"
```

### 3. Installer App
```bash
# Installer i test account
hs app install --app-id YOUR_APP_ID
```

### 4. Start Development
```bash
# Naviger til app directory
cd MyCallingApp

# Start development
cd src/app/extensions
npm install
hs project dev
```

## App Typer

### Calling App
```bash
./create-hubspot-app.sh "CallingApp" "Calling integration" "crm.objects.contacts.read,calling.read,calling.write"
```

### CRM Integration App
```bash
./create-hubspot-app.sh "CRMApp" "CRM integration" "crm.objects.contacts.read,crm.objects.contacts.write,crm.objects.companies.read"
```

### Marketing App
```bash
./create-hubspot-app.sh "MarketingApp" "Marketing integration" "forms.read,forms.write,marketing.read"
```

## Development Workflow

### 1. Developer Portal
- Her opretter du din app
- Her uploader du kode
- Her finder du Client ID/Secret

### 2. Test Account
- Her tester du din app
- Her ser du UI extensions
- Her validerer du funktionalitet

### 3. Local Development
```bash
# Start local dev server
hs project dev

# Vælg test account når promptet kommer
# Gør ændringer i kode
# Se ændringer live
```

### 4. Deploy
```bash
# Upload ændringer
hs project upload

# Deploy til test account
hs project deploy
```

## OAuth Backend Setup

### 1. Download OAuth Quickstart
```bash
git clone https://github.com/HubSpot/oauth-quickstart-nodejs.git
cd oauth-quickstart-nodejs
npm install
```

### 2. Konfigurer Environment
```bash
# Opret .env fil
cat > .env << EOF
CLIENT_ID=your_client_id_from_developer_account
CLIENT_SECRET=your_client_secret_from_developer_account
REDIRECT_URI=http://localhost:3000/oauth-callback
SCOPES=crm.objects.contacts.read calling.read calling.write
EOF
```

### 3. Start OAuth Server
```bash
npm start
```

## App Konfiguration

### public-app.json
```json
{
  "name": "MyApp",
  "label": "My App",
  "description": "App beskrivelse",
  "scopes": [
    "crm.objects.contacts.read",
    "calling.read",
    "calling.write"
  ],
  "auth": {
    "type": "oauth2",
    "scopes": [
      "crm.objects.contacts.read",
      "calling.read",
      "calling.write"
    ]
  },
  "uiExtensions": {
    "crm": {
      "card": {
        "file": "src/app/extensions/ExampleCard.jsx"
      }
    }
  },
  "allowedUrls": [
    "https://your-backend-domain.com"
  ]
}
```

## UI Extensions

### ExampleCard.jsx
```jsx
import React, { useState } from 'react';
import {
  Button,
  Text,
  hubspot,
} from '@hubspot/ui-extensions-react';

hubspot.extend(({ context, runServerlessFunction, actions }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleAction = async () => {
    setIsLoading(true);
    try {
      // Din app logik her
      actions.addAlert({
        message: 'Action completed!',
        type: 'success'
      });
    } catch (error) {
      actions.addAlert({
        message: 'Error: ' + error.message,
        type: 'error'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <Text>Min HubSpot App</Text>
      <Button
        onClick={handleAction}
        disabled={isLoading}
      >
        {isLoading ? 'Loading...' : 'Klik her'}
      </Button>
    </div>
  );
});
```

## Troubleshooting

### Almindelige Problemer

1. **CLI ikke installeret**
   ```bash
   npm install -g @hubspot/cli@latest
   ```

2. **Ikke authenticated**
   ```bash
   hs auth
   ```

3. **App ikke synlig i test account**
   - Tjek at app er installeret: `hs app install --app-id YOUR_APP_ID`
   - Tjek at development server kører: `hs project dev`

4. **OAuth fejl**
   - Verificer Client ID/Secret i developer account
   - Tjek redirect URI i OAuth backend
   - Valider scopes i app konfiguration

### Debug Commands
```bash
# Se app status
hs app list

# Se app details
hs app get --app-id YOUR_APP_ID

# Se logs
hs logs --follow

# Test app
hs app test --app-id YOUR_APP_ID
```

## Portal Navigation

### Developer Portal
- **Apps** → Din public app
- **Auth** tab → Client ID/Secret
- **Settings** → App konfiguration
- **Test** → Test app funktionalitet

### Test Account
- **Contacts** → Se app card
- **Settings** → App installation
- **Reports** → Test data

## Næste Skridt

1. **Customize UI Extensions**
   - Rediger `src/app/extensions/ExampleCard.jsx`
   - Tilføj din app logik
   - Test i test account

2. **OAuth Integration**
   - Sæt OAuth backend op
   - Konfigurer credentials
   - Test OAuth flow

3. **Deploy til Production**
   - Test i test account
   - Upload til developer portal
   - Deploy til production

## Bidrag

1. Fork repository
2. Opret feature branch
3. Commit ændringer
4. Push til branch
5. Opret Pull Request

## License

MIT License - se LICENSE fil for detaljer.

## Support

- **HubSpot Documentation**: [developers.hubspot.com](https://developers.hubspot.com/)
- **HubSpot Community**: [community.hubspot.com](https://community.hubspot.com/)
- **Issues**: [GitHub Issues](https://github.com/your-username/hubspot-public-app-boilerplate/issues)
