# TRANSCENDENCE

Test playground for the final project of the 42 common core.

## How to dev

- clone the repo
- launch vscode for the repo
- install the docker extension
- launch the docker compose with `make up`

Because the node files are present locally, vscode can use them for intelisense so it all works great! 

```bash
make react # to exec into the container, from here you can npm install etc.. 
make nest  # for the nest container
make postgress # self explanitory

make ip    # to show the ips of each container
make re    # to completly remove all container/images/networks/drives from your system

npm create vite@latest my-react-app -- --template react-ts # to install the basic setup for a react app
npm ... to add for the nest app

npm install # if there are already project files, but no node_modules

npm run dev # in the react container, to run the vite dev server with hot reloading
nest start --watch # to start the nest.js server in watchmode
```

When using the react+nestjs branch to launch the development env for the first time:

```bash
git clone git@github.com:znichola/ft_transcendence_test.git
cd ft_transcendence_test
make up

# in a new window navagte back to the same repo
make react
> cd react-app
> npm install
> npm run dev 

# in a new window navagte back to the same repo
make nest
> cd nestjs
> npm install
> nest start --watch


# installation of prisma in the container
make nest
> cd nestjs
> npm install prisma
> npm install @prisma/client

# initialize the database after a make re or for first use
make nest
> cd nestjs
> npx prisma migrate dev
> npx prisma db seed

# to inspect the database data, run from a containerized VS Code
# by default, allows you to access localhost:5555 from your browser
make nest
> cd nestjs
> npx prisma studio

# to 
make nest
> npx prisma db seed 

# to 

```


It's actaully not needed to do the steps below, but it's how you would launch vscode attached to a container.
- in the bottom right of vscode you have the blue connect button, click this 
- and attach to running container, pick the react or nest container
- this is important for vscode to have acess to the node module files for code linting, completion etc..
- if you can't, open the settings UI with ctrl+shift+p then type Preferences: Open Settins (UI)
- search for docker path and add the result of $`which docker` there

## Bootstrapping the frontend app

- install vite react-ts
- install tailwind
- install prettier
- install prettier tailwind
- install react router
- install react query
- install react query dev tools
  - npm i @tanstack/react-query-devtools
  - https://tanstack.com/query/latest/docs/react/devtools
- install axios
  - npm install axios
  - https://github.com/axios/axios#installing


## API the front end needs

- install nestjs
- install prisma
- install axios
- install cookie-parser
- install jwt
- install swagger
  - npm install @nestjs/swagger swagger-ui-express
  - https://rehmat-sayany.medium.com/integrating-swagger-with-nestjs-a-step-by-step-guide-abd532743c43
- get current user info
- somehow using the authentication something or another