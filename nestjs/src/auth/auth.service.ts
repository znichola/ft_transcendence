import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';
import { UserData } from 'src/interfaces';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async signInUser(login: string, defaultName: string, avatar: string): Promise<UserData> {
    console.log(`JWT_SECRET: ${process.env.JWT_SECRET}`);
    const user = await this.userService.registerUser(
      login,
      defaultName,
      avatar,
    );
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
    console.log(decoded);
    const login: string = decoded['login'];
    return login;
  }
}
