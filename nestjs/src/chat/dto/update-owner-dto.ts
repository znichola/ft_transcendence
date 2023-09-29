import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class UpdateOwnerDto
{
	@ApiProperty()
	@IsString()
	ownerUsername: string;
}