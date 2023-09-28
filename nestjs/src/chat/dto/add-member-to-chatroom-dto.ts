import { IsEnum, IsString } from "class-validator";
import { ChatroomUserRole } from "@prisma/client";

export class AddMemberToChatroomDto
{
	@IsString()
	username: string;

	@IsEnum(ChatroomUserRole)
	role: ChatroomUserRole;
}