import { ApiProperty } from "@nestjs/swagger";
import { Prisma } from "@prisma/client";

const messageWithUsername = Prisma.validator<Prisma.MessageDefaultArgs>()({
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

export type MessageWithUsername = Prisma.MessageGetPayload<typeof messageWithUsername>;

export class MessageEntity
{
	constructor(prismaObject: MessageWithUsername, isBlocked: boolean)
	{
		this.id = prismaObject.id;
		this.content = prismaObject.text;
		this.senderLogin42 = prismaObject.user.login42;
		this.sentAt = prismaObject.sentAt;
		this.isBlocked = isBlocked;
	}

	@ApiProperty()
	id: number;

	@ApiProperty()
	senderLogin42: string;

	@ApiProperty()
	content: string;

	@ApiProperty()
	sentAt: Date;

	@ApiProperty()
	isBlocked: boolean;
}

const messageWithChatroom = Prisma.validator<Prisma.MessageDefaultArgs>()({
	select: {
		id: true,
		text: true,
		sentAt: true,
		user: {
			select: {
				login42: true
			}
		},
		chatroom: {
			select: {
				id: true,
				name: true
			}
		}
	}
})

export type MessageWithChatroom = Prisma.MessageGetPayload<typeof messageWithChatroom>;

export class MessageWithChatroomEntity
{
	constructor(prismaObject: MessageWithChatroom)
	{
		this.id = prismaObject.chatroom.id;
		this.name = prismaObject.chatroom.name;
		this.message = new MessageEntity(prismaObject, false);
	}

	@ApiProperty()
	id: number;

	@ApiProperty()
	name: string;

	@ApiProperty()
	message: MessageEntity;
}