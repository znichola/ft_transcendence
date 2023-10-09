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
		console.log(`sending [newDirectMessage] event with payload: ${JSON.stringify(payload)}`);
		this.server.emit('newDirectMessage', payload);
	}
}
