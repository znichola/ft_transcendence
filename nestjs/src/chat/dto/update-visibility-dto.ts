import { ChatroomVisibilityStatus} from "@prisma/client";
import { IsEnum, IsOptional, IsString } from "class-validator";

export class UpdateVisibilityDto
{
	@IsEnum(ChatroomVisibilityStatus)
	status: ChatroomVisibilityStatus;

	@IsOptional()
	@IsString()
	password?: string;
}