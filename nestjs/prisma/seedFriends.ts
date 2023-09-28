import { FriendStatus, Prisma, PrismaClient } from '@prisma/client';
import { DefaultArgs } from '@prisma/client/runtime/library';

export default async function createFriendship(
  prisma: PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>,
  userLogin1: string,
  userLogin2: string,
  relation: FriendStatus,
) {
  const user1 = await prisma.user.findUnique({
    where: { login42: userLogin1 },
  });

  const user2 = await prisma.user.findUnique({
    where: { login42: userLogin2 },
  });

  if (!user1 || !user2) {
    console.error('One or both users do not exist.');
    return;
  }

  const friendshipExists = await prisma.friend.findFirst({
    where: {
      OR: [
        { user1Id: user1.id, user2Id: user2.id },
        { user1Id: user2.id, user2Id: user1.id },
      ],
    },
  });

  if (friendshipExists) {
    console.error('Friendship already exists.');
    return;
  }

  await prisma.friend.create({
    data: {
      user1: { connect: { id: user1.id } },
      user2: { connect: { id: user2.id } },
      status: relation, // You can set the initial status here
    },
  });
}

// thank you chat gpt