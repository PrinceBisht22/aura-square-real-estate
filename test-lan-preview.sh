#!/bin/bash

# Test script for LAN preview
# This script helps verify the preview server is accessible over LAN

echo "=== Aura Square LAN Preview Test ==="
echo ""

# Check if build exists
if [ ! -d "dist" ]; then
  echo "❌ dist/ directory not found. Run 'npm run build' first."
  exit 1
fi

echo "✅ Build directory exists"
echo ""

# Get local IP
LOCAL_IP=$(ipconfig getifaddr en0 2>/dev/null || ipconfig getifaddr en1 2>/dev/null || hostname -I | awk '{print $1}' 2>/dev/null || echo "192.168.1.33")

echo "📡 Local IP detected: $LOCAL_IP"
echo ""

echo "🚀 Starting preview server..."
echo "   Access at: http://localhost:4173"
echo "   Access at: http://$LOCAL_IP:4173"
echo ""
echo "Press Ctrl+C to stop"
echo ""

# Start preview server
npm run preview:lan

