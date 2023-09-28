import { ChatroomVisibilityStatus } from "@prisma/client";

export class ChatroomEntity
{
	id: number;
	name: string;
	ownerUsername: string;
	status: ChatroomVisibilityStatus;
}