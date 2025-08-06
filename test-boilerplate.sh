#!/bin/bash

# Test script for HubSpot Public App Boilerplate
# This script demonstrates the boilerplate without requiring authentication

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Test boilerplate structure
test_boilerplate() {
    local APP_NAME=$1
    local APP_DESCRIPTION=$2
    local SCOPES=$3
    
    print_status "Testing boilerplate for: $APP_NAME"
    print_status "Description: $APP_DESCRIPTION"
    print_status "Scopes: $SCOPES"
    echo ""
    
    # Create test directory
    TEST_DIR="test-$APP_NAME"
    mkdir -p $TEST_DIR
    cd $TEST_DIR
    
    # Create public-app.json
    print_status "Creating public-app.json..."
    cat > public-app.json << EOF
{
  "name": "$APP_NAME",
  "label": "$APP_NAME",
  "description": "$APP_DESCRIPTION",
  "scopes": ["$(echo $SCOPES | sed 's/,/","/g')"],
  "auth": {
    "type": "oauth2",
    "scopes": ["$(echo $SCOPES | sed 's/,/","/g')"]
  },
  "uiExtensions": {
    "crm": {
      "card": {
        "file": "src/app/extensions/ExampleCard.jsx"
      }
    }
  },
  "allowedUrls": ["https://your-backend-domain.com"]
}
EOF
    
    # Create directory structure
    mkdir -p src/app/extensions
    
    # Create ExampleCard.jsx
    print_status "Creating ExampleCard.jsx..."
    cat > src/app/extensions/ExampleCard.jsx << 'EOF'
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
EOF
    
    # Create package.json
    print_status "Creating package.json..."
    cat > src/app/extensions/package.json << EOF
{
  "name": "$APP_NAME",
  "version": "1.0.0",
  "description": "$APP_DESCRIPTION",
  "main": "ExampleCard.jsx",
  "scripts": {
    "build": "webpack --mode=production",
    "dev": "webpack --mode=development --watch"
  },
  "dependencies": {
    "@hubspot/ui-extensions-react": "^1.0.0",
    "react": "^18.0.0",
    "react-dom": "^18.0.0"
  },
  "devDependencies": {
    "@babel/core": "^7.0.0",
    "@babel/preset-react": "^7.0.0",
    "babel-loader": "^9.0.0",
    "webpack": "^5.0.0",
    "webpack-cli": "^5.0.0"
  }
}
EOF
    
    # Create webpack.config.js
    print_status "Creating webpack.config.js..."
    cat > src/app/extensions/webpack.config.js << 'EOF'
const path = require('path');

module.exports = {
  entry: './ExampleCard.jsx',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'index.js',
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-react'],
          },
        },
      },
    ],
  },
  resolve: {
    extensions: ['.js', '.jsx'],
  },
};
EOF
    
    # Create NEXT_STEPS.md
    print_status "Creating NEXT_STEPS.md..."
    cat > NEXT_STEPS.md << EOF
# Next Steps for $APP_NAME

## App Configuration

### 1. Install HubSpot CLI
\`\`\`bash
npm install -g @hubspot/cli@latest
hs auth
\`\`\`

### 2. Create HubSpot Project
\`\`\`bash
hs project create
# Vælg: $APP_NAME
# Vælg: $(pwd)/$APP_NAME
# Vælg: public
\`\`\`

### 3. Upload to Developer Account
\`\`\`bash
hs project upload
\`\`\`

### 4. Install in Test Account
\`\`\`bash
# Få app ID
hs app list | grep "$APP_NAME"

# Installer app
hs app install --app-id YOUR_APP_ID
\`\`\`

### 5. Start Development
\`\`\`bash
cd src/app/extensions
npm install
hs project dev
\`\`\`

### 6. Set up OAuth Backend
\`\`\`bash
git clone https://github.com/HubSpot/oauth-quickstart-nodejs.git
cd oauth-quickstart-nodejs
npm install
\`\`\`

### 7. Configure OAuth
Create a \`.env\` file:
\`\`\`
CLIENT_ID=your_client_id_from_developer_account
CLIENT_SECRET=your_client_secret_from_developer_account
REDIRECT_URI=http://localhost:3000/oauth-callback
SCOPES=$(echo $SCOPES | sed 's/,/ /g')
\`\`\`

## App Structure
\`\`\`
$APP_NAME/
├── public-app.json          # App konfiguration
├── src/
│   └── app/
│       └── extensions/
│           ├── ExampleCard.jsx    # UI Extension
│           ├── package.json       # Dependencies
│           └── webpack.config.js  # Build config
└── NEXT_STEPS.md           # Denne fil
\`\`\`

## Scopes Used
- $(echo $SCOPES | sed 's/,/\n- /g')

## Development Commands
\`\`\`bash
# Install dependencies
npm install

# Build for production
npm run build

# Development mode
npm run dev

# Start HubSpot dev server
hs project dev
\`\`\`
EOF
    
    print_success "Boilerplate created successfully!"
    print_success "Directory: $TEST_DIR"
    echo ""
    print_status "Files created:"
    echo "- public-app.json"
    echo "- src/app/extensions/ExampleCard.jsx"
    echo "- src/app/extensions/package.json"
    echo "- src/app/extensions/webpack.config.js"
    echo "- NEXT_STEPS.md"
    echo ""
    print_status "Next steps:"
    echo "1. cd $TEST_DIR"
    echo "2. Follow instructions in NEXT_STEPS.md"
    echo "3. hs auth (hvis ikke authenticated)"
    echo "4. hs project create"
    echo "5. hs project upload"
    
    cd ..
}

# Main execution
main() {
    echo "🧪 HubSpot Public App Boilerplate Test"
    echo "====================================="
    echo ""
    
    if [ $# -eq 0 ]; then
        print_error "Usage: $0 \"AppName\" \"Description\" \"scopes\""
        print_error "Example: $0 \"TestApp\" \"Test app\" \"crm.objects.contacts.read,calling.read\""
        exit 1
    fi
    
    test_boilerplate "$@"
}

main "$@"
