import { Injectable, UseGuards } from '@nestjs/common';
import { FriendStatus, User, UserStatus } from '@prisma/client';
import { AuthGuard } from 'src/auth/auth.guard';
import { FriendData, UserData } from 'src/interfaces';
import { PrismaService } from 'src/prisma/prisma.service';

const prisma: PrismaService = new PrismaService();

@Injectable()
export class UserService {
  async findAll(page?: number, searchName?: string, findStatus?: UserStatus): Promise<string[]> {
    const whereCondition: {
      OR: [
          {
            login42: { contains: string };
          },
          {
            name: { contains: string };
          },
        ];
        status?: UserStatus;
      }
     = {
      OR: [
        {
          login42: { contains: '' },
        },
        {
          name: { contains: '' },
        },
      ],
    };
    console.log(searchName, findStatus);
    if (searchName) {
      whereCondition.OR = [
          {
            login42: { contains: searchName },
          },
          {
            name: { contains: searchName },
          },
        ];
    }
    whereCondition.status = findStatus;
    const allUsers = await prisma.user.findMany({
      select: { login42: true },
      where: whereCondition,
      skip: (page - 1) * 10 || 0,
      take: 10,
      orderBy: {
        elo: 'desc',
      },
    });

    const usersArray: string[] = allUsers.map(user => user.login42);
    return usersArray;
  }

  async findUserFromLogin(login: string): Promise<UserData> {
    const user = await prisma.user.findUnique({
      where: {
        login42: login,
      },
    });
    return user;
  }

  async findUserFromId(userId: number): Promise<UserData> {
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });
    return user;
  }

  async findUserFromName(name: string): Promise<UserData>
  {
    const user = await prisma.user.findUnique({
      where: {
        name: name,
      },
    });
    return user;
  }

  async updateUserName(login: string, newName: string, newBio: string): Promise<UserData> {
    const user = await prisma.user.update({
      where: {
        login42: login,
      },
      data: {
        name: newName,
        bio: newBio,
      },
    });
    return user;
  }

  // @UseGuards(AuthGuard)
  async getUserId(login: string): Promise<number> {
    const user = await prisma.user.findUnique({
      where: { login42: login },
      select: { id: true },
    });
    return user.id;
  }

  // @UseGuards(AuthGuard)
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

  // @UseGuards(AuthGuard)
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

  async getUserFriendsByStatus(
    userId: number,
    incoming: boolean,
    status: FriendStatus,
  ): Promise<FriendData[]> {
    const whereCondition: {
      user1Id?: number;
      user2Id?: number;
      status: FriendStatus;
    } = { status: status };
    if (incoming) {
      whereCondition.user2Id = userId;
    } else {
      whereCondition.user1Id = userId;
    }
    const pending = await prisma.friend.findMany({
      where: whereCondition,
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

  // async registerUser(
  //   login: string,
  //   displayName: string,
  //   avatar: string,
  // ): Promise<UserData> {
  //   const user = await prisma.user.upsert({
  //     where: { login42: login },
  //     create: {
  //       login42: login,
  //       name: displayName,
  //       avatar: avatar,
  //     },
  //     update: { status: UserStatus.ONLINE },
  //   });
  //   return user;
  // }

  @UseGuards(AuthGuard)
  async createFriend(requesterId: number, receiverId: number) {
    await prisma.friend.create({
      data: {
        user1Id: requesterId,
        user2Id: receiverId,
      },
    });
  }
}