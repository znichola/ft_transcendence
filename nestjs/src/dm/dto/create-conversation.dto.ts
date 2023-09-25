import { IsInt } from "class-validator";

export class CreateConversationDto
{
	@IsInt()
	user1Id: number;

	@IsInt()
	user2Id: number;
}
