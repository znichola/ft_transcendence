import { ApiProperty } from "@nestjs/swagger";

export class MessageEntity
{
	@ApiProperty()
	id: number;

	@ApiProperty()
	senderUsername: string;

	@ApiProperty()
	content: string;

	@ApiProperty()
	sentAt: Date;
}