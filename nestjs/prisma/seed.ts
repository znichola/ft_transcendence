import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function createStatus(statusName: string) {
  await prisma.status.upsert({
    where: { name: statusName },
    update: {},
    create: {
      name: statusName,
    },
  });
}

async function createUser(
  login: string,
  username: string,
  avatar?: string,
  elo?: number,
  wins?: number,
  losses?: number,
  statusId?: number,
) {
  await prisma.user.upsert({
    where: { login42: login },
    update: {},
    create: {
      login42: login,
      name: username,
      avatar: avatar || 'https://placehold.co/200',
      elo: elo || 1500,
      wins: wins || 0,
      losses: losses || 0,
      statusId: statusId || 0,
    },
  });
}

async function createFunnyUsers() {
  await createUser(
    'funnyuser1',
    'LaughMaster',
    'https://picsum.photos/id/31/200',
    2000,
    100,
    10,
    1,
  );
  await createUser('funnyuser2', 'Jokester', 'https://picsum.photos/id/40/200');
  await createUser(
    'funnyuser3',
    'Pun Master : Dung Master',
    'https://picsum.photos/id/21/200',
    1600,
    50,
    30,
    3,
  );
  await createUser(
    'funnyuser4',
    'Chuckler Crukler Buckler',
    'https://picsum.photos/id/54/200',
    1400,
    25,
    40,
    2,
  );
  await createUser(
    'funnyuser5',
    'Giggle Queen',
    'https://picsum.photos/id/64/200',
    1200,
    10,
    50,
    0,
  );
  await createUser(
    'funnyuser6',
    '🤪 Genius',
    'https://picsum.photos/id/177/200',
    1000,
    5,
    60,
    2,
  );
  await createUser(
    'funnyuser7',
    'Jekerino 🥳',
    'https://picsum.photos/id/342/200',
    420,
    7,
    20,
    3,
  );
  await createUser(
    'funnyuser8',
    'Bare 🐻 Man',
    'https://picsum.photos/id/443/200',
    1600,
    20,
    33,
    0,
  );
}

async function main() {
  createStatus('online');
  createStatus('offline');
  createStatus('ingame');
  createStatus('unavailable');

  createUser(
    'default42',
    'Defaultus Maximus',
    'https://i.imgflip.com/2/aeztm.jpg',
  );
  createUser('test', 'Testus');

  createFunnyUsers();
}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
