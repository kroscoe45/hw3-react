#!/bin/bash

# extract-ts-files.sh
# Purpose: Extract TypeScript project files for AI code assistant upload
# This script will copy files to a flat directory structure with paths encoded in filenames
# Example: 'server/types/index.ts' becomes '../upload/server_types_index.ts'

set -e  # Exit on error

# Check if a project directory is provided
if [ -z "$1" ]; then
  echo "Error: No project directory specified."
  echo "Usage: ./extract-ts-files.sh <project_root_directory>"
  exit 1
fi

PROJECT_ROOT=$(realpath "$1")
UPLOAD_DIR="../upload"

# Check if project directory exists
if [ ! -d "$PROJECT_ROOT" ]; then
  echo "Error: Project directory '$PROJECT_ROOT' does not exist."
  exit 1
fi

# Clear and recreate upload directory
rm -rf "$UPLOAD_DIR"
mkdir -p "$UPLOAD_DIR"

echo "Extracting files from: $PROJECT_ROOT"
echo "Files will be saved with flattened paths to: $UPLOAD_DIR"

# Define file types to include
FILE_TYPES=(
  "*.ts"
  "*.tsx"
  "*.js"
  "*.jsx"
  "*.json"
  "*.md"
  "*.css"
  "*.html"
)

# Define directories to exclude
EXCLUDE_DIRS=(
  "node_modules"
  "dist"
  "build"
  "coverage"
  ".git"
)

# Process files
cd "$PROJECT_ROOT"
for TYPE in "${FILE_TYPES[@]}"; do
  find . -type f -name "$TYPE" | while read -r FILE; do
    # Remove the leading ./
    REL_PATH=${FILE#./}
    
    # Skip excluded directories
    SKIP=false
    for EXCLUDE_DIR in "${EXCLUDE_DIRS[@]}"; do
      if [[ "$REL_PATH" == *"$EXCLUDE_DIR"* ]]; then
        SKIP=true
        break
      fi
    done
    
    if [ "$SKIP" = true ]; then
      continue
    fi
    
    # Replace slashes with underscores for the new filename
    NEW_FILENAME=$(echo "$REL_PATH" | tr '/' '_')
    
    # Copy the file to the upload directory
    cp "$REL_PATH" "$UPLOAD_DIR/$NEW_FILENAME"
    
    echo "Copied: $REL_PATH → $NEW_FILENAME"
  done
done

# Count how many files were extracted
FILE_COUNT=$(find "$UPLOAD_DIR" -type f | wc -l)

echo "Done! Extracted $FILE_COUNT files to $UPLOAD_DIR"
echo "You can now upload individual files to your AI assistant."