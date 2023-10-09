import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { SendDmDto } from './dto/send-dm-dto';
import { Conversation, DirectMessage } from '@prisma/client';
import { ConversationEntity, ConversationWithUsername } from './entities/conversation.entity';
import { DirectMessageWithUsername, MessageEntity } from './entities/message.entity';
import { DmGateway } from './dm.gateway';

@Injectable()
export class DmService
{
	constructor(private prisma: PrismaService,
		private readonly gateway: DmGateway){}

	async getAllConversations(): Promise<ConversationEntity[]>
	{
		const conversationsFromDb: ConversationWithUsername[] = await this.prisma.conversation.findMany({
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

		const conversationEntities: ConversationEntity[] = conversationsFromDb.map(conv => new ConversationEntity(conv));
		return conversationEntities;
	}

	async getAllConversationsOfUser(user: string): Promise<ConversationEntity[]>
	{
		const userId = await this.getUserId(user);

		const conversationsFromDb: ConversationWithUsername[] = await this.prisma.conversation.findMany({
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

		const conversationEntities = conversationsFromDb.map(conv => new ConversationEntity(conv));
		return conversationEntities;
	}

	async getOneConversation(user1: string, user2: string): Promise<ConversationEntity>
	{
		const id1 = await this.getUserId(user1);
		const id2 = await this.getUserId(user2);

		const conversationFromDb = await this.prisma.conversation.findFirstOrThrow({
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

		return new ConversationEntity(conversationFromDb);
	}

	async getAllMessagesFromConversation(user1: string, user2: string): Promise<MessageEntity[]>
	{
		const id1 = await this.getUserId(user1);
		const id2 = await this.getUserId(user2);

		let convId = await this.getOneConversation(user1, user2).then(res => res?.id);

		const msgsFromDb: DirectMessageWithUsername[] = await this.prisma.directMessage.findMany({
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

		const msgEntities: MessageEntity[] = msgsFromDb.map(msg => new MessageEntity(msg));
		return msgEntities;
	}

	async getOneMessage(msgId: number): Promise<MessageEntity>
	{
		const msgFromDb: DirectMessageWithUsername = await this.prisma.directMessage.findUniqueOrThrow({
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

		return new MessageEntity(msgFromDb);
	}

	async sendMessage(from: string, to: string, payload: SendDmDto)
	{
		const id1 = await this.getUserId(from);
		const id2 = await this.getUserId(to);

		const conv = await this.createConversationIfNotExists(id1, id2);

		const msg = {
			senderId: +id1,
			conversationId: +conv.id,
			text: payload.content
		};

		await this.prisma.directMessage.create({
			data: msg,
		});

		this.gateway.push(conv);
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

	private async createConversationIfNotExists(id1: number, id2: number): Promise<ConversationEntity>
	{
		const conv = await this.prisma.conversation.findFirst({
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
		if (conv != null)
			return new ConversationEntity(conv);

		const newConv = await this.prisma.conversation.create({
			data: {
				user1Id: +id1,
				user2Id: +id2,
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
		return new ConversationEntity(newConv);
	}
}
