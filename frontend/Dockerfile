# base image
FROM node:18-alpine AS base

ARG UID=1000
ARG GID=1000

# install dependencies
RUN apk add --no-cache --update yarn shadow nginx

# Use the already generated `node` user to run the app
RUN groupmod -g "${GID}" node && usermod -u "${UID}" -g "${GID}" node
USER node

# set working directory
WORKDIR /app

# Copy all files needed for installing dependencies
COPY --chown=node:node package*.json yarn.lock ./

# run yarn install
RUN yarn install

# Copy the rest of the source
COPY --chown=node:node . .

EXPOSE 8000

################## DEV ###################
# Dev target
FROM base AS dev
USER node

# start app
CMD ["yarn", "dev"]


################## PROD ##################

FROM base AS prod
USER node

CMD ["yarn", "build"]
