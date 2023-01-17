<p align="center">
  <a href="https://docs.docker.com" target="blank"><img src="https://github.com/docker/compose/blob/v2/logo.png?raw=true" alt="Compose Logo" /></a>
</p>

<p align="center">
    <a href="https://github.com/docker/compose/releases/latest" target="_blank"><img src="https://img.shields.io/github/release/docker/compose.svg?style=flat-square" alt="NPM Version" /></a>
    <a href="https://pkg.go.dev/github.com/docker/compose/v2" target="_blank"><img src="https://img.shields.io/github/workflow/status/docker/compose/ci?label=ci&logo=github&style=flat-square"/></a>
    <a href="https://goreportcard.com/report/github.com/docker/compose/v2" target="_blank"><img src="https://goreportcard.com/badge/github.com/docker/compose/v2?style=flat-square" /></a>
    <a href="https://codecov.io/gh/docker/compose" target="_blank"><img src="https://codecov.io/gh/docker/compose/branch/master/graph/badge.svg?token=HP3K4Y4ctu"/></a>
    <a href="https://api.securityscorecards.dev/projects/github.com/docker/compose" target="_blank"><img src="https://api.securityscorecards.dev/projects/github.com/docker/compose/badge" /></a>
</p>

***

# Index
- ### [1. Getting Started](#getting-started)
- ### [2. Docker Compose Reference](#docker-compose-reference)
  - ##### [2.1 build](#build)
  - ##### [2.2 command](#command)
  - ##### [2.3 depends-on](#depends-on)
  - ##### [2.4 environment](#environment)
  - ##### [2.5 expose](#expose)
  - ##### [2.6 networks](#networks)
  - ##### [2.7 restart](#restart)
  - ##### [2.8 volume](#volume)
- ### [3. Sources](#sources)
- ### [Previous Docs : Install Docker](1-install-docker.md)
- ### [Next Docs : Docker Usefull Commands](3-docker-usefull-commands.md)
### [Back to summary](../Summary.md)

***
# Getting Started
- Allows you to start multiple containers at the same time
- **docker-compose.yml**: required file that will serve as a guide to run the containers correctly
- used to describe different containers

~~~yml
version: '3.7'

services:
  my-app:
    image: custom-node
    container_name: my-app
    build: ./app
    volumes:
      - './app:/app'
      - '/app/node_modules'
    ports:
      - '8080:8080'

  backend:
    image: backend
    container_name: my-server
    build:
      context: ./backend
      target: dev
    networks:
      - backend
    env_file:
      - .env
    volumes:
      - './backend:/server'
      - '/server/node_modules'
    ports:
      - '3080:3080'
~~~
<p align="center">
    <em>Example of docker-compose.yml file</em>
</p>

## Docker Compose Reference

### build
***
- Specifies the build configuration for creating container image from source

### command
***
- Overrides the default command declared by the container images
- Can also be a list, similar to Dockerfile

~~~yml
command: bundle exec thin -p 3000

command: [ "bundle", "exec", "thin", "-p", "3000" ]
~~~

### depends-on
***
- Expresses startup and shutdown dependencies between services
- Compose implementations MUST create services in dependency order
- Compose implementations MUST remove services in dependency order

~~~yml
services:
  web:
    build: .
    depends_on:
      - db
      - redis
  redis:
    image: redis
  db:
    image: postgres
~~~
_Here, `db` and `redis` are created before `web`. Then `web`, is removed before `db` and `redis`_

### environment
***
- Defines environment variables set in the container
- Can use either array or map
- Boolean should be enclosed in QUOTE
- Array syntax :

~~~yml
environment:
  - RACK_ENV=development
  - SHOW=true
  - USER_INPUT
~~~

### expose
***
- Defines ports that Compose implementation MUST expose from container
- Ports **must be accessible to linked services and should not be published to the host machine**

~~~yml
expose:
  - "3000"
  - "8000"
~~~

### networks
***
- Defines the networks that service containers are attached to

~~~yml
services:
  some-service:
    networks:
      - some-network
      - other-network
~~~

### ports
***
- Expose container ports
- Port mapping MUST NOT be used with `network_mode: host`

~~~yml
ports:
  - "3000"
  - "3000-3005"
  - "8000:8000"
  - "9090-9091:8080-8081"
  - "49100:22"
~~~

### restart
***
- Define the policy that platform will apply on container termination
  - `no`: The default restart policy. Does not restart a container under any circumstances.
  - `always`: The policy always restarts the container until its removal.
  - `on-failure`: The policy restarts a container if the exit code indicates an error.
  - `unless-stopped`: The policy restarts a container irrespective of the exit code but will stop restarting when the service is stopped or removed.

~~~yml
restart: always
~~~

### volume
***
- Defines mount hosts paths or named volumes that MUST be accessible by service containers
- If the mount is a host path and only used by a single service, it MAY be declared as part of the service definition instead of the top-level volumes key.
- To reuse a volume across multiple services, a named volume MUST be declared in the top-level volumes key.

_This example shows a named volume (db-data) being used by the backend service, and a bind mount defined for a single service_

~~~yml
services:
  backend:
    image: awesome/backend
    volumes:
      - type: volume
        source: db-data
        target: /data
        volume:
          nocopy: true
      - type: bind
        source: /var/run/postgres/postgres.sock
        target: /var/run/postgres/postgres.sock

volumes:
  db-data:
~~~
- There is some target :
  - `type`: the mount type volume, bind, tmpfs or npipe
  - `source`: the source of the mount, a path on the host for a bind mount, or the name of a volume defined in the top-level volumes key. Not applicable for a tmpfs mount.
  - `target`: the path in the container where the volume is mounted
  - `read_only`: flag to set the volume as read-only

***

### EVERYTHING IS [HERE](https://docs.docker.com/compose/compose-file/)

# Sources

- <a href="https://docs.docker.com/compose/" target="_blank">Docker Compose Homepage</a>
- <a href="https://docs.docker.com/compose/compose-file/compose-file-v3/" target="_blank">Docker Compose References and Docs</a>

### [Back to summary](../Summary.md)