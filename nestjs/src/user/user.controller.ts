import { Param, Controller, Get, Post, Body } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async getAllUsers(): Promise<object> {
    return this.userService.findAll();
  }

  @Get(':username')
  async getOne(@Param('username') username: string) : Promise<object> {
    return this.userService.findUser(username);
  }

  @Post(':username')
  async updateUser(@Param('username') username: string) : Promise<object> {
    return this.userService.updateUser(username, 'test2');
  }
}