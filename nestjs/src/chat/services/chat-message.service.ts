import { PrismaService } from "src/prisma/prisma.service";
import { MessageEntity, MessageWithUsername } from "../entities/message.entity";
import { ForbiddenException, Injectable } from "@nestjs/common";
import { ChatUtils } from "./chat-utils.service";
import { ChatGateway } from "../chat.gateway";

@Injectable()
export class ChatMessageService
{
	constructor(private prisma: PrismaService,
		private readonly utils: ChatUtils,
		private readonly gateway: ChatGateway){}

	async getOneMessageFromChatroom(id: number, msgId: number): Promise<MessageEntity>
	{
		await this.utils.checkChatroomExists(id);

		const msgFromDb: MessageWithUsername = await this.prisma.message.findUniqueOrThrow({
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

		return new MessageEntity(msgFromDb);
	}

	async getAllMessagesFromChatroom(id: number): Promise<MessageEntity[]>
	{
		await this.utils.checkChatroomExists(id);

		const msgsFromDb: MessageWithUsername[] = await this.prisma.message.findMany({
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

		const msgEntities: MessageEntity[] = msgsFromDb.map(msg => new MessageEntity(msg));
		return msgEntities;
	}

	async sendMessageToChatroom(chatroomId: number, senderUsername: string, content: string)
	{
		const senderId: number = await this.utils.getUserId(senderUsername);

		await this.utils.checkIsMember(senderId, chatroomId);

		if (await this.utils.isMuted(senderId, chatroomId))
			throw new ForbiddenException("You have been muted");

		const message = {
			userId: +senderId,
			chatroomId:	+chatroomId,
			text: content,
		}

		await this.prisma.message.create({
			data: message,
		});

		this.gateway.push(chatroomId);
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

}