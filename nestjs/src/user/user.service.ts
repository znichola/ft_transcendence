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
        elo: 'desc'
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

  async getUserStatus(statusid: number): Promise<string> {
    const statusString = await prisma.status.findFirst({
      where: {
        id: statusid,
      },
    });
    return statusString.name;
  }
}
