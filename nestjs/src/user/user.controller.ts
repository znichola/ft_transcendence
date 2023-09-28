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
  Put,
  NotFoundException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { UserService } from './user.service';
import { FriendData, UserData, UserFriend } from '../interfaces';
import { FriendStatus, UserStatus } from '@prisma/client';
import { AuthGuard } from 'src/auth/auth.guard';
import { AuthService } from 'src/auth/auth.service';
import { Request } from 'express';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}

  @UseGuards(AuthGuard)
  @ApiQuery({
    name: 'page',
    description: 'set the page to use for the pagination (default 1)',
    required: false,
    type: String
  })
  @ApiQuery({
    name: 'status',
    description: 'only display user with specific status',
    required: false,
    type: String,
    example: 'ONLINE'
  })
  @ApiQuery({
    name: 'name',
    description: 'only display user with specific string in they login or name',
    required: false,
    type: String,
    example: 'funny'
  })
  @ApiOperation({
    summary: 'Get a paginated list of users',
    description: 'A valid JWT token is required in the cookies for this operation. The paginated list can be filtered using optional query string parameters.',
  })
  @ApiResponse({ status: 401, description: 'No JTW token found' })
  @ApiResponse({ status: 200, description:'Paginated list of all users, filtered by name and status.',
    content: {
      JSON: {
        example:
          [
            "coding_ninja",
            "Rebecca_Kling1",
            "Justine_Hills69",
            "Tiffany_Weber89",
            "Natalie_Miller",
            "Octavia.Hettinger",
            "Timmothy39",
            "Elissa_Legros",
            "Kayley_Mante44",
            "Deja_Kihn"
          ]
      }
    }
  })
  @Get()
  async getAllUsers(
    @Query('page') page?: string,
    @Query('status') status?: string,
    @Query('name') name?: string,
  ): Promise<string[]> 
  {
    if (!page) page = '1';
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
  @Put(':username')
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

  @ApiOperation({
    summary: 'Get all the accepted and pending friend request for the username requested',
  })
  @ApiResponse({
    status: 200,
    description: 'Three different lists with accepted requests, pending requests, and requests waiting for answer from the user',
    content: {JSON: {
      schema:
      {
        example: {
          "friends": [],
          "pending": [],
          "requests": []
        }
      }
    }}
  })
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

  @UseGuards(AuthGuard)
  @ApiOperation({
    summary: 'Send a friend request to another user',
    description: 'the user identified in the URL send a friend request to the user which login is in the body data. There must be a valid JWT token, and the logged in user must be the user in the url.',
    requestBody: {
      description: 'Body must include the user to add to friends',
      required: true,
      content: {
        'application/json': {
          schema:
          {
            example: {
              "target": "default42"
            }
          }
      }}
      }
  })
  @ApiResponse({
    status: 201,
    description: 'Friend request created if it did not exist already',
    content: {
      'application/json': { example: 'sent'}
    }
  })
  @ApiResponse({
    status: 400,
    description: 'You cannot add yourself as a friend.'
  })
  @ApiResponse({
    status: 401,
    description: 'No JTW token found, or the logged in user is not the user in the request url',
  })
  @ApiResponse({
    status: 404,
    description: 'No user found with corresponding body target data.'
  })
  @Post(':username/friends')
  async addFriend(@Param('username') username: string, @Body() bodyData, @Req() req: Request): Promise<string> 
  {
    const loggedIn: string = await this.authService.getLoginFromToken(req.cookies.test.access_token);
    if (loggedIn != username)
    {
      throw new UnauthorizedException();
    }

    const userId: number = await this.userService.getUserId(username);
    const targetId: number = await this.userService.getUserId(bodyData.target);
    
    if (!userId || !targetId)
    {
      throw new NotFoundException();
    }

    if (userId == targetId)
    {
      throw new HttpException('You cannot add yourself as a friend.', HttpStatus.BAD_REQUEST);
    }

    const friendStatus: string = await this.userService.getFriendStatus(userId, targetId);

    if (!friendStatus || friendStatus == '')
    {
      await this.userService.createFriend(userId, targetId);
      return ('sent');
    }
    return (friendStatus.toLowerCase());
  }
}
