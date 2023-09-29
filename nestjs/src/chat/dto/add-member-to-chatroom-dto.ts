import { IsEnum, IsString } from "class-validator";
import { ChatroomUserRole } from "@prisma/client";
import { ApiProperty } from "@nestjs/swagger";

export class AddMemberToChatroomDto
{
	@ApiProperty()
	@IsString()
	username: string;

	@ApiProperty({enum: ChatroomUserRole})
	@IsEnum(ChatroomUserRole)
	role: ChatroomUserRole;
}