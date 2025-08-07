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
HUBSPOT_CLIENT_ID=your_hubspot_client_id_here
HUBSPOT_CLIENT_SECRET=your_hubspot_client_secret_here
REDIRECT_URI=https://your-app-name.vercel.app/oauth-callback
```

### 5. Opdater HubSpot App konfiguration
1. Gå til HubSpot Developer Account
2. Find FlexfoneCallingApp
3. Opdater Redirect URI til: `https://your-app-name.vercel.app/oauth-callback`

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
- `https://your-app-name.vercel.app`
- `https://your-app-name.vercel.app/oauth-callback` (OAuth callback)
- `https://your-app-name.vercel.app/health` (Health check)
