
CONTAINERS = $(shell docker ps -a -q)
TIDY=2>/dev/null ; true

COMPOSE_FILE=docker-compose-dev.yml
ifdef TRANSCENDANCE_MODE
	COMPOSE_FILE=docker-compose-$(TRANSCENDANCE_MODE).yml
endif

up : env
	env $$(cat env/.docker.env) docker compose -f $(COMPOSE_FILE) -p mastermind up --build

down:
	env $$(cat env/.docker.env) docker compose -f $(COMPOSE_FILE) -p mastermind down

fclean : env-clean
	docker stop       $(CONTAINERS)                  $(TIDY)
	docker rm         $(CONTAINERS)                  $(TIDY)
	docker network rm $(shell docker network ls -q)  $(TIDY)
	docker image rm   $(shell docker image ls -q)    $(TIDY)
	docker volume rm  $(shell docker volume ls -q)   $(TIDY)

re : fclean up

ip :
	@docker ps -q | xargs -I{} docker inspect -f '{{.Name}} {{range.NetworkSettings.Networks}}{{.IPAddress}}{{end}}' {}

CN = nest react postgres nginx

$(CN) :
	docker exec -it $@ /bin/bash

env-clean :
	@./env/clean-env.sh

env-re : env-clean env

env :
	@./env/gen-env.sh

cert:
	mkdir -p requirements/nginx/certs
	openssl req -x509 -newkey rsa:4096 -keyout requirements/nginx/certs/nginx.key -out requirements/nginx/certs/nginx.crt -sha256 -days 365 -nodes -subj "/C=CH/ST=Vaud/L=Renens/O=42Lausanne/OU=The Masterminds/CN=localhost"

.PHONY: up fclean re ip $(CN) env env-clean env-re
