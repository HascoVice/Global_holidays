DOCKER_COMPOSE = docker compose
BACKEND = $(DOCKER_COMPOSE) exec backend

up:
	$(DOCKER_COMPOSE) up --build

start:
	$(DOCKER_COMPOSE) start

stop:
	$(DOCKER_COMPOSE) stop

down:
	$(DOCKER_COMPOSE) down --remove-orphans

install:
	$(BACKEND) pip install

restart:
	$(DOCKER_COMPOSE) restart

refresh:
	$(MAKE) down
	$(MAKE) up

logs:
	$(DOCKER_COMPOSE) logs -f

data:
	$(BACKEND) python /app/scripts/data_cleaning.py

default: up