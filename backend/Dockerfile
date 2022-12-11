# Base
FROM node:19-alpine3.15 AS base

WORKDIR /server

COPY package*.json ./

# Dev target
FROM base AS dev

RUN npm install

CMD ["npm", "run", "start:dev"]

# Prod target