#!/bin/sh

set -e

npx prisma migrate dev

exec "$@"