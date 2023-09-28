import { IsString } from "class-validator";

export class UpdateMessageDto
{
	@IsString()
	content: string;
}