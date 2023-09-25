export class ChatroomMember
{
	public readonly id:				number;
	public readonly userId:			number;
    public 			role:			number;
    public readonly memberSince:	Date;

    constructor(userId: number)
    {
		this.id = Math.random();
		this.userId = userId;
		this.memberSince = new Date();
		this.role = 0;
	}
}