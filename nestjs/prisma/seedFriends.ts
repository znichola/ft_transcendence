import { FriendStatus, Prisma, PrismaClient } from '@prisma/client';
import { DefaultArgs } from '@prisma/client/runtime/library';

export async function createFriendship(
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
    console.error(
      user1.login42 + '+' + user2.login42 + 'Friendship already exists.',
    );
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

export async function friendUser(
  prisma: PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>,
  user: string,
) {
  const userExists = await prisma.user.findUnique({
    where: { login42: user },
  });
  if (userExists) {
    await createFriendship(prisma, user, 'funnyuser2', 'PENDING');
    await createFriendship(prisma, user, 'funnyuser1', 'BLOCKED');
    await createFriendship(prisma, user, 'coding_ninja', 'ACCEPTED');
    await createFriendship(prisma, user, 'funnyuser3', 'ACCEPTED');
    await createFriendship(prisma, 'user123', user, 'PENDING');
    await createFriendship(prisma, 'funnyuser5', user, 'ACCEPTED');
    await createFriendship(prisma, 'funnyuser6', user, 'ACCEPTED');
    await createFriendship(prisma, 'sportsfan42', user, 'PENDING');
  } else console.log('user:', user, 'does not exist, skipping freindship seed');
}
