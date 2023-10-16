import { Controller, Delete, Get, Post, Patch, Put, Body, UsePipes, ValidationPipe, Param, ParseIntPipe, UseFilters, UseGuards, Request} from '@nestjs/common';
import { ChatService } from './services/chat.service';
import { AddMemberToChatroomDto } from './dto/add-member-to-chatroom-dto';
import { CreateChatroomDto } from './dto/create-chatroom-dto';
import { UpdateRoleDto } from './dto/update-role-dto';
import { UpdateVisibilityDto } from './dto/update-visibility-dto';
import { UpdateOwnerDto } from './dto/update-owner-dto';
import { SendMessageDto } from './dto/send-message-dto';
import { UpdateMessageDto } from './dto/update-message-dto';
import { ChatroomEntity } from './entities/chatroom.entity';
import { MessageEntity } from './entities/message.entity';
import { MemberEntity } from './entities/member.entity';
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { PrismaClientExceptionFilter } from 'src/prisma-client-exception/prisma-client-exception.filter';
import { BanUserDto } from './dto/ban-user-dto';
import { BannedUser } from '@prisma/client';
import { BannedUserEntity } from './entities/banned-user.entity';
import { ChatMemberService } from './services/chat-member.service';
import { ChatMessageService } from './services/chat-message.service';
import { ChatBannedService } from './services/chat-banned.service';
import { MuteMemberDto } from './dto/mute-member-dto';
import { AuthGuard } from 'src/auth/auth.guard';

@ApiTags("Chatrooms")
@UsePipes(new ValidationPipe({whitelist: true}))
@UseFilters(PrismaClientExceptionFilter)
@Controller('chatroom')
@UseGuards(AuthGuard)
export class ChatController
{
	constructor(private readonly chatService: ChatService,
		private readonly memberService: ChatMemberService,
		private readonly messageService: ChatMessageService,
		private readonly bannedService: ChatBannedService) {}

	/* SECURITY: get only all PUBLIC and PROTECTED chatrooms */
	@Get()
	@ApiOkResponse({type: ChatroomEntity, isArray: true})
	async getAllVisibleChatRooms(): Promise<ChatroomEntity[]>
	{
		return await this.chatService.getAllVisibleChatRooms();
	}

	/* SECURITY: any logged in user can create a new chatroom */
	@Post()
	@ApiCreatedResponse({type: ChatroomEntity})
	async createNewChatRoom(@Body() createChatroomDto: CreateChatroomDto): Promise<ChatroomEntity>
	{
		return await this.chatService.createNewChatRoom(createChatroomDto);
	}

	/* SECURITY: - any logged in user can see info about a specific PUBLIC or PROTECTED chatroom */
	/*           - only members of the chatroom can see info about a PRIVATE chatroom */
	@Get(':id')
	@ApiOkResponse({type: ChatroomEntity})
	async getOneChatRoom(@Param('id', ParseIntPipe) id: number, @Request() req): Promise<ChatroomEntity>
	{
		const identity: string = req.user.login;
		return await this.chatService.getOneChatRoom(id, identity);
	}

	/* SECURITY: only the owner of the chatroom can delete it */
	@Delete(':id')
	async deleteChatroom(@Param('id', ParseIntPipe) id: number, @Request() req)
	{
		const identity: string = req.user.login;
		await this.chatService.deleteChatroom(id, identity);
	}

	/* SECURITY: only members of the chatroom can see the messages */
	@Get(':id/messages')
	@ApiOkResponse({type: MessageEntity, isArray: true})
	async getAllMessages(@Param('id', ParseIntPipe) id: number, @Request() req): Promise<MessageEntity[]>
	{
		const identity: string = req.user.login;
		return await this.messageService.getAllMessagesFromChatroom(id, identity);
	}

	/* only members of the chatroom can see the messages */
	@Get(':id/messages/:msgId')
	@ApiOkResponse({type: MessageEntity})
	async getOneMessage(@Param('id', ParseIntPipe) id: number, @Param('msgId', ParseIntPipe) msgId: number): Promise<MessageEntity>
	{
		return await this.messageService.getOneMessageFromChatroom(id, msgId);
	}

	/* only members of the chatroom */
	@Post(':id/messages')
	async sendMessage(@Param('id', ParseIntPipe) chatroomId: number, @Body() payload: SendMessageDto)
	{
		await this.messageService.sendMessageToChatroom(chatroomId, payload.senderLogin42, payload.content);
	}

	/* only sender of the message */
	@Put(':id/messages/:msgId')
	async updateMessage(@Param('id', ParseIntPipe) chatroomId: number, @Param('msgId', ParseIntPipe) msgId: number, @Body() payload: UpdateMessageDto)
	{
		await this.messageService.updateMessageFromChatroom(msgId, payload.content);
	}

	/* only sender of the message */
	@Delete(':id/messages/:msgId')
	async deleteMessage(@Param('id', ParseIntPipe) chatroomId: number, @Param('msgId', ParseIntPipe) msgId: number)
	{
		await this.messageService.deleteMessageFromChatroom(msgId);
	}

	/* only owner can change visibility */
	@Put(':id/visibility')
	async updateChatroomVisibility(@Param('id', ParseIntPipe) id: number, @Body() patch: UpdateVisibilityDto)
	{
		await this.chatService.updateChatroomVisibility(id, patch);
	}

	/* only owner can change owner */
	@Put(":id/owner")
	async updateChatroomOwner(@Param('id', ParseIntPipe) id: number, @Body() patch: UpdateOwnerDto)
	{
		await this.chatService.updateChatroomOwner(id, patch);
	}

	/* only members */
	@Get(':id/members')
	@ApiOkResponse({type: MemberEntity, isArray: true})
	async getMembersOfChatRoom(@Param('id', ParseIntPipe) id: number): Promise<MemberEntity[]>
	{
		return await this.memberService.getMembersOfChatRoom(id);
	}

	/* OWNER and ADMINs can add anyone they like */
	/* non members can attempt to add themselves */
	@Post(':id/members')
	async addMemberToChatRoom(@Param('id', ParseIntPipe) id: number, @Body() addMemberDto: AddMemberToChatroomDto)
	{
		await this.memberService.addMemberToChatRoom(id, addMemberDto);
	}

	/* members only */
	@Get(':id/members/:username')
	@ApiOkResponse({type: MemberEntity})
	async getOneMemberFromChatroom(@Param('id', ParseIntPipe) chatroomId: number, @Param('username') username: string): Promise<MemberEntity>
	{
		return await this.memberService.getOneMemberFromChatroom(chatroomId, username);
	}

	/* OWNER and ADMINs only */
	@Delete(':id/members/:username')
	async deleteMemberFromChatRoom(@Param('id', ParseIntPipe) chatroomId: number, @Param('username') username: string)
	{
		await this.memberService.deleteMemberFromChatRoom(chatroomId, username);
	}

	/* OWNER only */
	@Put(':id/members/:username/role')
	async updateMemberFromChatroom(@Param('id', ParseIntPipe) chatroomId: number, @Param('username') username: string, @Body() patch: UpdateRoleDto)
	{
		await this.memberService.updateRoleOfMemberFromChatroom(chatroomId, username, patch);
	}

	/* OWNER and ADMINs only */
	@Get(':id/banned')
	@ApiOkResponse({type: 'string', isArray: true})
	async getBannedUsers(@Param('id', ParseIntPipe) chatroomId: number): Promise<string[]>
	{
		return await this.bannedService.getBannedUsers(chatroomId);
	}

	/* OWNER and ADMINs only */
	@Post(':id/banned')
	async addBannedUser(@Param('id', ParseIntPipe) chatroomId: number, @Body() payload: BanUserDto)
	{
		await this.bannedService.addBannedUser(chatroomId, payload);
	}

	/* OWNER and ADMINs only */
	@Get(':id/banned/:username')
	@ApiOkResponse({type: BannedUserEntity})
	async getOneBannedUser(@Param('id', ParseIntPipe) chatroomId: number, @Param('username') username: string): Promise<BannedUserEntity>
	{
		return await this.bannedService.getOneBannedUser(chatroomId, username);
	}

	/* OWNER and ADMINs only */
	@Delete(':id/banned/:username')
	async deleteBannedUser(@Param('id', ParseIntPipe) chatroomId: number, @Param('username') username: string)
	{
		await this.bannedService.deleteBannedUser(chatroomId, username);
	}

	/* OWNER and ADMINs only */
	@Post(':id/muted/')
	async muteMember(@Param('id', ParseIntPipe) chatroomId: number, @Body() payload: MuteMemberDto)
	{
		await this.memberService.muteMember(chatroomId, payload);
	}

	/* OWNER and ADMINs only */
	@Delete(':id/muted/:username')
	async unmuteMember(@Param('id', ParseIntPipe) chatroomId: number, @Param('username') username: string)
	{
		await this.memberService.unmuteMember(chatroomId, username);
	}
}
