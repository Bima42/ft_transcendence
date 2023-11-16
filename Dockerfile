# Base
FROM node:18-alpine AS dev

ARG UID=1000
ARG GID=1000

EXPOSE 3080
ENTRYPOINT ["entrypoint.sh"]

RUN apk update && apk upgrade \
    && apk add --no-cache --quiet --update shadow postgresql-client

# Use the already generated `node` user to run the app
RUN groupmod -g "${GID}" node && usermod -u "${UID}" -g "${GID}" node
USER node

WORKDIR /server

# Copy all files needed for installing dependencies
COPY --chown=node:node backend/package*.json backend/yarn.lock

ENV NODE_ENV="development"

RUN yarn install

# Copy the rest of the source
COPY --chown=node:node backend/ ./

USER root
RUN dos2unix entrypoint.sh \
    && chmod +x entrypoint.sh \
    && mv entrypoint.sh /usr/local/bin

CMD ["yarn", "start:dev"]

############# FRONTEND   ###############
FROM node:18-alpine AS frontend-builder

USER node

# set working directory
WORKDIR /app

# Copy all files needed for installing dependencies
COPY --chown=node:node frontend/package*.json frontend/yarn.lock ./

# run yarn install
RUN yarn install \
    && mkdir dist

# Copy the rest of the source
COPY --chown=node:node frontend .

# build app
CMD ["yarn", "build-only"]

############# PRODUCTION-BUILDER ###############
FROM dev AS prod-builder

USER node
RUN npx prisma generate
RUN yarn build
RUN yarn install --production

############# PRODUCTION ###############
FROM node:18-alpine AS prod

RUN apk update && apk upgrade && apk add --no-cache --quiet --update postgresql-client

COPY --chmod=755 backend/entrypoint.sh /usr/local/bin

USER node
ENTRYPOINT ["entrypoint.sh"]

WORKDIR /server
COPY --chown=node:node backend/package*.json backend/yarn.lock ./
COPY --chown=node:node backend/prisma ./prisma
COPY --from=prod-builder --chown=node:node /server/dist ./dist
COPY --from=prod-builder --chown=node:node /server/node_modules ./node_modules
COPy --from=frontend-builder --chown=node:node /app/dist ./client

ENV NODE_ENV="production"

CMD ["yarn", "start:prod"]

EXPOSE 3080
