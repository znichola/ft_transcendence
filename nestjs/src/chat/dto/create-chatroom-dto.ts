import { IsInt } from "class-validator";

export class CreateChatroomDto
{
    @IsInt()
    ownerId: number;

    name: string;
}