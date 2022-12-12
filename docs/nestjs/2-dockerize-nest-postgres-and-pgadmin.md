<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow"></a>
</p>

***
# Index
***
- ### [1. Getting Started](#getting-started)
- ### [2. NestJS part](#nestjs-part)
  - ##### [2.1 NestJS dockerfile](#nestjs-dockerfile)
  - ##### [2.2 Docker compose for nest](#docker-compose-for-nest)
- ### [3. PGAdmin part](#pgadmin-part)
  - ##### [3.1 Environment variables pgadmin](#environment-variables-pgadmin)
  - ##### [3.2 Docker compose for pgadmin](#docker-compose-for-pgadmin)
- ### [4. Postgres part](#postgres-part)
  - ##### [4.1 Environment variables postgres](#environment-variables-postgres)
  - ##### [4.2 Docker compose for postgres](#docker-compose-for-postgres)
- ### [5. Docker Compose File](#docker-compose-file)
- ### [6. Launch Project](#launch-project)
- ### [7. Create Database](#create-database)
- ### [7. Create Database with pgadmin](3-create-table-in-database.md)

# Getting Started
- From here, you already have a nest project created
- Here is an example of the file tree
```
├─ .env
├─ docker-compose.yml
└─ backend/
   ├─ src/
       └─ main.ts
   ├─ test/
   ├─ package.json
   ├─ package-lock.json
   └─ Dockerfile
```

# NestJS part
***
## NestJS dockerfile
- Create a Dockerfile at the root of your nest project
- This is a simple Dockerfile based on node for alpine ([image](https://hub.docker.com/_/node))

```dockerfile
# Base
FROM node:19-alpine3.15

WORKDIR /server

COPY package*.json ./

RUN npm install

CMD ["npm", "run", "start:dev"]
```

## Docker compose for nest
```yml
networks:
  backend: {}

services:
  backend:
    image: backend
    container_name: my-server
    build:
      context: ./backend
    networks:
      - backend
    env_file:
      - .env
    volumes:
      - './backend:/server'
      - '/server/node_modules'
    ports:
      - '3000:3000'
    depends_on:
      - db
```

- We create a `network` for `backend`, `db` and `pgadmin`. Used to protect datas from other containers if we want to add a frontend container for example

# PGAdmin part
***
- Web-based GUI tool used to interact with the Postgres database sessions, both locally and remote servers as well
- You can use it to perform any sort of database administration required for a Postgres database

## Environment variables pgadmin
- There is some variables we used for this tutorial
```
PGADMIN_DEFAULT_EMAIL=admin@42lausanne.ch
PGADMIN_DEFAULT_PASSWORD=password
```

## Docker compose for pgadmin
```yml
  pgadmin:
    image: dpage/pgadmin4
    container_name: my-pgadmin
    restart: always
    networks:
      - backend
    env_file:
      - .env
    ports:
      - '5050:80'
    depends_on:
      - db
```
- `Port 5050` is open to connect to pgadmin and manage your databases 

# Postgres part
***
- We gonna pass directly by docker compose file
- We use official image for postgres ([Image](https://hub.docker.com/_/postgres))
- You can find a lot of information according to this image on Docker Hub

## Environment variables postgres
- There is some variables we used for this tutorial
```
POSTGRES_HOST=db
POSTGRES_PORT=5432
POSTGRES_DB=postgres
POSTGRES_USER=user
POSTGRES_PASSWORD=mypassword
```

## Docker compose for postgres
```yml
  db:
    image: postgres:15.1-alpine
    container_name: my-db
    restart: always
    networks:
      - backend
    env_file:
      - .env
    volumes:
      - 'data:/var/lib/postgresql/data'
    ports:
      - '5432:5432'
  
volumes:
  data:
```

- By default, postgres set the data folder in `/var/lib/postgresql/data`
- We create a volume to keep data store locally on the host

# Docker Compose File
***
```yml
version: '3.7'

networks:
  backend: {}

services:
  backend:
    image: backend
    container_name: my-server
    build:
      context: ./backend
    networks:
      - backend
    env_file:
      - .env
    volumes:
      - './backend:/server'
      - '/server/node_modules'
    ports:
      - '3000:3000'
    depends_on:
      - db

  pgadmin:
    image: dpage/pgadmin4
    container_name: my-pgadmin
    restart: always
    networks:
      - backend
    env_file:
      - .env
    ports:
      - '5050:80'
    depends_on:
      - db

  db:
    image: postgres:15.1-alpine
    container_name: my-db
    restart: always
    networks:
      - backend
    env_file:
      - .env
    volumes:
      - 'data:/var/lib/postgresql/data'
    ports:
      - '5432:5432'

volumes:
  data:
```

# Launch project
~~~bash
docker compose up --build
~~~

# Create database
- You can reach pgamin page using `localhost:5050`
- You should ge this page

<p align="center">
  <img src="pgadmin-homepage.png">
</p>

- Once connected, register a server. Give it a name then go to `Connection` menu
  - `Host` : In our case it's the database container `db`
  - `Port` : It's the database port
  - `Maintenance` : Refer to `POSTGRES_DB` variable
  - `User` : Refer to `POSTGRES_USER` variable
  - `Password` : Refer to `POSTGRES_PASSWORD` variable
<p align="center">
  <img src="register-server-pgadmin.png">
</p>

- Press `Save` button and it's done !
- Keep in mind that you can reach your database tables on pgadmin : `Servers` -> `Database name` -> `postgres` -> `Schemas` -> `public` -> `Tables`.


# Sources
***
- <a href="https://docs.nestjs.com/techniques/database" target="_blank">NestJS Database Docs</a>


### [Back to summary](../Summary.md)