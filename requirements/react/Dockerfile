# it's based on debian!
FROM node:20.5

EXPOSE 5173/tcp

# set comamnd prompt to indicate the container
RUN echo 'PS1="react \w > "' >> ~/.bashrc

RUN mkdir -p /script
COPY /config.sh /script
RUN chmod +x /script/config.sh

WORKDIR /app

ENTRYPOINT ["/script/config.sh"]
CMD [ "npm", "run", "dev" ]
