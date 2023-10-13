import { IsEnum, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { ChatroomUserRole } from "@prisma/client";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class AddMemberToChatroomDto
{
	@ApiProperty()
	@IsString()
	@IsNotEmpty()
	login42: string;

	@ApiPropertyOptional()
	@IsOptional()
	@IsString()
	password?: string;
}