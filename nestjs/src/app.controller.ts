import { Body, Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';
import axios from 'axios';
import { UserService } from './user/user.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService, private readonly userService: UserService) {}

  @Get()
  getHello(): string {
    console.log(process.env.DATABASE_URL);
    return this.appService.getHello();
  }

  @Post('login')
  async createUser(@Body() bodyData: object) {
    const state: string = bodyData['state'];
    const code: string = bodyData['code'];

    try {
      const test = await axios.post('https://api.intra.42.fr/oauth/token', {
        grant_type: 'authorization_code',
        client_id: process.env.API_CLIENT_ID,
        client_secret: process.env.API_CLIENT_SECRET,
        code: code,
        redirect_uri: 'http://localhost:5173/auth',
        state: 'abc', //Dont be dumb and use a correct state value for real project.
      });
      console.log('------------');
      console.log(test.data.access_token);
      const userInfo = await axios.get('https://api.intra.42.fr/v2/me', {
        headers: {
          Authorization: `Bearer ${test.data.access_token}`,
        },
      });
      console.log('------------');
      const {first_name, last_name, login, image } = userInfo.data;
      console.log(first_name, last_name, login, image.link);
      
      const defaultName = first_name + ' ' + last_name;
      const userId = this.userService.registerUser(login, defaultName, image.link); //Use this data to create a cookie with JWT
    } catch (error) {
      console.log(error.data);
    }
  }

}
