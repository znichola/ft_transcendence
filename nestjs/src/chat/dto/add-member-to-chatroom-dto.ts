import { IsEnum, IsNotEmpty, IsString } from "class-validator";
import { ChatroomUserRole } from "@prisma/client";
import { ApiProperty } from "@nestjs/swagger";

export class AddMemberToChatroomDto
{
	@ApiProperty()
	@IsString()
	@IsNotEmpty()
	username: string;

	@ApiProperty({enum: ChatroomUserRole})
	@IsEnum(ChatroomUserRole)
	role: ChatroomUserRole;
}