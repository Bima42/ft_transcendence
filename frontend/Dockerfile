# base image
FROM node:19-alpine3.15

# set working directory
WORKDIR /app

# add `/app/node_modules/.bin` to $PATH
ENV PATH /app/node_modules/.bin:$PATH

# install and cache app dependencies
COPY package*.json ./

RUN npm install

RUN chmod 777 node_modules

# start app
CMD ["npm", "run", "dev"]
