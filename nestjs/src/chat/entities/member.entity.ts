import { ApiProperty } from "@nestjs/swagger";
import { ChatroomUserRole, Prisma } from "@prisma/client";

const memberWithUsername = Prisma.validator<Prisma.ChatroomUserDefaultArgs>()({
	select: {
		role: true,
		mutedUntil: true,
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
		this.login42 = prismaObject.user.login42;
		this.role = prismaObject.role;
		this.isMuted = (new Date() < prismaObject.mutedUntil);
	}

	@ApiProperty()
	login42: string;

	@ApiProperty({enum: ChatroomUserRole})
	role: ChatroomUserRole;

	@ApiProperty()
	isMuted: boolean;
}