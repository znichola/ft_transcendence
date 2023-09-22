FROM nginx

EXPOSE 80/tcp

# set comamnd prompt to indicate the container
RUN echo 'PS1="nginx \w > "' >> ~/.bashrc

# docker build -t nginx-server .
# docker run --init --name nginx-server -p 80:4242 nginx-server
# docker exec -it nginx-server zsh