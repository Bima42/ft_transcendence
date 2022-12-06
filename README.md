# ft_transcendence
Single Page Application Website. Last project of 42 School

# Launch the project locally
- Get the Docker image

```bash
docker pull bima42/my-app
``` 

- Go to the projet ft_transcendence, inside app folder

```bash
cd ft_transcendence/app
```

- Run the container

```bash
docker run -v ${PWD}:/app -v /app/node_modules -p 8080:8080 --rm bima42/my-app
```

- Go to `localhost:8080`
