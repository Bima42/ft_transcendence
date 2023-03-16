# COLORS
GREEN		= \033[1;32m
RED 		= \033[1;31m
RESET		= \033[0m

all: dev

dev:
	@echo "${GREEN}Building containers in dev mode...${RESET}"
	@docker compose build
	@make up

up:
	@echo -e "${GREEN}Starting containers...${RESET}"
	@docker compose up

detached:
	@echo "${GREEN}Starting containers in detached mode...${RESET}"
	@docker compose up -d

build:
	@echo "${GREEN}Building containers images...${RESET}"
	@docker compose build --no-cache

down:
	@echo "${GREEN}Stopping containers...${RESET}"
	@docker compose down

clean:
	@echo "${GREEN}Cleaning containers...${RESET}"
	@docker compose down -v --remove-orphans
	rm -rf frontend/node_modules backend/node_modules

stop:
	@echo "${GREEN}Stopping containers...${RESET}"
	@docker compose stop

rebuild: clean
	@echo "${GREEN}Rebuilding containers...${RESET}"
	@docker compose up --build --force-recreate

prune: clean
	@echo "${RED}Cleaning all docker environment...${RESET}"
	@docker system prune -a -f --volumes
	rm -rf frontend/node_modules backend/node_modules


.PHONY: dev up detached build down clean stop rebuild prune
