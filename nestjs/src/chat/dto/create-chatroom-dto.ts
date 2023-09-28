import { ChatroomVisibilityStatus } from "@prisma/client";
import { IsEnum, IsOptional, IsString } from "class-validator";

export class CreateChatroomDto
{
    @IsString()
    ownerUsername: string;

	@IsString()
    name: string;

	@IsEnum(ChatroomVisibilityStatus)
	status: ChatroomVisibilityStatus;

	@IsOptional()
	@IsString()
	password?: string
}