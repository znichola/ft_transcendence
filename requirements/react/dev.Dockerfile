# it's based on debian!
FROM node:20.5

EXPOSE 5173/tcp

# set comamnd prompt to indicate the container
RUN echo 'PS1="react \w > "' >> ~/.bashrc

RUN mkdir -p /script
COPY dev.entrypoint.sh /script/entrypoint.sh
RUN chmod +x /script/entrypoint.sh

WORKDIR /app

ENTRYPOINT ["/script/entrypoint.sh"]
CMD [ "npm", "run", "dev" ]
