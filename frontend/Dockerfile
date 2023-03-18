# base image
FROM node:18-alpine AS base

# set working directory
WORKDIR /app

# install yarn
RUN apk add --no-cache yarn

# install and cache app dependencies
COPY package*.json ./

COPY yarn.lock ./

# run yarn install
RUN yarn install

# Dev target
FROM base AS dev

# change ownership of the node_modules directory to the node user
RUN chown -R node:node /app/node_modules

EXPOSE 8000

# start app
CMD ["yarn", "dev"]
