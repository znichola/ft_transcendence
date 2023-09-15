import { ChatroomMember } from "./chat-room-member.interface";

export class ChatRoomData
{
	public readonly	id:				number;
	//public readonly	creation_date:	Date;
	public			name:			string;
	public 			ownerId:		number;
	//public 			members:		ChatroomMember[];

	/*
	constructor(ownerId: number)
	{
		this.id = Math.random();
		this.creation_date = new Date();
		this.ownerId = ownerId;
		this.members = [];
		
		//automatically add the owner as a member with role "owner"
		let owner = new ChatroomMember(ownerId);
		owner.role = 1;
		this.members.push(owner);
	}
	*/
}
