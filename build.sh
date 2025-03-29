#!/bin/bash

# Build script: Increment version in package.json, run electron-builder, and copy the resulting binary

# Exit if any command fails
set -e

echo "Running react builder..."
npm run build

# 1. Read the current version from package.json
CURRENT_VERSION=$(jq -r '.version' package.json)
echo "Current version: $CURRENT_VERSION"

# 2. Split the version number into major, minor, and patch parts
IFS='.' read -r MAJOR MINOR PATCH <<< "$CURRENT_VERSION"

# 3. Increment the patch version
NEW_PATCH=$((PATCH + 1))

echo "Running react builder to update version..."
npm run build

# 4. Construct the new version
NEW_VERSION="$MAJOR.$MINOR.$NEW_PATCH"
echo "New version: $NEW_VERSION"

# 5. Update the package.json version using jq
jq --arg new_version "$NEW_VERSION" '.version = $new_version' package.json > tmp.json && mv tmp.json package.json

# 6. Commit the changes (optional, comment out if not needed)
git add package.json
git commit -m "Bump version to $NEW_VERSION"

# 7. Run electron-builder to build the app
echo "Running electron-builder..."
npm run build:win

# 8. Check if .dest-path exists
if [ ! -f .dest-path ]; then
    echo "Error: .dest-path file not found!"
    exit 1
fi

# 9. Read the destination path from the .dest-path file
DEST_BASE_PATH=$(cat .dest-path)
echo "Destination base path: $DEST_BASE_PATH"

# 10. Copy the generated binary to the specified destination
EXE_NAME="shadow-camera-viewer-$NEW_VERSION-setup.exe"
SOURCE_PATH="dist/$EXE_NAME"
DEST_PATH="$DEST_BASE_PATH/$EXE_NAME"

if [ -f "$SOURCE_PATH" ]; then
    echo "Copying $EXE_NAME to $DEST_PATH..."
    cp "$SOURCE_PATH" "$DEST_PATH"
    echo "Copied to $DEST_PATH"
else
    echo "Error: $SOURCE_PATH not found!"
    exit 1
fi
