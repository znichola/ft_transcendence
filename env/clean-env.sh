#!/bin/bash

set -e

SCRIPT_DIR=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )

cd $SCRIPT_DIR && [ -f kickstart.env ] && mv kickstart.env kickstart.env.old
cd $SCRIPT_DIR && rm -rf ../.env .react.env .nestjs.env

printf "\033[31m all .env files removed, kickstart.env renamed to \033[33mkickstart.env.old\033[0m\n"