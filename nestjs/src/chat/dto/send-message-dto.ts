import { IsInt, IsString } from "class-validator";

export class SendMessageDto
{
	@IsInt()
	from: number;

	@IsString()
	content: string;
}