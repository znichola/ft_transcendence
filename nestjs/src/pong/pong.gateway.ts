import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway()
export class PongGateway {
  @WebSocketServer()
  server: Server;
  // listen for send_message events
  @SubscribeMessage('send_gs')
  listenForMessages(@MessageBody() gs: string) {
    this.server.sockets.emit('receive_gs', gs);
  }
}
