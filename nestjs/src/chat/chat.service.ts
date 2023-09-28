import { HttpException, HttpStatus, Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AddMemberToChatroomDto } from './dto/add-member-to-chatroom-dto';
import { CreateChatroomDto } from './dto/create-chatroom-dto';
import { UpdateRoleDto } from './dto/update-role-dto';
import { UpdateVisibilityDto } from './dto/update-visibility-dto';
import { Chatroom, ChatroomUser } from '@prisma/client';
import PasswordValidator = require("password-validator");
import { UpdateOwnerDto } from './dto/update-owner-dto';
import { ChatroomEntity } from './entities/chatroom.entity';
import { MessageEntity } from './entities/message.entity';
import { MemberEntity } from './entities/member.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class ChatService
{
	constructor(private prisma: PrismaService){}

	async getAllChatRooms(): Promise<ChatroomEntity[]>
	{
		const chatroomsFromDb = await this.prisma.chatroom.findMany({
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

		const chatroomEntities: ChatroomEntity[] = chatroomsFromDb.map((chatroom) => {
			return {
				id: chatroom.id,
				name: chatroom.name,
				status: chatroom.status,
				ownerUsername: chatroom.owner.login42,
			}
		}
		);

		return chatroomEntities;
	}

	async createNewChatRoom(chatroomDto: CreateChatroomDto)
	{
		const userId: number = await this.getUserId(chatroomDto.ownerUsername);

		this.checkPasswordPresence(chatroomDto);

		let hash = null;

		if (chatroomDto.status == "PROTECTED")
		{
			this.validatePassword(chatroomDto.password);

			const saltOrRounds = 10;
			hash = await bcrypt.hash(chatroomDto.password, saltOrRounds);
		}

		await this.prisma.chatroom.create({
			data: {
				ownerId: +userId,
				name: chatroomDto.name,
				status: chatroomDto.status,
				password: hash,
			}
		});
	}

	async getOneChatRoom(chatroomId: number): Promise<ChatroomEntity>
	{
		const chatroomFromDb =  await this.prisma.chatroom.findFirst({
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

		return {
			id: chatroomFromDb.id,
			name: chatroomFromDb.name,
			status: chatroomFromDb.status,
			ownerUsername: chatroomFromDb.owner.login42
		}
	}

	async deleteChatroom(id: number)
	{
		await this.prisma.chatroom.delete({
			where: {
				id: +id,
			},
		})
	}

	async getOneMessageFromChatroom(id: number, msgId: number): Promise<MessageEntity>
	{
		const msgFromDb =  await this.prisma.message.findUnique({
			where: {
				id: +msgId,
				chatroomId: +id
			},
			select: {
				id: true,
				text: true,
				sentAt: true,
				user: {
					select: {
						login42: true
					}
				}
			}
		});

		return {
			id: msgFromDb.id,
			senderUsername: msgFromDb.user.login42,
			content: msgFromDb.text,
			sentAt: msgFromDb.sentAt
		}
	}

	async getAllMessagesFromChatroom(id: number): Promise<MessageEntity[]>
	{
		const msgsFromDb =  await this.prisma.message.findMany({
			where: {
				chatroomId: +id,
			},
			select: {
				id: true,
				text: true,
				sentAt: true,
				user: {
					select: {
						login42: true
					}
				}
			}
		});

		const msgEntities = msgsFromDb.map((msg) => {
			return {
				id: msg.id,
				senderUsername: msg.user.login42,
				content: msg.text,
				sentAt: msg.sentAt
			}
		});

		return msgEntities;
	}

	async sendMessageToChatroom(chatroomId: number, senderUsername: string, content: string)
	{
		const senderId: number = await this.getUserId(senderUsername);

		//check permissions of chatroomId
		this.checkIsMember(senderId, chatroomId);

		const message = {
			userId: +senderId,
			chatroomId:	+chatroomId,
			text: content,
		}

		await this.prisma.message.create({
			data: message,
		});
	}

	async updateMessageFromChatroom(msgId: number, newContent: string)
	{
		await this.prisma.message.update({
			where: {
				id: +msgId,
			},
			data: {
				text: newContent,
			},
		});
	}

	async deleteMessageFromChatroom(msgId: number)
	{
		await this.prisma.message.delete({
			where: {
				id: +msgId,
			}
		});
	}

	async updateChatroomVisibility(id: number, updateChatroomDto: UpdateVisibilityDto)
	{
		this.checkPasswordPresence(updateChatroomDto);

		let hash = null;

		if (updateChatroomDto.status == "PROTECTED")
		{
			this.validatePassword(updateChatroomDto.password);

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
		//missing "await" here ?!
		const userId = this.getUserId(patch.ownerUsername);

		/* check if ownerId is a member of the chatroom */
		const user = await this.prisma.chatroomUser.findUnique({
			where: {
				chatroomId_userId: {chatroomId: +id, userId: +userId},
			}
		});

		if (user == null)
		{
			throw new BadRequestException("This user is not a member of the chatroom.");
		}

		/* check if user is not banned etc. */

		await this.prisma.chatroom.update({
			where: {
				id: +id,
			},
			data: {
				ownerId: +userId,
			}
		});
	}

	async getMembersOfChatRoom(id: number): Promise<MemberEntity[]>
	{
		const memberFromDb =  await this.prisma.chatroomUser.findMany({
			where: {
				chatroomId: +id,
			},
			select: {
				role: true,
				user: {
					select: {
						login42: true
					}
				}
			}
		});

		const memberEntities =  memberFromDb.map(member => {
			return {
				username: member.user.login42,
				role: member.role,
			}
		});

		return memberEntities;
	}

	async getOneMemberFromChatroom(chatroomId: number, username: string): Promise<MemberEntity>
	{
		const userId = await this.getUserId(username);

		const memberFromDb = await this.prisma.chatroomUser.findUnique({
			where: {
				chatroomId_userId: {chatroomId: +chatroomId, userId: +userId},
			},
			select: {
				role: true,
				user: {
					select: {
						login42: true
					}
				}
			}
		});

		return {
			username: memberFromDb.user.login42,
			role: memberFromDb.role,
		}
	}

	async addMemberToChatRoom(chatroomId: number, addMemberDto: AddMemberToChatroomDto)
	{
		const userId = await this.getUserId(addMemberDto.username);

		await this.prisma.chatroomUser.create({
			data: {
				chatroomId: +chatroomId,
				userId: +userId,
				role: addMemberDto.role
			},
		});
	}

	async deleteMemberFromChatRoom(chatroomId: number, member: string)
	{
		const userId = await this.getUserId(member);

		await this.prisma.chatroomUser.delete({
			where: {
				chatroomId_userId: {chatroomId: +chatroomId, userId: +userId},
			},
		});
	}

	async updateRoleOfMemberFromChatroom(chatroomId: number, member: string, updateRoleDto: UpdateRoleDto)
	{
		const userId = await this.getUserId(member);

		await this.prisma.chatroomUser.update({
			where: {
				chatroomId_userId: {chatroomId: +chatroomId, userId: +userId},
			},
			data: updateRoleDto
		})
	}

	private async checkUserExists(userId: number)
	{
		const user = await this.prisma.user.findFirst({
			where:
			{
				id: +userId,
			},
		});
		if (user == null)
			throw new HttpException('This user does not exist', HttpStatus.NOT_FOUND);
	}

	private async checkIsMember(userId: number, chatroomId: number)
	{
		const chatroom = await this.prisma.chatroom.findUnique({
			where: {
				id: +chatroomId
			},
		});

		if (chatroom == null)
			throw new NotFoundException("This chatroom does not exist");

		if (chatroom.ownerId == userId)
			return true;

		const user = await this.prisma.chatroomUser.findUnique({
			where: {
				chatroomId_userId: {chatroomId: +chatroomId, userId: +userId},
			},
		});

		if (user == null)
			throw new NotFoundException('This user is not a member of the chatroom');

		return true;
	}

	private async getUserId(login: string): Promise<number>
	{
		const user = await this.prisma.user.findUnique({
			where: {
				login42: login,
			},
		});
		if (user == null)
			throw new NotFoundException("This user does not exist");

		return user.id;
	}

	private checkPasswordPresence(obj: UpdateVisibilityDto | CreateChatroomDto)
	{
		if ((obj.status == "PROTECTED" && obj.password == null) ||
			(obj.status != "PROTECTED" && obj.password != null))
		{
			throw new BadRequestException("Password must be provided if and only if visibility is PROTECTED");
		}
	}

	private validatePassword(pwd: string)
	{
		let schema = new PasswordValidator();
		schema
			.is().min(8)
			.is().max(20);
		if (!schema.validate(pwd))
		{
			throw new BadRequestException("Password validation failed");
		}
	}
}
