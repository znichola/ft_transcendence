import { PrismaService } from "src/prisma/prisma.service";
import { MemberEntity, MemberWithUsername } from "../entities/member.entity";
import { AddMemberToChatroomDto } from "../dto/add-member-to-chatroom-dto";
import { ConflictException, ForbiddenException, Injectable } from "@nestjs/common";
import { BannedUser, ChatroomVisibilityStatus } from "@prisma/client";
import { ChatUtils } from "./chat-utils.service";
import { UpdateRoleDto } from "../dto/update-role-dto";
import * as bcrypt from 'bcrypt';
import { MuteMemberDto } from "../dto/mute-member-dto";

@Injectable()
export class ChatMemberService
{
	constructor(private prisma: PrismaService,
		private readonly utils: ChatUtils){}


	async getMembersOfChatRoom(id: number, identity: string): Promise<MemberEntity[]>
	{
		await this.utils.checkChatroomExists(id);

		const issuerId = await this.utils.getUserId(identity);
		if (!await this.utils.isMember(issuerId, id))
			throw new ForbiddenException("You are not a member of this chatroom");

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

	async getOneMemberFromChatroom(chatroomId: number, username: string, identity: string): Promise<MemberEntity>
	{
		await this.utils.checkChatroomExists(chatroomId);

		const issuerId = await this.utils.getUserId(identity);
		if (!await this.utils.isMember(issuerId, chatroomId))
			throw new ForbiddenException("You are not a member of this chatroom");

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

	async addMemberToChatRoom(chatroomId: number, addMemberDto: AddMemberToChatroomDto, identity: string)
	{
		const chatroom = await this.prisma.chatroom.findUniqueOrThrow({
			where: {
				id: +chatroomId,
			},
		});

		const userId = await this.utils.getUserId(addMemberDto.login42);

		if (await this.utils.isMember(userId, chatroomId))
			throw new ConflictException("This user is already a member of the chatroom");

		if (await this.utils.isBanned(userId, chatroomId))
			throw new ForbiddenException("This user has been banned from this chatroom");

		const issuerId = await this.utils.getUserId(identity);

		if (chatroom.status == ChatroomVisibilityStatus.PRIVATE)
		{
			await this.utils.requireAdminRights(issuerId, chatroomId);
		}
		else
		{
			if (issuerId != userId)
				throw new ForbiddenException("You are not allowed to add users other than yourself in this chatroom");

			if (chatroom.status == ChatroomVisibilityStatus.PROTECTED)
			{
				if (addMemberDto.password == null || addMemberDto.password == "")
					throw new ForbiddenException("Password required");

				const pwd_verif: boolean = await bcrypt.compare(addMemberDto.password, chatroom.password);
				if (!pwd_verif)
					throw new ForbiddenException("Wrong password");
			}
		}

		await this.prisma.chatroomUser.create({
			data: {
				chatroomId: +chatroomId,
				userId: +userId,
				role: "MEMBER"
			},
		});
	}

	async deleteMemberFromChatRoom(chatroomId: number, member: string, identity: string)
	{
		await this.utils.checkChatroomExists(chatroomId);

		const userId = await this.utils.getUserId(member);

		await this.utils.checkIsMember(userId, chatroomId);

		const issuerId = await this.utils.getUserId(identity);

		const chatroom = await this.prisma.chatroom.findUniqueOrThrow({where: {id: +chatroomId}});

		if (chatroom.ownerId == userId)
		{
			if (issuerId != userId)
				throw new ForbiddenException("Nobody can kick the owner of the chatroom");

			/* find another member that is admin */
			let nextOwner = await this.prisma.chatroomUser.findFirst({where: {chatroomId: +chatroomId, role: "ADMIN"}});
			if (nextOwner == null)
				nextOwner = await this.prisma.chatroomUser.findFirst({where: {chatroomId: +chatroomId, role: "MEMBER"}});
			if (nextOwner == null)
			{
				await this.prisma.chatroom.delete({
					where: {
						id: +chatroomId
					}
				});
			}
			else
			{
				/* set nextOwner as the owner of the chatroom */
				await this.prisma.chatroom.update({
					where: {
						id: +chatroomId,
					},
					data: {
						ownerId: +nextOwner.userId,
						chatroomUsers: {
							update: {
								where: {
									chatroomId_userId: {chatroomId: +chatroomId, userId: +nextOwner.userId}
								},
								data: {
									role: "OWNER"
								}
							}
						}
					}
				});
			}
		}
		else if (userId != issuerId)
		{
			await this.utils.requireAdminRights(issuerId, chatroomId);
		}

		await this.prisma.chatroomUser.delete({
			where: {
				chatroomId_userId: {chatroomId: +chatroomId, userId: +userId},
			},
		});
	}

	async updateRoleOfMemberFromChatroom(chatroomId: number, member: string, updateRoleDto: UpdateRoleDto, identity: string)
	{
		await this.utils.checkChatroomExists(chatroomId);
		const userId = await this.utils.getUserId(member);
		await this.utils.checkIsMember(userId, chatroomId);

		if (await this.utils.isOwner(userId, chatroomId))
			throw new ForbiddenException("Cannot change role of owner");

		if (updateRoleDto.role == "OWNER")
			throw new ForbiddenException("Role of member cannot be set to owner");

		const issuerId = await this.utils.getUserId(identity);
		await this.utils.requireAdminRights(issuerId, chatroomId);

		await this.prisma.chatroomUser.update({
			where: {
				chatroomId_userId: {chatroomId: +chatroomId, userId: +userId},
			},
			data: updateRoleDto
		})
	}

	async muteMember(chatroomId: number, payload: MuteMemberDto, identity: string)
	{
		await this.utils.checkChatroomExists(chatroomId);
		const userId: number = await this.utils.getUserId(payload.login42);

		if (await this.utils.isOwner(userId, chatroomId))
			throw new ForbiddenException("You cannot mute the owner of the chatroom");

		const issuerId = await this.utils.getUserId(identity);
		await this.utils.requireAdminRights(issuerId, chatroomId);

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

	async unmuteMember(chatroomId: number, username: string, identity: string)
	{
		await this.utils.checkChatroomExists(chatroomId);
		const userId: number = await this.utils.getUserId(username);

		const issuerId = await this.utils.getUserId(identity);
		await this.utils.requireAdminRights(issuerId, chatroomId);

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