import {
  Param,
  Controller,
  Get,
  Post,
  Body,
  Query,
  UseGuards,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from './user.service';
import { FriendData, UserData, UserFriend } from '../interfaces';
import { FriendStatus, UserStatus } from '@prisma/client';
import { AuthGuard } from 'src/auth/auth.guard';
import { AuthService } from 'src/auth/auth.service';
import { Request } from 'express';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}

  @Get()
  @ApiResponse({status: 200, description:'Provides a paginated list of all users, filtered by name and status.'})
  async getAllUsers(
    @Query('page') page: string,
    @Query('status') status?: string,
    @Query('name') name?: string,
  ): Promise<string[]> {
    let searchStatus: UserStatus = UserStatus[status];
    const usersInfo: string[] = await this.userService.findAll(
      parseInt(page),
      name,
      searchStatus,
    );
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
    @Req() req: Request,
  ): Promise<UserData> {
    const loggedUser: string = await this.authService.getLoginFromToken(
      req.cookies.test.access_token,
    );
    if (loggedUser != username) {
      throw new UnauthorizedException();
    }
    const user = await this.userService.findUserFromName(bodyData.name);
    if (user) {
      throw new Error('Name already in use.');
    }
    return this.userService.updateUserName(
      username,
      bodyData.name,
      bodyData.bio,
    );
  }

  @Get(':username/friends')
  async userFriends(@Param('username') username: string): Promise<UserFriend> {
    const userId = await this.userService.getUserId(username);
    const approvedFriends: FriendData[] =
      await this.userService.getUserFriends(userId);
    const pendingFriends: FriendData[] =
      await this.userService.getUserFriendsByStatus(
        userId,
        false,
        FriendStatus.PENDING,
      );
    const requestsFriends: FriendData[] =
      await this.userService.getUserFriendsByStatus(
        userId,
        true,
        FriendStatus.PENDING,
      );
    const friendList: UserFriend = {
      friends: approvedFriends,
      pending: pendingFriends,
      requests: requestsFriends,
    };
    return friendList;
  }

  @ApiTags('Friends')
  @ApiOperation({
    summary: 'Send a friend request to another user',
    description: 'the user identified in the URL send a friend request to the user which login is in the body data. There must be a valid JWT token, and the logged in user must be the user in the url.'
  })
  @ApiResponse({
    status: 401,
    description: 'No JTW token found, or the logged in user is not the user in the request url',

    // examples: {
    //   'application/json': 
    //   {
    //     target: 'default42'
    //   }
    // }
  })
  @Post(':username/friends')
  async addFriend(@Param('username') username: string, @Body() bodyData) {
    const userId = await this.userService.getUserId(username);
    const targetId = await this.userService.getUserId(bodyData.target);
    await this.userService.createFriend(userId, targetId);
  }
}
