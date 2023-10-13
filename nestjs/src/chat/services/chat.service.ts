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

	async getAllChatRooms(): Promise<ChatroomEntity[]>
	{
		const chatroomsFromDb: ChatroomWithUsername[] = await this.prisma.chatroom.findMany({
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

	async createNewChatRoom(chatroomDto: CreateChatroomDto)
	{
		const userId: number = await this.utils.getUserId(chatroomDto.ownerLogin42);

		this.utils.checkPasswordPresence(chatroomDto);

		let hash = null;

		if (chatroomDto.status == "PROTECTED")
		{
			this.utils.validatePassword(chatroomDto.password);

			const saltOrRounds = 10;
			hash = await bcrypt.hash(chatroomDto.password, saltOrRounds);
		}

		/* create new chatroom and return new chatroom id */
		let newChatroom;
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
					id: true
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
	}

	async getOneChatRoom(chatroomId: number): Promise<ChatroomEntity>
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

		return new ChatroomEntity(chatroomFromDb);
	}

	async deleteChatroom(id: number)
	{
		await this.utils.checkChatroomExists(id);

		/* first we must delete all messages of chatroom */
		await this.prisma.message.deleteMany({
			where: {
				chatroomId: +id,
			}
		});

		/* then all members from chatroom */
		await this.prisma.chatroomUser.deleteMany({
			where: {
				chatroomId: +id,
			}
		});

		await this.prisma.chatroom.delete({
			where: {
				id: +id,
			},
		});
	}

	async updateChatroomVisibility(id: number, updateChatroomDto: UpdateVisibilityDto)
	{
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

	async updateChatroomOwner(id: number, patch: UpdateOwnerDto)
	{
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
			}
		});

		/* set the new owner as OWNER */
		await this.prisma.chatroomUser.update({
			where: {
				chatroomId_userId: {chatroomId: +id, userId: newOwnerId}
			},
			data: {
				role: "OWNER",
			}
		});

		/* set the old owner of the chatroom as ADMIN */
		await this.prisma.chatroomUser.update({
			where: {
				chatroomId_userId: {chatroomId: +id, userId: +oldOwnerId},
			},
			data: {
				role: "ADMIN"
			}
		});
	}
}
