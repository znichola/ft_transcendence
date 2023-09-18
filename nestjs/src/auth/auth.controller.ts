import { Body, Controller, Get, HttpCode, HttpStatus, Post, Req, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Request, Response } from 'express';
import axios from 'axios';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Get('login')
  async loggedIn(@Req() req: Request)
  {
    console.log(req.headers);
    console.log('------------');
    console.log(req.cookies);
  }

  @HttpCode(HttpStatus.OK)
  @Post('login')
  async signIn(@Body() bodyData: object, @Req() req: Request, @Res() res: Response) {
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
      const user = await this.authService.signInUser(login, defaultName, image.link)
      const token = await this.authService.getUserToken(user.id, user.login42); //Use this data to create a cookie with JWT
      console.log('------TOKEN------');
      console.log(token);
      res.cookie('test', token, {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        maxAge: 3600000,
      });

      const redirect = '/ranking'
      res.status(302).send({user, redirect});
      return;
    } catch (error) {
      console.log(error.data);
    }
  }
}
