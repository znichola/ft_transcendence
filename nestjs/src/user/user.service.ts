import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { userInfo } from 'os';
import { UserData } from 'src/interfaces';
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

  async getUserStatus(statusId: number): Promise<string> {
    const statusString = await prisma.status.findFirst({
      where: {
        id: statusId,
      },
    });
    return statusString.name;
  }

  async getUserId(login: string): Promise<number> {
    const user = await prisma.user.findFirst({
      where: {
        login42: login,
      },
    });
    return user.id;
  }

  async GetUserFriends(userId: number): Promise<object[]>
  {
    const results = await prisma.friend.findMany({
      where: {
        OR: [
          {
            user1Id: userId,
          },
          {
            user2Id: userId,
          },
        ],
      },
    });

    return results;
  }
}
