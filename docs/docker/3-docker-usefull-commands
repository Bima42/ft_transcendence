<p align="center">
  <a href="https://docs.docker.com" target="blank"><img src="https://cdn.worldvectorlogo.com/logos/docker.svg" width="120" alt="Docker Logo" /></a>
</p>

***

# Index
***
- ### [1. Run containers](#run-containers)
- ### [2. Reach application](#reach-application)
- ### [3. Build image with compose](#build-image-with-compose)
- ### [4. Stop containers related to compose](#stop-containers-related-to-compose)
- ### [5. Explore container](#explore-container)
- ### [6. NestJS Docs](../nestjs/0-what-is-nestjs.md)


***
## Run containers
- Use `--build` to rebuild images when you launch project
```bash
docker compose up --build
```

- Use `--force-recreate` to force recreate image and containers
```bash
docker compose up --force-recreate
```

- Launch in detach mode, you will not see containers log directly in your terminal
```bash
docker compose up -d
```

***
## Reach application
- `localhost:8080` to reach frontend container
- `localhost:5050` to reach pgadmin
- `localhost:3080` to reach backend container
- `localhost:3080/users` to reach users table inside our database

***
## Build image with compose
- If you want to rebuild images using compose
- You can use `--no-cache` with it to build without using cache

```bash
docker compose build
```

***
## Stop containers related to compose

```bash
docker compose down
```

***bash
## Clean up environment
- Clean containers and images not in use
```bash
docker system prune
```

- Remove all volumes
```bash
docker volume rm $(docker volume ls -q)
```
***

## Explore container

```bash
docker exec -ti [CONTAINER_NAME] sh
```

### [Back to homepage](https://github.com/Bima42/ft_transcendence)