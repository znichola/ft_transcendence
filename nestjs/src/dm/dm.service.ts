import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { SendDmDto } from './dto/send-dm-dto';
import { Conversation } from '@prisma/client';

@Injectable()
export class DmService
{
	constructor(private prisma: PrismaService){}

	async getAllConversations()
	{
		await this.prisma.conversation.findMany({});
	}

	async getAllConversationsOfUser(user: string)
	{
		const userId = await this.getUserId(user);

		return await this.prisma.conversation.findMany({
			where: {
				OR: [
					{
						user1Id: userId,
					},
					{
						user2Id: userId,
					}
				]
			}
		});
	}

	async getOneConversation(user1: string, user2: string): Promise<Conversation>
	{
		const id1 = await this.getUserId(user1);
		const id2 = await this.getUserId(user2);

		return await this.prisma.conversation.findFirst({
			where: {
				OR: [
					{
						user1Id: +id1,
						user2Id: +id2,
					},
					{
						user1Id: +id2,
						user2Id: +id1,
					}
				]
			},
			include: {
				messages: true
			}
		});
	}

	async sendMessage(from: string, to: string, payload: SendDmDto)
	{
		const id1 = await this.getUserId(from);
		const id2 = await this.getUserId(to);

		let conversation = await this.getOneConversation(from, to);
		if (conversation == null)
			conversation = await this.createConversation(id1, id2);

		console.log(conversation.id);

		const msg = {
			senderId: +id1,
			conversationId: +conversation.id,
			text: payload.content
		};

		await this.prisma.directMessage.create({
			data: msg,
		})
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

	private async createConversation(id1: number, id2: number): Promise<Conversation>
	{
		const newConv = await this.prisma.conversation.create({
			data: {
				user1Id: +id1,
				user2Id: +id2,
			},
		});
		return newConv;
	}
}
