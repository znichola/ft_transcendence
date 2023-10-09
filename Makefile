
CONTAINERS = $(shell docker ps -a -q)
TIDY=2>/dev/null ; true

up : env
	docker compose -f docker-compose.yml -p mastermind up --build

fclean : env-clean
	docker stop       $(CONTAINERS)                  $(TIDY)
	docker rm         $(CONTAINERS)                  $(TIDY)
	docker network rm $(shell docker network ls -q)  $(TIDY)
	docker image rm   $(shell docker image ls -q)    $(TIDY)
	docker volume rm  $(shell docker volume ls -q)   $(TIDY)

re : fclean up

ip :
	@docker ps -q | xargs -I{} docker inspect -f '{{.Name}} {{range.NetworkSettings.Networks}}{{.IPAddress}}{{end}}' {}

CN = nest react postgress nginx

$(CN) :
	docker exec -it $@ /bin/bash

# https://stackoverflow.com/questions/31466428/how-to-restart-a-single-container-with-docker-compose
# docker-compose up --detach --build $@

env-clean :
	@[ -f kickstart.env ]   && mv kickstart.env kickstart.env.old || true
	@[ -f .env ]            && rm .env                            || true
	@[ -f ./react-app/env ] && rm ./react-app/.env                || true
	@[ -f ./nestjs/env ]    && rm ./nestjs/.env                   || true
	@printf "\033[31m all .env files removed, kickstart.env renamed to \033[33mkickstart.env.old\033[0m\n"

env-re : env-clean env

env :
	@./gen-env.sh

.PHONY: up fclean re ip $(CN) env
