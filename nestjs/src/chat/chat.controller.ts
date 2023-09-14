import { Controller, Delete, Get, Post, Patch, Put, Body, UsePipes, ValidationPipe, Param} from '@nestjs/common';
import { ChatService } from './chat.service';
import { AddMemberToChatroomDto } from './dto/add-member-to-chatroom-dto';
import { CreateChatroomDto } from './dto/create-chatroom-dto';
import { UpdateRoleDto } from './dto/update-role-dto';
import { ChatRoomData } from './interfaces/chat-room-data.interface';
import { ChatroomMember } from './interfaces/chat-room-member.interface';

@Controller('chat')
export class ChatController
{
	constructor(private readonly chatService: ChatService) {}

	@Get()
	async getAllChatRooms(): Promise<ChatRoomData[]>
	{
		return await this.chatService.getAllChatRooms();
	}

	@Post()
	@UsePipes(ValidationPipe)
	async createNewChatRoom(@Body() createChatroomDto: CreateChatroomDto)
	{
		this.chatService.createNewChatRoom(createChatroomDto);
	}

	@Get(':id')
	async getOneChatRoom(@Param('id') id: number): Promise<ChatRoomData>
	{
		return this.chatService.getOneChatRoom(id);
	}

	@Delete(':id')
	async deleteChatroom(@Param('id') id: number)
	{
		this.chatService.deleteChatroom(id);
	}

	@Get(':id/members')
	async getMembersOfChatRoom(@Param('id') id: number): Promise<ChatroomMember[]>
	{
		return this.chatService.getMembersOfChatRoom(id);
	}

	@Post(':id/members')
	@UsePipes(ValidationPipe)
	async addMemberToChatRoom(@Param('id') id: number, @Body() addMemberDto: AddMemberToChatroomDto)
	{
		this.chatService.addMemberToChatRoom(id, addMemberDto);
	}

	@Get(':id/members/:memberId')
	async getOneMemberFromChatroom(@Param('id') chatroomId: number, @Param('memberId') memberId: number)
	{
		return this.chatService.getOneMemberFromChatroom(chatroomId, memberId);
	}

	@Delete(':id/members/:memberId')
	async deleteMemberFromChatRoom(@Param('id') chatroomId: number, @Param('memberId') memberId: number)
	{
		this.chatService.deleteMemberFromChatRoom(chatroomId, memberId);
	}

	@Patch(':id/members/:memberId')
	@UsePipes(ValidationPipe)
	async updateMemberFromChatroom(@Param('id') chatroomId: number, @Param('memberId') memberId: number, @Body() patch: UpdateRoleDto)
	{
		this.chatService.updateRoleOfMemberFromChatroom(chatroomId, memberId, patch);
	}
}
