FROM nginx:1.23-alpine AS base

RUN apk update && apk upgrade \
    && apk add --no-cache --quiet --update \
    	  openssl vim curl bash zsh gettext

# Dev target
FROM base AS dev

# Generate ssl certificate
RUN	mkdir -p /etc/nginx/ssl/private /etc/nginx/ssl/certs
RUN openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
    -keyout /etc/nginx/ssl/private/localhost.key \
    -out /etc/nginx/ssl/certs/localhost.crt \
    -subj "/C=CH/ST=Geneva/L=Geneva/O=42/OU=42/CN=localhost"

# Expose the port the Nginx server will be running on
EXPOSE 80 443

# Start the Nginx server
CMD ["nginx", "-g", "daemon off;"]