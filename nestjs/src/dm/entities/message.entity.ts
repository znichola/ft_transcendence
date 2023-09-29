import { ApiProperty } from "@nestjs/swagger";
import { Prisma } from "@prisma/client";

const directMessageWithUsername = Prisma.validator<Prisma.DirectMessageDefaultArgs>()({
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

export type DirectMessageWithUsername = Prisma.DirectMessageGetPayload<typeof directMessageWithUsername>;

export class MessageEntity
{
	constructor(prismaObject: DirectMessageWithUsername)
	{
		this.id = prismaObject.id;
		this.senderUsername = prismaObject.sender.login42;
		this.content = prismaObject.text;
		this.sentAt = prismaObject.sentAt;
	}

	@ApiProperty()
	id: number;

	@ApiProperty()
	senderUsername: string;

	@ApiProperty()
	content: string;

	@ApiProperty()
	sentAt: Date;
}