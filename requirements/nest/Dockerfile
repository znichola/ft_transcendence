# it's based on debian!
FROM node:20.5

RUN npm i -g @nestjs/cli

EXPOSE 3000/tcp

# set comamnd prompt to indicate the container
# RUN apt-get install -y zsh vim git
# RUN yes | sh -c "$(curl -fsSL https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh)"

# set comamnd prompt to indicate the container
RUN echo 'PS1="nest \w > "' >> ~/.bashrc

WORKDIR /web

CMD ["tail", "-f", "/dev/null"]

# docker build -t nest-server .
# docker run --init --name nest-server -p 3000:3000 nest-server
# docker exec -it nest-server zsh
