import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsNotEmpty, IsPositive, IsString } from "class-validator";

export class MuteMemberDto
{
	@ApiProperty()
	@IsString()
	@IsNotEmpty()
	login42: string;

	@ApiProperty()
	@IsInt()
	@IsPositive()
	durationInSeconds: number;
}