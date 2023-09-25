import { HttpException, HttpStatus, Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AddMemberToChatroomDto } from './dto/add-member-to-chatroom-dto';
import { CreateChatroomDto } from './dto/create-chatroom-dto';
import { UpdateRoleDto } from './dto/update-role-dto';
import { UpdateVisibilityDto } from './dto/update-visibility-dto';
import { Chatroom, ChatroomUser } from '@prisma/client';
import PasswordValidator = require("password-validator");
import { UpdateOwnerDto } from './dto/update-owner-dto';

@Injectable()
export class ChatService
{
	constructor(private prisma: PrismaService){}

	async getAllChatRooms(): Promise<Chatroom[]>
	{
		return await this.prisma.chatroom.findMany({})
	}

	async createNewChatRoom(chatroomDto: CreateChatroomDto)
	{
		await this.checkUserExists(chatroomDto.ownerId);
		await this.prisma.chatroom.create({
			data: chatroomDto
		});
	}

	async getOneChatRoom(chatroomId: number): Promise<Chatroom>
	{
		return await this.prisma.chatroom.findFirst({
			where: {
				id: +chatroomId,
			},
		})
	}

	async deleteChatroom(id: number)
	{
		await this.prisma.chatroom.delete({
			where: {
				id: +id,
			},
		})
	}

	async getOneMessageFromChatroom(id: number, msgId: number)
	{
		return await this.prisma.message.findUnique({
			where: {
				id: +msgId,
				chatroomId: +id
			}
		})
	}

	async getAllMessagesFromChatroom(id: number)
	{
		return await this.prisma.message.findMany({
			where: {
				chatroomId: +id,
			},
		});
	}

	async sendMessageToChatroom(chatroomId: number, userId: number, content: string)
	{
		//check permissions of chatroomId
		this.checkIsMember(userId, chatroomId);

		const message = {
			userId: +userId,
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
		/* check that there is a password if visibility is protected */

		if ((updateChatroomDto.status == "PROTECTED" && updateChatroomDto.password == null) ||
			(updateChatroomDto.status != "PROTECTED" && updateChatroomDto.password != null))
		{
			throw new BadRequestException();
		}

		if (updateChatroomDto.status == "PROTECTED")
		{
			/* check that the password is strong */
			let schema = new PasswordValidator();
			schema
				.is().min(8)
				.is().max(20);
			if (!schema.validate(updateChatroomDto.password))
			{
				throw new BadRequestException("Password validation failed");
			}
		}

		await this.prisma.chatroom.update({
			where: {
				id: +id,
			},
			data: updateChatroomDto
		});
	}

	async updateChatroomOwner(id: number, patch: UpdateOwnerDto)
	{
		/* check if ownerId is a member of the chatroom */
		const user = await this.prisma.chatroomUser.findUnique({
			where: {
				chatroomId_userId: {chatroomId: +id, userId: +patch.ownerId},
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
				ownerId: +patch.ownerId,
			}
		});
	}

	async getMembersOfChatRoom(id: number): Promise<ChatroomUser[]>
	{
		return await this.prisma.chatroomUser.findMany({
			where: {
				chatroomId: +id,
			}
		})
	}

	async getOneMemberFromChatroom(chatroomId: number, memberId: number): Promise<ChatroomUser>
	{
		return await this.prisma.chatroomUser.findUnique({
			where: {
				chatroomId_userId: {chatroomId: +chatroomId, userId: +memberId},
			}
		})
	}

	async addMemberToChatRoom(chatroomId: number, addMemberDto: AddMemberToChatroomDto)
	{
		await this.prisma.chatroomUser.create({
			data: {
				chatroomId: +chatroomId,
				userId: +addMemberDto.userId,
				role: addMemberDto.role
			},
		});
	}

	async deleteMemberFromChatRoom(chatroomId: number, memberId: number)
	{
		await this.prisma.chatroomUser.delete({
			where: {
				chatroomId_userId: {chatroomId: +chatroomId, userId: +memberId},
			},
		})
	}

	async updateRoleOfMemberFromChatroom(chatroomId: number, memberId: number, updateRoleDto: UpdateRoleDto)
	{
		await this.prisma.chatroomUser.update({
			where: {
				chatroomId_userId: {chatroomId: +chatroomId, userId: +memberId},
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
}
