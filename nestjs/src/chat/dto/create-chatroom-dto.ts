import { IsString } from "class-validator";

export class CreateChatroomDto
{
    @IsString()
    ownerUsername: string;

	@IsString()
    name: string;
}