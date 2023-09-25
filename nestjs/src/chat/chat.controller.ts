import { Controller, Delete, Get, Post, Patch, Put, Body, UsePipes, ValidationPipe, Param} from '@nestjs/common';
import { ChatService } from './chat.service';
import { AddMemberToChatroomDto } from './dto/add-member-to-chatroom-dto';
import { CreateChatroomDto } from './dto/create-chatroom-dto';
import { UpdateRoleDto } from './dto/update-role-dto';
import { Chatroom, ChatroomUser } from '@prisma/client';
import { UpdateVisibilityDto } from './dto/update-visibility-dto';
import { UpdateOwnerDto } from './dto/update-owner-dto';

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
