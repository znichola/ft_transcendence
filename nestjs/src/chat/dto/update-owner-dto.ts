import { IsInt } from "class-validator";

export class UpdateOwnerDto
{
	@IsInt()
	ownerId: number;
}