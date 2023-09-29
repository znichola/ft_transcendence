import { ApiProperty } from "@nestjs/swagger";
import { Chatroom, ChatroomVisibilityStatus, Prisma } from "@prisma/client";

const chatroomWithUsername = Prisma.validator<Prisma.ChatroomDefaultArgs>()({
	select: {
		id: true,
		name: true,
		status: true,
		owner: {
			select: {
				login42: true
			}
		}
	}
});

export type ChatroomWithUsername = Prisma.ChatroomGetPayload<typeof chatroomWithUsername>

export class ChatroomEntity
{

	constructor(prismaObject: ChatroomWithUsername)
	{
		this.id = prismaObject.id;
		this.name = prismaObject.name;
		this.ownerUsername = prismaObject.owner.login42;
		this.status = prismaObject.status;
	}

	@ApiProperty()
	id: number;

	@ApiProperty()
	name: string;

	@ApiProperty()
	ownerUsername: string;

	@ApiProperty({enum: ChatroomVisibilityStatus})
	status: ChatroomVisibilityStatus;
}