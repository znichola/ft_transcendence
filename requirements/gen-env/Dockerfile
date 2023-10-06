FROM debian

RUN apt-get update
RUN apt-get install pwgen -y

CMD env && echo hello world $TEST

# docker build -t gen-env . 
# docker run -it gen-env  /bin/bash