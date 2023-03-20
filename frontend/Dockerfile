# base image
FROM node:18-alpine AS base

ARG UID=1000
ARG GID=1000

# set working directory
WORKDIR /app

# install yarn
RUN apk add --no-cache --update yarn shadow

# Use the already generated `node` user to run the app
RUN groupmod -g "${GID}" node && usermod -u "${UID}" -g "${GID}" node
USER node

# install and cache app dependencies
COPY --chown=node:node package*.json ./

# run yarn install
RUN yarn install

# Dev target
FROM base AS dev

EXPOSE 8000

# start app
CMD ["yarn", "dev"]
