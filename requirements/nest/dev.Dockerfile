# it's based on debian!
FROM node:20.5

RUN npm i -g @nestjs/cli

EXPOSE 3000/tcp
EXPOSE 5555/tcp

# set comamnd prompt to indicate the container
RUN echo 'PS1="nest \w > "' >> ~/.bashrc

RUN mkdir -p /script
COPY dev.entrypoint.sh /script/entrypoint.sh
RUN chmod +x /script/entrypoint.sh

WORKDIR /backend

ENTRYPOINT ["/script/entrypoint.sh"]
CMD [ "nest", "start", "--watch", "--preserveWatchOutput" ]
