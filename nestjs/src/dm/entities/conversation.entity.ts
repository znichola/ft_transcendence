import { ApiProperty } from "@nestjs/swagger";
import { Prisma } from "@prisma/client";

const conversationWithUsername = Prisma.validator<Prisma.ConversationDefaultArgs>()({
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

export type ConversationWithUsername = Prisma.ConversationGetPayload<typeof conversationWithUsername>;

export class ConversationEntity
{
	constructor(prismaObject: ConversationWithUsername)
	{
		this.id = prismaObject.id;
		this.username1 = prismaObject.user1.login42;
		this.username2 = prismaObject.user2.login42;
	}

	@ApiProperty()
	id: number;

	@ApiProperty()
	username1: string;

	@ApiProperty()
	username2: string;
}