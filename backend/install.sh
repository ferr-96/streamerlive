#!/bin/bash

echo "🚀 StreamerLive Backend Setup"
echo "=============================="
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

echo "✅ Node.js $(node --version) detected"
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
npm install

if [ $? -eq 0 ]; then
    echo "✅ Dependencies installed"
else
    echo "❌ Failed to install dependencies"
    exit 1
fi

echo ""

# Seed database
echo "🌱 Seeding database..."
npm run seed

if [ $? -eq 0 ]; then
    echo "✅ Database seeded successfully"
else
    echo "❌ Failed to seed database"
    exit 1
fi

echo ""
echo "=============================="
echo "✨ Setup complete!"
echo ""
echo "To start the server:"
echo "  npm start       (production)"
echo "  npm run dev     (development with auto-reload)"
echo ""
echo "Server will run on http://localhost:5000"
echo "=============================="
