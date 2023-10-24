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
import { IGameState, I2D, IBall, IRoom } from '../interfaces';
import { Server, Socket } from 'socket.io';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { AuthService } from '../auth/auth.service';
import { UserService } from '../user/user.service';
import { UserEntity } from '../user/user.entity';
import { User, UserStatus } from '@prisma/client';
import { Cron } from '@nestjs/schedule';
import {PongService} from "./pong.service";
import {createBooleanLiteral} from "@nestjs/swagger/dist/plugin/utils/ast-utils";

@WebSocketGateway({
  namespace: 'pong',
  cors: {
    origin: '*',
  },
})

@UseGuards(AuthGuard)
export class PongGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;

  constructor(
      private readonly authService: AuthService,
      private readonly userService: UserService,
      private readonly pongService: PongService,
  ) {}

  //les queues en fonction du gameType
  private normalQueue: UserEntity[] = [];
  private specialQueue: UserEntity[] = [];

  //les games en cours
  private roomList: IRoom[] = []; //vs// private roomMap: Map<string, IRoom> = new Map<string, IRoom>(); //string=roomName

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
  async handleConnection(client: Socket/*, ...args: any[]*/): Promise<void> {
    //get user all info
    const userToken: string = client.handshake.headers.authorization.toString();
    const userLogin: string = await this.authService.getLoginFromToken(userToken);
    const userElo: number = await this.pongService.getUserElo(userLogin);
    console.log(
        'Pong User connected : ',
        userLogin,
        ' with id ',
        client.id,
        ' and elo: ',
        userElo,
    );
    //checking if user needs to reconnect to its game
    const index: number = this.findIndexRoomLogin(userLogin);
    if (index != -1) {
      //mets a jour le status afk dans la room
      this.roomList[index].user1.login == userLogin
          ? !this.roomList[index].gs.p1.afk
          : !this.roomList[index].gs.p2.afk;
      //mets a jour le socket dans la room
      this.roomList[index].user1.login == userLogin
          ? (this.roomList[index].user1.client = client)
          : (this.roomList[index].user2.client = client);
      client.join(this.roomList[index].roomID);
    }
  }

  async handleDisconnect(client: Socket): Promise<void> {
    // check if it needs to be defined as afk inside a room
    let index: number = this.findIndexRoomSocket(client.id);
    if (index != -1) {
      this.roomList[index].user1.client.id == client.id
          ? this.roomList[index].gs.p1.afk
          : this.roomList[index].gs.p2.afk;
      this.roomList[index].user1.client.id == client.id
          ? this.roomList[index].user1.state = 'AFK'
          : this.roomList[index].user2.state = 'AFK';
    }
    // check if inside normal queue
    index = this.findIndexQueueSocket(client.id, false);
    if (index != -1) this.normalQueue.splice(index, 1);
    // check if inside special queue
    index = this.findIndexQueueSocket(client.id, true);
    if (index != -1) this.specialQueue.splice(index, 1);
  }

  @SubscribeMessage('looking-for-game')
  async handleSpecial(
      @MessageBody() data: string,
      @ConnectedSocket() client: Socket,
  ): Promise<void> {
    let index: number;
    const userToken: string = client.handshake.headers.authorization.toString();
    const userLogin: string = await this.authService.getLoginFromToken(userToken);
    const userElo: number = await this.pongService.getUserElo(userLogin);
    let type: boolean | undefined = data == 'CLASSICAL' ? false : data == 'SPECIAL' ? true : undefined;
    //if info is correct
    if (type != undefined) {
      //if player wasn't in wanted queue it gets added
      index = this.findIndexQueueSocket(client.id, type);
      if (index == -1) {
        const user: UserEntity = new UserEntity(userLogin, client, userElo, 'PENDING');
        this.specialQueue.push(user);
      }
      //if player was in the other queue it gets deleted
      index = this.findIndexQueueSocket(client.id, !type);
      if (index != -1) this.normalQueue.splice(index, 1);
      //updata user state
      this.userService
          .setUserStatus(userLogin, UserStatus.INQUEUE)
          .then((): void => {
          });
    }
  }

  @SubscribeMessage('challenge')
  async handleChallenge(
      @MessageBody() data: { invitedLogin: string, special: boolean },
      @ConnectedSocket() client: Socket,
  ): Promise<void> {
    const userToken: string = client.handshake.headers.authorization.toString();
    const userLogin: string = await this.authService.getLoginFromToken(userToken);
    const userElo: number = await this.pongService.getUserElo(userLogin);
    const user1: UserEntity = new UserEntity(userLogin, client, userElo, 'PENDING');
    const user2: UserEntity = new UserEntity(data.invitedLogin, undefined, undefined, undefined);
    // CHECK IF ALREADY CREATED THIS GAME INVITE
    const index: number = this.roomList.findIndex(
        (room: IRoom): boolean =>
            data.invitedLogin == room.user2.login && userLogin == room.user1.login,
    );
    if (index == -1)
      await this.createNewRoom(user1, user2, data.special, false);
    this.server.emit('challenge', <any>{from: userLogin, to: data.invitedLogin, special: data.special} );
  }

  @SubscribeMessage('accept')
  async handleAccept(
      @MessageBody() data: { opponent: string, special: boolean },
      @ConnectedSocket() client: Socket,
  ): Promise<void> {
    const userToken: string = client.handshake.headers.authorization.toString();
    const userLogin: string = await this.authService.getLoginFromToken(userToken);
    const userElo: number = await this.pongService.getUserElo(userLogin);
    // CHECK IF HIS LOGIN IS IN ROOM WITH CORRECT OPPONENT
    const index: number = this.roomList.findIndex(
        (room: IRoom): boolean =>
            data.opponent == room.user1.login && userLogin == room.user2.login,
    );
    if (index != -1)
    {
      this.roomList[index].user2.client = client;
      this.roomList[index].user2.elo = userElo;
      this.roomList[index].user2.state = 'PENDING';
      client.join(this.roomList[index].roomID);
    }
  }

  @SubscribeMessage('confirm') // TODO: check qu'il confirme le bon match, donc for each
  async handleConfirm(
      @MessageBody() data: { user1: string, user2: string, special: boolean },
      @ConnectedSocket() client: Socket,
  ): Promise<void> {
    const userToken: string = client.handshake.headers.authorization.toString();
    const userLogin: string = await this.authService.getLoginFromToken(userToken);
    const index: number = this.findIndexRoomSocket(client.id);
    if (index != -1) {
      if (this.roomList[index].user1.login == userLogin && this.roomList[index].user1.client.id == client.id)
        this.roomList[index].user1.state = 'WAITING';//this.roomList[index].gs.p1.afk = false;
      else if (this.roomList[index].user2.login == userLogin && this.roomList[index].user2.client.id == client.id)
        this.roomList[index].user2.state = 'WAITING';//this.roomList[index].gs.p2.afk = false;
    }
  }

  @SubscribeMessage('moveUp')
  async handleMoveUp(
      @MessageBody() data: boolean,
      @ConnectedSocket() client: Socket,
  ): Promise<void> {
    const userToken: string = client.handshake.headers.authorization.toString();
    const userLogin: string = await this.authService.getLoginFromToken(userToken);
    const index: number = this.findIndexRoomSocket(client.id);
    if (index != -1) {
      if (this.roomList[index].user1.login == userLogin && this.roomList[index].user1.client.id == client.id)
        this.roomList[index].gs.p1.moveUp = data;
      else if (this.roomList[index].user2.login == userLogin && this.roomList[index].user2.client.id == client.id)
        this.roomList[index].gs.p2.moveUp = data;
    }
  }

  @SubscribeMessage('moveDown')
  async handleMoveDown(
      @MessageBody() data: boolean,
      @ConnectedSocket() client: Socket,
  ): Promise<void> {
    const userToken: string = client.handshake.headers.authorization.toString();
    const userLogin: string = await this.authService.getLoginFromToken(userToken);
    const index: number = this.findIndexRoomSocket(client.id);
    if (index != -1) {
      if (this.roomList[index].user1.login == userLogin && this.roomList[index].user1.client.id == client.id)
        this.roomList[index].gs.p1.moveDown = data;
      else if (this.roomList[index].user2.login == userLogin && this.roomList[index].user2.client.id == client.id)
        this.roomList[index].gs.p2.moveDown = data;
    }
  }

  @Cron('*/5 * * * * *')
  async findMatches(): Promise<void> {
    await this.findPlayersInQueue(true);
    await this.findPlayersInQueue(false);
  }

  @Cron('*/5 * * * * *')//TODO supprime les rooms si les deux afk trop longtemps
  async launchRoom(): Promise<void> {
    this.roomList.forEach((r: IRoom): void => {
      if (r.user1.client != undefined && r.user2.client != undefined) {
        //TELLS PLAYERS GAME WILL START
        if (r.user1.state == 'PENDING' && r.user2.state == 'PENDING')
          this.broadcastTo(r.roomID, 'room-created', 'merde'); //TODO
        if (r.user1.state == 'WAITING' && r.user2.state == 'WAITING') {
          this.broadcastTo(r.roomID, 'start-game', 'merde'); // TODO
          // SET GAMERS STATUS AS INGAME
          this.userService
              .setUserStatus(r.user1.login, UserStatus.INGAME)
              .then((): void => {
              });
          this.userService
              .setUserStatus(r.user2.login, UserStatus.INGAME)
              .then((): void => {
              });
          this.pongCalculus(r.gs, canvas).then((): void => {
          });
        }
      }
    })
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

  findIndexQueueSocket(
      socketID: string,
      type: boolean,
  ): number {
    if (!type) {
      return this.normalQueue.findIndex(
          (user: UserEntity): boolean => user.client.id == socketID,
      );
    } else {
      return this.specialQueue.findIndex(
          (user: UserEntity): boolean => user.client.id == socketID,
      );
    }
  }

  findIndexRoomSocket(socketID: string): number {
    return this.roomList.findIndex(
        (room: IRoom): boolean =>
            socketID == room.user1.client.id || socketID == room.user2.client.id,
    );
  }

  findIndexRoomLogin(userLogin: string): number {
    return this.roomList.findIndex(
        (room: IRoom): boolean =>
            userLogin == room.user1.login || userLogin == room.user2.login,
    );
  }

  async createNewRoom(user1: UserEntity, user2: UserEntity, special: boolean, ranked: boolean): Promise<void> {
    // CREATE ROOM IN DATA
    const roomName: string = `${await this.pongService.createGame(special, true, user1.login, user2.login)}`;
    // CREATE NEW GS FOR THIS ROOM
    const newGameState: IGameState = JSON.parse(JSON.stringify(gameStart)); //TODO
    setRandomDirBall(newGameState.balls[0]);
    // CREATE A ROOM IN LIST
    const newRoom: IRoom = {
      gs: newGameState,
      user1: user1,
      user2: user2,
      roomID: roomName,
      type: special,
      ranked: ranked,
    };
    this.roomList.push(newRoom);
    // ADD USER TO SOCKET ROOM IF POSSIBLE
    if (user1.client != undefined)
      user1.client.join(`${roomName}`);
    if (user2.client != undefined)
      user2.client.join(`${roomName}`);
    // TELLS TO BOTH IF IT'S READY TO PLAY
    // if (user1.client != undefined && user2.client != undefined)
    //   this.broadcastTo(roomName, 'room-created', 'merde'); //TODO
  }

  async findPlayersInQueue(special: boolean): Promise<void> {
    const array: UserEntity[] = special ? this.specialQueue : this.normalQueue;
    if (array.length > 1) {
      const user1: UserEntity = array.shift();
      const user2: UserEntity = array.shift();
      await this.createNewRoom(user1, user2, special, true);
    }
    else console.log(`not enough players in ${special} queue`);
  }
}

