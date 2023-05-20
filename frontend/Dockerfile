# base image
FROM node:18-alpine AS base

ARG UID=1000
ARG GID=1000

# install dependencies
RUN apk add --no-cache --update yarn shadow

USER node

# set working directory
WORKDIR /app

# Copy all files needed for installing dependencies
COPY --chown=node:node package*.json yarn.lock ./

# run yarn install
RUN yarn install

# Copy the rest of the source
COPY --chown=node:node . .

################## DEV ###################
# Dev target
FROM base AS dev
USER node

EXPOSE 80

# start app
CMD ["yarn", "dev"]

################## PROD ##################

FROM base AS prod-builder
USER node

# build app
RUN yarn build-only

FROM nginx:1.23-alpine AS prod

# Expose the port the Nginx server will be running on
EXPOSE 80

WORKDIR /app

COPY --from=prod-builder /app/dist /usr/share/nginx/html

# Start the Nginx server
CMD ["nginx", "-g", "daemon off;"]
