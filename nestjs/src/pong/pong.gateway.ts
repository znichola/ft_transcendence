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
import {IGameState, I2D, IBall, IRoom, IPlayer} from '../interfaces';
import { Server, Socket } from 'socket.io';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { AuthService } from '../auth/auth.service';
import { UserService } from '../user/user.service';
import { PlayerEntity, UserEntity } from '../user/user.entity';
import { User, UserStatus } from '@prisma/client';
import { Cron } from '@nestjs/schedule';
import {PongService} from "./pong.service";
import {createBooleanLiteral} from "@nestjs/swagger/dist/plugin/utils/ast-utils";
import { UserStatusService } from '../user/user.status.service';
import { WsGuard } from 'src/ws/ws.guard';

@WebSocketGateway({
  namespace: 'pong',
  cors: {
    origin: '*',
  },
})
@UseGuards(WsGuard)
export class PongGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;

  constructor(
      private readonly authService: AuthService,
      private readonly userService: UserService,
      private readonly pongService: PongService,
      private readonly userStatusService: UserStatusService,
  ) {}
  //les queues en fonction du gameType
  private normalQueue: PlayerEntity[] = [];
  private specialQueue: PlayerEntity[] = [];

  //for challenges purposes
  private playerList: PlayerEntity[] = [];

  //les games en cours
  private roomList: IRoom[] = [];

  broadcast(event: string, data: any): void {
    this.server.emit(event, data);
  }

  broadcastTo(room: string, event: string, data: any): void {
    this.server.to(room).emit(event, data);
  }

  afterInit(server: Server): void {
    // console.log('Init', server);
  }

  async handleConnection(client: Socket/*, ...args: any[]*/): Promise<void> {
    //get user all info
    const userToken: string = client.handshake.auth.token;
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
    const player: PlayerEntity = new PlayerEntity(userLogin, client, userElo, undefined);
    //checking if user needs to reconnect to its game
    let index: number = this.findLoginInRoom(userLogin);
    if (index != -1) {
      //mets a jour le status afk dans la room
      this.roomList[index].user1.login == userLogin
          ? !this.roomList[index].gs.p1.afk
          : !this.roomList[index].gs.p2.afk;
      player.state = 'GAMING';
      //mets a jour le socket dans la room
      this.roomList[index].user1.login == userLogin
          ? (this.roomList[index].user1.client = client)
          : (this.roomList[index].user2.client = client);
      client.join(this.roomList[index].roomID);
    }
    this.playerList.push(player);
  }

  async handleDisconnect(client: Socket): Promise<void> {
    // defined afk in IRoom and leave socket.room
    let index: number = this.findSocketInRoom(client.id);
    if (index != -1) {
      this.roomList[index].user1.client.id == client.id
          ? this.roomList[index].gs.p1.afk
          : this.roomList[index].gs.p2.afk;
      this.roomList[index].user1.client.id == client.id
          ? this.roomList[index].user1.state = 'AFK'
          : this.roomList[index].user2.state = 'AFK';
      client.leave(this.roomList[index].roomID);
    }
    // delete from normal queue
    index = this.findSocketInQueue(client.id, false);
    if (index != -1) this.normalQueue.splice(index, 1);
    // delete from special queue
    index = this.findSocketInQueue(client.id, true);
    if (index != -1) this.specialQueue.splice(index, 1);
    // delete from playerList
    index = this.findSocketInPlayer(client.id);
    if (index != -1) this.playerList.splice(index, 1);
  }

  @SubscribeMessage('looking-for-game')
  async handleSpecial(
      @MessageBody() data: string,
      @ConnectedSocket() client: Socket,
  ): Promise<void> {
    let index: number;
    const userToken: string = client.handshake.auth.token;
    const userLogin: string = await this.authService.getLoginFromToken(userToken);
    let special: boolean | undefined = data == 'CLASSICAL' ? false : data == 'SPECIAL' ? true : undefined;
    //if info correct && doesn't have WAITING GAMING state on other sockets
    if (special == undefined && !this.checkState(userLogin))
      return ;
    //gets added in queue
    index = this.findSocketInQueue(client.id, special);
    if (index != -1) {
      index = this.findSocketInPlayer(client.id);
      const player: PlayerEntity = this.playerList[index];
      player.state = 'PENDING';
      special == true ? this.specialQueue.push(player) : this.normalQueue.push(player);
      //update user state
      this.userStatusService
          .setUserStatus(userLogin, UserStatus.INQUEUE)
          .then((): void => {
          });
      //if player was in the other queue it gets deleted
      index = this.findSocketInQueue(client.id, !special);
      if (index != -1) special == true ? this.normalQueue.splice(index, 1) : this.specialQueue.splice(index, 1);
    }
  }

  @SubscribeMessage('challenge')
  async handleChallenge(
      @MessageBody() data: { invitedLogin: string, special: boolean },
      @ConnectedSocket() client: Socket,
  ): Promise<void> {
    const userToken: string = client.handshake.auth.token;
    const userLogin: string = await this.authService.getLoginFromToken(userToken);
    console.log("-------------------------");
    //CHECK IF BOTH ARE IN UNACCEPTABLE STATE
    if (!this.checkState(userLogin) || !this.checkState(data.invitedLogin))
       return ;
    //FIND CHALLENGER IN PLAYER LIST
    let index: number = this.findSocketInPlayer(client.id);
    const player1: PlayerEntity = this.playerList[index];
    //FIND CHALLENGED IN PLAYER LIST
    index = this.findLoginInPlayer(data.invitedLogin);
    const player2: PlayerEntity = this.playerList[index];
    //CREATING ROOM
    player1.state = 'PENDING';
    //SEND INVITE TO ALL SOCKET CHALLENGED IS CONNECTED ON

    console.log("lsdjfldkjs", this.findAllLoginsInPlayer(data.invitedLogin));
    console.log("merde: ", client.id);
    client.send("test", "send");
    this.server.emit("test", "emite");

    await this.createNewRoom(player1, player2, data.special, false);
    this.findAllLoginsInPlayer(data.invitedLogin).forEach((p: PlayerEntity): void => {
      console.log("challenge lsjdflsd", {from: userLogin, to: data.invitedLogin, special: data.special});
      p.client.send('challenge', <any>{from: userLogin, to: data.invitedLogin, special: data.special} );
    });
    console.log("challenge end", data);

  }

  @SubscribeMessage('accept')
  async handleAccept(
      @MessageBody() data: { opponent: string, special: boolean },
      @ConnectedSocket() client: Socket,
  ): Promise<void> {
    const userToken: string = client.handshake.auth.token;
    const userLogin: string = await this.authService.getLoginFromToken(userToken);
    const userElo: number = await this.pongService.getUserElo(userLogin);
    // CHECK IF BOTH ARE IN UNACCEPTABLE STATE
    if (!this.checkState(userLogin) || !this.checkState(data.opponent))
      return ;
    // FIND CORRECT ROOM
    let index: number = this.findCorrectRoom(data.opponent, userLogin);
    if (index != -1)
    {
      const player: PlayerEntity = this.roomList[index].user2;
      client.join(this.roomList[index].roomID);
      //CHECK IF PAS DEJA ACCEPTE
      if (player.client != undefined && player.elo != undefined && player.state != undefined)
        player.client.leave(this.roomList[index].roomID);
      // PUT NEW USER IN ROOM
      this.roomList[index].user2 = this.playerList[this.findCorrectPlayer(userLogin, client.id)];
      this.roomList[index].user2.state = 'PENDING';
    }
  }

  @SubscribeMessage('ready') // TODO: check qu'il confirme le bon match, donc for each
  async handleReady(
      @MessageBody() data: { user1: string, user2: string, special: boolean },
      @ConnectedSocket() client: Socket,
  ): Promise<void> {
    const userToken: string = client.handshake.auth.token;
    const userLogin: string = await this.authService.getLoginFromToken(userToken);
    const index: number = this.findSocketInRoom(client.id);
    if (index != -1) {
      if (this.roomList[index].user1.login == userLogin && this.roomList[index].user1.client.id == client.id)
        this.roomList[index].user1.state = 'READY';
      else if (this.roomList[index].user2.login == userLogin && this.roomList[index].user2.client.id == client.id)
        this.roomList[index].user2.state = 'READY';
    }
  }

  @SubscribeMessage('moveUp')
  async handleMoveUp(
      @MessageBody() data: boolean,
      @ConnectedSocket() client: Socket,
  ): Promise<void> {
    const userToken: string = client.handshake.auth.token;
    const userLogin: string = await this.authService.getLoginFromToken(userToken);
    const index: number = this.findSocketInRoom(client.id);
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
    const userToken: string = client.handshake.auth.token;
    const userLogin: string = await this.authService.getLoginFromToken(userToken);
    const index: number = this.findSocketInRoom(client.id);
    if (index != -1) {
      if (this.roomList[index].user1.login == userLogin && this.roomList[index].user1.client.id == client.id)
        this.roomList[index].gs.p1.moveDown = data;
      else if (this.roomList[index].user2.login == userLogin && this.roomList[index].user2.client.id == client.id)
        this.roomList[index].gs.p2.moveDown = data;
    }
  }

  async createNewRoom(user1: PlayerEntity, user2: PlayerEntity, special: boolean, ranked: boolean): Promise<void> {
    // CREATE NEW GS FOR THIS ROOM
    const newGameState: IGameState = JSON.parse(JSON.stringify(gameStart)); //TODO
    // CREATE ROOM IN DATA
    newGameState.id = await this.pongService.createGame(special, true, user1.login, user2.login);
    const roomName: string = `${newGameState.id}`;
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
  }

  async findPlayersInQueue(special: boolean): Promise<void> {
    let array: PlayerEntity[] = special ? this.specialQueue : this.normalQueue;
    //ERASE ALL PLAYERS WITH UNACCEPTABLE STATE
    array = array.filter((p: PlayerEntity) => p.state != 'GAMING' && p.state != 'READY');
    // NOT ENOUGH PEOPLE
    if (array.length <= 1) {
      // console.log (`not enough players in ${special} queue`);
      return ;
    }
    const user1: PlayerEntity = array.shift();
    const user2: PlayerEntity = array.shift();
    await this.createNewRoom(user1, user2, special, true);
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
          r.user1.state = 'GAMING';
          r.user2.state = 'GAMING';
          // SET GAMERS STATUS AS INGAME
          this.userStatusService
              .setUserStatus(r.user1.login, UserStatus.INGAME)
              .then((): void => {
              });
          this.userStatusService
              .setUserStatus(r.user2.login, UserStatus.INGAME)
              .then((): void => {
              });
          this.pongCalculus(r.gs, canvas).then((): void => {
            this.broadcastTo(r.roomID, 'game-over', 'game is over'); //TODO: define data
            r.user1.state = undefined;
            r.user2.state = undefined;
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
      if (gameStart.timerAfk <= 0) return; //TODO GIVE DATA INFO
    }
    this.broadcastTo(`${gs.id}`, 'upDate', <any>gs);
    if (!this.isGameOver(gs))
      setTimeout((): void => {
        this.pongCalculus(gs, canvas);
      }, timer);
    else
      gs.p1.afk && gs.p2.afk ? await this.pongService.cancelGame(gs.id) : await this.pongService.endGame(gs);
  }

  /////////////////////////////////////////////////////////////////// QUEUE LIST
  findSocketInQueue(
      socketID: string,
      type: boolean,
  ): number {
    if (!type) {
      return this.normalQueue.findIndex(
          (user: PlayerEntity): boolean => user.client.id == socketID,
      );
    } else {
      return this.specialQueue.findIndex(
          (user: PlayerEntity): boolean => user.client.id == socketID,
      );
    }
  }
  /////////////////////////////////////////////////////////////////// ROOM LIST
  findSocketInRoom(socketID: string): number {
    return this.roomList.findIndex(
        (room: IRoom): boolean =>
            socketID == room.user1.client.id || socketID == room.user2.client.id,
    );
  }

  findLoginInRoom(userLogin: string): number {
    return this.roomList.findIndex(
        (room: IRoom): boolean =>
            userLogin == room.user1.login || userLogin == room.user2.login,
    );
  }

  findCorrectRoom(user1Login: string, user2Login: string): number {
    return this.roomList.findIndex(
      (r: IRoom): boolean => {
        return((user1Login == r.user1.login && user2Login == r.user2.login)
        || (user1Login == r.user2.login && user2Login == r.user1.login));
      }
    );
  }
  /////////////////////////////////////////////////////////////////// PLAYER LIST
  findSocketInPlayer(socketID: string): number {
    return this.playerList.findIndex(
        (p: PlayerEntity): boolean => socketID == p.client.id)
  }

  findLoginInPlayer(userLogin: string): number {
    return this.playerList.findIndex(
        (p: PlayerEntity): boolean => userLogin == p.login,);
  }

  findAllLoginsInPlayer(userLogin: string): PlayerEntity[] {
    return this.playerList.filter((p: PlayerEntity): boolean => p.login == userLogin);
  }

  /////////////////////////////////////////////////////////////////// TOOLS
  checkState(userLogin:string): boolean {
    const logins: PlayerEntity[] = this.findAllLoginsInPlayer(userLogin);
    if (!logins.length) return false;
    return logins.every((p: PlayerEntity): boolean => p.state == 'PENDING' || p.state == 'AFK' || p.state == undefined);
  }

  findCorrectPlayer(userLogin: string, socketID: string): number {
    const logins: PlayerEntity[] = this.findAllLoginsInPlayer(userLogin);
    return logins.findIndex((p: PlayerEntity): boolean => socketID == p.client.id);
  }

  isGameOver(gs: IGameState): boolean {
    if (gs.timerAfk <= 0)
    {
      if (gs.p1.afk && !gs.p2.afk)
        gs.type == true ? gs.p2.score = 30 : gs.p2.score = 5;
      else if (!gs.p1.afk && gs.p2.afk)
        gs.type == true ? gs.p1.score = 30 : gs.p1.score = 5;
      else
        return false;
    }
    if (gs.type && (gs.p1.score == 30 || gs.p2.score == 30))
      return true;
    return !gs.type && (gs.p1.score == 5 || gs.p2.score == 5);
  }
}
