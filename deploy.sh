#!/bin/bash

# Personal Finance Tracker - GitHub Pages Deploy Script

echo "🚀 Deploying Personal Finance Tracker to GitHub Pages..."

# Build the app
echo "📦 Building the application..."
npm run build

# Check if build was successful
if [ $? -ne 0 ]; then
    echo "❌ Build failed. Please fix the errors and try again."
    exit 1
fi

# Deploy to gh-pages branch
echo "🌐 Deploying to GitHub Pages..."
npx gh-pages -d dist

echo "✅ Deployment complete! Your app will be available at:"
echo "🔗 https://$(git config --get remote.origin.url | sed 's/.*github.com[:/]\([^/]*\)\/\([^.]*\).*/\1.github.io\/\2/')/"
echo ""
echo "📝 Don't forget to:"
echo "1. Update your Supabase redirect URLs to include the GitHub Pages URL"
echo "2. Enable GitHub Pages in your repository settings"
echo "3. Wait a few minutes for the deployment to complete"