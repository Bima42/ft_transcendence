# base image
FROM node:19-alpine3.15

# set working directory
WORKDIR /app

# install and cache app dependencies
COPY package*.json ./

# install yarn
RUN apk add --no-cache yarn

# run yarn install
RUN yarn install

# change ownership of the node_modules directory to the node user
RUN chown -R node:node /app/node_modules

# start app
CMD ["yarn", "run", "dev"]
