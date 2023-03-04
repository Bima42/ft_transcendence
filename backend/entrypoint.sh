#!/usr/bin/env bash

# Wait for the app to be mounted
while [ ! -d /server ]; do
    sleep 1
done

# Install dependencies
yarn install

# First start, create the database and run migrations
npx prisma migrate dev --name init
npx prisma migrate

yarn start:dev