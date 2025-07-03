#!/bin/bash

# Manual release script
# Usage: ./manual-release.sh v1.0.3

if [ $# -eq 0 ]; then
    echo "Usage: $0 <tag_name>"
    echo "Example: $0 v1.0.3"
    exit 1
fi

TAG_NAME=$1

echo "Building application..."
npm run build:linux

echo "Checking for build artifacts..."
if [ ! -d "electron-dist" ]; then
    echo "Error: electron-dist directory not found!"
    exit 1
fi

echo "Files in electron-dist:"
ls -la electron-dist/

APPIMAGE_FILE=$(find electron-dist -name "*.AppImage" | head -n 1)
DEB_FILE=$(find electron-dist -name "*.deb" | head -n 1)

if [ -z "$APPIMAGE_FILE" ] || [ -z "$DEB_FILE" ]; then
    echo "Error: Could not find AppImage or DEB file!"
    echo "AppImage: $APPIMAGE_FILE"
    echo "DEB: $DEB_FILE"
    exit 1
fi

echo "Found files:"
echo "AppImage: $APPIMAGE_FILE"
echo "DEB: $DEB_FILE"

echo ""
echo "To manually create a release with these files:"
echo "1. Go to: https://github.com/vkamal-esh/daily-focus-nest/releases/new"
echo "2. Tag version: $TAG_NAME"
echo "3. Release title: Daily Focus Nest $TAG_NAME"
echo "4. Upload these files:"
echo "   - $APPIMAGE_FILE"
echo "   - $DEB_FILE"
echo "5. Click 'Publish release'"
