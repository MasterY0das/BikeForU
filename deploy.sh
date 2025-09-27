#!/bin/bash

# BikeForU Deployment Script
echo "🚴 Starting BikeForU deployment..."

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Make sure you're in the project root directory."
    exit 1
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Run tests (if any)
echo "🧪 Running tests..."
npm test -- --coverage --watchAll=false

# Build the project
echo "🔨 Building project..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
    echo "📁 Build files are ready in the 'build' directory"
    echo ""
    echo "🚀 Next steps:"
    echo "1. Upload the 'build' folder contents to your web server"
    echo "2. Configure your domain DNS settings"
    echo "3. Update Supabase settings for your production domain"
    echo ""
    echo "📖 See DEPLOYMENT_GUIDE.md for detailed instructions"
else
    echo "❌ Build failed. Please check the errors above."
    exit 1
fi