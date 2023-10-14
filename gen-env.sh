#!/bin/bash

JWT_SECRET_KICKSTART=$(cat /dev/urandom | LC_ALL=C tr -dc 'a-zA-Z0-9' | fold -w 48 | head -n 1)
DATABASE_PWD_KICKSTART=$(cat /dev/urandom | LC_ALL=C tr -dc 'a-zA-Z0-9' | fold -w 16 | head -n 1)

if [[ -e kickstart.env ]]; then
  printf "
kickstart.env is present, check you have correctly set the 42api ID and SECRET

"
else

  if [[ -e kickstart.env.old ]]; then
    source ./kickstart.env.old
  fi

  printf "\n\33[96m fillout the kickstart.env file with information from the 42 api!\033[0m\n\n"
  {
    printf "# This is the setup for generating the .env files for the nest and react containers

# if present, these value are ported over from the kickstart.env.old
APP_NAME=\"${APP_NAME:="Transcendance"}\"
USE_LOCAL_HOST=\"${USE_LOCAL_HOST:="false"}\"
API_CLIENT_ID=\"${API_CLIENT_ID:="_________replace_with_the_API_ID_from_the_42_api_____"}\"
API_CLIENT_SECRET=\"${API_CLIENT_SECRET:="_____replace_with_the_secret_also_from_42________"}\"
DATABASE_USR=\"${DATABASE_USR:="__________replace_with_your_database_user_____________"}\"
DATABASE_NAME=\"${DATABASE_NAME:="__________replace_with_your_database_user___________"}\"
COOKIE_USR=\"${COOKIE_USR:="userSession"}\"
COOKIE_TMP=\"${COOKIE_TMP:="userTemp"}\"

# auto generated on each re gen of this file
JWT_SECRET=\"$JWT_SECRET_KICKSTART\"
DATABASE_PWD=\"$DATABASE_PWD_KICKSTART\"
"
  } >kickstart.env
  exit 42
fi

# print warning about not filling in the
test -e kickstart.env || (
  printf "\n\33[96m fillout the kickstart.env file with information from the 42 api!\033[0m\n\n" && printf '
API_CLIENT_ID="_______replace_with_the_API_ID_from_the_42_api____"\nAPI_CLIENT_SECRET="_____replace_with_the_secret_also_from_42_____"
' >kickstart.env
)

source ./kickstart.env

IP_ADDR=$(ipconfig getifaddr en0)
if [[ $USE_LOCAL_HOST == "true" ]]; then
  IP_ADDR="localhost"
fi

PORT=8080

VITE_IP_ADDR=$IP_ADDR
VITE_PORT=$PORT

{
  printf "
# This file is auto-generated

VITE_IP_ADDR=\"$VITE_IP_ADDR\"
"

} >react-app/.env

{
  printf "
# This file is auto-generated

IP_ADDR=\"$VITE_IP_ADDR\"
API_CLIENT_ID=\"$API_CLIENT_ID\"
API_CLIENT_SECRET=\"$API_CLIENT_SECRET\"
JWT_SECRET=\"$JWT_SECRET\"
COOKIE_USR=\"$COOKIE_USR\"
COOKIE_TMP=\"$COOKIE_TMP\"
APP_NAME=\"$APP_NAME\"
DATABASE_URL=\"postgresql://$DATABASE_USR:$DATABASE_PWD@postgres:5432/$DATABASE_NAME?schema=public\"
"

} >nestjs/.env

{
  printf "
# This file is auto-generated

API_CLIENT_ID=\"$API_CLIENT_ID\"
API_CLIENT_SECRET=\"$API_CLIENT_SECRET\"
JWT_SECRET=\"$JWT_SECRET\"
COOKIE_USR=\"$COOKIE_USR\"
COOKIE_TMP=\"$COOKIE_TMP\"
APP_NAME=\"$APP_NAME\"
DATABASE_PWD=\"$DATABASE_PWD\"
DATABASE_URL=\"postgresql://$DATABASE_USR:$DATABASE_PWD@postgres:5432/$DATABASE_NAME?schema=public\"
DATABASE_USR=\"$DATABASE_USR\"
DATABASE_NAME=\"$DATABASE_NAME\"
"
} >.env
