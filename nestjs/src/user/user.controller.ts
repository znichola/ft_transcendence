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
  Delete,
} from '@nestjs/common';
import { UserService } from './user.service';
import { FriendData, UserData, UserFriends } from '../interfaces';
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

  // TODO : UseGuards back
  // @UseGuards(AuthGuard)
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

  // TODO : UseGuards back
  // @UseGuards(AuthGuard)
  @ApiOperation({
    summary: 'Get all the data about a specific user, for profile display',
    description: 'a valid JWT token is required for this operation.'
  })
  @ApiResponse({
    status: 200,
    description: 'A UserData object with all the data for profile display is returned.'
  })
  @ApiResponse({
    status: 401,
    description: 'No JWT token found. (Uncomment UseGuard and remove this text later)'
  })
  @ApiResponse({
    status: 404,
    description: 'No user found with the provided login.'
  })
  @Get(':username')
  async getOne(@Param('username') username: string): Promise<UserData> {
    const userInfo = await this.userService.findUserFromLogin(username);
    if (!userInfo)
    {
      throw new HttpException('User not Found.', HttpStatus.NOT_FOUND);
    }
    return userInfo;
  }

  // REDO in PUT for real project?
  // TODO : UseGuards back
  // @UseGuards(AuthGuard)
  @ApiOperation({
    summary: 'Update the user profile.',
    description: 'Update the user profile with the UserData provided. There must be a valid JWT token, and the logged in user must be the user in the url.',
    requestBody: {
      description: 'Body must include a UserData object, with name and bio fields.',
      required: true,
      content: {
        'application/json': {
          schema:
          {
            example: {
              "name": "default42",
              "bio": 'This example is the bare minimum data required for the update to work 🍕'
            }
          }
      }}
      }
  })
  @ApiResponse({ status: 200, description: 'Profile has been updated. new updated UserData is returned' })
  @ApiResponse({ status: 400, description: 'UserData missing or imcomplete (implementation missing 👈)'})
  @ApiResponse({ status: 401, description: 'No JWT token found, or logged in user does not match URL user login.'})
  @Put(':username')
  async updateUser(
    @Param('username') username: string,
    @Body() bodyData: UserData,
    @Req() req: Request,
  ): Promise<UserData> {
    // TODO : Remove if condition after testing.
    // if (req.cookies.test)
    // {
    //   await this.authService.verifyUser(username, req.cookies.test.access_token);
    // }

    if (bodyData.name)
    {
      const user = await this.userService.findUserFromName(bodyData.name);
      if (user) 
      {
        throw new HttpException('Name already in use.', HttpStatus.BAD_REQUEST);
      }
    }
    return this.userService.updateUserName(
      username,
      bodyData.name,
      bodyData.bio,
    );
  }

  // TODO : UseGuards back
  // @UseGuards(AuthGuard)
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
  @ApiResponse({
    status: 401,
    description: 'No JWT token found. (Uncomment UseGuard and remove this text later)'
  })
  @ApiResponse({
    status: 404,
    description: 'No user found with the provided login.'
  })
  @Get(':username/friends')
  async userFriends(@Param('username') username: string): Promise<UserFriends> {
    const userId = await this.userService.getUserId(username);
    
    if (!userId)
    {
      throw new HttpException('User not Found.', HttpStatus.NOT_FOUND);
    }

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
    const friendList: UserFriends = {
      friends: approvedFriends,
      pending: pendingFriends,
      requests: requestsFriends,
    };
    return friendList;
  }

  // TODO : UseGuards back
  // @UseGuards(AuthGuard)
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
    description: 'Target missing in Body data, or similar to Sender.'
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
    // TODO : Remove if condition after testing.
    if (req.cookies.test)
    {
      await this.authService.verifyUser(username, req.cookies.test.access_token);
    }
    if (!bodyData.target)
    {
      throw new HttpException('Missing target in body data.', HttpStatus.BAD_REQUEST);
    }
    
    const users = await this.userService.getFriendsIds(username, bodyData.target);

    const friendStatus: string = await this.userService.getFriendStatus(users[0], users[1]);

    if (!friendStatus || friendStatus == '')
    {
      await this.userService.createFriend(users[0], users[1]);
      return ('sent');
    }
    return (friendStatus.toLowerCase());
  }

  // TODO : UseGuards back
  // @UseGuards(AuthGuard)
  @ApiOperation({
    summary: 'Remove a friend.',
    description: 'the user identified in the URL removes the user which login is in the body data from his friends. There must be a valid JWT token, and the logged in user must be the user in the url.',
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
    status: 200,
    description: 'Friend removed. (Or did not exist)',
  })
  @ApiResponse({
    status: 400,
    description: 'Target missing in Body data, or similar to Sender.'
  })
  @ApiResponse({
    status: 401,
    description: 'No JTW token found, or the logged in user is not the user in the request url',
  })
  @ApiResponse({
    status: 404,
    description: 'No user found with corresponding body target data.'
  })
  @Delete(':username/friends')
  async removeFriend(@Param('username') username: string, @Body() bodyData, @Req() req: Request)
  {
    // TODO : Remove if condition after testing.
    if (req.cookies.test)
    {
      await this.authService.verifyUser(username, req.cookies.test.access_token);
    }

    if (!bodyData.target)
    {
      throw new HttpException('Missing target in body data.', HttpStatus.BAD_REQUEST);
    }

    const users = await this.userService.getFriendsIds(username, bodyData.target);

    await this.userService.removeFriend(users[0], users[1]);
  }

  // TODO : UseGuards back
  // @UseGuards(AuthGuard)
  @ApiOperation({
    summary: 'Accept a friend request.',
    description: 'the user identified in the URL accept the friend request from the user which login is in the body data from his friends. There must be a valid JWT token, and the logged in user must be the user in the url.',
    requestBody: {
      description: 'Body must include the user who sent the friend request.',
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
    status: 200,
    description: 'Friend request accepted, or no friend request found with this data'
  })
  @ApiResponse({
    status: 400,
    description: 'Target missing in Body data, or similar to Sender.'
  })
  @ApiResponse({
    status: 401,
    description: 'No JTW token found, or the logged in user is not the user in the request url',
  })
  @ApiResponse({
    status: 404,
    description: 'No user found with corresponding body target data.'
  })
  @Put(':username/friends')
  async acceptFriend(@Param('username') username: string, @Body() bodyData, @Req() req: Request)
  {
    // TODO : Remove if condition after testing.
    // if (req.cookies.test)
    // {
    //   await this.authService.verifyUser(username, req.cookies.test.access_token);
    // }

    if (!bodyData.target)
    {
      throw new HttpException('Missing target in body data.', HttpStatus.BAD_REQUEST);
    }

    const users = await this.userService.getFriendsIds(username, bodyData.target);
    await this.userService.updateFriend(users[0], users[1]);
  }
}
