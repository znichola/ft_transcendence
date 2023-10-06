import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { ChatroomVisibilityStatus } from "@prisma/client";
import { IsEnum, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateChatroomDto
{
	@ApiProperty()
    @IsString()
	@IsNotEmpty()
    ownerLogin42: string;

	@ApiProperty()
	@IsString()
	@IsNotEmpty()
    name: string;

	@ApiProperty({enum: ChatroomVisibilityStatus})
	@IsEnum(ChatroomVisibilityStatus)
	status: ChatroomVisibilityStatus;

	@ApiPropertyOptional()
	@IsOptional()
	@IsString()
	@IsNotEmpty()
	password?: string
}