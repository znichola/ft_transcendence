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

export class DirectMessageEntity
{
	constructor(prismaObject: DirectMessageWithUsername)
	{
		this.id = prismaObject.id;
		this.senderLogin42 = prismaObject.sender.login42;
		this.content = prismaObject.text;
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
