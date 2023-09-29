import { ApiProperty } from "@nestjs/swagger";
import { ChatroomUserRole } from "@prisma/client";
import { IsEnum, IsString } from "class-validator";

export class UpdateRoleDto
{
	@ApiProperty({enum: ChatroomUserRole})
	@IsEnum(ChatroomUserRole)
	role: ChatroomUserRole;
}