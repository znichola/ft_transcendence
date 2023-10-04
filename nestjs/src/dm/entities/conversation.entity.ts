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
		this.user1Login42 = prismaObject.user1.login42;
		this.user2Login42 = prismaObject.user2.login42;
	}

	@ApiProperty()
	id: number;

	@ApiProperty()
	user1Login42: string;

	@ApiProperty()
	user2Login42: string;
}