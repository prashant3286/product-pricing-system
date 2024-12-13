COMPOSE = docker-compose

.PHONY: build up down logs shell test clean

build:
	$(COMPOSE) build

up:
	$(COMPOSE) up

down:
	$(COMPOSE) down

logs:
	$(COMPOSE) logs -f

shell-backend:
	$(COMPOSE) exec backend python manage.py shell

shell-frontend:
	$(COMPOSE) exec frontend sh

test-backend:
	$(COMPOSE) exec backend python manage.py test

test-frontend:
	$(COMPOSE) exec frontend npm test

clean:
	$(COMPOSE) down -v
	rm -rf node_modules
	find . -type d -name __pycache__ -exec rm -r {} +