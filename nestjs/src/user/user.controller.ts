import { Param, Controller, Get, Post, Body } from '@nestjs/common';
import { UserService } from './user.service';
import { UserData } from '../interfaces';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async getAllUsers(): Promise<UserData[]> {
    const usersInfo = await this.userService.findAll();
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

  @Post(':username')
  async updateUser(@Param('username') username: string, @Body() bodyData: UserData): Promise<UserData> {
    return this.userService.updateUserName(username, bodyData.name);
  }
}
