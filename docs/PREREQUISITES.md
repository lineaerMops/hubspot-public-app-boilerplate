# Prerequisites for HubSpot Public App Development

## 1. HubSpot Developer Account

### Opret Developer Account
1. Gå til [HubSpot Developers](https://developers.hubspot.com/)
2. Klik "Sign up for free"
3. Udfyld din information
4. Verificer din email

### Sign up for UI Extensions Beta
1. Gå til [UI Extensions Beta](https://developers.hubspot.com/docs/api/public-apps/ui-extensions)
2. Klik "Sign up for the beta"
3. Følg instruktionerne
4. Vent på godkendelse (kan tage 24-48 timer)

## 2. HubSpot CLI Installation

### Install CLI
```bash
npm install -g @hubspot/cli@latest
```

### Authenticate
```bash
hs auth
```

### Verificer Installation
```bash
hs --version
hs auth status
```

## 3. Test Account Setup

### Opret Test Account
1. Gå til din developer account
2. Klik "Create test account"
3. Udfyld account information
4. Vælg plan (Free er tilstrækkelig)

### Test Account vs Developer Account
- **Developer Account**: Her udvikler du din app
- **Test Account**: Her tester du din app

## 4. Node.js og npm

### Install Node.js
```bash
# Download fra nodejs.org eller brug nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
nvm install 18
nvm use 18
```

### Verificer Installation
```bash
node --version
npm --version
```

## 5. Git

### Install Git
```bash
# macOS
brew install git

# Ubuntu/Debian
sudo apt-get install git

# Windows
# Download fra git-scm.com
```

### Konfigurer Git
```bash
git config --global user.name "Dit Navn"
git config --global user.email "din.email@example.com"
```

## 6. Code Editor

### Anbefalede Editors
- **VS Code**: Gratis, mange extensions
- **WebStorm**: Betalt, fuld IDE
- **Sublime Text**: Hurtig, letvægt

### VS Code Extensions
```json
{
  "recommendations": [
    "esbenp.prettier-vscode",
    "bradlc.vscode-tailwindcss",
    "ms-vscode.vscode-typescript-next"
  ]
}
```

## 7. Browser Extensions

### Chrome Extensions
- **React Developer Tools**
- **Redux DevTools** (hvis du bruger Redux)
- **JSON Formatter**

## 8. API Keys og Credentials

### Developer Account API Key
1. Gå til developer account
2. Klik "Settings" → "Integrations" → "API Keys"
3. Opret ny API key
4. Gem den sikkert

### Test Account API Key
1. Gå til test account
2. Klik "Settings" → "Integrations" → "API Keys"
3. Opret ny API key
4. Gem den sikkert

## 9. OAuth Backend

### Node.js OAuth Quickstart
```bash
git clone https://github.com/HubSpot/oauth-quickstart-nodejs.git
cd oauth-quickstart-nodejs
npm install
```

### Environment Variables
```bash
# .env
CLIENT_ID=your_client_id_from_developer_account
CLIENT_SECRET=your_client_secret_from_developer_account
REDIRECT_URI=http://localhost:3000/oauth-callback
SCOPES=crm.objects.contacts.read calling.read calling.write
```

## 10. Verificer Setup

### Test CLI
```bash
hs auth status
hs app list
```

### Test OAuth
```bash
cd oauth-quickstart-nodejs
npm start
# Gå til http://localhost:3000
```

### Test Development
```bash
# Opret test app
./create-hubspot-app.sh "TestApp" "Test app" "crm.objects.contacts.read"

# Start development
cd TestApp/src/app/extensions
npm install
hs project dev
```

## Troubleshooting

### CLI Problemer
```bash
# Reinstall CLI
npm uninstall -g @hubspot/cli
npm install -g @hubspot/cli@latest

# Clear cache
hs auth logout
hs auth
```

### OAuth Problemer
- Tjek at redirect URI matcher
- Verificer Client ID/Secret
- Tjek scopes i app konfiguration

### Development Problemer
- Tjek at test account er valgt
- Verificer at app er installeret
- Tjek browser console for fejl
