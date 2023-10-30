
CONTAINERS = $(shell docker ps -a -q)
TIDY=2>/dev/null ; true

CERT = requirements/nginx/certs

up : prod

prod: env $(CERT)
	docker compose -f docker-compose.yml -p mastermind up --build

dev: env $(CERT)
	docker compose -f docker-compose-dev.yml -p mastermind up --build

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

cert: $(CERT)

$(CERT):
	mkdir -p requirements/nginx/certs
	openssl req -x509 -newkey rsa:4096 -keyout requirements/nginx/certs/nginx.key -out requirements/nginx/certs/nginx.crt -sha256 -days 365 -nodes -subj "/C=CH/ST=Vaud/L=Renens/O=42Lausanne/OU=The Masterminds/CN=localhost"

.PHONY: up fclean re ip $(CN) env env-clean env-re prod dev
