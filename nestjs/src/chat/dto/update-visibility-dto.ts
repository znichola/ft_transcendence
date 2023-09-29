import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { ChatroomVisibilityStatus} from "@prisma/client";
import { IsEnum, IsOptional, IsString } from "class-validator";

export class UpdateVisibilityDto
{
	@ApiProperty({enum: ChatroomVisibilityStatus})
	@IsEnum(ChatroomVisibilityStatus)
	status: ChatroomVisibilityStatus;

	@ApiPropertyOptional()
	@IsOptional()
	@IsString()
	password?: string;
}