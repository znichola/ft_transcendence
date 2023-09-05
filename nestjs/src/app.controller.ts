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
  getLogin(){
    const id: number = 1
    const user: string = "Defaultus"
    const friends: number = 42
    return {id, user, friends}
  }
}
