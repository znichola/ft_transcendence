import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class BanUserDto
{
	@ApiProperty()
	@IsString()
	@IsNotEmpty()
	login42: string;
}