# Next Steps for TestCallingApp

## App Configuration

### 1. Install HubSpot CLI
```bash
npm install -g @hubspot/cli@latest
hs auth
```

### 2. Create HubSpot Project
```bash
hs project create
# Vælg: TestCallingApp
# Vælg: /Users/benjaminnygaard/hubspot-public-app-boilerplate/test-TestCallingApp/TestCallingApp
# Vælg: public
```

### 3. Upload to Developer Account
```bash
hs project upload
```

### 4. Install in Test Account
```bash
# Få app ID
hs app list | grep "TestCallingApp"

# Installer app
hs app install --app-id YOUR_APP_ID
```

### 5. Start Development
```bash
cd src/app/extensions
npm install
hs project dev
```

### 6. Set up OAuth Backend
```bash
git clone https://github.com/HubSpot/oauth-quickstart-nodejs.git
cd oauth-quickstart-nodejs
npm install
```

### 7. Configure OAuth
Create a `.env` file:
```
CLIENT_ID=your_client_id_from_developer_account
CLIENT_SECRET=your_client_secret_from_developer_account
REDIRECT_URI=http://localhost:3000/oauth-callback
SCOPES=crm.objects.contacts.read calling.read calling.write
```

## App Structure
```
TestCallingApp/
├── public-app.json          # App konfiguration
├── src/
│   └── app/
│       └── extensions/
│           ├── ExampleCard.jsx    # UI Extension
│           ├── package.json       # Dependencies
│           └── webpack.config.js  # Build config
└── NEXT_STEPS.md           # Denne fil
```

## Scopes Used
- crm.objects.contacts.read
- calling.read
- calling.write

## Development Commands
```bash
# Install dependencies
npm install

# Build for production
npm run build

# Development mode
npm run dev

# Start HubSpot dev server
hs project dev
```
