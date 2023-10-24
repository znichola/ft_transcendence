import { UseGuards } from '@nestjs/common';
import { WebSocketGateway, WebSocketServer, OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { AuthService } from 'src/auth/auth.service';
import { ChallengeEntity, UserEntity, UserNameEntity } from './user.entity';
import { SocketAuthMiddleware } from 'src/auth/ws.middleware';
import { WsGuard } from 'src/ws/ws.guard';
import { UserStatusService } from './user.status.service';
import { UserStatus } from '@prisma/client';

@WebSocketGateway({
    cors: {
        origin: '*',
    },
})
@UseGuards(WsGuard)
export class UserGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
    @WebSocketServer() server: Server;
    constructor(
        private readonly authService: AuthService,
        private readonly userStatusService: UserStatusService,
        ){}
    private userList: UserEntity[] = [];
    
    async afterInit(client: Socket) 
    {
        client.use(SocketAuthMiddleware() as any);
        console.log('User WS Initialized');
    }

    async handleDisconnect(client: Socket)
    {
        const userToken: string = client.handshake.headers.authorization.toString();
        const userLogin = await this.authService.getLoginFromToken(userToken);
        console.log('User disconnected : ', userLogin);

        let index = this.userList.findIndex(user => user.client.id === client.id);
        this.userList.splice(index, 1);
        this.broadcast("removeUser", userLogin);

        if (this.userList.findIndex(user => user.login === userLogin) == -1)
            await this.userStatusService.setUserStatus(userLogin, UserStatus.OFFLINE);

    }

    async handleConnection(client: Socket)
    {
        const userToken: string = client.handshake.headers.authorization.toString();
        const userLogin = await this.authService.getLoginFromToken(userToken);

        console.log('User connected : ', userLogin);

        const user: UserEntity = new UserEntity(userLogin, client);

        if (this.userList.findIndex(user => user.login === userLogin) == -1)
            await this.userStatusService.setUserStatus(userLogin, UserStatus.ONLINE);
        
        this.userList.push(user);
    }

    sendFriendRequest(to: string, sender: UserNameEntity)
    {
        this.toAllUserClients(to, 'friendRequest', sender);
    }

    sendChallenge(to: string, challenge: ChallengeEntity)
    {
        this.toAllUserClients(to, 'challenge', challenge);
    }

    @SubscribeMessage('declineChallenge')
    handleDeclineChallenge(client: Socket, challenge: ChallengeEntity)
    {
        console.log('challenge with id ', challenge.gameId, ' declined.');
    }

    @SubscribeMessage('acceptChallenge')
    handleAcceptChallenge(client: Socket, challenge: ChallengeEntity)
    {
        console.log('challenge with id ', challenge.gameId, ' accepted.');
        console.log('Accepting client ID is ', client.id);
    }

    toAllUserClients(to: string, event: string, message: any)
    {
        this.userList.forEach((user) => {
            if (user.login == to)
            {
                console.log('sending to client ', user.client.id);
                user.client.send(event, message);
            }
        });
    }

    sendUserUpdated(login: string)
    {
        this.server.emit('userUpdated', login);
    }

    broadcast(event: string, user: string)
    {
        this.server.emit(event, user);
    }

    broadcastTo(room: string, event: string, message: string)
    {
        this.server.to(room).emit(event, message);
    }
}