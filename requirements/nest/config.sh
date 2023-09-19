make nest
cd nestjs
npx prisma migrate dev
npx prisma db seed
echo "Starting to watch..."
nest start --watch
echo "Oups"