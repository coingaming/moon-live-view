#!/bin/bash

# Deployment script for Moon Live View Docs to Gigalixir

echo "🚀 Starting deployment to Gigalixir..."

# Check if we're in the right directory
if [ ! -f "mix.exs" ]; then
    echo "❌ Error: mix.exs not found. Make sure you're in the project root directory."
    exit 1
fi

# Check if Gigalixir CLI is installed
if ! command -v gigalixir &> /dev/null; then
    echo "❌ Error: Gigalixir CLI not found. Please install it first:"
    echo "   brew install gigalixir/brew/gigalixir"
    exit 1
fi

# Check if user is logged in
if ! gigalixir auth &> /dev/null; then
    echo "❌ Error: Not logged in to Gigalixir. Please run: gigalixir login"
    exit 1
fi

# Build assets before deployment
echo "📦 Building assets..."
mix assets.deploy

# Deploy to Gigalixir
echo "🌟 Deploying to Gigalixir..."
git push gigalixir main

echo "✅ Deployment complete!"
echo "🌐 Your app should be available at: https://$(gigalixir apps | grep -o '[^[:space:]]*\.gigalixirapp\.com')"

# Show logs
echo "📋 Recent logs:"
gigalixir logs