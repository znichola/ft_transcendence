import { Controller, Delete, Get, Post, Patch, Put, Body, UsePipes, ValidationPipe, Param} from '@nestjs/common';
import { ChatService } from './chat.service';
import { AddMemberToChatroomDto } from './dto/add-member-to-chatroom-dto';
import { CreateChatroomDto } from './dto/create-chatroom-dto';
import { UpdateRoleDto } from './dto/update-role-dto';
import { Chatroom, ChatroomUser } from '@prisma/client';
import { UpdateVisibilityDto } from './dto/update-visibility-dto';
import { UpdateOwnerDto } from './dto/update-owner-dto';
import { SendMessageDto } from './dto/send-message-dto';
import { UpdateMessageDto } from './dto/update-message-dto';

@Controller('chat')
export class ChatController
{
	constructor(private readonly chatService: ChatService) {}

	@Get()
	async getAllChatRooms(): Promise<Chatroom[]>
	{
		return await this.chatService.getAllChatRooms();
	}

	@Post()
	@UsePipes(ValidationPipe)
	async createNewChatRoom(@Body() createChatroomDto: CreateChatroomDto)
	{
		await this.chatService.createNewChatRoom(createChatroomDto);
	}

	@Get(':id')
	async getOneChatRoom(@Param('id') id: number): Promise<Chatroom>
	{
		return await this.chatService.getOneChatRoom(id);
	}

	@Delete(':id')
	async deleteChatroom(@Param('id') id: number)
	{
		await this.chatService.deleteChatroom(id);
	}

	@Get(':id/messages')
	async getAllMessages(@Param('id') id: number)
	{
		return await this.chatService.getAllMessagesFromChatroom(id);
	}

	@Get(':id/messages/:msgId')
	async getOneMessage(@Param('id') id: number, @Param('msgId') msgId: number)
	{
		return await this.chatService.getOneMessageFromChatroom(id, msgId);
	}

	@Post(':id/messages')
	@UsePipes(ValidationPipe)
	async sendMessage(@Param('id') chatroomId: number, @Body() payload: SendMessageDto)
	{
		await this.chatService.sendMessageToChatroom(chatroomId, payload.from, payload.content);
	}

	@Put(':id/messages/:msgId')
	@UsePipes(ValidationPipe)
	async updateMessage(@Param('id') chatroomId: number, @Param('msgId') msgId: number, @Body() payload: UpdateMessageDto)
	{
		await this.chatService.updateMessageFromChatroom(msgId, payload.content);
	}

	@Delete(':id/messages/:msgId')
	async deleteMessage(@Param('id') chatroomId: number, @Param('msgId') msgId: number)
	{
		await this.chatService.deleteMessageFromChatroom(msgId);
	}

	@Patch(':id/visibility')
	@UsePipes(ValidationPipe)
	async updateChatroomVisibility(@Param('id') id: number, @Body() patch: UpdateVisibilityDto)
	{
		await this.chatService.updateChatroomVisibility(id, patch);
	}

	@Patch(":id/owner")
	@UsePipes(ValidationPipe)
	async updateChatroomOwner(@Param('id') id: number, @Body() patch: UpdateOwnerDto)
	{
		await this.chatService.updateChatroomOwner(id, patch);
	}

	@Get(':id/members')
	async getMembersOfChatRoom(@Param('id') id: number): Promise<ChatroomUser[]>
	{
		return await this.chatService.getMembersOfChatRoom(id);
	}

	@Post(':id/members')
	@UsePipes(ValidationPipe)
	async addMemberToChatRoom(@Param('id') id: number, @Body() addMemberDto: AddMemberToChatroomDto)
	{
		await this.chatService.addMemberToChatRoom(id, addMemberDto);
	}

	@Get(':id/members/:memberId')
	async getOneMemberFromChatroom(@Param('id') chatroomId: number, @Param('memberId') memberId: number): Promise<ChatroomUser>
	{
		return await this.chatService.getOneMemberFromChatroom(chatroomId, memberId);
	}

	@Delete(':id/members/:memberId')
	async deleteMemberFromChatRoom(@Param('id') chatroomId: number, @Param('memberId') memberId: number)
	{
		await this.chatService.deleteMemberFromChatRoom(chatroomId, memberId);
	}

	@Patch(':id/members/:memberId/role')
	@UsePipes(ValidationPipe)
	async updateMemberFromChatroom(@Param('id') chatroomId: number, @Param('memberId') memberId: number, @Body() patch: UpdateRoleDto)
	{
		await this.chatService.updateRoleOfMemberFromChatroom(chatroomId, memberId, patch);
	}
}
