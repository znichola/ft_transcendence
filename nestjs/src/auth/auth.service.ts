import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserData } from 'src/interfaces';
import { AuthGuard } from './auth.guard';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserStatus } from '@prisma/client';

const prisma: PrismaService = new PrismaService();
@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
  ) {}

  async signInUser(login: string, defaultName: string, avatar: string): Promise<UserData> {
    console.log(`JWT_SECRET: ${process.env.JWT_SECRET}`);
    const user = await prisma.user.upsert({
      where: { login42: login },
      create: {
        login42: login,
        name: defaultName,
        avatar: avatar,
      },
      update: { status: UserStatus.ONLINE },
    });
    return user;
  }

  async getUserToken(userId: number, userLogin: string) {
    const payload = { sub: userId, login: userLogin };
    return {
      access_token: this.jwtService.sign(payload, {
        secret: process.env.JWT_SECRET,
        expiresIn: '1d',
      }),
    };
  }

  async getLoginFromToken(token: string): Promise<string> {
    const decoded = this.jwtService.decode(token);
    console.log('decoding');
    const login: string = decoded['login'];
    return login;
  }

  async verifyUser(username: string, token: string)
  {
    const loggedIn: string = await this.getLoginFromToken(token);
    if (loggedIn != username)
    {
      throw new UnauthorizedException();
    }
  }
}
