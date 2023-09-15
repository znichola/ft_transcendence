import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AddMemberToChatroomDto } from './dto/add-member-to-chatroom-dto';
import { CreateChatroomDto } from './dto/create-chatroom-dto';
import { UpdateRoleDto } from './dto/update-role-dto';
import { ChatRoomData } from './interfaces/chat-room-data.interface';
import { ChatroomMember } from './interfaces/chat-room-member.interface';

@Injectable()
export class ChatService
{
	constructor(private prisma: PrismaService){}

	private chatRooms: ChatRoomData[] = [];

	async getAllChatRooms(): Promise<ChatRoomData[]>
	{
		return this.chatRooms;
	}

	async createNewChatRoom(chatroomDto: CreateChatroomDto)
	{
		await this.checkUserExists(chatroomDto.ownerId);
		let newChatRoom = new ChatRoomData(chatroomDto.ownerId);
		this.chatRooms.push(newChatRoom);
	}

	async getOneChatRoom(id: number): Promise<ChatRoomData>
	{
		const chatroom = this.chatRooms.find(chatroom => chatroom.id == id);
		if (chatroom == undefined)
			throw new NotFoundException();
		return this.chatRooms.find(chatroom => chatroom.id == id);
	}

	async deleteChatroom(id: number)
	{
		let indexToDelete = this.chatRooms.findIndex(chatroom => chatroom.id == id);
		if (indexToDelete == undefined)
			throw new NotFoundException();
		delete this.chatRooms[indexToDelete];
	}

	async getMembersOfChatRoom(id: number): Promise<ChatroomMember[]>
	{
		let chatroomIndex = this.chatRooms.findIndex(chatroom => chatroom.id == id);
		if (chatroomIndex == undefined)
			throw new NotFoundException();
		return this.chatRooms[chatroomIndex].members;
	}

	async getOneMemberFromChatroom(chatroomId: number, memberId: number)
	{
		let chatroomIndex = this.chatRooms.findIndex(chatroom => chatroom.id == chatroomId);
		if (chatroomIndex == undefined)
			throw new NotFoundException();
		return this.chatRooms[chatroomIndex].members.find(member => member.id == memberId);
	}

	async addMemberToChatRoom(chatRoomId: number, addMemberDto: AddMemberToChatroomDto)
	{
		let chatroomIndex = this.chatRooms.findIndex(chatroom => chatroom.id == chatRoomId);		
		if (chatroomIndex == undefined)
			throw new NotFoundException();
		let newMember = new ChatroomMember(addMemberDto.userId);	
		this.chatRooms[chatroomIndex].members.push(newMember);
	}

	async deleteMemberFromChatRoom(chatRoomId: number, memberId: number)
	{
		let chatroomIndex = this.chatRooms.findIndex(chatroom => chatroom.id == chatRoomId);		
		if (chatroomIndex == undefined)
			throw new NotFoundException();
		let indexToDelete = this.chatRooms[chatroomIndex].members.findIndex(member => member.id == memberId);
		if (indexToDelete == undefined)
			throw new NotFoundException();
		delete this.chatRooms[chatRoomId].members[indexToDelete];
	}

	async updateRoleOfMemberFromChatroom(chatroomId: number, memberId: number, updateRoleDto: UpdateRoleDto)
	{
		let chatroomIndex = this.chatRooms.findIndex(chatroom => chatroom.id == chatroomId);		
		if (chatroomIndex == undefined)
			throw new NotFoundException();
		let indexToUpdate = this.chatRooms[chatroomIndex].members.findIndex(member => member.id == memberId);
		if (indexToUpdate == undefined)
			throw new NotFoundException();
		this.chatRooms[chatroomIndex].members[indexToUpdate].role = updateRoleDto.role;
	}

	private async checkUserExists(userId: number)
	{
		const user = await this.prisma.user.findFirst({
			where:
			{
				id: userId,
			},
		});
		if (user == null)
			throw new HttpException('This user does not exist', HttpStatus.NOT_FOUND);
	}
}