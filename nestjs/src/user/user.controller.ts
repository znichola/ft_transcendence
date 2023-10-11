import {
  Param,
  Controller,
  Get,
  Post,
  Body,
  Query,
  UseGuards,
  Req,
  Put,
  HttpException,
  HttpStatus,
  Delete,
  HttpCode,
  UploadedFile,
  ParseFilePipe,
  MaxFileSizeValidator,
  UseInterceptors,
  Res,
} from '@nestjs/common';
import { UserService } from './user.service';
import { FriendData, UserData, UserFriends } from '../interfaces';
import { FriendStatus, UserStatus } from '@prisma/client';
import { AuthGuard } from 'src/auth/auth.guard';
import { AuthService } from 'src/auth/auth.service';
import { Request, Response } from 'express';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { saveImageToServer } from 'src/utils/avatar-storage';
import { createReadStream, existsSync } from 'fs';

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
    type: String,
  })
  @ApiQuery({
    name: 'status',
    description: 'only display user with specific status',
    required: false,
    type: String,
    example: 'ONLINE',
  })
  @ApiQuery({
    name: 'name',
    description: 'only display user with specific string in they login or name',
    required: false,
    type: String,
    example: 'funny',
  })
  @ApiOperation({
    summary: 'Get a paginated list of users',
    description:
      'A valid JWT token is required in the cookies for this operation. The paginated list can be filtered using optional query string parameters.',
  })
  @ApiResponse({ status: 401, description: 'No JTW token found' })
  @ApiResponse({
    status: 200,
    description: 'Paginated list of all users, filtered by name and status.',
    content: {
      JSON: {
        example: [
          'coding_ninja',
          'Rebecca_Kling1',
          'Justine_Hills69',
          'Tiffany_Weber89',
          'Natalie_Miller',
          'Octavia.Hettinger',
          'Timmothy39',
          'Elissa_Legros',
          'Kayley_Mante44',
          'Deja_Kihn',
        ],
      },
    },
  })
  @Get()
  async getAllUsers(
    @Query('page') page?: string,
    @Query('status') status?: string,
    @Query('name') name?: string,
  ): Promise<string[]> {
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
  @UseGuards(AuthGuard)
  @ApiOperation({
    summary: 'Get all the data about a specific user, for profile display',
    description: 'a valid JWT token is required for this operation.',
  })
  @ApiResponse({
    status: 200,
    description:
      'A UserData object with all the data for profile display is returned.',
  })
  @ApiResponse({
    status: 401,
    description:
      'No JWT token found. (Uncomment UseGuard and remove this text later)',
  })
  @ApiResponse({
    status: 404,
    description: 'No user found with the provided login.',
  })
  @Get(':username')
  async getUser(@Param('username') username: string): Promise<UserData> {
    const userInfo = await this.userService.findUserFromLogin(username);
    if (!userInfo) {
      throw new HttpException('User not Found.', HttpStatus.NOT_FOUND);
    }
    return userInfo;
  }

  @UseGuards(AuthGuard)
  @ApiOperation({
    summary: 'Update the user profile.',
    description:
      'Update the user profile with the UserData provided. There must be a valid JWT token, and the logged in user must be the user in the url.',
    requestBody: {
      description:
        'Body must include a UserData object, with name and bio fields.',
      required: true,
      content: {
        'application/json': {
          schema: {
            example: {
              name: 'default42',
              bio: 'This example is the bare minimum data required for the update to work 🍕',
            },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Profile has been updated. new updated UserData is returned',
  })
  @ApiResponse({
    status: 400,
    description: 'UserData missing or imcomplete (implementation missing 👈)',
  })
  @ApiResponse({
    status: 401,
    description:
      'No JWT token found, or logged in user does not match URL user login.',
  })
  @Put(':username')
  async updateUser(
    @Param('username') username: string,
    @Body() bodyData: UserData,
    @Req() req: Request,
  ): Promise<UserData> {
    await this.authService.verifyUser(username, req.cookies.test.access_token);

    if (bodyData.name) {
      const user = await this.userService.findUserFromName(bodyData.name);
      if (user) {
        throw new HttpException('Name already in use.', HttpStatus.BAD_REQUEST);
      }
    }
    return this.userService.updateUserName(
      username,
      bodyData.name,
      bodyData.bio,
    );
  }

  @HttpCode(HttpStatus.OK)
  @Get(':username/avatar')
  async getAvatar(@Param('username') username: string, @Res() res: Response) {
    const imagePath = this.userService.getAvatar(username);
    if (!imagePath)
      throw new HttpException('No Avatar Found.', HttpStatus.NOT_FOUND);
    const contentType =
      'image/' + imagePath.slice(imagePath.lastIndexOf('.') + 1);
    const filename = imagePath.slice(imagePath.lastIndexOf('/') + 1);

    res.setHeader('Content-Type', contentType);
    res.setHeader('Content-Disposition', `inline; filename=${filename}`);
    createReadStream(imagePath).pipe(res);
  }

  // @UseGuards(AuthGuard)
  @UseInterceptors(FileInterceptor('file', saveImageToServer))
  @HttpCode(HttpStatus.OK)
  @Post(':username/avatar')
  async uploadAvatar(
    @UploadedFile(
      new ParseFilePipe({
        validators: [new MaxFileSizeValidator({ maxSize: 2000000 })],
      }),
    )
    file: Express.Multer.File,
    @Param('username') username: string)
  {
    const fileName = file?.filename;
    if (!fileName)
      throw new HttpException('Incorrect file type provided.', HttpStatus.BAD_REQUEST);
    const avatarUrl: string =
      'http://' +
      process.env.IP_ADDR +
      ':8080/api/user/' +
      username +
      '/avatar';
    await this.userService.updateAvatar(username, avatarUrl);
  }

  @UseGuards(AuthGuard)
  @ApiOperation({
    summary:
      'Get all the accepted and pending friend request for the username requested',
  })
  @ApiResponse({
    status: 200,
    description:
      'Three different lists with accepted requests, pending requests, and requests waiting for answer from the user',
    content: {
      JSON: {
        schema: {
          example: {
            friends: [],
            pending: [],
            requests: [],
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description:
      'No JWT token found. (Uncomment UseGuard and remove this text later)',
  })
  @ApiResponse({
    status: 404,
    description: 'No user found with the provided login.',
  })
  @Get(':username/friends')
  async userFriends(@Param('username') username: string): Promise<UserFriends> {
    const userId = await this.userService.getUserId(username);

    if (!userId) {
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

  @UseGuards(AuthGuard)
  @ApiOperation({
    summary: 'Send a friend request to another user',
    description:
      'the first user identified in the URL sends a friend request to the second user. There must be a valid JWT token, and the logged in user must be the first user in the url.',
  })
  @ApiResponse({
    status: 201,
    description: 'Friend request created if it did not exist already',
    content: {
      'application/json': { example: 'sent' },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Target similar to Sender.',
  })
  @ApiResponse({
    status: 401,
    description:
      'No JTW token found, or the logged in user is not the user in the request url',
  })
  @ApiResponse({
    status: 404,
    description: 'No user found with corresponding username or target data.',
  })
  @Post(':username/friends/:target')
  async addFriend(
    @Param('username') username: string,
    @Param('target') target: string,
    @Req() req: Request,
  ): Promise<string> {
    await this.authService.verifyUser(username, req.cookies.test.access_token);
    const users = await this.userService.getFriendsIds(username, target);

    const friendStatus: string = await this.userService.getFriendStatus(
      users[0],
      users[1],
    );

    if (!friendStatus || friendStatus == '') {
      await this.userService.createFriend(users[0], users[1]);
      return 'sent';
    }
    return friendStatus.toLowerCase();
  }

  @UseGuards(AuthGuard)
  @ApiOperation({
    summary: 'Remove a friend.',
    description:
      'the first user identified in the URL removes the second user from his friends. There must be a valid JWT token, and the logged in user must be the first user in the url.',
  })
  @ApiResponse({
    status: 200,
    description: 'Friend removed. (Or did not exist)',
  })
  @ApiResponse({
    status: 400,
    description: 'Target missing in Body data, or similar to Sender.',
  })
  @ApiResponse({
    status: 401,
    description:
      'No JTW token found, or the logged in user is not the user in the request url',
  })
  @ApiResponse({
    status: 404,
    description: 'No user found with corresponding username or target data.',
  })
  @HttpCode(HttpStatus.OK)
  @Delete(':username/friends/:target')
  async removeFriend(
    @Param('username') username: string,
    @Param('target') target: string,
    @Req() req: Request,
  ) {
    await this.authService.verifyUser(username, req.cookies.test.access_token);
    const users = await this.userService.getFriendsIds(username, target);

    await this.userService.removeFriend(users[0], users[1]);
  }

  @UseGuards(AuthGuard)
  @ApiOperation({
    summary: 'Accept a friend request.',
    description:
      'the first user identified in the URL accepts the friend request from the second user. There must be a valid JWT token, and the logged in user must be the first user in the url.',
  })
  @ApiResponse({
    status: 200,
    description:
      'Friend request accepted, or no friend request found with this data',
  })
  @ApiResponse({
    status: 400,
    description: 'Target similar to Sender.',
  })
  @ApiResponse({
    status: 401,
    description:
      'No JTW token found, or the logged in user is not the user in the request url',
  })
  @ApiResponse({
    status: 404,
    description: 'No user found with corresponding username or target data.',
  })
  @Put(':username/friends/:target')
  async acceptFriend(
    @Param('username') username: string,
    @Param('target') target: string,
    @Req() req: Request,
  ) {
    await this.authService.verifyUser(username, req.cookies.test.access_token);
    const users = await this.userService.getFriendsIds(username, target);
    await this.userService.updateFriend(users[0], users[1]);
  }

  @Post(':username/block/:target')
  async blockUser(@Param('username') username: string, @Param('target') target: string, @Req() req: Request)
  {
    await this.authService.verifyUser(username, req.cookies.test.access_token);
    const users = await this.userService.getFriendsIds(username, target);
    await this.userService.addBlockedUser(users[0], users[1]);
  }

  @Delete(':username/block/:target')
  async unblockUser(@Param('username') username: string, @Param('target') target: string, @Req() req: Request)
  {
    await this.authService.verifyUser(username, req.cookies.test.access_token);
    const users = await this.userService.getFriendsIds(username, target);
    await this.userService.removeBlockedUser(users[0], users[1]);
  }
}
