import { IsString } from "class-validator";

export class SendDmDto
{
	@IsString()
	content: string;
}