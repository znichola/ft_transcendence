import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
  UseGuards,
} from '@nestjs/common';
import { FriendStatus, User, UserStatus } from '@prisma/client';
import { contains } from 'class-validator';
import { existsSync } from 'fs';
import { AuthGuard } from 'src/auth/auth.guard';
import { ChatroomEntity, ChatroomWithUsername } from 'src/chat/entities/chatroom.entity';
import { FriendData, UserData } from 'src/interfaces';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserGateway } from './user.gateway';
import { UserNameEntity } from './user.entity';

const prisma: PrismaService = new PrismaService();

@Injectable()
export class UserService {
  constructor(private userGateway: UserGateway){}

  async findAll(page?: number, searchName?: string, findStatus?: UserStatus ): Promise<string[]> {
    const allUsers = await prisma.user.findMany({
      select: { login42: true },
      where: {
        OR: [
          {
            login42: {  mode: 'insensitive', contains: searchName || '' },
          },
          {
            name: {  mode: 'insensitive', contains: searchName || '' },
          },
        ],
        status: findStatus
      },
      skip: (page - 1) * 10 || 0,
      take: 10,
      orderBy: {
        elo: 'desc',
      },
    });

    const usersArray: string[] = allUsers.map((user) => user.login42);
    return usersArray;
  }

  async findAllFriends(user: string, page?: number, searchName?: string, findStatus?: UserStatus ): Promise<string[]>
  {
    const userId = await this.getUserId(user);
    const allFriends = await prisma.friend.findMany({
      where: {
        OR: [
          {
            user1Id: userId,
            user2: {
              OR: [
                {
                  login42: { mode: 'insensitive', contains: searchName || '' }
                },
                {
                  name: { mode: 'insensitive', contains: searchName || '' }
                }
              ],
              status: findStatus,
            }
          },
          {
            user2Id: userId,
            user1: {
              OR: [
                {
                  login42: { mode: 'insensitive', contains: searchName || '' }
                },
                {
                  name: { mode: 'insensitive', contains: searchName || '' }
                }
              ],
              status: findStatus,
            }
          }
        ],
        status: FriendStatus.ACCEPTED,
      },
      select: { 
        user1Id: true,
        user2Id: true
      }
    });

    console.log(allFriends);

    let filteredFriends: string[] = [];
    console.log('logging friendships');
    for (const friendship of allFriends) {
      if (friendship.user1Id != userId)
      {
        const friendLogin = await this.getUserLogin(friendship.user2Id);
        filteredFriends.push(friendLogin);
      }
      else
      {
        const friendLogin = await this.getUserLogin(friendship.user2Id);
        filteredFriends.push(friendLogin);
      }
    }
    return filteredFriends;

  }

  async findUserFromLogin(login: string): Promise<UserData> {
    const user = await prisma.user.findUnique({
      where: {
        login42: login,
      },
    });
    return user;
  }

  async findUserFromId(userId: number): Promise<UserData> {
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });
    return user;
  }

  async findUserFromName(name: string): Promise<UserData> {
    const user = await prisma.user.findUnique({
      where: {
        name: name,
      },
    });
    return user;
  }

  async updateUserName(
    login: string,
    newName: string,
    newBio: string,
  ): Promise<UserData> {
    const user = await prisma.user.update({
      where: {
        login42: login,
      },
      data: {
        name: newName,
        bio: newBio,
      },
    });
    return user;
  }

  async getUserLogin(id: number): Promise<string> {
    const user = await prisma.user.findUnique({
      where: { id: id },
      select: { login42: true },
    });
    if (!user) return null;
    return user.login42;
  }

  async getUserId(login: string): Promise<number> {
    const user = await prisma.user.findUnique({
      where: { login42: login },
      select: { id: true },
    });
    if (!user) return null;
    return user.id;
  }

  async getFriendData(userId: number): Promise<FriendData> {
    const friend = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        login42: true,
        name: true,
        avatar: true,
        status: true,
      },
    });
    return friend;
  }

  async getUserFriends(userId: number): Promise<FriendData[]> {
    const userFriends = await prisma.friend.findMany({
      where: {
        OR: [
          {
            user1Id: userId,
          },
          {
            user2Id: userId,
          },
        ],
        status: FriendStatus.ACCEPTED,
      },
    });

    const userPromises = userFriends.map(async (value) => {
      let user: FriendData;
      if (value.user1Id == userId) {
        user = await this.getFriendData(value.user2Id);
      } else {
        user = await this.getFriendData(value.user1Id);
      }
      return user;
    });

    const results: FriendData[] = await Promise.all(userPromises);
    return results;
  }

  async getUserFriendsByStatus(
    userId: number,
    incoming: boolean,
    status: FriendStatus,
  ): Promise<FriendData[]> {
    const whereCondition: {
      user1Id?: number;
      user2Id?: number;
      status: FriendStatus;
    } = { status: status };
    if (incoming) {
      whereCondition.user2Id = userId;
    } else {
      whereCondition.user1Id = userId;
    }
    const pending = await prisma.friend.findMany({
      where: whereCondition,
    });
    const userPromises = pending.map(async (value) => {
      let user: FriendData;
      if (value.user1Id == userId) {
        user = await this.getFriendData(value.user2Id);
      } else {
        user = await this.getFriendData(value.user1Id);
      }
      return user;
    });
    const results: FriendData[] = await Promise.all(userPromises);
    return results;
  }

  async getFriendsIds(user1: string, user2: string): Promise<number[]> {
    const userId: number = await this.getUserId(user1);
    const targetId: number = await this.getUserId(user2);

    if (!userId || !targetId) {
      throw new NotFoundException();
    }

    if (userId == targetId) {
      throw new HttpException(
        'sender and target IDs must be differents.',
        HttpStatus.BAD_REQUEST,
      );
    }
    return [userId, targetId];
  }

  async getFriendStatus(
    requesterId: number,
    receiverId: number,
  ): Promise<string> {
    const friendStatus = await prisma.friend.findFirst({
      where: {
        OR: [
          {
            user1Id: requesterId,
            user2Id: receiverId,
          },
          {
            user1Id: receiverId,
            user2Id: requesterId,
          },
        ],
      },
      select: {
        user1Id: true,
        status: true,
      },
    });
    if (!friendStatus) {
      return '';
    }
    if (
      friendStatus.user1Id == requesterId &&
      friendStatus.status == 'PENDING'
    ) {
      return 'SENT';
    }
    return friendStatus.status;
  }

  async createFriend(requesterId: number, receiverId: number) {
    const request = await prisma.friend.create({
      data: {
        user1Id: requesterId,
        user2Id: receiverId,
      },
      select: {
        user1: { select: {
          login42: true,
          name: true,
        }},
        user2: { select: { login42: true }}
      }
    });
    const sender = new UserNameEntity(request.user1.login42, request.user1.name);
    this.userGateway.sendFriendRequest(request.user2.login42, sender);
  }

  async removeFriend(user1: number, user2: number) {
    await prisma.friend.deleteMany({
      where: {
        OR: [
          {
            user1Id: user1,
            user2Id: user2,
          },
          {
            user1Id: user2,
            user2Id: user1,
          },
        ],
        AND: {
          NOT: {
            status: FriendStatus.BLOCKED,
          },
        },
      },
    });
  }

  async updateFriend(user1: number, user2: number) {
    await prisma.friend.updateMany({
      where: { user1Id: user2, user2Id: user1 },
      data: { status: FriendStatus.ACCEPTED },
    });
  }

  getAvatar(login: string): string
  {
    const validFileExtensions = ['.jpg', '.jpeg', '.png'];
    let foundPath = null;
    for(let extension of validFileExtensions) {
      const imagePath = './avatars/' + login + extension;
      if (existsSync(imagePath)) {
        foundPath = imagePath;
        break;
      }
    }
    return foundPath;
  }

  async updateAvatar(login: string, newAvatar: string)
  {
    await prisma.user.update({
      where: { login42: login },
      data: { avatar: newAvatar }
    })
  }

  async getBlockedUsers(user: number): Promise<String[]>
  {
    const blockedUsers = await prisma.friend.findMany({
      where: { user1Id: user, status: FriendStatus.BLOCKED }
    });

    const blockedPromises = blockedUsers.map(async (value) => 
    {
      let user: FriendData;
      user = await this.getFriendData(value.user2Id);
      return user.login42;
    });

    const results: string[] = await Promise.all(blockedPromises);
    return results;
  }

  async addBlockedUser(user: number, target: number)
  {
    const relation = await prisma.friend.findFirst({
      where: { user1Id: user, user2Id: target },
      select: { id: true}
    })
    let relationId: number;
    relation ? relationId = relation.id : relationId = 0;
    await prisma.friend.upsert({
      where: { id: relationId },
      create: {
        user1Id: user,
        user2Id: target,
        status: FriendStatus.BLOCKED,
      },
      update: { status: FriendStatus.BLOCKED },
    })
  }

  async removeBlockedUser(user:number, target: number)
  {
    const blocked = await prisma.friend.findFirst({
      where: { user1Id: user, user2Id: target, AND: { status: FriendStatus.BLOCKED } },
      select: { id: true}
    })
    if (blocked)
    {
      await prisma.friend.delete({
        where: { id: blocked.id }
      })
    }
  }

  async getChatrooms(userLogin: string): Promise<ChatroomEntity[]>
  {
    let result: ChatroomEntity[] = [];
    const chatrooms: ChatroomWithUsername[] = await prisma.chatroom.findMany({
      where: { 
        chatroomUsers: {
           some: { user: {login42: userLogin }}
        },
      },
      select: {
        id: true,
				name: true,
				status: true,
				owner: {
					select: {
						login42: true
					}
				}
      }
    });
    
    console.log(chatrooms);
    chatrooms.forEach(room => {
      const chatroom: ChatroomEntity = new ChatroomEntity(room);
      result.push(chatroom);
    });

    return result;
  }
}
