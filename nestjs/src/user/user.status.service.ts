import {Injectable} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserStatus } from '@prisma/client';

const prisma: PrismaService = new PrismaService();

@Injectable()
export class UserStatusService {
constructor(){}

async setUserStatus(login: string, newStatus: UserStatus)
  {
    await prisma.user.update({
      where: { login42: login },
      data: { status: newStatus },
    });
  }
}