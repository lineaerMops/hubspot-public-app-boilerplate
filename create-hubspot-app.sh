#!/bin/bash

# HubSpot Public App Boilerplate Generator
# GitHub: https://github.com/your-username/hubspot-public-app-boilerplate

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
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

# Check prerequisites
check_prerequisites() {
    print_status "Checking prerequisites..."
    
    # Check if hs CLI is installed
    if ! command -v hs &> /dev/null; then
        print_error "HubSpot CLI not found. Please install with: npm install -g @hubspot/cli@latest"
        exit 1
    fi
    
    # Check if user is authenticated
    if ! hs auth status &> /dev/null; then
        print_error "Not authenticated with HubSpot. Please run: hs auth"
        exit 1
    fi
    
    print_success "Prerequisites check passed"
}

# Main app creation function
create_hubspot_app() {
    local APP_NAME=$1
    local APP_DESCRIPTION=$2
    local SCOPES=$3
    
    if [ -z "$APP_NAME" ] || [ -z "$APP_DESCRIPTION" ] || [ -z "$SCOPES" ]; then
        print_error "Usage: $0 \"AppName\" \"Description\" \"scopes\""
        print_error "Example: $0 \"CallingApp\" \"Calling integration\" \"crm.objects.contacts.read,calling.read,calling.write\""
        exit 1
    fi
    
    print_status "Creating HubSpot public app: $APP_NAME"
    print_status "Description: $APP_DESCRIPTION"
    print_status "Scopes: $SCOPES"
    echo ""
    
    # 1. Create project with boilerplate template
    print_status "Creating project with boilerplate template..."
    hs project create << EOF
$APP_NAME
$(pwd)/$APP_NAME
public
EOF
    
    cd $APP_NAME
    
    # 2. Configure public-app.json
    print_status "Configuring public-app.json..."
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
    
    # 3. Upload to developer account
    print_status "Uploading to developer account..."
    hs project upload
    
    # 4. Get app ID
    APP_ID=$(hs app list | grep "$APP_NAME" | awk '{print $1}')
    
    if [ -z "$APP_ID" ]; then
        print_error "Failed to get app ID. Please check if app was created successfully."
        exit 1
    fi
    
    print_success "App created successfully!"
    print_success "App ID: $APP_ID"
    
    # 5. Create next steps file
    cat > NEXT_STEPS.md << EOF
# Next Steps for $APP_NAME

## App ID: $APP_ID

### 1. Install app in test account
\`\`\`bash
hs app install --app-id $APP_ID
\`\`\`

### 2. Set up OAuth backend
\`\`\`bash
git clone https://github.com/HubSpot/oauth-quickstart-nodejs.git
cd oauth-quickstart-nodejs
npm install
\`\`\`

### 3. Configure OAuth backend
Create a \`.env\` file in the oauth-quickstart-nodejs directory:
\`\`\`
CLIENT_ID=your_client_id_from_developer_account
CLIENT_SECRET=your_client_secret_from_developer_account
REDIRECT_URI=http://localhost:3000/oauth-callback
SCOPES=$(echo $SCOPES | sed 's/,/ /g')
\`\`\`

### 4. Start development
\`\`\`bash
cd src/app/extensions
npm install
hs project dev
\`\`\`

### 5. Find credentials in developer account
- Go to Developer Account → Manage Apps → $APP_NAME → Auth tab
- Copy Client ID and Client Secret to your OAuth backend

### 6. Test in test account
- Go to Test Account → Contacts
- Find a contact and see your app card with "Developing locally" tag
EOF
    
    print_success "Next steps saved to NEXT_STEPS.md"
    echo ""
    print_success "🎉 Your HubSpot public app is ready for development!"
    echo ""
    print_status "Next steps:"
    echo "1. Install app in test account: hs app install --app-id $APP_ID"
    echo "2. Set up OAuth backend (see NEXT_STEPS.md)"
    echo "3. Start development: cd src/app/extensions && npm install && hs project dev"
}

# Main execution
main() {
    echo "🚀 HubSpot Public App Boilerplate Generator"
    echo "=========================================="
    echo ""
    
    check_prerequisites
    create_hubspot_app "$@"
}

# Run main function with all arguments
main "$@"
