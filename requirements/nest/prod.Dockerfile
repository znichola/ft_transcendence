FROM node:20.5

COPY nestjs /app

WORKDIR /app

RUN npm i -g @nestjs/cli && npm i

COPY requirements/nest/prod.entrypoint.sh /entrypoint.sh

ENTRYPOINT ["/entrypoint.sh"]

CMD ["nest", "start"]