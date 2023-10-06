
if [[ -e kickstart.env ]]; then
  printf "
kickstart.env is present, check you have correctly set the 42api ID and SECRET

"
else
  printf "\n\33[96m fillout the kickstart.env file with information from the 42 api!\033[0m\n\n"
  {
    printf '
USE_LOCAL_HOST="false"
API_CLIENT_ID="_______replace_with_the_API_ID_from_the_42_api____"
API_CLIENT_SECRET="_____replace_with_the_secret_also_from_42_____"
' 
  } > kickstart.env
  exit 42
fi

# print warning about not filling in the 
test -e kickstart.env || (\
printf "\n\33[96m fillout the kickstart.env file with information from the 42 api!\033[0m\n\n" && printf '
API_CLIENT_ID="_______replace_with_the_API_ID_from_the_42_api____"\nAPI_CLIENT_SECRET="_____replace_with_the_secret_also_from_42_____"
' > kickstart.env)

source ./kickstart.env

JWT_SECRET=$(cat /dev/urandom | LC_ALL=C tr -dc 'a-zA-Z0-9' | fold -w 48 | head -n 1)
DATABASE_PWD=$(cat /dev/urandom | LC_ALL=C tr -dc 'a-zA-Z0-9' | fold -w 16 | head -n 1)

# delete this when the backend properly reads the env variables
DATABASE_PWD="1234"
JWT_SECRET="lol"

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

} > react-app/.env

{
  printf "
# This file is auto-generated

IP_ADDR=\"$VITE_IP_ADDR\"
"

} > nestjs/.env

{
  printf "
# This file is auto-generated

API_CLIENT_ID=\"$API_CLIENT_ID\"
API_CLIENT_SECRET=\"$API_CLIENT_SECRET\"
JWT_SECRET=\"$JWT_SECRET\"
DATABASE_PWD=\"$DATABASE_PWD\"
DATABASE_URL=\"postgresql://postgres:$DATABASE_PWD@postgres:5432/testdb?schema=public\"
"
} > .env