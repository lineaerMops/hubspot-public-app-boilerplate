# Vercel Deployment Guide

## 🚀 Deploy til Vercel

### 1. Installer Vercel CLI
```bash
npm install -g vercel
```

### 2. Login til Vercel
```bash
vercel login
```

### 3. Deploy appen
```bash
vercel
```

### 4. Sæt miljøvariabler op
Efter deployment, gå til Vercel dashboard og sæt følgende miljøvariabler:

```
HUBSPOT_CLIENT_ID=9055da32-6363-46ab-b4e7-1af284cf80de
HUBSPOT_CLIENT_SECRET=3da2d0e7-b8dc-4a5d-8ab9-30bf0ff188e2
REDIRECT_URI=https://hubspot-public-app-boilerplate.vercel.app/oauth-callback
```

### 5. Opdater HubSpot App konfiguration
1. Gå til HubSpot Developer Account
2. Find FlexfoneCallingApp
3. Opdater Redirect URI til: `https://hubspot-public-app-boilerplate.vercel.app/oauth-callback`

## 🔧 Lokal Development

For lokal development, kør:
```bash
npm start
```

## 📋 Miljøvariabler

- `HUBSPOT_CLIENT_ID`: Din HubSpot app Client ID
- `HUBSPOT_CLIENT_SECRET`: Din HubSpot app Client Secret  
- `REDIRECT_URI`: OAuth callback URL (sættes automatisk af Vercel)
- `NODE_ENV`: Sæt til 'production' på Vercel

## 🌐 Vercel URLs

Efter deployment får du en URL som:
- `https://hubspot-public-app-boilerplate.vercel.app`
- `https://hubspot-public-app-boilerplate.vercel.app/oauth-callback` (OAuth callback)
- `https://hubspot-public-app-boilerplate.vercel.app/health` (Health check)
