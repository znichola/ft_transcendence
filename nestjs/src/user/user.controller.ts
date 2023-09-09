import { Param, Controller, Get, Post, Body } from '@nestjs/common';
import { UserService } from './user.service';
import { UserData } from '../interfaces';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async getAllUsers(): Promise<object> {
    return this.userService.findAll();
  }

  @Get(':username')
  async getOne(@Param('username') username: string): Promise<UserData> {
    const userInfo = await this.userService.findUser(username);
    userInfo.status = await this.userService.getUserStatus(userInfo.statusId);
    console.log(userInfo);
    return userInfo;
  }

  @Post(':username')
  async updateUser(@Param('username') username: string): Promise<object> {
    return this.userService.updateUser(username, 'test2');
  }
}
