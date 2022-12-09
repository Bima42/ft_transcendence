# base image
FROM node:12.2.0-alpine

# set working directory
WORKDIR /app

# add `/app/node_modules/.bin` to $PATH
ENV PATH /app/node_modules/.bin:$PATH

# install and cache app dependencies
COPY package.json ./

RUN npm install

RUN mkdir -p node_modules/.cache && chmod -R 777 node_modules/.cache
RUN npm install -g @vue/cli
RUN npm update -g @vue/cli
RUN npm install --save vue-router@next

# start app
CMD ["npm", "run", "serve"]