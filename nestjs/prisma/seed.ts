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

// please generate some realistic dummy data following this schema
//   await createUser(
//     '/*username*/',
//     '/*Full Display Name*/',
//     'https://picsum.photos/id//*a number*//200',
//     /*number 0-3000*/,
//     /*number 0-100*/,
//     /*number 0-100*/,
//     /*number 0-3*/,
//   );

async function creatDummyData() {
  await createUser(
    'user123',
    'John Doe',
    'https://picsum.photos/id/101/200',
    2450,
    78,
    93,
    2,
  );

  await createUser(
    'jane.smith',
    'Jane Smith',
    'https://picsum.photos/id/205/200',
    1234,
    45,
    62,
    0,
  );

  await createUser(
    'rockstar88',
    'Axl Rose',
    'https://picsum.photos/id/305/200',
    1500,
    90,
    84,
    3,
  );

  await createUser(
    'coding_ninja',
    'Alice Johnson',
    'https://picsum.photos/id/410/200',
    2875,
    63,
    75,
    1,
  );

  await createUser(
    'sportsfan42',
    'Michael Jordan',
    'https://picsum.photos/id/512/200',
    1980,
    82,
    96,
    3,
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
  creatDummyData();
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
