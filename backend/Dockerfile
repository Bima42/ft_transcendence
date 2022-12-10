FROM node:19-alpine3.15

WORKDIR /server

COPY package*.json ./

RUN npm install

EXPOSE 3080

CMD ["npm", "run", "start:dev"]
