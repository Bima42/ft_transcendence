# base image
FROM node:18-alpine

# set working directory
WORKDIR /app

# install and cache app dependencies
COPY package*.json ./

COPY yarn.lock ./

# install yarn
RUN apk add --no-cache yarn

# run yarn install
RUN yarn install

# change ownership of the node_modules directory to the node user
RUN chown -R node:node /app/node_modules

# start app
CMD ["yarn", "dev"]
