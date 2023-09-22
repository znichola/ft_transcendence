import { ChatroomUserRole } from "@prisma/client";

export class UpdateRoleDto
{
    role: ChatroomUserRole;
}