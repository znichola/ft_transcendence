import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class SendDmDto
{
	@ApiProperty()
	@IsString()
	@IsNotEmpty()
	content: string;
}