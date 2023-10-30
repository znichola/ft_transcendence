# FT_TRANSCENDENCE
The final project of the common core @ Ecole 42.

## Overview
This project is a web application where connected users can play Pong.
The most important features are:
- A user can login with Ecole 42's OAuth system.
- A user profile with info the user can edit. The user can also upload their own profile picture.
- Users can create chatrooms, which are either public, private or protected by a password.
- Users can send friend requests to others. It's also possible to block users.
- Users can send each other direct messages.
- Users can either challenge another user to play pong or join a matchmaking system.

## Frameworks used
The frontend is written in React with Typescript.
The backend is written in Nestjs, also with Typescript.
The database used is PostgreSQL, and the framework used to interact with it is Prisma.

## Architecture
This project uses Docker.
We have in total 4 containers:
- A container for the backend, running a node server
- A container for our PostgreSQL database
- A throwaway container used to build our frontend react code
- A container running Nginx, which will serve the fontend code and serve as a reverse-proxy to the node server

## Dev vs Prod
We have an architecture for development and an architecture for production.
In development, we use bind mounts containing our source files. React is not in a throwaway container but has it's own server with a hot-reload feature.
Nestjs also rebuild on file change.
In production, we use docker's volumes instead. The only data that really needs to persist in production is that databases data and the uploaded profile pictures.
We also use a third volume so that Nginx can access the React files.

## Notes for building the project
- `make` generates a `kickstart.env` file in the `env/` folder. In this file, you'll need to add the 42API client id and key. You can also choose wether to use 'localhost' or the IP address of the host. But you use the IP address, 42API needs to know about it.
- To change from dev to prod, use `export TRANSCENDANCE_MODE=prod`
- HTTPS is used and requires an SSL certificate when doing make, a self-signed certificate is generated in /requirements/nginx/certs and will be copied into the Nginx container
