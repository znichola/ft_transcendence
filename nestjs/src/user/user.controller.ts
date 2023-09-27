import { Param, Controller, Get, Post, Body, Query, UseGuards, Req, UnauthorizedException } from '@nestjs/common';
import { UserService } from './user.service';
import { FriendData, UserData, UserFriend } from '../interfaces';
import { FriendStatus, UserStatus } from '@prisma/client';
import { AuthGuard } from 'src/auth/auth.guard';
import { AuthService } from 'src/auth/auth.service';
import { Request } from 'express';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService, private readonly authService: AuthService) {}

  @Get()
  async getAllUsers(@Query('page') page: string, @Query('status') status?: string, @Query('name') name?:string): Promise<string[]> {
    let searchStatus: UserStatus = UserStatus[status];
    console.log(searchStatus);
    const usersInfo: string[] = await this.userService.findAll(parseInt(page), name, searchStatus);
    return usersInfo;
  }

  @Get(':username')
  async getOne(@Param('username') username: string): Promise<UserData> {
    const userInfo = await this.userService.findUserFromLogin(username);
    if (!userInfo) {
      return null;
    }
    return userInfo;
  }

  // REDO in PUT for real project?
  @UseGuards(AuthGuard)
  @Post(':username')
  async updateUser(
    @Param('username') username: string,
    @Body() bodyData: UserData,
    @Req() req: Request
  ): Promise<UserData> {
    const loggedUser: string = await this.authService.getLoginFromToken(req.cookies.test.access_token);
    if (loggedUser != username)
    {
      throw new UnauthorizedException();
    }
    const user = await this.userService.findUserFromName(bodyData.name);
    if (user)
    {
      throw new Error("Name already in use.");
    }
    return this.userService.updateUserName(username, bodyData.name, bodyData.bio);
  }

  @Get(':username/friends')
  async userFriends(@Param('username') username: string): Promise<UserFriend> {
    const userId = await this.userService.getUserId(username);
    const approvedFriends: FriendData[] = await this.userService.getUserFriends(userId);
    const pendingFriends: FriendData[] = await this.userService.getUserFriendsByStatus(userId, false, FriendStatus.PENDING);
    const requestsFriends: FriendData[] = await this.userService.getUserFriendsByStatus(userId, true, FriendStatus.PENDING);
    const friendList: UserFriend = {
      friends: approvedFriends,
      pending: pendingFriends,
      requests: requestsFriends,
    };
    return friendList;
  }

  @Post(':username/friends')
  async addFriend(@Param('username') username: string, @Body() bodyData) {
    const userId = await this.userService.getUserId(username);
    const receiverId = await this.userService.getUserId(bodyData.receiver)
    await this.userService.createFriend(userId, receiverId);
  }
}
