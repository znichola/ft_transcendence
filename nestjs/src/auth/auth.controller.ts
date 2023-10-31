import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  NotFoundException,
  Post,
  Query,
  Req,
  Res,
  UseGuards,
  Header
} from '@nestjs/common';
import { AuthGuard } from './auth.guard';
import { AuthService } from './auth.service';
import { Request, Response } from 'express';
import axios from 'axios';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';

// prettier-ignore
@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  @Header('content-type', 'application/json')
  async signIn(
    @Body() bodyData: object,
    @Res() res: Response,
  ) {
    if (!bodyData || !bodyData['state'] || !bodyData['code'])
      throw new HttpException('Missing Body Data.', HttpStatus.BAD_REQUEST);
    const state: string = bodyData['state'];
    const code: string = bodyData['code'];
    try {
      const token42 = await axios.post('https://api.intra.42.fr/oauth/token', {
        grant_type: 'authorization_code',
        client_id: process.env.API_CLIENT_ID,
        client_secret: process.env.API_CLIENT_SECRET,
        code: code,
        redirect_uri: process.env.SITE_URL + '/auth',
        state: state
      });
      if (!token42) {
        throw new Error('Unable to retrieve data from 42 API.');
      }
      const userInfo = await axios.get('https://api.intra.42.fr/v2/me', {
        headers: {
          Authorization: `Bearer ${token42.data.access_token}`,
        },
      });
      const { first_name, last_name, login, image } = userInfo.data;

      const userExists = await this.authService.findUser(login);
      const defaultName = first_name + ' ' + last_name;
      const user = await this.authService.signInUser(
        login,
        defaultName,
        image.link,
      );

      const cookieName: string = user.tfaStatus ? process.env.COOKIE_TMP : process.env.COOKIE_USR;
      const cookieMaxAge: number = user.tfaStatus ? 300000 : 3600000;
      const token = await this.authService.getUserToken(user.login42); //Use this data to create a cookie with JWT
      res.cookie(cookieName, token, {
        domain: process.env.IP_ADDR,
        httpOnly: true,
        secure: true,
        sameSite: 'lax',
        maxAge: cookieMaxAge,
      });

      return res.status(200).send({ login: user.login42, tfa: user.tfaStatus, first: !userExists });
    }
    catch (error)
    {
      console.log('error with 42 login');
    }
  }

  @UseGuards(AuthGuard)
  @ApiOperation({
    summary: 'Logout',
    description: 'Logs out from the site, expiring the current cookies for authentication.'
  })
  @ApiResponse({ status: 401, description: 'No Logged in user.'})
  @ApiResponse({ status: 200, description:'Logout successful.'})
  @Get('logout')
  async logOutUser(@Req() req: Request, @Res() res: Response)
  {
    const userLogin = await this.authService.getLoginFromToken(req.cookies[process.env.COOKIE_USR].access_token);
    await this.authService.signOutUser(userLogin);
    res.setHeader('Content-Type', 'text/html');
    res.cookie(process.env.COOKIE_USR, '', { expires: new Date() });
    return res.status(200).send();
  }

  @ApiQuery({
    name: 'user',
    description: 'The user login you want to use (default: default42)',
    required: false,
    type: String,
    example: 'default42'
  })
  @ApiOperation({
    summary: 'Login as any user',
    description: 'A JWT token is created and added to the cookies, to pretend you are logged in as any user'
  })
  @ApiResponse({ status: 200, description: 'Logged in.'})
  @ApiResponse({ status: 404, description: 'User not found.' })
  @Get('dev')
  async loginDev(@Res() res: Response, @Query('user') user?: string)
  {
	if (process.env.TRANSCENDANCE_MODE == 'prod')
		throw new NotFoundException();

    if (!user) user = 'default42';
    const token = await this.authService.getUserToken(user);
    if (!token) throw new HttpException('User not found.', HttpStatus.NOT_FOUND);

    res.setHeader('Content-Type', 'text/html');
    res.cookie(process.env.COOKIE_USR, token, {
      domain: process.env.IP_ADDR,
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      maxAge: 3600000,
    });
    return res.status(200).send();
  }

  @UseGuards(AuthGuard)
  @ApiOperation({
    summary: 'Get current user token',
    description: 'Get the access tokem from the JWT token in the cookies for websocket authentication.'
  })
  @ApiResponse({ status: 200, description: 'User Access Token provided.' })
  @ApiResponse({ status: 401, description: 'No JWT cookie found.' })
  @Get('token')
  getUserToken(@Req() req: Request): Promise<string>
  {
    const userToken = req.cookies[process.env.COOKIE_USR].access_token;
    return (userToken);
  }

  @UseGuards(AuthGuard)
  @ApiOperation({
    summary: 'Get current user login',
    description: 'Get the login from the JWT token payload in the browser cookies.'
  })
  @ApiResponse({ status: 200, description: 'User Login returned.'})
  @ApiResponse({ status: 401, description: 'No JWT cookie found.'})
  @Get('user')
  async getLoggedUser(@Req() req: Request): Promise<string> {
    const userLogin: string = await this.authService.getLoginFromToken(
      req.cookies[process.env.COOKIE_USR].access_token,
    );
    return userLogin;
  }
}
