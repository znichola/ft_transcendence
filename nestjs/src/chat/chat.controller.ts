import { Controller, Delete, Get, Post, Patch, Put, Body, UsePipes, ValidationPipe, Param, ParseIntPipe, UseFilters, UseGuards, Request, Req} from '@nestjs/common';
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

	@Get()
	@ApiOkResponse({type: ChatroomEntity, isArray: true})
	async getAllVisibleChatRooms(@Request() req): Promise<ChatroomEntity[]>
	{
		const identity: string = req.user.login;
		return await this.chatService.getAllVisibleChatRooms(identity);
	}

	@Post()
	@ApiCreatedResponse({type: ChatroomEntity})
	async createNewChatRoom(@Body() createChatroomDto: CreateChatroomDto): Promise<ChatroomEntity>
	{
		return await this.chatService.createNewChatRoom(createChatroomDto);
	}

	@Get(':id')
	@ApiOkResponse({type: ChatroomEntity})
	async getOneChatRoom(@Param('id', ParseIntPipe) id: number, @Request() req): Promise<ChatroomEntity>
	{
		const identity: string = req.user.login;
		return await this.chatService.getOneChatRoom(id, identity);
	}

	@Delete(':id')
	async deleteChatroom(@Param('id', ParseIntPipe) id: number, @Request() req)
	{
		const identity: string = req.user.login;
		await this.chatService.deleteChatroom(id, identity);
	}

	@Get(':id/messages')
	@ApiOkResponse({type: MessageEntity, isArray: true})
	async getAllMessages(@Param('id', ParseIntPipe) id: number, @Request() req): Promise<MessageEntity[]>
	{
		const identity: string = req.user.login;
		return await this.messageService.getAllMessagesFromChatroom(id, identity);
	}

	@Get(':id/messages/:msgId')
	@ApiOkResponse({type: MessageEntity})
	async getOneMessage(@Param('id', ParseIntPipe) id: number, @Param('msgId', ParseIntPipe) msgId: number, @Request() req): Promise<MessageEntity>
	{
		const identity: string = req.user.login;
		return await this.messageService.getOneMessageFromChatroom(id, msgId, identity);
	}

	@Post(':id/messages')
	async sendMessage(@Param('id', ParseIntPipe) chatroomId: number, @Body() payload: SendMessageDto, @Request() req)
	{
		const identity: string = req.user.login;
		await this.messageService.sendMessageToChatroom(chatroomId, payload.content, identity);
	}

	@Put(':id/messages/:msgId')
	async updateMessage(@Param('id', ParseIntPipe) chatroomId: number, @Param('msgId', ParseIntPipe) msgId: number, @Body() payload: UpdateMessageDto, @Request() req)
	{
		const identity: string = req.user.login;
		await this.messageService.updateMessageFromChatroom(msgId, payload.content, identity);
	}

	@Delete(':id/messages/:msgId')
	async deleteMessage(@Param('id', ParseIntPipe) chatroomId: number, @Param('msgId', ParseIntPipe) msgId: number, @Request() req)
	{
		const identity: string = req.user.login;
		await this.messageService.deleteMessageFromChatroom(msgId, identity);
	}

	@Put(':id/visibility')
	async updateChatroomVisibility(@Param('id', ParseIntPipe) id: number, @Body() patch: UpdateVisibilityDto, @Request() req)
	{
		const identity: string = req.user.login;
		await this.chatService.updateChatroomVisibility(id, patch, identity);
	}

	@Put(":id/owner")
	async updateChatroomOwner(@Param('id', ParseIntPipe) id: number, @Body() patch: UpdateOwnerDto, @Request() req)
	{
		const identity: string = req.user.login;
		await this.chatService.updateChatroomOwner(id, patch, identity);
	}

	@Get(':id/members')
	@ApiOkResponse({type: MemberEntity, isArray: true})
	async getMembersOfChatRoom(@Param('id', ParseIntPipe) id: number, @Request() req): Promise<MemberEntity[]>
	{
		const identity: string = req.user.login;
		return await this.memberService.getMembersOfChatRoom(id, identity);
	}

	@Post(':id/members')
	async addMemberToChatRoom(@Param('id', ParseIntPipe) id: number, @Body() addMemberDto: AddMemberToChatroomDto, @Request() req)
	{
		const identity: string = req.user.login;
		await this.memberService.addMemberToChatRoom(id, addMemberDto, identity);
	}

	@Get(':id/members/:username')
	@ApiOkResponse({type: MemberEntity})
	async getOneMemberFromChatroom(@Param('id', ParseIntPipe) chatroomId: number, @Param('username') username: string, @Request() req): Promise<MemberEntity>
	{
		const identity: string = req.user.login;
		return await this.memberService.getOneMemberFromChatroom(chatroomId, username, identity);
	}

	@Delete(':id/members/:username')
	async deleteMemberFromChatRoom(@Param('id', ParseIntPipe) chatroomId: number, @Param('username') username: string, @Request() req)
	{
		const identity: string = req.user.login;
		await this.memberService.deleteMemberFromChatRoom(chatroomId, username, identity);
	}

	@Put(':id/members/:username/role')
	async updateMemberFromChatroom(@Param('id', ParseIntPipe) chatroomId: number, @Param('username') username: string, @Body() patch: UpdateRoleDto, @Request() req)
	{
		const identity: string = req.user.login;
		await this.memberService.updateRoleOfMemberFromChatroom(chatroomId, username, patch, identity);
	}

	@Get(':id/banned')
	async getBannedUsers(@Param('id', ParseIntPipe) chatroomId: number, @Request() req): Promise<string[]>
	{
		const identity: string = req.user.login;
		return await this.bannedService.getBannedUsers(chatroomId, identity);
	}

	@Post(':id/banned')
	async addBannedUser(@Param('id', ParseIntPipe) chatroomId: number, @Body() payload: BanUserDto, @Request() req)
	{
		const identity: string = req.user.login;
		await this.bannedService.addBannedUser(chatroomId, payload, identity);
	}

	@Get(':id/banned/:username')
	async getOneBannedUser(@Param('id', ParseIntPipe) chatroomId: number, @Param('username') username: string, @Request() req): Promise<BannedUserEntity>
	{
		const identity: string = req.user.login;
		return await this.bannedService.getOneBannedUser(chatroomId, username, identity);
	}

	@Delete(':id/banned/:username')
	async deleteBannedUser(@Param('id', ParseIntPipe) chatroomId: number, @Param('username') username: string, @Request() req)
	{
		const identity: string = req.user.login;
		return await this.bannedService.deleteBannedUser(chatroomId, username, identity);
	}

	@Post(':id/muted/')
	async muteMember(@Param('id', ParseIntPipe) chatroomId: number, @Body() payload: MuteMemberDto, @Request() req)
	{
		const identity: string = req.user.login;
		await this.memberService.muteMember(chatroomId, payload, identity);
	}

	@Delete(':id/muted/:username')
	async unmuteMember(@Param('id', ParseIntPipe) chatroomId: number, @Param('username') username: string, @Request() req)
	{
		const identity: string = req.user.login;
		await this.memberService.unmuteMember(chatroomId, username, identity);
	}
}
