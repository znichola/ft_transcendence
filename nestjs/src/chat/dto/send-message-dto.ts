import { IsInt } from "class-validator";

export class SendMessageDto
{
	@IsInt()
	from: number;

	content: string;
}