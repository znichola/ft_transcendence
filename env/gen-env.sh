#!/bin/bash

SCRIPT_DIR=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )

JWT_SECRET_KICKSTART=$(cat /dev/urandom | LC_ALL=C tr -dc 'a-zA-Z0-9' | fold -w 48 | head -n 1)
DATABASE_PWD_KICKSTART=$(cat /dev/urandom | LC_ALL=C tr -dc 'a-zA-Z0-9' | fold -w 16 | head -n 1)

gen_kickstart_template() {
cat <<-EOF > $SCRIPT_DIR/kickstart.env
# This is the setup for generating the .env files for the nest and react containers

# if present, these value are ported over from the kickstart.env.old
APP_NAME=${APP_NAME:="Transcendance"}
USE_LOCAL_HOST=${USE_LOCAL_HOST:="false"}
HTTPS_PORT=443
HTTP_PORT=80
API_CLIENT_ID=${API_CLIENT_ID:="_________replace_with_the_API_ID_from_the_42_api_____"}
API_CLIENT_SECRET=${API_CLIENT_SECRET:="_____replace_with_the_secret_also_from_42________"}
COOKIE_USR=${COOKIE_USR:="userSession"}
COOKIE_TMP=${COOKIE_TMP:="userTemp"}

# auto generated on each re gen of this file
JWT_SECRET=$JWT_SECRET_KICKSTART
DATABASE_PWD=$DATABASE_PWD_KICKSTART
EOF
}

if [[ -e $SCRIPT_DIR/kickstart.env ]]; then
	echo "kickstart.env is present, check you have correctly set the 42api ID and SECRET"
else

	if [[ -e $SCRIPT_DIR/kickstart.env.old ]]; then
		source $SCRIPT_DIR/kickstart.env.old
	fi
	printf "\n\33[96m fillout the kickstart.env file with information from the 42 api!\033[0m\n\n"
	gen_kickstart_template
	exit 42
fi

source $SCRIPT_DIR/kickstart.env

IP_ADDR=$(ipconfig getifaddr en0)
if [[ $USE_LOCAL_HOST == "true" ]]; then
	IP_ADDR="localhost"
fi

VITE_IP_ADDR=$IP_ADDR

SITE_DOMAIN=$VITE_IP_ADDR:$HTTPS_PORT
SITE_URL=https://$SITE_DOMAIN

{
cat <<-EOF > $SCRIPT_DIR/.react.env
VITE_IP_ADDR=$VITE_IP_ADDR
VITE_SITE_URL=$SITE_URL
VITE_SITE_DOMAIN=$SITE_DOMAIN
VITE_CLIENT_ID=$API_CLIENT_ID
EOF
}

{
cat <<-EOF > $SCRIPT_DIR/.nestjs.env
IP_ADDR=$VITE_IP_ADDR
API_CLIENT_ID=$API_CLIENT_ID
API_CLIENT_SECRET=$API_CLIENT_SECRET
JWT_SECRET=$JWT_SECRET
COOKIE_USR=$COOKIE_USR
COOKIE_TMP=$COOKIE_TMP
APP_NAME=$APP_NAME
DATABASE_URL=postgresql://postgres:$DATABASE_PWD@postgres:5432/postgres?schema=public
SITE_URL=$SITE_URL
EOF
}

{
cat <<-EOF > $SCRIPT_DIR/.docker.env
DATABASE_PWD=$DATABASE_PWD
HTTPS_PORT=$HTTPS_PORT
HTTP_PORT=$HTTP_PORT
EOF
}
