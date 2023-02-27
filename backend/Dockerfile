# Base
FROM node:19-alpine3.15 AS base

RUN apk update && apk upgrade \
    && apk add --no-cache --quiet --update vim curl bash postgresql-client

WORKDIR /server

COPY package*.json ./

COPY yarn.lock ./

# Dev target
FROM base AS dev

RUN yarn install

CMD ["yarn", "start:dev"]

# Prod target