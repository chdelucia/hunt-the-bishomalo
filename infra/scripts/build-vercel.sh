#!/bin/bash
set -e

echo "Starting Vercel build process..."

# Clear previous builds
rm -rf dist

# Reset Nx cache to ensure fresh build
./node_modules/.bin/nx reset

echo "Building Shell: hunt-the-bishomalo..."
./node_modules/.bin/nx build hunt-the-bishomalo --configuration=production

echo "Building Remote: achievements-remote..."
./node_modules/.bin/nx build achievements-remote --configuration=production

echo "Build process completed successfully."
