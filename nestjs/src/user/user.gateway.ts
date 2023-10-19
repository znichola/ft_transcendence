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
export class UserGateway
implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
    @WebSocketServer() server: Server;
    constructor(
        private readonly authService: AuthService,
        private readonly userService: UserService,
        ){}
    private userList: UserEntity[] = [];
    private matchmakingList: UserEntity[] = [];
    

    afterInit(server: Server): void 
    {
        console.log('Init');
        // this.startMatchmaking();
    }

    async handleDisconnect(client: Socket)
    {
        const userLogin: string = client.handshake.headers.user.toString();
        console.log('User disconnected : ', userLogin);
        let index = this.userList.findIndex(user => user.client.id === client.id);
        this.userList.splice(index, 1);
        this.broadcast("removeUser", userLogin);
        if (this.userList.findIndex(user => user.login === userLogin) == -1)
        {
            await this.userService.setUserStatus(userLogin, UserStatus.OFFLINE);
        }
    }

    async handleConnection(client: Socket)
    {
        const userLogin: string = client.handshake.headers.user.toString();
        console.log('User connected : ', userLogin, ' with id ', client.id);
        this.broadcast("addUser", userLogin);
        const user: UserEntity = new UserEntity(userLogin, client);
        this.userList.push(user);
        if (this.matchmakingList.findIndex(user => user.login === userLogin) == -1)
        {
            this.matchmakingList.push(user)
        }
        // Attempt 2 at a way to send message to selected users
        // if (this.userList[0] && this.userList[1])
        // {
        //     console.log('sending to ', this.userList[0].client.id, ' and ', this.userList[1].client.id);
        //     this.userList[0].client.join("game1");
        //     this.userList[1].client.join("game1");
        //     const message = "hello this is a test with ids " + this.userList[0].client.id + ' and ' + this.userList[1].client.id;
        //     this.broadcastTo("game1", "test", message);
        // }
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

    @Cron('*/5 * * * * *')
    findMatches()
    {
        console.log('finding matches');
        this.matchmakingList.forEach(user => { console.log(user.login )});
        if (this.matchmakingList.length > 1)
        {
            const roomName: string = 'game1';
            const user1: UserEntity = this.matchmakingList.shift();
            const user2: UserEntity = this.matchmakingList.shift();
            const message: string = 'A game between ' + user1.login + ' and ' + user2.login + ' is about to start';
            user1.client.join(roomName);
            user2.client.join(roomName);
            console.log('making a match. Players are : ', user1.login, ' and ', user2.login);
            this.broadcastTo(roomName, "test", message);
        }
        else console.log('Not enough players in matchmaking');
    }

}