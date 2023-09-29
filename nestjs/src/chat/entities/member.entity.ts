import { ApiProperty } from "@nestjs/swagger";
import { ChatroomUserRole, Prisma } from "@prisma/client";

const memberWithUsername = Prisma.validator<Prisma.ChatroomUserDefaultArgs>()({
	select: {
		role: true,
		user: {
			select: {
				login42: true
			}
		}
	}
});

export type MemberWithUsername = Prisma.ChatroomUserGetPayload<typeof memberWithUsername>;

export class MemberEntity
{
	constructor(prismaObject: MemberWithUsername)
	{
		this.username = prismaObject.user.login42;
		this.role = prismaObject.role;
	}

	@ApiProperty()
	username: string;

	@ApiProperty({enum: ChatroomUserRole})
	role: ChatroomUserRole;
}