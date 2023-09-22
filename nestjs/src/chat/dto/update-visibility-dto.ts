import { ChatroomVisibilityStatus} from "@prisma/client";

export class UpdateVisibilityDto
{
	status: ChatroomVisibilityStatus;
	password?: string;
} 