import { Param, Controller, Get, Post, Body, Query } from '@nestjs/common';
import { UserService } from './user.service';
import { UserData } from '../interfaces';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async getAllUsers(@Query('page') page: string): Promise<UserData[]> {
    const usersInfo = await this.userService.findAll(parseInt(page));
    const promisedUsersInfo = usersInfo.map(async (user) => {
      user.status = await this.userService.getUserStatus(user.statusId);
      return user;
    });
    const parsedUsersInfo = await Promise.all(promisedUsersInfo);
    return parsedUsersInfo;

  }

  @Get(':username')
  async getOne(@Param('username') username: string): Promise<UserData> {
    const userInfo = await this.userService.findUser(username);
    userInfo.status = await this.userService.getUserStatus(userInfo.statusId);
    console.log(userInfo);
    return userInfo;
  }

  // REDO in PUT for real project
  @Post(':username')
  async updateUser(@Param('username') username: string, @Body() bodyData: UserData): Promise<UserData> {
    return this.userService.updateUserName(username, bodyData.name);
  }
}
