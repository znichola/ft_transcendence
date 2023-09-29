import { ApiProperty } from "@nestjs/swagger";
import { ChatroomVisibilityStatus } from "@prisma/client";

export class ChatroomEntity
{
	@ApiProperty()
	id: number;

	@ApiProperty()
	name: string;

	@ApiProperty()
	ownerUsername: string;

	@ApiProperty({enum: ChatroomVisibilityStatus})
	status: ChatroomVisibilityStatus;
}