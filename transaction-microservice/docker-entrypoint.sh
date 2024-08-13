#!/bin/sh

# Run Prisma migrations
npx prisma migrate deploy

# Populate the database
#npx ts-node prisma/seed.ts

# Start the application
npm run start:prod
