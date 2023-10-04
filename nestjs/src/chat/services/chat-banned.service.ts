import { PrismaService } from "src/prisma/prisma.service";
import { BannedUserEntity, BannedUserWithUsername } from "../entities/banned-user.entity";
import { BanUserDto } from "../dto/ban-user-dto";
import { Injectable } from "@nestjs/common";
import { ChatUtils } from "./chat-utils.service";

@Injectable()
export class ChatBannedService
{
	constructor(private prisma: PrismaService,
		private readonly utils: ChatUtils){}

	async getBannedUsers(chatroomId: number): Promise<BannedUserEntity[]>
	{
		await this.utils.checkChatroomExists(chatroomId);

		const banned: BannedUserWithUsername[] = await this.prisma.bannedUser.findMany({
			select: {
				user: {
					select: {
						login42: true
					}
				}
			}
		});

		return banned.map(user => new BannedUserEntity(user));
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
		const userId = await this.utils.getUserId(payload.login42);

		await this.prisma.bannedUser.create({
			data: {
				chatroomId: +chatroomId,
				userId: +userId,
			}
		});
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