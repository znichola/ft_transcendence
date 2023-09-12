import { Controller, Delete, Get, Post, Put, Body, UsePipes, ValidationPipe } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatRoomData } from './interfaces/chat-room-data.interface';

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
	async createNewChatRoom(@Body() chatRoomData: ChatRoomData)
	{
		await this.chatService.createNewChatRoom(chatRoomData);
	}
}
