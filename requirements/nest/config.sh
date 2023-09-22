cd nestjs
npm install
npx prisma migrate dev
npx prisma db seed
echo "Finished nest setup ..."
exec "$@"