#!/usr/bin/env sh

# Wait for the app to be mounted
while [ ! -d /server ]; do
    echo "waiting on volume to be mounted..."
    sleep 1
done

# craft the var from all others:
export DATABASE_URL="postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@${POSTGRES_HOST}:${POSTGRES_PORT:-5432}/${POSTGRES_DB}?schema=public"

# Wait for the database to be started
while ! pg_isready -q --dbname="${POSTGRES_DB}" \
                      --host="${POSTGRES_HOST}" \
                      --port="${POSTGRES_PORT}"; do
    echo "Waiting on database connection... postgresql://${POSTGRES_USER}:<***>@${POSTGRES_HOST}:${POSTGRES_PORT:-5432}/${POSTGRES_DB}?schema=public"
    sleep 1
done


if [ "${NODE_ENV:-production}" = "development" ];then
    echo "Starting in development environment."
    # First start, create the database and run migrations
    if ! npx prisma migrate dev --name init; then
      echo "Cannot initialize the database."
      exit 1
    fi
	npx prisma db seed
else
    echo "Starting in production environment."
    if ! npx prisma migrate deploy ; then
      echo "Cannot initialize the database."
      exit 1
    fi
fi

# Start the server with the specified CMD
exec "$@"
