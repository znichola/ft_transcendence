cd nestjs
npm install
npx prisma migrate dev
npx prisma db seed &
# npx prisma studio &
# nest start --watch &
echo "Finished nest setup ..."
"$@"