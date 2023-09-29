import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class UpdateOwnerDto
{
	@ApiProperty()
	@IsString()
	@IsNotEmpty()
	ownerUsername: string;
}