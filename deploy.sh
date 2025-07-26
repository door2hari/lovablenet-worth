#!/bin/bash

# Personal Finance Tracker - GitHub Pages Deploy Script

echo "🚀 Deploying Personal Finance Tracker to GitHub Pages..."

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Please run this script from the project root."
    exit 1
fi

# Check if gh-pages is installed
if ! command -v npx &> /dev/null; then
    echo "❌ Error: npx not found. Please install Node.js and npm."
    exit 1
fi

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Build the app
echo "📦 Building the application..."
npm run build

# Check if build was successful
if [ $? -ne 0 ]; then
    echo "❌ Build failed. Please fix the errors and try again."
    exit 1
fi

# Check if dist directory exists
if [ ! -d "dist" ]; then
    echo "❌ Error: dist directory not found after build."
    exit 1
fi

# Deploy to gh-pages branch
echo "🌐 Deploying to GitHub Pages..."
npx gh-pages -d dist

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Deployment complete!"
    echo ""
    echo "🔗 Your app will be available at:"
    echo "   https://$(git config --get remote.origin.url | sed 's/.*github.com[:/]\([^/]*\)\/\([^.]*\).*/\1.github.io\/\2/')/"
    echo ""
    echo "📱 Mobile Access:"
    echo "   - The app is PWA-ready and can be installed on mobile devices"
    echo "   - Visit the deployed URL on your mobile browser"
    echo "   - Look for 'Add to Home Screen' option"
    echo ""
    echo "📝 Important next steps:"
    echo "1. ✅ Update your Supabase redirect URLs to include the GitHub Pages URL"
    echo "2. ✅ Enable GitHub Pages in your repository settings (Settings > Pages)"
    echo "3. ✅ Wait 2-3 minutes for the deployment to complete"
    echo "4. ✅ Test authentication and functionality on the deployed site"
    echo ""
    echo "🔧 For local mobile testing:"
    echo "   - Run 'npm run dev' to start development server"
    echo "   - Find your local IP: 'ipconfig' (Windows) or 'ifconfig' (Mac/Linux)"
    echo "   - Access on mobile: http://YOUR_LOCAL_IP:8080"
else
    echo "❌ Deployment failed. Please check the error messages above."
    exit 1
fi