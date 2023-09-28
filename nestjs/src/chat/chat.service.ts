import { HttpException, HttpStatus, Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
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

		/* create new chatroom and return new chatroom id */
		const newChatroom = await this.prisma.chatroom.create({
			data: {
				ownerId: +userId,
				name: chatroomDto.name,
				status: chatroomDto.status,
				password: hash,
			},
			select: {
				id: true
			}
		});

		/* owner becomes member of chatroom */
		await this.prisma.chatroomUser.create({
			data: {
				chatroomId: +newChatroom.id,
				userId: +userId,
				role: "OWNER"
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

		if (chatroomFromDb == null)
			throw new NotFoundException("This chatroom does not exist");

		return {
			id: chatroomFromDb.id,
			name: chatroomFromDb.name,
			status: chatroomFromDb.status,
			ownerUsername: chatroomFromDb.owner.login42
		}
	}

	async deleteChatroom(id: number)
	{
		await this.checkChatroomExists(id);

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
		})
	}

	async getOneMessageFromChatroom(id: number, msgId: number): Promise<MessageEntity>
	{
		await this.checkChatroomExists(id);

		const msgFromDb = await this.prisma.message.findUnique({
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

		return (msgFromDb == null) ? null : {
			id: msgFromDb.id,
			senderUsername: msgFromDb.user.login42,
			content: msgFromDb.text,
			sentAt: msgFromDb.sentAt
		}
	}

	async getAllMessagesFromChatroom(id: number): Promise<MessageEntity[]>
	{
		await this.checkChatroomExists(id);

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

		await this.checkIsMember(senderId, chatroomId);

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
		const newOwnerId = await this.getUserId(patch.ownerUsername);

		await this.checkIsMember(newOwnerId, id);

		const chatroom = await this.prisma.chatroom.findUnique({
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
		await this.checkChatroomExists(chatroomId);

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

		if (memberFromDb == null)
			throw new NotFoundException("This user is not a member of the chatroom");

		return {
			username: memberFromDb.user.login42,
			role: memberFromDb.role,
		}
	}

	async addMemberToChatRoom(chatroomId: number, addMemberDto: AddMemberToChatroomDto)
	{
		await this.checkChatroomExists(chatroomId);

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
		await this.checkChatroomExists(chatroomId);

		const userId = await this.getUserId(member);

		await this.checkIsMember(userId, chatroomId);

		//check if user is owner
		const chatroom = await this.prisma.chatroom.findUnique({where: {id: +chatroomId}});
		if (chatroom.ownerId == userId)
		{
			/* find another member that is admin */
			let nextOwner = await this.prisma.chatroomUser.findFirst({where: {chatroomId: +chatroomId, role: "ADMIN"}});
			if (nextOwner == null)
				nextOwner = await this.prisma.chatroomUser.findFirst({where: {chatroomId: +chatroomId, role: "MEMBER"}});

			if (nextOwner == null)
			{
				await this.deleteChatroom(chatroomId);
				return ;
			}

			/* set nextOwner as the owner of the chatroom */
			await this.prisma.chatroom.update({
				where: {
					id: +chatroomId,
				},
				data: {
					ownerId: +nextOwner.userId,
				}
			});

			/* mark nextOwner's role as "OWNER" */
			await this.prisma.chatroomUser.update({
				where: {
					chatroomId_userId: {chatroomId: +chatroomId, userId: +nextOwner.userId}
				},
				data: {
					role: "OWNER"
				}
			});
		}

		await this.prisma.chatroomUser.delete({
			where: {
				chatroomId_userId: {chatroomId: +chatroomId, userId: +userId},
			},
		});
	}

	async updateRoleOfMemberFromChatroom(chatroomId: number, member: string, updateRoleDto: UpdateRoleDto)
	{
		await this.checkChatroomExists(chatroomId);
		const userId = await this.getUserId(member);
		await this.checkIsMember(userId, chatroomId);

		if (this.isOwner(userId, chatroomId))
			throw new ForbiddenException("Cannot change role of owner");

		if (updateRoleDto.role == "OWNER")
			throw new ForbiddenException("Role of member cannot be set to owner");

		/* must access identity to check if user is allowed to perform operation (either Owner or Admin) */

		await this.prisma.chatroomUser.update({
			where: {
				chatroomId_userId: {chatroomId: +chatroomId, userId: +userId},
			},
			data: updateRoleDto
		})
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

	private async checkChatroomExists(id: number)
	{
		const chatroom = await this.prisma.chatroom.findUnique({
			where: {
				id: +id,
			},
			select: {
				id: true
			}
		});

		if (chatroom == null)
			throw new NotFoundException("This chatroom does not exist");
	}

	private async isOwner(userId: number, chatroomId: number): Promise<boolean>
	{
		const member = await this.prisma.chatroomUser.findUnique({
			where: {
				chatroomId_userId: {chatroomId: +chatroomId, userId: +userId}
			},
			select: {
				role: true
			}
		});

		if (member == null)
			throw new NotFoundException("This user is not a member of the chatroom");

		return (member.role == "OWNER");
	}
}
