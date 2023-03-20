# base image
FROM node:18-alpine AS base

ARG UID=1000
ARG GID=1000

# install dependencies
RUN apk add --no-cache --update yarn shadow

# Use the already generated `node` user to run the app
RUN groupmod -g "${GID}" node && usermod -u "${UID}" -g "${GID}" node
USER node

# set working directory
WORKDIR /app

# Copy all files needed for installing dependencies
COPY --chown=node:node package*.json yarn.lock ./

# run yarn install
RUN yarn install

# Dev target
FROM base AS dev
USER node

# Copy the rest of the source
COPY --chown=node:node . .

EXPOSE 8000

# start app
CMD ["yarn", "dev"]
