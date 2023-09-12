import { Injectable } from '@nestjs/common';
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

  async GetUserFriends(userId: number): Promise<UserData[]> {
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
      },
    });

    const userPromises = userFriends.map(async (value) => {
      console.log(value);
      console.log('--');
      let user: UserData;
      if (value.user1Id == userId) {
        user = await this.findUserFromId(value.user2Id);
      } else {
        user = await this.findUserFromId(value.user1Id);
      }
      return user;
    });

    const results: UserData[] = await Promise.all(userPromises);
    return results;
  }

  async findAllByStatus(
    statusName: string,
    page?: number,
  ): Promise<UserData[]> {
    const status = await prisma.status.findFirst({
      where: { name: statusName },
      include: {
        user: { skip: (page - 1) * 10 || 0, take: 10, orderBy: { elo: 'desc' } },
      },
    });
    if (status) {
      const users = status.user;
      return users;
    }
    return [];
  }
}
