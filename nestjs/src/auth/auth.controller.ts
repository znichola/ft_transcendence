import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from './auth.guard';
import { AuthService } from './auth.service';
import { Request, Response } from 'express';
import axios from 'axios';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Get('login')
  async loggedIn(@Req() req: Request) {
    console.log(req.headers);
    console.log('------------');
    console.log(req.cookies);

    const userLogin: string = await this.authService.getLoginFromToken(req.cookies.test.access_token)
    console.log(userLogin);
  }

  @HttpCode(HttpStatus.OK)
  @Post('login')
  async signIn(
    @Body() bodyData: object,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    console.log('In Auth Controller');
    const state: string = bodyData['state'];
    const code: string = bodyData['code'];
    try {
      const test = await axios.post('https://api.intra.42.fr/oauth/token', {
        grant_type: 'authorization_code',
        client_id: process.env.API_CLIENT_ID,
        client_secret: process.env.API_CLIENT_SECRET,
        code: code,
        redirect_uri: 'http://localhost:5173/auth',
        state: 'abc', //Dont be dumb and use the correct state value for real project.
      });
      if (!test) {
        throw new Error('Unable to retrieve data from 42 API.');
      }
      console.log('------------');
      console.log(test.data.access_token);
      const userInfo = await axios.get('https://api.intra.42.fr/v2/me', {
        headers: {
          Authorization: `Bearer ${test.data.access_token}`,
        },
      });
      console.log('------------');
      const { first_name, last_name, login, image } = userInfo.data;
      console.log(first_name, last_name, login, image.link);

      const defaultName = first_name + ' ' + last_name;
      const user = await this.authService.signInUser(
        login,
        defaultName,
        image.link,
      );
      const token = await this.authService.getUserToken(user.id, user.login42); //Use this data to create a cookie with JWT
      console.log('------TOKEN------');
      console.log(token);
      res.cookie('test', token, {
        domain: 'localhost',
        httpOnly: true,
        secure: false,
        sameSite: 'lax',
        maxAge: 3600000,
      });

      const redirect = '/ranking';
      return res.status(200).send({ user, redirect });
    } catch (error) {
      console.log(error);
    }
  }

  //@UseGuards(AuthGuard)
  @Get('user')
  async getLoggedUser(@Req() req: Request): Promise<string> {
    if (req.cookies.test) {
    const userLogin: string = await this.authService.getLoginFromToken(req.cookies.test.access_token);
    return userLogin;
    }
    throw new UnauthorizedException();
  }
}
