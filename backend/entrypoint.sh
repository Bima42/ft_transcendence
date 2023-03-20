#!/usr/bin/env bash

# Wait for the app to be mounted
while [ ! -d /server ]; do
    sleep 1
done

# Install dependencies
yarn install

# craft the var from all others:
export DATABASE_URL="postgresql://${POSTGRES_USER:-db}:${POSTGRES_PASSWORD:-mypassword}@${POSTGRES_HOST:-db}:${POSTGRES_PORT:-5432}/${POSTGRES_DB:-postgres}?schema=public"

# First start, create the database and run migrations
npx prisma migrate dev --name init
npx prisma migrate

yarn start:dev
