import { PrismaService } from "src/prisma/prisma.service";
import { MessageEntity, MessageWithUsername } from "../entities/message.entity";
import { ForbiddenException, Injectable } from "@nestjs/common";
import { ChatUtils } from "./chat-utils.service";
import { UserGateway } from "src/user/user.gateway";

@Injectable()
export class ChatMessageService
{
	constructor(private prisma: PrismaService,
		private readonly utils: ChatUtils,
		private readonly gateway: UserGateway){}

	async getOneMessageFromChatroom(id: number, msgId: number, identity: string): Promise<MessageEntity>
	{
		await this.utils.checkChatroomExists(id);

		const issuerId = await this.utils.getUserId(identity);
		const access: boolean = await this.utils.isMember(issuerId, id);
		if (!access)
			throw new ForbiddenException("You are not a member of this chatroom");

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

		const blockedUsers = await this.prisma.friend.findMany({
			where: {
				user1Id: issuerId,
				status: "BLOCKED"
			},
			select: {
				user2: {
					select: {
						login42: true
					}
				},
				since: true
			}
		});

		let isBlocked = false;
		for (const blocked of blockedUsers)
		{
			if (msgFromDb.user.login42 == blocked.user2.login42 && blocked.since <= msgFromDb.sentAt)
			{
				isBlocked = true;
				msgFromDb.text = "[You have blocked this user]";
			}
		}
		return new MessageEntity(msgFromDb, isBlocked);
	}

	async getAllMessagesFromChatroom(id: number, identity: string): Promise<MessageEntity[]>
	{
		await this.utils.checkChatroomExists(id);

		const issuerId = await this.utils.getUserId(identity);
		const access: boolean = await this.utils.isMember(issuerId, id);
		if (!access)
			throw new ForbiddenException("You are not a member of this chatroom");

		let msgsFromDb: MessageWithUsername[] = await this.prisma.message.findMany({
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

		const blockedUsers = await this.prisma.friend.findMany({
			where: {
				user1Id: issuerId,
				status: "BLOCKED"
			},
			select: {
				user2: {
					select: {
						login42: true
					}
				},
				since: true
			}
		});

		const msgEntities: MessageEntity[] = msgsFromDb.map(msg => {
			let isBlocked = false;
			for (const blocked of blockedUsers)
			{
				if (msg.user.login42 == blocked.user2.login42 && blocked.since <= msg.sentAt)
				{
					isBlocked = true;
					msg.text = "[You have blocked this user]";
				}
			}
			return new MessageEntity(msg, isBlocked)
		});
		return msgEntities;
	}

	async sendMessageToChatroom(chatroomId: number, content: string, identity: string)
	{
		const senderId: number = await this.utils.getUserId(identity);
		if (!await this.utils.isMember(senderId, chatroomId))
			throw new ForbiddenException("You are not a member of this chatroom");

		if (await this.utils.isMuted(senderId, chatroomId))
			throw new ForbiddenException("You have been muted");

		const message = {
			userId: +senderId,
			chatroomId:	+chatroomId,
			text: content,
		}

		const msgFromDb = await this.prisma.message.create({
			data: message,
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

		const members = await this.prisma.chatroomUser.findMany({
			where: {
				NOT: {
					user: {
						friends1: {
							some: {
								user2: {
									login42: identity
								},
								status: "BLOCKED"
							}
						}
					}
				}
			},
			select: {
				user: {
					select: {
						login42: true
					}
				}
			}
		});

		for (const member of members)
		{
			this.gateway.sendToChatroom(new MessageEntity(msgFromDb, false), member.user.login42);
		}
	}

	async updateMessageFromChatroom(msgId: number, newContent: string, identity: string)
	{
		const msg = await this.prisma.message.findUniqueOrThrow({
			where: {
				id: +msgId
			}
		});

		const issuerId = await this.utils.getUserId(identity);
		if (msg.userId != issuerId)
			throw new ForbiddenException("You are not the author of this message");

		await this.prisma.message.update({
			where: {
				id: +msgId,
			},
			data: {
				text: newContent,
			},
		});
	}

	async deleteMessageFromChatroom(msgId: number, identity: string)
	{
		const msg = await this.prisma.message.findUniqueOrThrow({
			where: {
				id: +msgId
			}
		});

		const issuerId = await this.utils.getUserId(identity);
		if (msg.userId != issuerId)
			throw new ForbiddenException("You are not the author of this message");

		await this.prisma.message.delete({
			where: {
				id: +msgId,
			}
		});
	}
}