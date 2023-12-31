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
  UsePipes,
  ValidationPipe,
  Header
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
import { createReadStream } from 'fs';
import { UserProfileDto } from './dto';
import { ChatroomEntity } from 'src/chat/entities/chatroom.entity';

@ApiTags('User')
@UsePipes(new ValidationPipe({whitelist: true}))
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
  @ApiQuery({
    name: 'friend',
    description: 'Use true or false to look only for the current user friends, or for everyone',
    required: false,
    type: String,
    example: 'true',
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
    @Req() req: Request,
    @Query('page') page?: string,
    @Query('status') status?: string,
    @Query('name') name?: string,
    @Query('friend') friend?: string,
  ): Promise<string[]> {
    if (!page) page = '1';
    let searchStatus: UserStatus = UserStatus[status];
    let usersInfo: string[];
    if (friend == 'true')
    {
      const userLogin: string = await this.authService.getLoginFromToken(req.cookies[process.env.COOKIE_USR].access_token);
      usersInfo = await this.userService.findAllFriends(
        userLogin,
        parseInt(page),
        name,
        searchStatus,
      );
    }
    else
    {
      usersInfo = await this.userService.findAll(
        parseInt(page),
        name,
        searchStatus,
      );
    }
    return usersInfo;
  }

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
  async getUser(@Param('username') username: string, @Req() req: Request): Promise<UserData> {
    const userInfo = await this.userService.findUserFromLogin(username);
    if (!userInfo) {
      throw new HttpException('User not Found.', HttpStatus.NOT_FOUND);
    }
    const currentUser = await this.authService.getLoginFromToken(req.cookies[process.env.COOKIE_USR].access_token);
    if (username != currentUser)
      delete userInfo.tfaStatus;
    delete userInfo.tfaSecret;

    return userInfo;
  }

  @UseGuards(AuthGuard)
  @ApiOperation({
    summary: 'Get the list of Chatroom the user is in',
    description:
      'Each chatroom is represented by a ChatroomEntity containing multiple information. Being logged in is required',
  })
  @ApiResponse({ status: 200, description: 'list of the user\'s chatrooms'})
  @ApiResponse({ status: 401, description: 'No JTW token found' })
  @Get(':username/chatrooms')
  async getUserChatrooms(@Param('username') username: string, @Req() req: Request): Promise <ChatroomEntity[]>
  {
    await this.authService.verifyUser(username, req.cookies[process.env.COOKIE_USR].access_token);

    const chatrooms: ChatroomEntity[] = await this.userService.getChatrooms(username);
    return chatrooms;
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
  @Header('content-type', 'application/json')
  @Put(':username')
  async updateUser(
    @Param('username') username: string,
    @Body() bodyData: UserProfileDto,
    @Req() req: Request,
  ): Promise<UserData>
  {
    await this.authService.verifyUser(username, req.cookies[process.env.COOKIE_USR].access_token);

    if (bodyData.name) {
      const user = await this.userService.findUserFromName(bodyData.name);
      if (user && user.login42 != username) {
        throw new HttpException('Name already in use.', HttpStatus.BAD_REQUEST);
      }
      return this.userService.updateUserName(
        username,
        bodyData.name,
        bodyData.bio,
        );
      }
  }

  @UseGuards(AuthGuard)
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

  @UseGuards(AuthGuard)
  @UseInterceptors(FileInterceptor('file', saveImageToServer))
  @HttpCode(HttpStatus.OK)
  @Header('content-type', 'application/json')
  @Post(':username/avatar')
  async uploadAvatar(
    @UploadedFile(
      new ParseFilePipe({
        validators: [new MaxFileSizeValidator({ maxSize: 2000000 })],
      }),
    )
    file: Express.Multer.File,
    @Param('username') username: string,
    @Req() req: Request)
  {
    await this.authService.verifyUser(username, req.cookies[process.env.COOKIE_USR].access_token);

    const fileName = file?.filename;
    if (!fileName)
      throw new HttpException('Incorrect file type provided.', HttpStatus.BAD_REQUEST);
    const avatarUrl: string =
      process.env.SITE_URL +
      '/api/user/' +
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
  async userFriends(@Param('username') username: string, @Req() req: Request): Promise<UserFriends>
  {
    await this.authService.verifyUser(username, req.cookies[process.env.COOKIE_USR].access_token);
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
  @Header('content-type', 'application/json')
  @Post(':username/friends/:target')
  async addFriend(
    @Param('username') username: string,
    @Param('target') target: string,
    @Req() req: Request,
  ): Promise<string> {
    await this.authService.verifyUser(username, req.cookies[process.env.COOKIE_USR].access_token);

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
    await this.authService.verifyUser(username, req.cookies[process.env.COOKIE_USR].access_token);

    const users = await this.userService.getFriendsIds(username, target);

    await this.userService.removeFriend(users[0], users[1]);

    return ("Friend removed.");
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
  @Header('content-type', 'application/json')
  @Put(':username/friends/:target')
  async acceptFriend(
    @Param('username') username: string,
    @Param('target') target: string,
    @Req() req: Request,
  ) {
    await this.authService.verifyUser(username, req.cookies[process.env.COOKIE_USR].access_token);

    const users = await this.userService.getFriendsIds(username, target);
    await this.userService.updateFriend(users[0], users[1]);
  }

  @UseGuards(AuthGuard)
  @ApiOperation({
    summary: 'View all users blocked by someone',
    description:
      'This endpoint will provide the login list of all users blocked by the user named in the URL'
  })
  @ApiResponse({
    status: 200,
    description: 'A list of all blocked users'
  })
  @ApiResponse({
    status: 401,
    description:
      'No JTW token found, or the logged in user is not the user in the request url',
  })
  @Get(':username/block')
  async getAllBlocked(@Param('username') username: string, @Req() req: Request): Promise<String[]>
  {
    await this.authService.verifyUser(username, req.cookies[process.env.COOKIE_USR].access_token);
    const userId = await this.userService.getUserId(username);
    const result = await this.userService.getBlockedUsers(userId);
    return (result);
  }

  @UseGuards(AuthGuard)
  @ApiOperation({
    summary: 'Block another user.',
    description:
      'the first user identified in the URL blocks the second user. There must be a valid JWT token, and the logged in user must be the first user in the url.',
  })
  @ApiResponse({
    status: 200,
    description:
      'User was blocked.',
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
  @Header('content-type', 'application/json')
  @Post(':username/block/:target')
  async blockUser(@Param('username') username: string, @Param('target') target: string, @Req() req: Request)
  {
    await this.authService.verifyUser(username, req.cookies[process.env.COOKIE_USR].access_token);

    const users = await this.userService.getFriendsIds(username, target);
    await this.userService.addBlockedUser(users[0], users[1]);
  }

  @UseGuards(AuthGuard)
  @ApiOperation({
    summary: 'Unblocked another user.',
    description:
      'the first user identified in the URL unblocks the second user. There must be a valid JWT token, and the logged in user must be the first user in the url.',
  })
  @ApiResponse({
    status: 200,
    description:
      'User unblocked, or was not blocked in the first place.',
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
  @Header('content-type', 'application/json')
  @Delete(':username/block/:target')
  async unblockUser(@Param('username') username: string, @Param('target') target: string, @Req() req: Request)
  {
    await this.authService.verifyUser(username, req.cookies[process.env.COOKIE_USR].access_token);
    const users = await this.userService.getFriendsIds(username, target);
    await this.userService.removeBlockedUser(users[0], users[1]);
  }
}
