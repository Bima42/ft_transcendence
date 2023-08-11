# Index
- ### [1. PostgreSQL](#configure-postgresql)
    - ##### [1.1 Docker compose](#docker-compose)
- ### [2. Adminer](#configure-adminer)
  - ##### [2.1 Docker compose](#docker-compose)
  - ##### [2.2 Connect to your database](#connect-to-your-database)
- ### [3. Prisma](#prisma)
    - ##### [3.1 Install Prisma](#install-prisma)
    - ##### [3.2 Create Prisma schema](#prisma-schema)
    - ##### [3.3 Generate Prisma client](#prisma-client)
      - ###### [3.3.1 Prisma Module](#prisma-module)
      - ###### [3.3.2 Prisma Service](#prisma-service)
    - ##### [3.3 Migrate your database](#migration)
    - ##### [3.4 Seed your database](#seed-your-database)
- ### [Previous Docs : Install and Create Nest project](1-install-and-create-nest-project.md)
- ### [Next Docs: Database Schema](3-database-structure.md)
***

# Configure PostgreSQL
## Docker compose
- Set your environment variables in your .env file
- Add this to your `docker-compose.yml`
```yaml
  db:
    image: postgres:15.1-alpine
    container_name: transcendence-db
    restart: always
    environment:
      - POSTGRES_HOST=${POSTGRES_HOST}
      - POSTGRES_PORT=${POSTGRES_PORT}
      - POSTGRES_DB=${POSTGRES_DB}
      - POSTGRES_USER=${POSTGRES_USER}
      - POSTGRES_PASSWORD=${POSTGRES_PASSWORD}
    volumes:
      - 'data:/var/lib/postgresql/data'
    expose:
      - '5432'
    networks:
      - transcendence
```

# Configure Adminer
## Docker compose
```yaml
  adminer:
    image: adminer
    container_name: transcendence-adminer
    restart: always
    environment:
      - ADMINER_DEFAULT_SERVER=db
    ports:
      - '8080:8080'
    networks:
      - transcendence
```
## Connect to your database
- In your docker-compose.yml, you have to set the environment variable ADMINER_DEFAULT_SERVER to the name of your database service (here `db`)
- Go to http://localhost:8080
- Connect with your database credentials, you should be able to see your database

# Prisma
## Install Prisma
- You should check the [official documentation](https://www.prisma.io/blog/nestjs-prisma-rest-api-7D056s1BmOL0) which is very well done
- In your nest project, install prisma
```bash
npm install prisma --save-dev
```
- Initialize prisma
```bash
npx prisma init
```
- You should have a new folder `prisma` with a `schema.prisma` file inside
- Think about adding the `DATABASE_URL` environment variable in your backend container

```
DATABASE_URL="postgres://myuser:mypassword@localhost:5432/db"
```

## Prisma schema
- You can find the documentation [here](https://www.prisma.io/docs/concepts/components/prisma-schema)
- First, you have to define your database connection
```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```
- Then, you can define your models
```prisma
model User {
  id        Int      @id @default(autoincrement())
  email     String   @unique
  name      String?
  posts     Post[]
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```
- You can also define relations between your models
```prisma
model Post {
  id        Int      @id @default(autoincrement())
  title     String
  content   String?
  published Boolean  @default(false)
  author    User?    @relation(fields: [authorId], references: [id])
  authorId  Int?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```
- Your `prisma.schema` file will be used to generate your database schema, and so need to contain all the information about your database

## Prisma client
- You need to generate your prisma client to be able to use it in your nest project
```bash
npm install @prisma/client
```

## Install Prisma for NestJS
- There is a simple example [here](https://docs.nestjs.com/recipes/prisma#use-prisma-client-in-your-nestjs-services)
- You need to create a PrismaService and a PrismaModule
### Prisma Module
```typescript
import { Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

/**
 * Any module that imports the PrismaModule will have access to PrismaService
 */
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
```
- Think about add it in your `app.module.ts`

### Prisma Service
- Here is a simple example of a PrismaService
```typescript
import { INestApplication, Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';


@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    await this.$connect();
  }

  /**
   * Ensure application shuts down gracefully.
   */
  async enableShutdownHooks(app: INestApplication) {
    this.$on('beforeExit', async () => {
      await app.close();
    });
  }
}
```

## Migration
- You can find the documentation [here](https://www.prisma.io/docs/concepts/components/prisma-migrate)
- If you want to update your database schema, you need to create a migration file that will be created in the `prisma/migrations` folder on schema changes
- You can then apply your migration directly in your container

```bash
npx prisma migrate dev
```

- You can also use `npx prisma migrate deploy` to apply all migrations

## Seed your database
- You should think about seeding your database with some data to test your application
- [This article](https://www.prisma.io/blog/nestjs-prisma-rest-api-7D056s1BmOL0#seed-the-database) explains how to do it
- You need to create a `seed.ts` file in your `prisma` folder
- You can then run `npx prisma db seed --preview-feature` to seed your database

### [Back to top](#index)
### [Back to summary](../Summary.md)
