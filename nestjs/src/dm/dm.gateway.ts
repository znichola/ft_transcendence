import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io'
import { ConversationEntity } from './entities/conversation.entity';

@WebSocketGateway({
	namespace: 'dm',
	cors: {
		origin: '*'
	}
})
export class DmGateway
{
	@WebSocketServer()
	server: Server;

	push(payload: ConversationEntity)
	{
		const payload2 =   {
			id: 1,
			senderLogin42: "Brisa9",
			content: "Hello, how are you?",
			sentAt: "2023-10-24T12:00:00",
		}
		console.log(`sending [newDirectMessage] event with payload: ${JSON.stringify(payload2)}`);
		this.server.emit('newDirectMessage', payload2);
	}
}
