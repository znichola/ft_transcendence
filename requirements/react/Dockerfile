# it's based on debian!
FROM node:20.5

EXPOSE 6000/tcp

# set comamnd prompt to indicate the container
RUN echo 'PS1="react \w > "' >> ~/.bashrc

# set comamnd prompt to indicate the container
# RUN apt-get install -y zsh vim git
# RUN yes | sh -c "$(curl -fsSL https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh)"

WORKDIR /web

CMD ["tail", "-f", "/dev/null"]

# docker build -t react-server .
# docker run --init --name react-server -p 3000:3000 react-server
# docker exec -it react-server zsh
