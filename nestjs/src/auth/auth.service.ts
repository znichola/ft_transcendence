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

  async signOutUser(login: string)
  {
    await prisma.user.update({
      where: { login42: login },
      data: { status: UserStatus.OFFLINE }
    });
  }

  async getUserToken(userLogin: string, tfaEnabled = false) {
    const user = await prisma.user.findUnique({where: {login42: userLogin}});
    if (!user) return null;
    const payload = { login: userLogin, tfa: tfaEnabled };
    return {
      access_token: this.jwtService.sign(payload, {
        secret: process.env.JWT_SECRET,
        expiresIn: '1d',
      }),
    };
  }

  async getLoginFromToken(token: string): Promise<string> {
    const decoded = this.jwtService.decode(token);
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
