import { Body, Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';
import axios from 'axios';
import { UserService } from './user/user.service';
import { ApiResponse } from '@nestjs/swagger';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService, private readonly userService: UserService) {}

  @Get()
  @ApiResponse({status: 200, description:'Replies "Hello World!" if the API is accessible'})
  getHello(): string {
    console.log(process.env.DATABASE_URL);
    return this.appService.getHello();
  }
}
