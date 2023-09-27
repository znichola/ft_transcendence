import { IsInt, IsString } from "class-validator";

export class SendMessageDto
{
	@IsString()
	senderUsername: string;

	@IsString()
	content: string;
}