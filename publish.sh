#!/bin/bash

function gh {
  /c/Program\ Files/GitHub\ CLI/gh.exe "$@"
}

# Publish script: Tag version, create a GitHub release, and upload binary to the release

# Exit if any command fails
set -e

# 1. Read the current version from package.json
NEW_VERSION=$(node -e "console.log(require('./package.json').version);")
echo "Publishing version: $NEW_VERSION"

# 2. Check if .dest-path exists
if [ ! -f .dest-path ]; then
    echo "Error: .dest-path file not found!"
    exit 1
fi

# 3. Read the destination path from the .dest-path file
DEST_BASE_PATH=$(cat .dest-path)
echo "Destination base path: $DEST_BASE_PATH"

# 4. Define the expected binary name and path
EXE_NAME="shadow-camera-viewer-$NEW_VERSION-setup.exe"
SOURCE_PATH="dist/$EXE_NAME"
DEST_PATH="$DEST_BASE_PATH/$EXE_NAME"

# 5. Verify the binary exists
if [ ! -f "$SOURCE_PATH" ]; then
    echo "Error: $SOURCE_PATH not found! Please make sure the build is complete before publishing."
    exit 1
fi

# 6. Tag the new version in Git
#git tag -a "v$NEW_VERSION" -m "Release version $NEW_VERSION"
git push origin "v$NEW_VERSION"
echo "Git tag v$NEW_VERSION pushed to remote"

# 7. Create a GitHub release using GitHub CLI (gh)
echo "Creating GitHub release for v$NEW_VERSION..."
gh release create "v$NEW_VERSION" "$SOURCE_PATH" --title "Shadow Camera Viewer v$NEW_VERSION" --notes "Release version $NEW_VERSION"
echo "GitHub release created for v$NEW_VERSION and $EXE_NAME uploaded"

echo "Publish process completed successfully!"
