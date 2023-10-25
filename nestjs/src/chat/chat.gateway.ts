import { SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { ChatroomEntity } from './entities/chatroom.entity';

@WebSocketGateway({
	namespace: 'chatroom',
	cors: {
		origin: '*'
	}
})
export class ChatGateway
{
	@WebSocketServer()
	server: Server

	push(chatroomId: number)
	{
		const payload = {
			id: chatroomId,
			senderLogin42: "Brisa9",
			content: "Hello, how are you?",
			sentAt: "2023-10-24T12:00:00",
			isBlocked: false,
		}
		this.server.emit('newChatroomMessage', payload);
	}
}
