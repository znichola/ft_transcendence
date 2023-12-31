import { HttpException, HttpStatus, Injectable, NotFoundException, BadRequestException, ForbiddenException, ConflictException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateChatroomDto } from '../dto/create-chatroom-dto';
import { UpdateVisibilityDto } from '../dto/update-visibility-dto';
import PasswordValidator = require("password-validator");
import { UpdateOwnerDto } from '../dto/update-owner-dto';
import { ChatroomEntity, ChatroomWithUsername } from '../entities/chatroom.entity';
import * as bcrypt from 'bcrypt';
import { ChatUtils } from './chat-utils.service';

@Injectable()
export class ChatService
{
	constructor(private prisma: PrismaService,
		private readonly utils: ChatUtils){}

	async getAllVisibleChatRooms(identity: string): Promise<ChatroomEntity[]>
	{
		const chatroomsFromDb: ChatroomWithUsername[] = await this.prisma.chatroom.findMany({
			where: {
				OR:[
					{
						status: "PUBLIC"
					},
					{
						status: "PROTECTED"
					},
					{
						chatroomUsers: {
							some: {
								user: {
									login42: identity
								}
							}
						}
					}
				]
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

		const chatroomEntities: ChatroomEntity[] = chatroomsFromDb.map(chatroom => new ChatroomEntity(chatroom));
		return chatroomEntities;
	}

	async createNewChatRoom(chatroomDto: CreateChatroomDto, identity: string): Promise<ChatroomEntity>
	{
		const userId: number = await this.utils.getUserId(identity);

		this.utils.checkPasswordPresence(chatroomDto);

		let hash = null;

		if (chatroomDto.status == "PROTECTED")
		{
			this.utils.validatePassword(chatroomDto.password);

			const saltOrRounds = 10;
			hash = await bcrypt.hash(chatroomDto.password, saltOrRounds);
		}

		let newChatroom: ChatroomWithUsername;
		try {
			newChatroom = await this.prisma.chatroom.create({
				data: {
					ownerId: +userId,
					name: chatroomDto.name,
					status: chatroomDto.status,
					password: hash,
					chatroomUsers: {
						create: {
							userId: +userId,
							role: "OWNER"
						}
					}
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
		}
		catch (e: any)
		{
			if (e.code == 'P2002')
				throw new ConflictException("A chatroom with the same name already exists");
			else
				throw e;
		}

		return new ChatroomEntity(newChatroom);
	}

	async getOneChatRoom(chatroomId: number, identity: string): Promise<ChatroomEntity>
	{
		const chatroomFromDb: ChatroomWithUsername = await this.prisma.chatroom.findUniqueOrThrow({
			where: {
				id: +chatroomId,
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

		if (chatroomFromDb.status == "PRIVATE")
		{
			const userId = await this.utils.getUserId(identity);
			if (!await this.utils.isMember(userId, chatroomId))
				throw new ForbiddenException("You are not a member of this chatroom");
		}

		return new ChatroomEntity(chatroomFromDb);
	}

	async deleteChatroom(id: number, identity: string)
	{
		const chatroom = await this.prisma.chatroom.findUniqueOrThrow({
			where: {
				id: +id,
			},
			select: {
				owner: {
					select: {
						login42: true
					}
				}
			}
		});

		if (chatroom.owner.login42 != identity)
			throw new ForbiddenException("You are not the owner of this chatroom");

		await this.prisma.chatroom.delete({
			where: {
				id: +id,
			},
		});
	}

	async updateChatroomVisibility(id: number, updateChatroomDto: UpdateVisibilityDto, identity: string)
	{
		const userId = await this.utils.getUserId(identity);
		if (!await this.utils.isOwner(userId, id))
			throw new ForbiddenException("You are not the owner of this chatroom");

		this.utils.checkPasswordPresence(updateChatroomDto);

		let hash = null;

		if (updateChatroomDto.status == "PROTECTED")
		{
			this.utils.validatePassword(updateChatroomDto.password);

			const saltOrRounds = 10;
			hash = await bcrypt.hash(updateChatroomDto.password, saltOrRounds);
		}

		await this.prisma.chatroom.update({
			where: {
				id: +id,
			},
			data: {
				status: updateChatroomDto.status,
				password: hash,
			}
		});
	}

	async updateChatroomOwner(id: number, patch: UpdateOwnerDto, identity: string)
	{
		const userId = await this.utils.getUserId(identity);
		if (!await this.utils.isOwner(userId, id))
			throw new ForbiddenException("You are not the owner of this chatroom");

		const newOwnerId = await this.utils.getUserId(patch.ownerLogin42);

		await this.utils.checkIsMember(newOwnerId, id);

		const chatroom = await this.prisma.chatroom.findUniqueOrThrow({
			where: {
				id: +id
			},
			select: {
				ownerId: true
			}
		});

		const oldOwnerId = chatroom.ownerId;

		/* set the new owner as owner of the chatroom */
		await this.prisma.chatroom.update({
			where: {
				id: +id,
			},
			data: {
				ownerId: +newOwnerId,
				chatroomUsers: {
					update: [
						{
							where: {
								chatroomId_userId: {chatroomId: +id, userId: newOwnerId}
							},
							data: {
								role: "OWNER"
							}
						},
						{
							where: {
								chatroomId_userId: {chatroomId: +id, userId: +oldOwnerId},
							},
							data: {
								role: "ADMIN"
							}
						}
					]
				}
			}
		});
	}
}
