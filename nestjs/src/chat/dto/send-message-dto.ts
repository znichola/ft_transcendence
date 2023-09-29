import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsString } from "class-validator";

export class SendMessageDto
{
	@ApiProperty()
	@IsString()
	senderUsername: string;

	@ApiProperty()
	@IsString()
	content: string;
}