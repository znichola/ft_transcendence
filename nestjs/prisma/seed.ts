import { PrismaClient, UserStatus } from '@prisma/client';

const prisma = new PrismaClient();

async function createUser(
  login: string,
  username: string,
  avatar?: string,
  elo?: number,
  wins?: number,
  losses?: number,
  status?: UserStatus,
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
      status: status,
    },
  });
}

async function createChatroom(owner: number, name: string) {
  await prisma.chatroom.upsert({
    where: { id: 0},
    update: {},
    create: {
      ownerId: 1,
      name: name,
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
    UserStatus.ONLINE,
  );
  await createUser('funnyuser2', 'Jokester', 'https://picsum.photos/id/40/200');
  await createUser(
    'funnyuser3',
    'Pun Master : Dung Master',
    'https://picsum.photos/id/21/200',
    1600,
    50,
    30,
    UserStatus.ONLINE,
  );
  await createUser(
    'funnyuser4',
    'Chuckler Crukler Buckler',
    'https://picsum.photos/id/54/200',
    1400,
    25,
    40,
    UserStatus.ONLINE,
  );
  await createUser(
    'funnyuser5',
    'Giggle Queen',
    'https://picsum.photos/id/64/200',
    1200,
    10,
    50,
    UserStatus.INGAME,
  );
  await createUser(
    'funnyuser6',
    '🤪 Genius',
    'https://picsum.photos/id/177/200',
    1000,
    5,
    60,
    UserStatus.OFFLINE,
  );
  await createUser(
    'funnyuser7',
    'Jekerino 🥳',
    'https://picsum.photos/id/342/200',
    420,
    7,
    20,
    UserStatus.OFFLINE,
  );
  await createUser(
    'funnyuser8',
    'Bare 🐻 Man',
    'https://picsum.photos/id/443/200',
    1600,
    20,
    33,
    UserStatus.OFFLINE,
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
    UserStatus.OFFLINE,
  );

  await createUser(
    'jane.smith',
    'Jane Smith',
    'https://picsum.photos/id/205/200',
    1234,
    45,
    62,
    UserStatus.ONLINE,
  );

  await createUser(
    'rockstar88',
    'Axl Rose',
    'https://picsum.photos/id/305/200',
    1500,
    90,
    84,
    UserStatus.UNAVAILABLE,
  );

  await createUser(
    'coding_ninja',
    'Alice Johnson',
    'https://picsum.photos/id/410/200',
    2875,
    63,
    75,
    UserStatus.OFFLINE,
  );

  await createUser(
    'sportsfan42',
    'Michael Jordan',
    'https://picsum.photos/id/512/200',
    1980,
    82,
    96,
    UserStatus.INGAME,
  );
}

async function main() {
  await createUser(
    'default42',
    'Defaultus Maximus',
    'https://i.imgflip.com/2/aeztm.jpg',
  );
  await createUser('test', 'Testus');

  createChatroom(1, 'test');

  await createFunnyUsers();
  await creatDummyData();

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
