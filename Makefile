
CONTAINERS = $(shell docker ps -a -q)
TIDY=2>/dev/null ; true

up :
	docker compose -p mastermind up

fclean :
	docker stop       $(CONTAINERS)                  $(TIDY)
	docker rm         $(CONTAINERS)                  $(TIDY)
	docker network rm $(shell docker network ls -q)  $(TIDY)
	docker image rm   $(shell docker image ls -q)    $(TIDY)
	docker volume rm  $(shell docker volume ls -q)   $(TIDY)

re : fclean up

CN = nest react

$(CN) :
	docker exec -it $@ /bin/bash

.PHONY: fclean re node
