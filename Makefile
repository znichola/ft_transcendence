
CONTAINERS = $(shell docker ps -a -q)
TIDY=2>/dev/null ; true

up :
	docker compose -f docker-compose.yml -p mastermind up --build

fclean :
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

.PHONY: up fclean re ip $(CN)
