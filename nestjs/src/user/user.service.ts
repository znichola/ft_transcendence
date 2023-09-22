import { Injectable } from '@nestjs/common';
import { FriendStatus, UserStatus } from '@prisma/client';
import { FriendData, UserData } from 'src/interfaces';
import { PrismaService } from 'src/prisma/prisma.service';

const prisma: PrismaService = new PrismaService();

@Injectable()
export class UserService {
  async findAll(page?: number): Promise<UserData[]> {
    const allUsers = await prisma.user.findMany({
      skip: (page - 1) * 10 || 0,
      take: 10,
      orderBy: {
        elo: 'desc',
      },
    });
    return allUsers;
  }

  async findUser(login: string): Promise<UserData> {
    const user = await prisma.user.findFirst({
      where: {
        login42: login,
      },
    });
    return user;
  }

  async findUserFromId(userId: number): Promise<UserData> {
    const user = await prisma.user.findFirst({
      where: {
        id: userId,
      },
    });
    return user;
  }

  async updateUserName(login: string, newName: string): Promise<UserData> {
    const user = await prisma.user.update({
      where: {
        login42: login,
      },
      data: {
        name: newName,
      },
    });
    return user;
  }

  async getUserId(login: string): Promise<number> {
    const user = await prisma.user.findUnique({
      where: { login42: login },
      select: { id: true }
    });
    return user.id;
  }


  async getFriendData(userId: number): Promise<FriendData> {
    const friend = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        login42: true,
        name: true,
        avatar: true,
        status: true,
      },
    });
    return friend;
  }

  async getUserFriends(userId: number): Promise<FriendData[]> {
    const userFriends = await prisma.friend.findMany({
      where: {
        OR: [
          {
            user1Id: userId,
          },
          {
            user2Id: userId,
          },
        ],
        status: FriendStatus.ACCEPTED,
      },
    });

    const userPromises = userFriends.map(async (value) => {
      let user: FriendData;
      if (value.user1Id == userId) {
        user = await this.getFriendData(value.user2Id);
      } else {
        user = await this.getFriendData(value.user1Id);
      }
      return user;
    });

    const results: FriendData[] = await Promise.all(userPromises);
    return results;
  }

async getUserFriendsByStatus(userId: number, incoming: boolean, status: FriendStatus): Promise<FriendData[]> {
  const whereCondition: { user1Id?: number, user2Id?: number, status: FriendStatus } = { status: status}
  if (incoming) {
    whereCondition.user2Id = userId
  } else {
    whereCondition.user1Id = userId
  }
  const pending = await prisma.friend.findMany({
    where: whereCondition
  });
  const userPromises = pending.map(async (value) => {
    let user: FriendData;
    if (value.user1Id == userId) {
      user = await this.getFriendData(value.user2Id);
    } else {
      user = await this.getFriendData(value.user1Id);
    }
    return user;
  });
  const results: FriendData[] = await Promise.all(userPromises);
  return results;
}

  // async findAllByStatus(
  //   statusName: string,
  //   page?: number,
  // ): Promise<UserData[]> {
  //   const status = await prisma.status.findFirst({
  //     where: { name: statusName },
  //     include: {
  //       user: { skip: (page - 1) * 10 || 0, take: 10, orderBy: { elo: 'desc' } },
  //     },
  //   });
  //   if (status) {
  //     const users = status.user;
  //     return users;
  //   }
  //   return [];
  // }

  async registerUser(login: string, displayName: string, avatar: string): Promise<UserData> {
    const user = await prisma.user.upsert({
      where: { login42: login },
      create: { 
        login42: login,
        name: displayName,
        avatar: avatar,
      },
      update: { status: UserStatus.ONLINE },
    });
    return user;
  }

  async createFriend(requesterId: number, receiverId: number){
    await prisma.friend.create({
      data: {
        user1Id: requesterId,
        user2Id: receiverId,
      }
    });
  }
}
