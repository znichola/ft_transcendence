import { Injectable } from '@nestjs/common';
import { ChatRoomData } from './interfaces/chat-room-data.interface';

@Injectable()
export class ChatService
{
	private chatRooms: ChatRoomData[] = [];

	async getAllChatRooms()
	{
		return this.chatRooms;
	}

	async createNewChatRoom(chatRoomData: ChatRoomData)
	{
		this.chatRooms.push(chatRoomData);
	}

	addMember(chatRoomId: number, userId: number)
	{
		//check if userId is valid
		//check is chatRoomId is valid

		//is this operation allowed?
	}

	deleteMember(chatRoomId: number, userId: number)
	{
		//check if userId is valid
		//check is chatRoomId is valid

		//is this operation allowed?
	}

	changeRole(chatRoomId: number, userId: number, new_role: string)
	{
		//is new_role a valid role?
	}
}
