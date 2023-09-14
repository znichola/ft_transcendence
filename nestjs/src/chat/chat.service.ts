import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { AddMemberToChatroomDto } from './dto/add-member-to-chatroom-dto';
import { CreateChatroomDto } from './dto/create-chatroom-dto';
import { UpdateRoleDto } from './dto/update-role-dto';
import { ChatRoomData } from './interfaces/chat-room-data.interface';
import { ChatroomMember } from './interfaces/chat-room-member.interface';

@Injectable()
export class ChatService
{
	private chatRooms: ChatRoomData[] = [];

	async getAllChatRooms(): Promise<ChatRoomData[]>
	{
		return this.chatRooms;
	}

	async createNewChatRoom(chatroomDto: CreateChatroomDto)
	{
		let newChatRoom = new ChatRoomData(chatroomDto.ownerId);
		this.chatRooms.push(newChatRoom);
	}

	async getOneChatRoom(id: number): Promise<ChatRoomData>
	{
		const chatroom = this.chatRooms.find(chatroom => chatroom.id == id);
		if (chatroom == undefined)
			throw new HttpException('Not found', HttpStatus.NOT_FOUND);
		return this.chatRooms.find(chatroom => chatroom.id == id);
	}

	async deleteChatroom(id: number)
	{
		let indexToDelete = this.chatRooms.findIndex(chatroom => chatroom.id == id);
		if (indexToDelete == undefined)
			throw new HttpException('Not found', HttpStatus.NOT_FOUND);
		delete this.chatRooms[indexToDelete];
	}

	async getMembersOfChatRoom(id: number): Promise<ChatroomMember[]>
	{
		let chatroomIndex = this.chatRooms.findIndex(chatroom => chatroom.id == id);
		if (chatroomIndex == undefined)
			throw new HttpException('Not found', HttpStatus.NOT_FOUND);
		return this.chatRooms[chatroomIndex].members;
	}

	async getOneMemberFromChatroom(chatroomId: number, memberId: number)
	{
		let chatroomIndex = this.chatRooms.findIndex(chatroom => chatroom.id == chatroomId);
		if (chatroomIndex == undefined)
			throw new HttpException('Not found', HttpStatus.NOT_FOUND);
		return this.chatRooms[chatroomIndex].members.find(member => member.id == memberId);
	}

	async addMemberToChatRoom(chatRoomId: number, addMemberDto: AddMemberToChatroomDto)
	{
		let chatroomIndex = this.chatRooms.findIndex(chatroom => chatroom.id == chatRoomId);		
		if (chatroomIndex == undefined)
			throw new HttpException('Not found', HttpStatus.NOT_FOUND);
		let newMember = new ChatroomMember(addMemberDto.userId);	
		this.chatRooms[chatroomIndex].members.push(newMember);
	}

	async deleteMemberFromChatRoom(chatRoomId: number, memberId: number)
	{
		let chatroomIndex = this.chatRooms.findIndex(chatroom => chatroom.id == chatRoomId);		
		if (chatroomIndex == undefined)
			throw new HttpException('Not found', HttpStatus.NOT_FOUND);
		let indexToDelete = this.chatRooms[chatroomIndex].members.findIndex(member => member.id == memberId);
		if (indexToDelete == undefined)
			throw new HttpException('Not found', HttpStatus.NOT_FOUND);
		delete this.chatRooms[chatRoomId].members[indexToDelete];
	}

	async updateRoleOfMemberFromChatroom(chatroomId: number, memberId: number, updateRoleDto: UpdateRoleDto)
	{
		let chatroomIndex = this.chatRooms.findIndex(chatroom => chatroom.id == chatroomId);		
		if (chatroomIndex == undefined)
			throw new HttpException('Not found', HttpStatus.NOT_FOUND);
		let indexToUpdate = this.chatRooms[chatroomIndex].members.findIndex(member => member.id == memberId);
		if (indexToUpdate == undefined)
			throw new HttpException('Not found', HttpStatus.NOT_FOUND);
		this.chatRooms[chatroomIndex].members[indexToUpdate].role = updateRoleDto.role;
	}
}
