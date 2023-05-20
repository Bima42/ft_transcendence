# Base
FROM node:18-alpine AS dev

ARG UID=1000
ARG GID=1000

ENTRYPOINT ["entrypoint.sh"]

RUN apk update && apk upgrade \
    && apk add --no-cache --quiet --update shadow postgresql-client

# Use the already generated `node` user to run the app
RUN groupmod -g "${GID}" node && usermod -u "${UID}" -g "${GID}" node

USER node
WORKDIR /server

# Copy all files needed for installing dependencies
COPY --chown=node:node package*.json yarn.lock ./

############# DEVELOPMENT ###############


ENV NODE_ENV="development"

RUN yarn install

# Copy the rest of the source
COPY --chown=node:node . ./

USER root
RUN chmod +x entrypoint.sh \
    && mv entrypoint.sh /usr/local/bin

USER node
CMD ["yarn", "start:dev"]

EXPOSE 3080

############# PRODUCTION-BUILDER ###############
FROM dev AS prod-builder

USER node
RUN npx prisma generate && yarn build && yarn install --production


############# PRODUCTION ###############
FROM node:18-alpine AS prod

RUN apk update && apk upgrade && apk add --no-cache --quiet --update postgresql-client

COPY --chmod=755 entrypoint.sh /usr/local/bin

USER node
ENTRYPOINT ["entrypoint.sh"]

WORKDIR /server
COPY --chown=node:node package*.json yarn.lock ./
COPY --chown=node:node prisma ./prisma
COPY --from=prod-builder --chown=node:node /server/dist ./dist
COPY --from=prod-builder --chown=node:node /server/node_modules ./node_modules

ENV NODE_ENV="production"

CMD ["yarn", "start:prod"]

EXPOSE 3080
