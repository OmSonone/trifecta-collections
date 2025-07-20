#!/bin/bash

# Build script that handles both local development (SQLite) and production (PostgreSQL)

echo "Starting build process..."

# Generate Prisma client
echo "Generating Prisma client..."
npx prisma generate

# Check if we're using PostgreSQL (production)
if [[ "$DATABASE_URL" == postgresql* ]] || [[ "$DATABASE_URL" == postgres* ]]; then
  echo "PostgreSQL detected, pushing database schema..."
  npx prisma db push --accept-data-loss
else
  echo "Non-PostgreSQL database detected, skipping db push..."
fi

# Build Next.js application
echo "Building Next.js application..."
npx next build

echo "Build complete!"
