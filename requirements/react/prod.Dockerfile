FROM node:20.5

COPY react-app /app

WORKDIR /app

RUN npm i -g vite
RUN npm i

COPY requirements/react/prod.entrypoint.sh /entrypoint.sh

ENTRYPOINT ["/entrypoint.sh"]

CMD ["vite", "build"]