import { IsInt } from "class-validator";

export class AddMemberToChatroomDto
{
    @IsInt()
    userId: number;
}