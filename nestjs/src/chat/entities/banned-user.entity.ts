import { ApiProperty } from "@nestjs/swagger";
import { BannedUser, Prisma } from "@prisma/client";

const bannedUserWithUsername = Prisma.validator<Prisma.BannedUserDefaultArgs>()({
	select: {
		user: {
			select: {
				login42: true
			}
		}
	}
});

export type BannedUserWithUsername = Prisma.BannedUserGetPayload<typeof bannedUserWithUsername>;

export class BannedUserEntity
{
	constructor(prismaObject: BannedUserWithUsername)
	{
		this.username = prismaObject.user.login42;
	}

	@ApiProperty()
	username: string;
}