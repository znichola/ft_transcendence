# it's based on debian!
FROM node:20.5

RUN npm i -g @nestjs/cli

EXPOSE 3000/tcp

# set comamnd prompt to indicate the container
RUN echo 'PS1="nest \w > "' >> ~/.bashrc

RUN mkdir -p /script
COPY /config.sh /script
RUN chmod +x /script/config.sh

WORKDIR /backend

ENTRYPOINT ["/script/config.sh"]
CMD [ "nest", "start", "--watch", "--preserveWatchOutput" ]
