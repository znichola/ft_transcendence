#!/bin/sh

set -e

npx prisma migrate dev
npx prisma db seed

exec "$@"