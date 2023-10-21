import { UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { WebSocketGateway, WebSocketServer, OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { AuthService } from 'src/auth/auth.service';
import { UserEntity } from './user.entity';
import { UserService } from './user.service';
import { UserStatus } from '@prisma/client';
import { Cron } from '@nestjs/schedule';

@WebSocketGateway({
    namespace: 'user',
    cors: {
        origin: '*',
    },
})
@UseGuards(AuthGuard)
export class UserGateway implements OnGatewayConnection, OnGatewayDisconnect
{
    @WebSocketServer() server: Server;
    constructor(
        private readonly authService: AuthService,
        private readonly userService: UserService,
        ){}
    private userList: UserEntity[] = [];
    private matchmakingList: UserEntity[] = [];
    private gamesCount: number = 0;
    
    async handleDisconnect(client: Socket)
    {
        const userLogin: string = client.handshake.headers.user.toString();
        console.log('User disconnected : ', userLogin);

        let index = this.userList.findIndex(user => user.client.id === client.id);
        this.userList.splice(index, 1);
        this.broadcast("removeUser", userLogin);

        let mmIndex = this.matchmakingList.findIndex(user => user.client.id == client.id)
        if (mmIndex) this.userList.splice(mmIndex, 1);

        if (this.userList.findIndex(user => user.login === userLogin) == -1)
            await this.userService.setUserStatus(userLogin, UserStatus.OFFLINE);

    }

    async handleConnection(client: Socket)
    {
        const userLogin: string = client.handshake.headers.user.toString();
        console.log('User connected : ', userLogin, ' with id ', client.id);

        this.broadcast("addUser", userLogin);
        const user: UserEntity = new UserEntity(userLogin, client);
        this.userList.push(user);

        if (this.matchmakingList.findIndex(user => user.login === userLogin) == -1)
            this.matchmakingList.push(user)

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