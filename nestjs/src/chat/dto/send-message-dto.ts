import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsNotEmpty, IsString } from "class-validator";

export class SendMessageDto
{
	@ApiProperty()
	@IsString()
	@IsNotEmpty()
	content: string;
}