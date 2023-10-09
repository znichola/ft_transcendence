import { SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { ChatroomEntity } from './entities/chatroom.entity';

@WebSocketGateway({
	namespace: 'chat',
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
		this.server.emit('newChatroomMessage', chatroomId);
	}
}
