# Base
FROM node:18-alpine AS base

ARG UID=1000
ARG GID=1000

RUN apk update && apk upgrade \
    && apk add --no-cache --quiet --update shadow dos2unix postgresql-client

# Use the already generated `node` user to run the app
RUN groupmod -g "${GID}" node && usermod -u "${UID}" -g "${GID}" node
USER node

WORKDIR /server

# Copy all files needed for installing dependencies
COPY --chown=node:node package*.json yarn.lock ./

RUN yarn install

# Dev target
FROM base AS dev

# Copy the rest of the source
COPY --chown=node:node . ./

USER root
RUN dos2unix entrypoint.sh \
    && chmod +x entrypoint.sh \
    && mv entrypoint.sh /usr/local/bin

EXPOSE 3080
USER node

ENTRYPOINT ["entrypoint.sh"]

# Prod target
