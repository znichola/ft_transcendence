import { ChatroomUserRole } from "@prisma/client";

export class MemberEntity
{
	username: string;
	role: ChatroomUserRole;
}