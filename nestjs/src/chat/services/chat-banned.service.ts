import { PrismaService } from "src/prisma/prisma.service";
import { BannedUserEntity, BannedUserWithUsername } from "../entities/banned-user.entity";
import { BanUserDto } from "../dto/ban-user-dto";
import { BadRequestException, ForbiddenException, Injectable } from "@nestjs/common";
import { ChatUtils } from "./chat-utils.service";
import { ChatroomUserRole } from "@prisma/client";

@Injectable()
export class ChatBannedService
{
	constructor(private prisma: PrismaService,
		private readonly utils: ChatUtils){}

	async getBannedUsers(chatroomId: number): Promise<string[]>
	{
		await this.utils.checkChatroomExists(chatroomId);

		const banned: BannedUserWithUsername[] = await this.prisma.bannedUser.findMany({
			where: {
				chatroomId: +chatroomId
			},
			select: {
				user: {
					select: {
						login42: true
					}
				}
			}
		});

		return banned.map(user => user.user.login42);
	}

	async getOneBannedUser(chatroomId: number, username: string): Promise<BannedUserEntity>
	{
		const userId = await this.utils.getUserId(username);

		const banned: BannedUserWithUsername = await this.prisma.bannedUser.findUniqueOrThrow({
			where: {
				chatroomId_userId: {chatroomId: +chatroomId, userId: +userId}
			},
			select: {
				user: {
					select: {
						login42: true
					}
				}
			}
		});

		return new BannedUserEntity(banned);
	}

	async addBannedUser(chatroomId: number, payload: BanUserDto)
	{
		await this.utils.checkChatroomExists(chatroomId);

		let userId: number;
		try {
			userId = await this.utils.getUserId(payload.login42);
		} catch (e: any)
		{
			throw new BadRequestException("This user does not exist");
		}

		const member = await this.prisma.chatroomUser.findUnique({
			where: {
				chatroomId_userId: {chatroomId: +chatroomId, userId: +userId}
			}
		});

		if (member != null && member.role == ChatroomUserRole.OWNER)
		{
			throw new ForbiddenException("You cannot ban the owner of the channel");
		}

		/* add user to the list of banned members */
		await this.prisma.bannedUser.create({
			data: {
				chatroomId: +chatroomId,
				userId: +userId,
			}
		});

		/* delete user from chatroom if they are in the chatroom */
		if (member != null)
		{
			await this.prisma.chatroomUser.delete({
				where: {
					chatroomId_userId: {chatroomId: +chatroomId, userId: +userId}
				}
			});
		}
	}

	async deleteBannedUser(chatroomId: number, username: string)
	{
		const userId = await this.utils.getUserId(username);

		await this.prisma.bannedUser.delete({
			where: {
				chatroomId_userId: {chatroomId: +chatroomId, userId: +userId}
			}
		});
	}

}