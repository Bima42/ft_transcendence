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

COPY --chown=node:node package*.json ./

RUN yarn install

# Dev target
FROM base AS dev

COPY --chown=node:node ./entrypoint.sh /usr/local/bin/entrypoint.sh

USER root
RUN dos2unix /usr/local/bin/entrypoint.sh

RUN chmod +x /usr/local/bin/entrypoint.sh

EXPOSE 3080
USER node

ENTRYPOINT ["entrypoint.sh"]

# Prod target
