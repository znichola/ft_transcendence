import { IsString } from "class-validator";

export class UpdateOwnerDto
{
	@IsString()
	ownerUsername: string;
}