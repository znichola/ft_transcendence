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
		const message = {
			id: 42,
			senderLogin42: "Brisa9",
			content: "Hello, how are you?",
			sentAt: "2023-10-24T12:00:00",
			isBlocked: false,
		}
		const payload = {
			id: chatroomId,
			name: "The chatroom's name",
			message: message,
		}
		this.server.emit('newChatroomMessage', payload);
	}
}
