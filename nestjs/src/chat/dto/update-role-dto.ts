import { ChatroomUserRole } from "@prisma/client";
import { IsEnum, IsString } from "class-validator";

export class UpdateRoleDto
{
	@IsEnum(ChatroomUserRole)
	role: ChatroomUserRole;
}