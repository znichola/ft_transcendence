import { IsEnum, IsInt } from "class-validator";
import { ChatroomUserRole } from "@prisma/client";

export class AddMemberToChatroomDto
{
    @IsInt()
    userId: number;

	@IsEnum(ChatroomUserRole)
	role: ChatroomUserRole;
}