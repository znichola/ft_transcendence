import { IsInt, IsString } from "class-validator";

export class CreateChatroomDto
{
    @IsInt()
    ownerId: number;

	@IsString()
    name: string;
}