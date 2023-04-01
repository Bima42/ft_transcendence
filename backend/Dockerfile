# Base
FROM node:18-alpine AS base

ARG UID=1000
ARG GID=1000

EXPOSE 3080
ENTRYPOINT ["entrypoint.sh"]

RUN apk update && apk upgrade \
    && apk add --no-cache --quiet --update shadow dos2unix postgresql-client

# Use the already generated `node` user to run the app
RUN groupmod -g "${GID}" node && usermod -u "${UID}" -g "${GID}" node
USER node

WORKDIR /server

# Copy all files needed for installing dependencies
COPY --chown=node:node package*.json yarn.lock ./

RUN yarn install

# Copy the rest of the source
COPY --chown=node:node . ./

USER root
RUN dos2unix entrypoint.sh \
    && chmod +x entrypoint.sh \
    && mv entrypoint.sh /usr/local/bin

############# DEVELOPMENT ###############
FROM base AS dev

ENV NODE_ENV="development"

CMD ["yarn", "start:dev"]

############# PRODUCTION ###############
FROM base AS prod

ENV NODE_ENV="production"

RUN npx prisma generate && yarn build

CMD ["yarn", "start:prod"]
