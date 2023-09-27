import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { SendDmDto } from './dto/send-dm-dto';
import { Conversation, DirectMessage } from '@prisma/client';
import { ConversationEntity } from './entities/conversation.entity';
import { MessageEntity } from './entities/message.entity';

@Injectable()
export class DmService
{
	constructor(private prisma: PrismaService){}

	async getAllConversations(): Promise<ConversationEntity[]>
	{
		const conversationsFromDb = await this.prisma.conversation.findMany({
			select: {
				id: true,
				user1: {
					select: {
						login42: true
					}
				},
				user2: {
					select: {
						login42: true
					}
				}
			}
		});

		const conversationEntities = conversationsFromDb.map((conv) => {
			return {
				id: conv.id,
				username1: conv.user1.login42,
				username2: conv.user2.login42
			}
		});

		return conversationEntities;
	}

	async getAllConversationsOfUser(user: string): Promise<ConversationEntity[]>
	{
		const userId = await this.getUserId(user);

		const conversationsFromDb = await this.prisma.conversation.findMany({
			where: {
				OR: [
					{
						user1Id: userId,
					},
					{
						user2Id: userId,
					}
				]
			},
			select: {
				id: true,
				user1: {
					select: {
						login42: true
					}
				},
				user2: {
					select: {
						login42: true
					}
				}
			}
		});

		const conversationEntities = conversationsFromDb.map((conv) => {
			return {
				id: conv.id,
				username1: conv.user1.login42,
				username2: conv.user2.login42
			}
		});

		return conversationEntities;
	}

	async getOneConversation(user1: string, user2: string): Promise<ConversationEntity>
	{
		const id1 = await this.getUserId(user1);
		const id2 = await this.getUserId(user2);

		const conversationFromDb = await this.prisma.conversation.findFirst({
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
			select: {
				id: true,
				user1: {
					select: {
						login42: true
					}
				},
				user2: {
					select: {
						login42: true
					}
				}
			}
		});

		return (conversationFromDb == null) ? null : {
			id: conversationFromDb.id,
			username1: conversationFromDb.user1.login42,
			username2: conversationFromDb.user2.login42
		}
	}

	async getAllMessagesFromConversation(user1: string, user2: string): Promise<MessageEntity[]>
	{
		const id1 = await this.getUserId(user1);
		const id2 = await this.getUserId(user2);

		let convId = await this.getOneConversation(user1, user2).then(res => res?.id);
		if (convId == null)
			convId = await this.createConversation(id1, id2).then(res => res?.id);

		const msgsFromDb = await this.prisma.directMessage.findMany({
			where: {
				conversationId: +convId,
			},
			select: {
				id: true,
				sentAt: true,
				text: true,
				sender: {
					select: {
						login42: true
					}
				}
			}
		});

		const msgEntities = msgsFromDb.map(msg => {
			return {
				id: msg.id,
				sentAt: msg.sentAt,
				senderUsername: msg.sender.login42,
				content: msg.text,
			}
		});

		return msgEntities;
	}

	async getOneMessage(msgId: number): Promise<MessageEntity>
	{
		const msgFromDb = await this.prisma.directMessage.findUnique({
			where: {
				id: +msgId,
			},
			select: {
				id: true,
				sentAt: true,
				text: true,
				sender: {
					select: {
						login42: true
					}
				}
			}
		});

		return (msgFromDb == null) ? null : {
			id: msgFromDb.id,
			sentAt: msgFromDb.sentAt,
			senderUsername: msgFromDb.sender.login42,
			content: msgFromDb.text,
		}
	}

	async sendMessage(from: string, to: string, payload: SendDmDto)
	{
		const id1 = await this.getUserId(from);
		const id2 = await this.getUserId(to);

		let convId = await this.getOneConversation(from, to).then(res => res?.id);
		if (convId == null)
			convId = await this.createConversation(id1, id2).then(res => res?.id);

		const msg = {
			senderId: +id1,
			conversationId: +convId,
			text: payload.content
		};

		await this.prisma.directMessage.create({
			data: msg,
		})
	}

	async deleteMessage(msgId: number)
	{
		await this.prisma.directMessage.delete({
			where: {
				id: +msgId,
			}
		});
	}

	async updateMessage(msgId: number, payload: SendDmDto)
	{
		await this.prisma.directMessage.update({
			where: {
				id: +msgId,
			},
			data: {
				text: payload.content,
			}
		});
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
