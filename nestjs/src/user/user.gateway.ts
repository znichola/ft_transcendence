import { UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { WebSocketGateway, WebSocketServer, OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { AuthService } from 'src/auth/auth.service';
import { UserEntity } from './user.entity';
import { UserService } from './user.service';
import { UserStatus } from '@prisma/client';

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
    

    afterInit(server: Server): void 
    {
        console.log('Init');
    }

    async handleDisconnect(client: Socket)
    {
        const userLogin: string = client.handshake.headers.user.toString();
        console.log('User disconnected : ', userLogin);
        let index = this.userList.findIndex(user => user.client_id === client.id);
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
        //console.log(this.userList);
        client.emit("connection", this.userList);
        this.broadcast("addUser", userLogin);
        const user: UserEntity = new UserEntity(userLogin, client.id) ;
        this.userList.push(user);
        // Attempt at a way to send message to selected users (works fine)
        // if (this.userList[0] && this.userList[1] && ! this.userList[2])
        // {
        //     console.log('sending to ', this.userList[0].client_id, ' and ', this.userList[1].client_id);
        //     this.server.to(this.userList[0].client_id).emit('test', this.userList[0].client_id);
        //     this.server.to(this.userList[1].client_id).emit('test', this.userList[1].client_id);
        // }
        await this.userService.setUserStatus(userLogin, UserStatus.ONLINE);
    }

    broadcast(event: string, user: string)
    {
        this.server.emit(event, user);
    }
}