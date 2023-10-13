import { PrismaService } from "src/prisma/prisma.service";
import { MemberEntity, MemberWithUsername } from "../entities/member.entity";
import { AddMemberToChatroomDto } from "../dto/add-member-to-chatroom-dto";
import { ConflictException, ForbiddenException, Injectable } from "@nestjs/common";
import { BannedUser, ChatroomVisibilityStatus } from "@prisma/client";
import { ChatUtils } from "./chat-utils.service";
import { UpdateRoleDto } from "../dto/update-role-dto";
import * as bcrypt from 'bcrypt';
import { ChatService } from "./chat.service";
import { MuteMemberDto } from "../dto/mute-member-dto";

@Injectable()
export class ChatMemberService
{
	constructor(private prisma: PrismaService,
		private readonly utils: ChatUtils,
		private readonly chatService: ChatService){}


	async getMembersOfChatRoom(id: number): Promise<MemberEntity[]>
	{
		await this.utils.checkChatroomExists(id);

		const memberFromDb: MemberWithUsername[] = await this.prisma.chatroomUser.findMany({
			where: {
				chatroomId: +id,
			},
			select: {
				role: true,
				mutedUntil: true,
				user: {
					select: {
						login42: true
					}
				}
			}
		});

		const memberEntities: MemberEntity[] = memberFromDb.map(member => new MemberEntity(member));
		return memberEntities;
	}

	async getOneMemberFromChatroom(chatroomId: number, username: string): Promise<MemberEntity>
	{
		await this.utils.checkChatroomExists(chatroomId);

		const userId = await this.utils.getUserId(username);

		const memberFromDb: MemberWithUsername = await this.prisma.chatroomUser.findUniqueOrThrow({
			where: {
				chatroomId_userId: {chatroomId: +chatroomId, userId: +userId},
			},
			select: {
				role: true,
				mutedUntil: true,
				user: {
					select: {
						login42: true
					}
				}
			}
		});

		return new MemberEntity(memberFromDb);
	}

	async addMemberToChatRoom(chatroomId: number, addMemberDto: AddMemberToChatroomDto)
	{
		await this.utils.checkChatroomExists(chatroomId);

		const userId = await this.utils.getUserId(addMemberDto.login42);

		const chatroom = await this.prisma.chatroom.findUniqueOrThrow({
			where: {
				id: +chatroomId,
			},
		});

		if (await this.utils.isMember(userId, chatroomId))
			throw new ConflictException("This user is already a member of the chatroom");

		if (await this.utils.isBanned(userId, chatroomId))
			throw new ForbiddenException("This user has been banned from this chatroom");

		if (chatroom.status == ChatroomVisibilityStatus.PRIVATE)
		{
			throw new ForbiddenException("You haven't been invited to join this chatroom");
		}
		else if (chatroom.status == ChatroomVisibilityStatus.PROTECTED)
		{
			if (addMemberDto.password == null || addMemberDto.password == "")
				throw new ForbiddenException("Password required");

			const pwd_verif: boolean = await bcrypt.compare(addMemberDto.password, chatroom.password);
			if (!pwd_verif)
				throw new ForbiddenException("Wrong password");
		}

		await this.prisma.chatroomUser.create({
			data: {
				chatroomId: +chatroomId,
				userId: +userId,
				role: "MEMBER"
			},
		});
	}

	async deleteMemberFromChatRoom(chatroomId: number, member: string)
	{
		await this.utils.checkChatroomExists(chatroomId);

		const userId = await this.utils.getUserId(member);

		await this.utils.checkIsMember(userId, chatroomId);

		//check if user is owner
		const chatroom = await this.prisma.chatroom.findUniqueOrThrow({where: {id: +chatroomId}});
		if (chatroom.ownerId == userId)
		{
			/* find another member that is admin */
			let nextOwner = await this.prisma.chatroomUser.findFirst({where: {chatroomId: +chatroomId, role: "ADMIN"}});
			if (nextOwner == null)
				nextOwner = await this.prisma.chatroomUser.findFirst({where: {chatroomId: +chatroomId, role: "MEMBER"}});

			if (nextOwner == null)
			{
				await this.chatService.deleteChatroom(chatroomId);
				return ;
			}

			/* set nextOwner as the owner of the chatroom */
			await this.prisma.chatroom.update({
				where: {
					id: +chatroomId,
				},
				data: {
					ownerId: +nextOwner.userId,
				}
			});

			/* mark nextOwner's role as "OWNER" */
			await this.prisma.chatroomUser.update({
				where: {
					chatroomId_userId: {chatroomId: +chatroomId, userId: +nextOwner.userId}
				},
				data: {
					role: "OWNER"
				}
			});
		}

		await this.prisma.chatroomUser.delete({
			where: {
				chatroomId_userId: {chatroomId: +chatroomId, userId: +userId},
			},
		});
	}

	async updateRoleOfMemberFromChatroom(chatroomId: number, member: string, updateRoleDto: UpdateRoleDto)
	{
		await this.utils.checkChatroomExists(chatroomId);
		const userId = await this.utils.getUserId(member);
		await this.utils.checkIsMember(userId, chatroomId);

		if (this.utils.isOwner(userId, chatroomId))
			throw new ForbiddenException("Cannot change role of owner");

		if (updateRoleDto.role == "OWNER")
			throw new ForbiddenException("Role of member cannot be set to owner");

		/* must access identity to check if user is allowed to perform operation (either Owner or Admin) */

		await this.prisma.chatroomUser.update({
			where: {
				chatroomId_userId: {chatroomId: +chatroomId, userId: +userId},
			},
			data: updateRoleDto
		})
	}

	async muteMember(chatroomId: number, payload: MuteMemberDto)
	{
		await this.utils.checkChatroomExists(chatroomId);
		const userId: number = await this.utils.getUserId(payload.login42);

		if (await this.utils.isOwner(userId, chatroomId))
			throw new ForbiddenException("You cannot mute the owner of the chatroom");

		let until = new Date();
		until.setSeconds(until.getSeconds() + payload.durationInSeconds);

		await this.prisma.chatroomUser.update({
			where: {
				chatroomId_userId: {
					chatroomId: +chatroomId,
					userId: +userId
				}
			},
			data: {
				mutedUntil: until
			}
		});
	}

	async unmuteMember(chatroomId: number, username: string)
	{
		await this.utils.checkChatroomExists(chatroomId);
		const userId: number = await this.utils.getUserId(username);

		const epoch = new Date('1970-01-01T00:00:00.000Z');

		await this.prisma.chatroomUser.update({
			where: {
				chatroomId_userId: {
					chatroomId: +chatroomId,
					userId: +userId
				}
			},
			data: {
				mutedUntil: epoch
			}
		});
	}
}