import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { ChatroomVisibilityStatus } from "@prisma/client";
import { IsEnum, IsNotEmpty, IsOptional, IsString, MaxLength } from "class-validator";

export class CreateChatroomDto
{
	@ApiProperty()
	@IsString()
	@MaxLength(42)
	@IsNotEmpty()
	name: string;

	@ApiProperty({enum: ChatroomVisibilityStatus})
	@IsEnum(ChatroomVisibilityStatus)
	status: ChatroomVisibilityStatus;

	@ApiPropertyOptional()
	@IsOptional()
	@IsString()
	password?: string
}