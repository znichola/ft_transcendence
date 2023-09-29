import { ApiProperty } from "@nestjs/swagger";

export class ConversationEntity
{
	@ApiProperty()
	id: number;

	@ApiProperty()
	username1: string;

	@ApiProperty()
	username2: string;
}