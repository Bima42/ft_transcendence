# ft_transcendence
Single Page Application Website. This is the last project of 42 School common core. 
This project is a website that includes a multiplayer pong game.

## Launch the project locally
### Clone the repository
```bash
git clone git@github.com:Bima42/ft_transcendence.git

cd ft_transcendence
```

### Setting up environment variables
- Rename `.env.example` to `.env`
- Change the values of the variables `FORTYTWO_API_UID` and `FORTYTWO_API_SECRET` in `.env` to match your environment
- You should also configure `JWT_KEY` 

### Run containers
- Use `--build` to rebuild images
- Use `--force-recreate` to force recreate image and containers
- Use `-d` to run containers in background

```bash
docker compose up -d
```

### Reach the website
- Go to `https://localhost:4443`

## Documentation
- ### [Summary](docs/Summary.md)
- ### [Docker](docs/docker/0-what-is-docker.md)
- ### [Docker Commands](docs/docker/3-docker-usefull-commands.md)
- ### [Backend](docs/backend/0-what-is-nestjs.md)

## Website overview
### Login

<div style="display: flex; align-items: center">
    <img src="docs/images/login_page.png" alt="Computer Image" width="400" height="auto">
    <img src="docs/images/login_page_mobile.png" alt="Mobile Image" width="400" height="auto">
</div>

### Home
<div style="display: flex; align-items: center">
    <img src="docs/images/home_page.png" alt="Computer Image" width="400" height="auto">
    <img src="docs/images/home_page_mobile.png" alt="Mobile Image" width="400" height="auto">
</div>

### Profile
<div style="display: flex; align-items: center">
    <img src="docs/images/profile_page.png" alt="Computer Image" width="400" height="auto">
    <img src="docs/images/profile_page_mobile.png" alt="Mobile Image" width="400" height="auto">
</div>

### Chat
<div style="display: flex; align-items: center">
    <img src="docs/images/chat_page.png" alt="Computer Image" width="400" height="auto">
    <img src="docs/images/chat_page_mobile.png" alt="Mobile Image" width="400" height="auto">
</div>

#### Chat with a friend
<div style="display: flex; align-items: center">
    <img src="docs/images/chat_with_a_friend.png" alt="Computer Image" width="400" height="auto">
    <img src="docs/images/chat_with_a_friend_mobile.png" alt="Mobile Image" width="400" height="auto">
</div>

### Game
<div style="display: flex; align-items: center">
    <img src="docs/images/game_page.png" alt="Computer Image" width="400" height="auto">
    <img src="docs/images/game_page_mobile.png" alt="Mobile Image" width="400" height="auto">
</div>

#### In game
<div style="display: flex; align-items: center">
    <img src="docs/images/in_game_page.png" alt="Computer Image" width="400" height="auto">
    <img src="docs/images/in_game_page_mobile.png" alt="Mobile Image" width="400" height="auto">
</div>

### Leaderboard
<div style="display: flex; align-items: center">
    <img src="docs/images/leaderboard_page.png" alt="Computer Image" width="400" height="auto">
    <img src="docs/images/leaderboard_page_mobile.png" alt="Mobile Image" width="400" height="auto">
</div>
