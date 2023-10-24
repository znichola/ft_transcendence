import { UseGuards } from '@nestjs/common';
import { WebSocketGateway, WebSocketServer, OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { AuthService } from 'src/auth/auth.service';
import { UserEntity } from './user.entity';
import { UserService } from './user.service';
import { UserStatus } from '@prisma/client';
import { SocketAuthMiddleware } from 'src/auth/ws.middleware';
import { WsGuard } from 'src/ws/ws.guard';

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
        private readonly userService: UserService,
        ){}
    private userList: UserEntity[] = [];
    // private matchmakingList: UserEntity[] = [];
    private gamesCount: number = 0;
    
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

        // let mmIndex = this.matchmakingList.findIndex(user => user.client.id == client.id)
        // if (mmIndex) this.userList.splice(mmIndex, 1);

        if (this.userList.findIndex(user => user.login === userLogin) == -1)
            await this.userService.setUserStatus(userLogin, UserStatus.OFFLINE);

    }

    async handleConnection(client: Socket)
    {
        const userToken: string = client.handshake.headers.authorization.toString();
        const userLogin = await this.authService.getLoginFromToken(userToken);

        console.log('User connected : ', userLogin);

        this.broadcast("addUser", userLogin);
        const user: UserEntity = new UserEntity(userLogin, client);
        this.userList.push(user);

        // if (this.matchmakingList.findIndex(user => user.login === userLogin) == -1)
            // this.matchmakingList.push(user)

        await this.userService.setUserStatus(userLogin, UserStatus.ONLINE);
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