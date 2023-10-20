import { PrismaClient, UserStatus } from '@prisma/client';
import { faker } from '@faker-js/faker';
import { friendUser } from './seedFriends';
import { createDummyData, createFunnyUsers } from './seedFixedUsers';
import { createConversation } from './seedConversation';

const mvp = [
  'default42',
  'mpouce',
  'hradoux',
  'bphilago',
  'skoulen',
  'znichola',
];

faker.seed(1234);

const prisma = new PrismaClient();

export function generateHistory(valuesCount?: number): number[] {
  const length = valuesCount || 10;
  const history = Array.from({ length }, (_, index) => index + 1);

  history[0] = 1500;
  for (let index = 1; index < (valuesCount || 10); index++) {
    const element: number = faker.number.int({ min: -20, max: 20 });
    const newElement: number = history[index - 1] + element;
    history[index] = newElement;
  }
  return history;
}

export async function createUser(
  login: string,
  username: string,
  avatar?: string,
  elo?: number,
  wins?: number,
  losses?: number,
  history?: number[],
  status?: UserStatus,
  bio?: string,
) {
  let nElo: number;
  let nWins: number;
  let nLosses: number;

  if (history) {
    nWins = 0;
    nLosses = 0;
    nElo = history[history.length - 1];
    for (let i = 1; i < history.length; i++) {
      if (history[i] - history[i - 1] > 0) nWins++;
      else nLosses++;
    }
  }

  const user = await prisma.user.upsert({
    where: { login42: login },
    update: {},
    create: {
      login42: login,
      name: username,
      avatar: avatar || 'https://placehold.co/200',
      elo: nElo || elo || 1500,
      wins: nWins || wins || 0,
      losses: nLosses || losses || 0,
      eloHistory: history,
      status: status,
      bio: bio,
    },
    select: {
      id: true,
    },
  });

  return user.id;
}

async function createChatroom(
  chatroomId: number,
  ownerId: number,
  name: string,
) {
  const chatroom = await prisma.chatroom.upsert({
    where: { id: chatroomId },
    update: {},
    create: {
      ownerId: ownerId,
      name: name,
    },
    select: {
      id: true,
    },
  });

  await prisma.chatroomUser.upsert({
    where: {
      chatroomId_userId: { chatroomId: chatroom.id, userId: ownerId },
    },
    update: {},
    create: {
      chatroomId: chatroom.id,
      userId: ownerId,
      role: 'OWNER',
    },
  });
}

async function FakerData() {
  for (let i = 0; i < 100; i++) {
    await createUser(
      faker.internet.userName(),
      faker.person.fullName(),
      faker.internet.avatar(),
      faker.number.int({ min: 0, max: 2800 }),
      faker.number.int({ min: 0, max: 300 }),
      faker.number.int({ min: 0, max: 300 }),
      generateHistory(faker.number.int({ min: 5, max: 150 })),
      faker.helpers.arrayElement([
        UserStatus.INGAME,
        UserStatus.ONLINE,
        UserStatus.OFFLINE,
        UserStatus.INQUEUE,
      ]),
      faker.person.bio(),
    );
  }
}

async function main() {
  const seeded = await prisma.user.findUnique({
    where: { login42: 'default42' },
  });

  if (!seeded) {
    await createUser(
      'default42',
      'Defaultus Maximus',
      'https://i.imgflip.com/2/aeztm.jpg',
      1612,
      8,
      2,
      [1500, 1520, 1539, 1564, 1580, 1572, 1560, 1575, 1589, 1600, 1612],
    );
    await FakerData();
    await createFunnyUsers();
    await createDummyData();
  } else console.log('already seeded, skipping the bulk user seeding step');

  const id1 = await createUser('test', 'Testus');
  const id2 = await createUser('puree123', 'Pomme de Terre');

  await createChatroom(1, id1, 'test');
  await createChatroom(2, id1, 'The chads');
  await createChatroom(3, id2, 'Hackers only');
  await createChatroom(4, id2, '1337');

  await createConversation(prisma, 'znichola', 'default42');

  mvp.map((u) => friendUser(prisma, u));
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
