import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller('user')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('defaultus')
  getLogin() {
    const id: number = 1;
    const user: string = 'Defaultus Maximus';
    const friends: number = 42;
    const img_url: string = 'https://i.imgflip.com/2/aeztm.jpg';
    const rank: number = 81;
    return { id, user, friends, img_url, rank };
  }
}
