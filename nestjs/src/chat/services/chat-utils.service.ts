import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { UpdateVisibilityDto } from "../dto/update-visibility-dto";
import { CreateChatroomDto } from "../dto/create-chatroom-dto";
import PasswordValidator from "password-validator";

@Injectable()
export class ChatUtils
{
	constructor(private prisma: PrismaService){}

	async isMember(userId: number, chatroomId: number)
	{
		const chatroom = await this.prisma.chatroom.findUnique({
			where: {
				id: +chatroomId
			},
		});
		if (chatroom == null)
			throw new NotFoundException("This chatroom does not exist");

		const user = await this.prisma.chatroomUser.findUnique({
			where: {
				chatroomId_userId: {chatroomId: +chatroomId, userId: +userId},
			},
		});
		return (user != null);
	}

	async checkIsMember(userId: number, chatroomId: number)
	{
		if (!this.isMember(userId, chatroomId))
			throw new NotFoundException('This user is not a member of the chatroom');
	}

	async getUserId(login: string): Promise<number>
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

	checkPasswordPresence(obj: UpdateVisibilityDto | CreateChatroomDto)
	{
		if ((obj.status == "PROTECTED" && obj.password == null) ||
			(obj.status != "PROTECTED" && obj.password != null))
		{
			throw new BadRequestException("Password must be provided if and only if visibility is PROTECTED");
		}
	}

	validatePassword(pwd: string)
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

	async checkChatroomExists(id: number)
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

	async isOwner(userId: number, chatroomId: number): Promise<boolean>
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