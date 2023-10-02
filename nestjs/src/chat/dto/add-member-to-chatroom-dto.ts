import { IsEnum, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { ChatroomUserRole } from "@prisma/client";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class AddMemberToChatroomDto
{
	@ApiProperty()
	@IsString()
	@IsNotEmpty()
	username: string;

	@ApiPropertyOptional()
	@IsOptional()
	@IsString()
	@IsNotEmpty()
	password?: string;
}