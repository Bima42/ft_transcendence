# Base
FROM node:18-alpine AS base

RUN apk update && apk upgrade \
    && apk add --no-cache --quiet --update vim curl bash postgresql-client dos2unix

WORKDIR /server

COPY package*.json ./

RUN yarn install

# Dev target
FROM base AS dev

RUN chmod 777 -R ./node_modules

COPY ./entrypoint.sh /usr/local/bin/entrypoint.sh
RUN dos2unix /usr/local/bin/entrypoint.sh

RUN chmod +x /usr/local/bin/entrypoint.sh

ENTRYPOINT ["entrypoint.sh"]

# Prod target