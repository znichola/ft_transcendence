import { Controller, Delete, Get, Post, Patch, Put, Body, UsePipes, ValidationPipe, Param, ParseIntPipe, UseFilters} from '@nestjs/common';
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

@ApiTags("Chatrooms")
@UsePipes(new ValidationPipe({whitelist: true}))
@UseFilters(PrismaClientExceptionFilter)
@Controller('chatroom')
export class ChatController
{
	constructor(private readonly chatService: ChatService,
		private readonly memberService: ChatMemberService,
		private readonly messageService: ChatMessageService,
		private readonly bannedService: ChatBannedService) {}

	@Get()
	@ApiOkResponse({type: ChatroomEntity, isArray: true})
	async getAllChatRooms(): Promise<ChatroomEntity[]>
	{
		return await this.chatService.getAllChatRooms();
	}

	@Post()
	@ApiCreatedResponse({type: ChatroomEntity})
	async createNewChatRoom(@Body() createChatroomDto: CreateChatroomDto): Promise<ChatroomEntity>
	{
		return await this.chatService.createNewChatRoom(createChatroomDto);
	}

	@Get(':id')
	@ApiOkResponse({type: ChatroomEntity})
	async getOneChatRoom(@Param('id', ParseIntPipe) id: number): Promise<ChatroomEntity>
	{
		return await this.chatService.getOneChatRoom(id);
	}

	@Delete(':id')
	async deleteChatroom(@Param('id', ParseIntPipe) id: number)
	{
		await this.chatService.deleteChatroom(id);
	}

	@Get(':id/messages')
	@ApiOkResponse({type: MessageEntity, isArray: true})
	async getAllMessages(@Param('id', ParseIntPipe) id: number): Promise<MessageEntity[]>
	{
		return await this.messageService.getAllMessagesFromChatroom(id);
	}

	@Get(':id/messages/:msgId')
	@ApiOkResponse({type: MessageEntity})
	async getOneMessage(@Param('id', ParseIntPipe) id: number, @Param('msgId', ParseIntPipe) msgId: number): Promise<MessageEntity>
	{
		return await this.messageService.getOneMessageFromChatroom(id, msgId);
	}

	@Post(':id/messages')
	async sendMessage(@Param('id', ParseIntPipe) chatroomId: number, @Body() payload: SendMessageDto)
	{
		await this.messageService.sendMessageToChatroom(chatroomId, payload.senderLogin42, payload.content);
	}

	@Put(':id/messages/:msgId')
	async updateMessage(@Param('id', ParseIntPipe) chatroomId: number, @Param('msgId', ParseIntPipe) msgId: number, @Body() payload: UpdateMessageDto)
	{
		await this.messageService.updateMessageFromChatroom(msgId, payload.content);
	}

	@Delete(':id/messages/:msgId')
	async deleteMessage(@Param('id', ParseIntPipe) chatroomId: number, @Param('msgId', ParseIntPipe) msgId: number)
	{
		await this.messageService.deleteMessageFromChatroom(msgId);
	}

	@Put(':id/visibility')
	async updateChatroomVisibility(@Param('id', ParseIntPipe) id: number, @Body() patch: UpdateVisibilityDto)
	{
		await this.chatService.updateChatroomVisibility(id, patch);
	}

	@Put(":id/owner")
	async updateChatroomOwner(@Param('id', ParseIntPipe) id: number, @Body() patch: UpdateOwnerDto)
	{
		await this.chatService.updateChatroomOwner(id, patch);
	}

	@Get(':id/members')
	@ApiOkResponse({type: MemberEntity, isArray: true})
	async getMembersOfChatRoom(@Param('id', ParseIntPipe) id: number): Promise<MemberEntity[]>
	{
		return await this.memberService.getMembersOfChatRoom(id);
	}

	@Post(':id/members')
	async addMemberToChatRoom(@Param('id', ParseIntPipe) id: number, @Body() addMemberDto: AddMemberToChatroomDto)
	{
		await this.memberService.addMemberToChatRoom(id, addMemberDto);
	}

	@Get(':id/members/:username')
	@ApiOkResponse({type: MemberEntity})
	async getOneMemberFromChatroom(@Param('id', ParseIntPipe) chatroomId: number, @Param('username') username: string): Promise<MemberEntity>
	{
		return await this.memberService.getOneMemberFromChatroom(chatroomId, username);
	}

	@Delete(':id/members/:username')
	async deleteMemberFromChatRoom(@Param('id', ParseIntPipe) chatroomId: number, @Param('username') username: string)
	{
		await this.memberService.deleteMemberFromChatRoom(chatroomId, username);
	}

	@Put(':id/members/:username/role')
	async updateMemberFromChatroom(@Param('id', ParseIntPipe) chatroomId: number, @Param('username') username: string, @Body() patch: UpdateRoleDto)
	{
		await this.memberService.updateRoleOfMemberFromChatroom(chatroomId, username, patch);
	}

	@Get(':id/banned')
	@ApiOkResponse({type: 'string', isArray: true})
	async getBannedUsers(@Param('id', ParseIntPipe) chatroomId: number): Promise<string[]>
	{
		return await this.bannedService.getBannedUsers(chatroomId);
	}

	@Post(':id/banned')
	async addBannedUser(@Param('id', ParseIntPipe) chatroomId: number, @Body() payload: BanUserDto)
	{
		await this.bannedService.addBannedUser(chatroomId, payload);
	}

	@Get(':id/banned/:username')
	@ApiOkResponse({type: BannedUserEntity})
	async getOneBannedUser(@Param('id', ParseIntPipe) chatroomId: number, @Param('username') username: string): Promise<BannedUserEntity>
	{
		return await this.bannedService.getOneBannedUser(chatroomId, username);
	}

	@Delete(':id/banned/:username')
	async deleteBannedUser(@Param('id', ParseIntPipe) chatroomId: number, @Param('username') username: string)
	{
		await this.bannedService.deleteBannedUser(chatroomId, username);
	}

	@Post(':id/muted/')
	async muteMember(@Param('id', ParseIntPipe) chatroomId: number, @Body() payload: MuteMemberDto)
	{
		await this.memberService.muteMember(chatroomId, payload);
	}

	@Delete(':id/muted/:username')
	async unmuteMember(@Param('id', ParseIntPipe) chatroomId: number, @Param('username') username: string)
	{
		await this.memberService.unmuteMember(chatroomId, username);
	}
}
