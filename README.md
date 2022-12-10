# ft_transcendence
Single Page Application Website. Last project of 42 School

# Launch the project locally

- Go to the project ft_transcendence, inside app folder

```bash
cd ft_transcendence
```

***
### Run containers
- Use `--build` to rebuild images
- Use `--force-recreate` to force recreate image and containers

```bash
docker compose up -d
```

***
### Reach application
- Go to `localhost:8080`

***
### Build image with compose
- If you want to rebuild images using compose
- You can use `--no-cache` with it to build without using cache

```
docker compose build
```

***
### Clean up images and volumes related to services

```
docker compose down --rmi local
```

***
### Clean up environment

```
docker system prune
```

***
### Explore container

```
docker exec -ti my-app sh

docker exec -ti my-server sh
```