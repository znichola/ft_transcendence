import { createUser, generateHistory } from './seed';
import { UserStatus } from '@prisma/client';

export async function createFunnyUsers() {
  await createUser(
    'funnyuser1',
    'LaughMaster',
    'https://picsum.photos/id/31/200',
    2000,
    100,
    10,
    generateHistory(),
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
    generateHistory(),
    UserStatus.ONLINE,
  );
  await createUser(
    'funnyuser4',
    'Chuckler Crukler Buckler',
    'https://picsum.photos/id/54/200',
    1400,
    25,
    40,
    generateHistory(),
    UserStatus.ONLINE,
  );
  await createUser(
    'funnyuser5',
    'Giggle Queen',
    'https://picsum.photos/id/64/200',
    1200,
    10,
    50,
    generateHistory(),
    UserStatus.INGAME,
  );
  await createUser(
    'funnyuser6',
    '🤪 Genius',
    'https://picsum.photos/id/177/200',
    1000,
    5,
    60,
    generateHistory(),
    UserStatus.OFFLINE,
  );
  await createUser(
    'funnyuser7',
    'Jekerino 🥳',
    'https://picsum.photos/id/342/200',
    420,
    7,
    20,
    generateHistory(),
    UserStatus.OFFLINE,
  );
  await createUser(
    'funnyuser8',
    'Bare 🐻 Man',
    'https://picsum.photos/id/443/200',
    1600,
    20,
    33,
    generateHistory(),
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

export async function createDummyData() {
  await createUser(
    'user123',
    'John Doe',
    'https://picsum.photos/id/101/200',
    2450,
    78,
    93,
    generateHistory(),
    UserStatus.OFFLINE,
  );

  await createUser(
    'jane.smith',
    'Jane Smith',
    'https://picsum.photos/id/205/200',
    1234,
    45,
    62,
    generateHistory(),
    UserStatus.ONLINE,
  );

  await createUser(
    'rockstar88',
    'Axl Rose',
    'https://picsum.photos/id/305/200',
    1500,
    90,
    84,
    generateHistory(),
    UserStatus.UNAVAILABLE,
  );

  await createUser(
    'coding_ninja',
    'Alice Johnson',
    'https://picsum.photos/id/410/200',
    2875,
    63,
    75,
    generateHistory(),
    UserStatus.OFFLINE,
  );

  await createUser(
    'sportsfan42',
    'Michael Jordan',
    'https://picsum.photos/id/512/200',
    1980,
    82,
    96,
    generateHistory(),
    UserStatus.INGAME,
  );
}
