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
	constructor(prismaObject: MessageWithUsername)
	{
		this.id = prismaObject.id;
		this.content = prismaObject.text;
		this.senderLogin42 = prismaObject.user.login42;
		this.sentAt = prismaObject.sentAt;
	}

	@ApiProperty()
	id: number;

	@ApiProperty()
	senderLogin42: string;

	@ApiProperty()
	content: string;

	@ApiProperty()
	sentAt: Date;
}