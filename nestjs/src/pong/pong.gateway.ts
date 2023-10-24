import {
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
} from '@nestjs/websockets';
import {
  canvas,
  timer,
  gameStart,
  definePlayerContact,
  setBallPos,
  bounceWallBall,
  scoreBall,
  createNewBall,
  positionPlayer,
  setRandomDirBall,
} from './pong.maths';
import { IGameState, I2D, IBall, IRoom, IUserInfo } from '../interfaces';
import { Server, Socket } from 'socket.io';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { AuthService } from '../auth/auth.service';
import { UserStatusService } from '../user/user.status.service';
import { UserEntity } from '../user/user.entity';
import { User, UserStatus } from '@prisma/client';
import { Cron } from '@nestjs/schedule';

@WebSocketGateway({
  namespace: 'pong',
  cors: {
    origin: '*',
  },
})
//@UseGuards(AuthGuard)
export class PongGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server: Server;
  constructor(
    private readonly authService: AuthService,
    private readonly userStatusService: UserStatusService,
  ) {}

  // therefore 'special' and 'normal' event doesn't need to send infos
  private userList: UserEntity[] = [];

  //private userIDMap: Map<string, string> = new Map<string, string>(); //key = socket.id // value = login

  //les queues en fonction du gameType
  private normalQueue: UserEntity[] = [];
  private specialQueue: UserEntity[] = [];

  //les games en cours
  private roomList: IRoom[] = []; //vs// private roomMap: Map<string, IRoom> = new Map<string, IRoom>(); //string=roomName

  //peut etre utile pour mettre afk simplement un joeur lors d'une DC
  //private gameStateMap: Map<string, IGameState> = new Map<string, IGameState>();
  private cntGame: number = 0;

  broadcast(event: string, data: any): void {
    this.server.emit(event, data);
  }

  broadcastTo(room: string, event: string, data: any): void {
    this.server.to(room).emit(event, data);
  }
  afterInit(server: Server): void {
    // console.log('Init', server);
  }

  //TODO VOIR AVEC LES AUTRES IF OK ONLY ONE SOCKET VALUE PER LOGIN
  async handleConnection(client: Socket, ...args: any[]): Promise<any> {
    const userLogin: string = client.handshake.headers.user.toString();
    console.log('Pong User connected : ', userLogin, ' with id ', client.id);
    await this.userStatusService.setUserStatus(userLogin, UserStatus.ONLINE); //TODO le mettre dans le findMatch, UserStatus.INGAME
    const user: UserEntity = new UserEntity(userLogin, client);
    // prettier-ignore
    if (this.userList.findIndex((user: UserEntity): boolean => user.login === userLogin) == -1)
      this.userList.push(user);
    this.userList.forEach((user: UserEntity): void => {
      console.log('UserList: ', user.login, user.client.id);
    });
    //checking if need to reconnect to its game
    const index: number = this.roomList.findIndex(
      (room: IRoom): boolean =>
        room.user1.info.login === userLogin ||
        room.user2.info.login === userLogin,
    );
    if (index != -1) {
      //mets a jour le status afk dans la room
      this.roomList[index].user1.info.login == userLogin
        ? !this.roomList[index].gs.p1.afk
        : !this.roomList[index].gs.p2.afk;
      //mets a jour le socket dans la room
      this.roomList[index].user1.info.login == userLogin
        ? (this.roomList[index].user1.info.client = client)
        : (this.roomList[index].user2.info.client = client);
      client.join(this.roomList[index].roomID);
    }
  }
  async handleDisconnect(client: Socket): Promise<any> {
    const userLogin: string = client.handshake.headers.user.toString();
    console.log('Pong User disconnected : ', userLogin);
    await this.userStatusService.setUserStatus(userLogin, UserStatus.OFFLINE);

    // check if it needs to be defined as afk inside a room
    let index: number = this.roomList.findIndex(
      (room: IRoom): boolean =>
        room.user1.info.login === userLogin ||
        room.user2.info.login === userLogin,
    );
    if (index != -1) {
      this.roomList[index].user1.info.login == userLogin
        ? this.roomList[index].gs.p1.afk
        : this.roomList[index].gs.p2.afk;
    }

    //check if inside userList
    index = this.userList.findIndex(
      (user: UserEntity): boolean => user.login === userLogin,
    );
    if (index != -1) this.userList.splice(index, 1);

    // check if inside normal queue
    index = this.normalQueue.findIndex(
      (user: UserEntity): boolean => user.client.id == client.id,
    );
    if (index != -1) this.normalQueue.splice(index, 1);

    // check if inside special queue
    index = this.specialQueue.findIndex(
      (user: UserEntity): boolean => user.client.id == client.id,
    );
    if (index != -1) this.normalQueue.splice(index, 1);
  }

  @SubscribeMessage('special')
  async handleSpecial(
    // @MessageBody() data: ,
    @ConnectedSocket() client: Socket,
  ) {
    let user: UserEntity;
    let index: number = this.userList.findIndex(
      (user: UserEntity): boolean => user.client.id == client.id,
    );

    //if this socket is related to a login
    if (index != -1) {
      user = this.userList[index];

      //if player wasn't in wanted queue it gets added
      index = this.specialQueue.findIndex(
        (u: UserEntity): boolean => u.login == user.login,
      );
      if (index == -1) this.specialQueue.push(user);

      //if player was in the other queue it gets deleted
      index = this.normalQueue.findIndex(
        (u: UserEntity): boolean => u.login == user.login,
      );
      if (index != -1) this.normalQueue.splice(index, 1);
    }
    //TODO RETURN ERROR LIKE CLOSING SOCKET TO RESTART ALL PROCESS
  }

  @SubscribeMessage('classical')
  async handleNormal(
    @MessageBody() data: { id: string; halo: number },
    @ConnectedSocket() client: Socket,
  ) {
    let user: UserEntity;
    let index: number = this.userList.findIndex(
      (user: UserEntity): boolean => user.client.id == client.id,
    );
    //if this socket is related to a login
    if (index != -1) {
      user = this.userList[index];
      console.log(user.login, user.client.id, 'classical');
      //if player wasn't in wanted queue it gets added
      index = this.normalQueue.findIndex(
        (u: UserEntity): boolean => u.login == user.login,
      );
      if (index == -1) this.normalQueue.push(user);
      else console.log('pas push sur normal: ', index, index);
      //if player was in the other queue it gets deleted
      index = this.specialQueue.findIndex(
        (u: UserEntity): boolean => u.login == user.login,
      );
      if (index != -1) this.specialQueue.splice(index, 1);
    }
    //TODO RETURN ERROR LIKE CLOSING SOCKET TO RESTART ALL PROCESS
  }

  @SubscribeMessage('moveUp') //TODO: VOIR AVEC NIKI
  async handleMoveUp(
    @MessageBody() data: boolean,
    @ConnectedSocket() client: Socket,
  ) {
    let user: UserEntity;
    let index: number = this.userList.findIndex(
      (user: UserEntity): boolean => user.client.id == client.id,
    );
    //if this socket is related to a login
    if (index != -1) {
      user = this.userList[index];
      index = this.roomList.findIndex((room: IRoom): void => {
        if (
          user.login == room.user1.info.login ||
          user.login == room.user2.info.login
        )
          user.login == room.user1.info.login
            ? (room.gs.p1.moveUp = data)
            : (room.gs.p2.moveUp = data);
      });
    }
  }

  @SubscribeMessage('moveDown') //TODO: VOIR AVEC NIKI
  async handleMoveDown(
    @MessageBody() data: boolean,
    @ConnectedSocket() client: Socket,
  ) {
    let user: UserEntity;
    let index: number = this.userList.findIndex(
      (user: UserEntity): boolean => user.client.id == client.id,
    );
    //if this socket is related to a login
    if (index != -1) {
      user = this.userList[index];
      index = this.roomList.findIndex((room: IRoom): void => {
        if (
          user.login == room.user1.info.login ||
          user.login == room.user2.info.login
        )
          user.login == room.user1.info.login
            ? (room.gs.p1.moveDown = data)
            : (room.gs.p2.moveDown = data);
      });
    }
  }

  @Cron('*/5 * * * * *')
  findMatches() {
    //console.log('finding matches');
    // this.normalQueue.forEach((user: UserEntity): void => {
    //   console.log('list normal', user.login);
    // });
    // this.specialQueue.forEach((user: UserEntity): void => {
    //   console.log('list special', user.login);
    // });
    //console.log(this.normalQueue.length, this.userList.length);
    if (this.normalQueue.length > 1) {
      this.cntGame++;
      const roomName: string = `game${this.cntGame}`;
      const user1: UserEntity = this.normalQueue.shift();
      const user2: UserEntity = this.normalQueue.shift();
      const message: string =
        'A game between ' +
        user1.login +
        ' and ' +
        user2.login +
        ' is about to start';
      user1.client.join(roomName);
      user2.client.join(roomName);
      console.log(
        'making a match. Players are : ',
        user1.login,
        ' and ',
        user2.login,
      );
      this.broadcastTo(roomName, 'gameFound', message);
      //TODO waiting players for confirmation
      const newGameState: IGameState = JSON.parse(JSON.stringify(gameStart)); //TODO
      setRandomDirBall(newGameState.balls[0]);
      const newRoom: IRoom = {
        gs: newGameState,
        user1: {
          info: user1,
        },
        user2: {
          info: user2,
        },
        roomID: roomName,
        type: false,
      };
      this.roomList.push(newRoom);
      this.userStatusService
        .setUserStatus(user1.login, UserStatus.ONLINE)
        .then((): void => {});
      this.userStatusService
        .setUserStatus(user2.login, UserStatus.ONLINE)
        .then((): void => {});
      this.pongCalculus(newRoom.gs, canvas).then((): void => {});
    } //else console.log('Not enough players in matchmaking');
    ///////////////////////////////////////////////////////////////////////////////////////
    if (this.specialQueue.length > 1) {
      this.cntGame++;
      const roomName: string = `game${this.cntGame}`;
      const user1: UserEntity = this.specialQueue.shift();
      const user2: UserEntity = this.specialQueue.shift();
      const message: string =
        'A game between ' +
        user1.login +
        ' and ' +
        user2.login +
        ' is about to start';
      user1.client.join(roomName);
      user2.client.join(roomName);
      console.log(
        'making a match. Players are : ',
        user1.login,
        ' and ',
        user2.login,
      );
      this.broadcastTo(roomName, 'test', message);
      //TODO waiting players for confirmation
      const newGameState: IGameState = JSON.parse(JSON.stringify(gameStart)); //TODO
      setRandomDirBall(newGameState.balls[0]);
      const newRoom: IRoom = {
        gs: newGameState,
        user1: {
          info: user1,
        },
        user2: {
          info: user2,
        },
        roomID: roomName,
        type: false,
      };
      this.roomList.push(newRoom);
      this.userStatusService
        .setUserStatus(user1.login, UserStatus.ONLINE)
        .then((): void => {});
      this.userStatusService
        .setUserStatus(user2.login, UserStatus.ONLINE)
        .then((): void => {});
      //this.pongCalculus(newRoom.gs, canvas).then((): void => {});
    } //else console.log('Not enough players in matchmaking');
  }

  async pongCalculus(gs: IGameState, canvas: I2D): Promise<void> {
    if (!gs.p1.afk && !gs.p2.afk) {
      positionPlayer(gs.p1, canvas);
      positionPlayer(gs.p2, canvas);
      gs.balls.forEach((b: IBall) => setBallPos(b));
      if (gs.type) createNewBall(gs.balls, canvas);
      gs.balls.forEach((b: IBall) => bounceWallBall(b, canvas));
      gs.balls.forEach((b: IBall) => definePlayerContact(b, gs, canvas));
      scoreBall(gs, canvas);
    } else {
      gs.timerAfk -= timer / 1000;
      console.log(gs.timerAfk);
      if (gameStart.timerAfk <= 0) return; //TODO GIVE DATA INFO
    }
    this.server.emit('upDate', <any>gs);
    if (gs.timerAfk > 0)
      setTimeout(() => {
        this.pongCalculus(gs, canvas);
      }, timer);
  }
}
