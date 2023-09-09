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
      avatar: avatar || '',
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
    'https://picsum.photos/200',
    2000,
    100,
    10,
    1,
  );
  await createUser('funnyuser2', 'Jokester', 'https://picsum.photos/200');
  await createUser(
    'funnyuser3',
    'PunMaster',
    'https://picsum.photos/200',
    1600,
    50,
    30,
    1,
  );
  await createUser(
    'funnyuser4',
    'Chuckler',
    'https://picsum.photos/200',
    1400,
    25,
    40,
    1,
  );
  await createUser(
    'funnyuser5',
    'GiggleQueen',
    'https://picsum.photos/200',
    1200,
    10,
    50,
    1,
  );
  await createUser(
    'funnyuser6',
    'ComedyGenius',
    'https://picsum.photos/200',
    1000,
    5,
    60,
    1,
  );
}

async function main() {
  createStatus('online');
  createStatus('offline');
  createStatus('ingame');
  createStatus('unavailable');

  createUser('default42', 'Defaultus Maximus');
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
