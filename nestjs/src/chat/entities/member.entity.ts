import { ApiProperty } from "@nestjs/swagger";
import { ChatroomUserRole } from "@prisma/client";

export class MemberEntity
{
	@ApiProperty()
	username: string;

	@ApiProperty({enum: ChatroomUserRole})
	role: ChatroomUserRole;
}