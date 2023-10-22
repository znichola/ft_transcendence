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
  IGameState,
  I2D,
  IBall,
  IPlayer,
  IRoom,
  IUserInfo,
} from '../interfaces';
import { Server, Socket } from 'socket.io';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { AuthService } from '../auth/auth.service';
import { UserService } from '../user/user.service';
import { UserEntity } from '../user/user.entity';
import { User, UserStatus } from '@prisma/client';
import { Cron } from '@nestjs/schedule';

const canvas: I2D = { width: 1 + 111 / 175, height: 1 };
const timer: number = 1000 / 60;

const gameStart: IGameState = {
  p1: {
    pos: { x: 1 / 85, y: 1 / 2 - 1 / 10 },
    dim: { w: 1 / 85, h: 1 / 5 },
    score: 0,
    moveUp: false,
    moveDown: false,
    id: undefined,
    afk: true,
    //halo:
  },
  p2: {
    pos: { x: 1 - 2 / 85, y: 1 / 2 - 1 / 10 },
    dim: { w: 1 / 85, h: 1 / 5 },
    score: 0,
    moveUp: false,
    moveDown: false,
    id: undefined,
    afk: true,
    //halo:
  },
  ball: {
    pos: { x: 1 / 2, y: 1 / 2 },
    radius: 1 / 35000,
    speed: 1 / 4,
    direction: { x: 1, y: 0 },
  },
  timerAfk: 15,
  type: false,
};

@WebSocketGateway({
  namespace: 'user',
  cors: {
    origin: '*',
  },
})
@UseGuards(AuthGuard)
export class PongGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server: Server;
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
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
    console.log('Init', server);
  }

  //TODO VOIR AVEC LES AUTRES IF OK ONLY ONE SOCKET VALUE PER LOGIN
  async handleConnection(client: Socket, ...args: any[]): Promise<any> {
    const userLogin: string = client.handshake.headers.user.toString();
    await this.userService.setUserStatus(userLogin, UserStatus.ONLINE); //TODO le mettre dans le findMatch, UserStatus.INGAME
    const user: UserEntity = new UserEntity(userLogin, client);
    // prettier-ignore
    if (this.userList.findIndex((user: UserEntity): boolean => user.login === userLogin) == -1)
      this.userList.push(user);
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
    await this.userService.setUserStatus(userLogin, UserStatus.OFFLINE);

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
        (user: UserEntity): boolean => user.login == user.login,
      );
      if (index == -1) this.specialQueue.push(user);

      //if player was in the other queue it gets deleted
      index = this.normalQueue.findIndex(
        (user: UserEntity): boolean => user.login == user.login,
      );
      if (index != -1) this.normalQueue.splice(index, 1);
    }
    //TODO RETURN ERROR LIKE CLOSING SOCKET TO RESTART ALL PROCESS
  }

  @SubscribeMessage('normal')
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

      //if player wasn't in wanted queue it gets added
      index = this.specialQueue.findIndex(
        (user: UserEntity): boolean => user.login == user.login,
      );
      if (index == -1) this.specialQueue.push(user);

      //if player was in the other queue it gets deleted
      index = this.specialQueue.findIndex(
        (user: UserEntity): boolean => user.login == user.login,
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
    console.log('finding matches');
    this.normalQueue.forEach((user: UserEntity): void => {
      console.log(user.login);
    });
    this.specialQueue.forEach((user: UserEntity): void => {
      console.log(user.login);
    });
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
      this.broadcastTo(roomName, 'test', message);
      const newGameState: IGameState = {
        ...gameStart,
        p1: { ...gameStart.p1, pos: gameStart.p1.pos, dim: gameStart.p1.dim },
        p2: { ...gameStart.p2, pos: gameStart.p2.pos, dim: gameStart.p2.dim },
        ball: {
          ...gameStart.ball,
          pos: gameStart.ball.pos,
          direction: gameStart.ball.direction,
        },
      };
      setRandomDirBall(newGameState.ball);
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
      this.userService
        .setUserStatus(user1.login, UserStatus.ONLINE)
        .then((): void => {});
      this.userService
        .setUserStatus(user2.login, UserStatus.ONLINE)
        .then((): void => {});
      this.pongCalculus(newRoom.gs, canvas).then((): void => {});
    } else console.log('Not enough players in matchmaking');
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
      const newGameState: IGameState = {
        ...gameStart,
        p1: { ...gameStart.p1, pos: gameStart.p1.pos, dim: gameStart.p1.dim },
        p2: { ...gameStart.p2, pos: gameStart.p2.pos, dim: gameStart.p2.dim },
        ball: {
          ...gameStart.ball,
          pos: gameStart.ball.pos,
          direction: gameStart.ball.direction,
        },
      };
      setRandomDirBall(newGameState.ball);
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
      this.userService
        .setUserStatus(user1.login, UserStatus.ONLINE)
        .then((): void => {});
      this.userService
        .setUserStatus(user2.login, UserStatus.ONLINE)
        .then((): void => {});
      this.pongCalculus(newRoom.gs, canvas).then((): void => {});
    } else console.log('Not enough players in matchmaking');
  }

  async pongCalculus(gs: IGameState, canvas: I2D): Promise<void> {
    if (!gs.p1.afk && !gs.p2.afk) {
      positionPlayer(gs.p1, canvas);
      positionPlayer(gs.p2, canvas);
      setBallPos(gs);
      bounceWallBall(gs, canvas);
      gs.ball.pos.x < canvas.width / 2
        ? bouncePlayerBall(gs.p1, gs.ball)
        : bouncePlayerBall(gs.p2, gs.ball);
      scoreBall(gs, canvas);
    } else {
      gs.timerAfk -= timer / 1000;
      console.log(gs.timerAfk);
      if (gameStart.timerAfk <= 0) return; //TODO GIVE DATA INFO
    }
    this.server.emit('upDate', <any>gs);
    setTimeout(() => {
      this.pongCalculus(gs, canvas);
    }, timer);
  }
}

function setBallPos(gs: IGameState) {
  gs.ball.pos.x += (gs.ball.direction.x * gs.ball.speed * timer) / 858;
  gs.ball.pos.y += (gs.ball.direction.y * gs.ball.speed * timer) / 525;
}
function bounceWallBall(gs: IGameState, canvas: I2D) {
  //TOUCHE BORD HAUT OU BAS
  if (
    gs.ball.pos.y - gs.ball.radius < 0 ||
    gs.ball.pos.y + gs.ball.radius > canvas.height
  ) {
    gs.ball.direction.y *= -1;
    if (gs.ball.pos.y - gs.ball.radius <= 0) gs.ball.pos.y = gs.ball.radius;
    else gs.ball.pos.y = canvas.height - gs.ball.radius;
  }
}

function bouncePlayerBall(p: IPlayer, b: IBall) {
  if (
    b.pos.x + b.radius > p.pos.x &&
    b.pos.y - b.radius < p.pos.y + p.dim.h &&
    b.pos.x - b.radius < p.pos.x + p.dim.w &&
    b.pos.y + b.radius > p.pos.y
  ) {
    const contactRatioY = (b.pos.y - (p.pos.y + p.dim.h / 2)) / (p.dim.h / 2);
    const angle = (Math.PI / 3) * contactRatioY;
    const direction = b.direction.x < 0 ? -1 : 1;
    b.direction.x = -direction * Math.cos(angle);
    b.direction.y = Math.sin(angle);
    if (direction < 0) b.pos.x = p.pos.x + p.dim.w + b.radius + 1;
    else b.pos.x = p.pos.x - b.radius - 1;
    //put lim to Vmax pending on p.w and ball.diam
    if (b.speed < (p.dim.w + b.radius * 2) / 16) {
      b.speed *= 1.12;
      if (b.speed > (p.dim.w + b.radius * 2) / 16)
        b.speed = (p.dim.w + b.radius * 2) / 16;
    }
  }
}

function scoreBall(gs: IGameState, canvas: I2D) {
  //TOUCHE BORD GAUCHE OU DROITE
  if (
    gs.ball.pos.x - gs.ball.radius < 0 ||
    gs.ball.pos.x + gs.ball.radius > canvas.width
  ) {
    if (gs.ball.pos.x - gs.ball.radius <= 0) gs.p2.score += 1;
    else gs.p1.score += 1;
    setRandomDirBall(gs.ball);
    setInitialPosition(gs);
  }
}

function positionPlayer(p: IPlayer, canvas: I2D) {
  if (p.moveUp && !p.moveDown && p.pos.y > 0) {
    p.pos.y -= 1 / 105;
    if (p.pos.y < 0) p.pos.y = 0;
  }
  if (p.moveDown && !p.moveUp && p.pos.y < canvas.height - p.dim.h) {
    p.pos.y += 1 / 105;
    if (p.pos.y > canvas.height - p.dim.h) p.pos.y = canvas.height - p.dim.h;
  }
}

function setInitialPosition(gs: IGameState) {
  //define player initial pos
  gs.p1.pos.x = 1 / 85;
  gs.p2.pos.x = 1 - 2 / 85;
  gs.p1.pos.y = gs.p2.pos.y = 1 / 2 - 1 / 10;
  //define ball initial pos
  gs.ball.speed = 1 / 4;
  gs.ball.pos.x = 1 / 2;
  gs.ball.pos.y = 1 / 2;
}

function setRandomDirBall(b: IBall) {
  let newDirection = Math.random() * 2 * Math.PI;
  if (
    newDirection >= Math.PI / 2 - Math.PI / 6 &&
    newDirection <= Math.PI / 2 + Math.PI / 6
  )
    newDirection < Math.PI / 2
      ? (newDirection -= Math.PI / 6)
      : (newDirection += Math.PI / 6);
  if (
    newDirection >= (3 * Math.PI) / 2 - Math.PI / 6 &&
    newDirection <= (3 * Math.PI) / 2 + Math.PI / 6
  )
    newDirection < (3 * Math.PI) / 2
      ? (newDirection -= Math.PI / 6)
      : (newDirection += Math.PI / 6);

  b.direction.x = Math.cos(newDirection);
  b.direction.y = Math.sin(newDirection);
}

// const gameStart: IGameState = {
//   p1: {
//     pos: { x: 0, y: 0 },
//     dim: { w: 0, h: 0 },
//     score: 0,
//     moveUp: false,
//     moveDown: false,
//     id: undefined,
//     afk: true,
//   },
//   p2: {
//     pos: { x: 0, y: 0 },
//     dim: { w: 0, h: 0 },
//     score: 0,
//     moveUp: false,
//     moveDown: false,
//     id: undefined,
//     afk: true,
//   },
//   ball: {
//     pos: { x: 200, y: 50 },
//     radius: 20,
//     speed: 1,
//     direction: { x: 1, y: 0 },
//   },
//   timerAfk: 15,
//   type: false,
// };
//
// const gameState: IGameState = gameStart;
// const canvas: I2D = { width: 858, height: 525 };
// const timer: number = 1000 / 60;

// @WebSocketGateway({ cors: { origin: '*' } })
// export class PongGateway implements OnGatewayConnection, OnGatewayDisconnect {
//   @WebSocketServer()
//   server: Server;
//
//   async handleConnection(client: Socket) {
//     console.log('connected: ', client.id, this.server.engine.clientsCount);
//     await setGameState(gameState, canvas);
//     if (gameState.p1.id === undefined) {
//       gameState.p1.id = client.id;
//       gameState.p1.afk = false;
//     } else if (gameState.p2.id === undefined) {
//       gameState.p2.id = client.id;
//       gameState.p2.afk = false;
//     }
//     if (!gameState.p1.afk && !gameState.p2.afk) gameState.timerAfk = 15;
//     if (this.server.engine.clientsCount == 2)
//       await this.pongCalculus(gameState, canvas);
//   }
//
//   async handleDisconnect(client: Socket) {
//     if (gameState.p1.id === client.id) {
//       gameState.p1.afk = true;
//       gameState.p1.id = undefined;
//     } else if (gameState.p2.id === client.id) {
//       gameState.p2.afk = true;
//       gameState.p2.id = undefined;
//     }
//     console.log('disconnected: ', client.id); // Handle disconnection event
//   }
//
//   @SubscribeMessage('message')
//   async handleMessage(
//     @MessageBody() data: any,
//     @ConnectedSocket() client: Socket,
//   ) {
//     console.log(data, client.id); // Handle received message
//     this.server.emit('message', data); // Broadcast the message to all connected clients
//   }
//
//   @SubscribeMessage('moveUp')
//   async handleMoveUp(
//     @MessageBody() data: boolean,
//     @ConnectedSocket() client: Socket,
//   ) {
//     if (client.id === gameState.p1.id) gameState.p1.moveUp = data;
//     else if (client.id === gameState.p2.id) gameState.p2.moveUp = data;
//   }
//
//   @SubscribeMessage('moveDown')
//   async handleMoveDown(
//     @MessageBody() data: boolean,
//     @ConnectedSocket() client: Socket,
//   ) {
//     if (client.id === gameState.p1.id) gameState.p1.moveDown = data;
//     else if (client.id === gameState.p2.id) gameState.p2.moveDown = data;
//   }
//
//   async pongCalculus(gs: IGameState, canvas: I2D) {
//     if (!gs.p1.afk && !gs.p2.afk) {
//       positionPlayer(gameState.p1, canvas);
//       positionPlayer(gameState.p2, canvas);
//       setBallPos(gameState);
//       bounceWallBall(gameState, canvas);
//       gameState.ball.pos.x < canvas.width / 2
//         ? bouncePlayerBall(gameState.p1, gameState.ball)
//         : bouncePlayerBall(gameState.p2, gameState.ball);
//       scoreBall(gameState, canvas);
//     } else {
//       gameState.timerAfk -= timer / 1000;
//       console.log(gameState.timerAfk);
//       if (gameStart.timerAfk <= 0) return;
//     }
//     this.server.emit('upDate', <any>gameState);
//     setTimeout(() => {
//       this.pongCalculus(gameState, canvas);
//     }, timer);
//   }
// }
//
// async function setBallPos(gs: IGameState) {
//   gs.ball.pos.x += gs.ball.direction.x * gs.ball.speed * timer;
//   gs.ball.pos.y += gs.ball.direction.y * gs.ball.speed * timer;
// }
// async function bounceWallBall(gs: IGameState, canvas: I2D) {
//   //TOUCHE BORD HAUT OU BAS
//   if (
//     gs.ball.pos.y - gs.ball.radius < 0 ||
//     gs.ball.pos.y + gs.ball.radius > canvas.height
//   ) {
//     gs.ball.direction.y *= -1;
//     if (gs.ball.pos.y - gs.ball.radius <= 0) gs.ball.pos.y = gs.ball.radius;
//     else gs.ball.pos.y = canvas.height - gs.ball.radius;
//   }
// }
//
// async function bouncePlayerBall(p: IPlayer, b: IBall) {
//   if (
//     b.pos.x + b.radius > p.pos.x &&
//     b.pos.y - b.radius < p.pos.y + p.dim.h &&
//     b.pos.x - b.radius < p.pos.x + p.dim.w &&
//     b.pos.y + b.radius > p.pos.y
//   ) {
//     const contactRatioY = (b.pos.y - (p.pos.y + p.dim.h / 2)) / (p.dim.h / 2);
//     const angle = (Math.PI / 3) * contactRatioY;
//     const direction = b.direction.x < 0 ? -1 : 1;
//     b.direction.x = -direction * Math.cos(angle);
//     b.direction.y = Math.sin(angle);
//     if (direction < 0) b.pos.x = p.pos.x + p.dim.w + b.radius + 1;
//     else b.pos.x = p.pos.x - b.radius - 1;
//     //put lim to Vmax pending on p.w and ball.diam
//     if (b.speed < (p.dim.w + b.radius * 2) / 16) {
//       b.speed *= 1.12;
//       if (b.speed > (p.dim.w + b.radius * 2) / 16)
//         b.speed = (p.dim.w + b.radius * 2) / 16;
//     }
//   }
// }
//
// async function scoreBall(gs: IGameState, canvas: I2D) {
//   //TOUCHE BORD GAUCHE OU DROITE
//   if (
//     gs.ball.pos.x - gs.ball.radius < 0 ||
//     gs.ball.pos.x + gs.ball.radius > canvas.width
//   ) {
//     if (gs.ball.pos.x - gs.ball.radius <= 0) gs.p2.score += 1;
//     else gs.p1.score += 1;
//     setRandomPosBall(gs.ball);
//     setInitialPosition(gs, canvas);
//   }
// }
//
// async function positionPlayer(p: IPlayer, canvas: I2D) {
//   if (p.moveUp && !p.moveDown && p.pos.y > 0) {
//     p.pos.y -= 3;
//     if (p.pos.y < 0) p.pos.y = 0;
//   }
//   if (p.moveDown && !p.moveUp && p.pos.y < canvas.height - p.dim.h) {
//     p.pos.y += 3;
//     if (p.pos.y > canvas.height - p.dim.h) p.pos.y = canvas.height - p.dim.h;
//   }
// }
//
// async function setGameState(gs: IGameState, canvas: I2D) {
//   //define player dimension proportional to canvas dimension
//   gs.p1.dim.w = gs.p2.dim.w = Math.round(canvas.width / 85);
//   gs.p1.dim.h = gs.p2.dim.h = Math.round(canvas.height / 5);
//   //define ball radius proportional to canvas dimension
//   gs.ball.radius = Math.round((canvas.height * canvas.width) / 35000);
//   setRandomPosBall(gs.ball);
//   setInitialPosition(gs, canvas);
//   console.log(gs.timerAfk);
// }
//
// async function setInitialPosition(gs: IGameState, canvas: I2D) {
//   //define player initial pos
//   gs.p1.pos.x = Math.round(canvas.width / 85);
//   gs.p2.pos.x = Math.round(canvas.width - canvas.width / 85 - gs.p2.dim.w);
//   gs.p1.pos.y = gs.p2.pos.y = Math.round(canvas.height / 2 - gs.p1.dim.h / 2);
//   //define ball initial pos
//   gs.ball.speed =
//     Math.sqrt(Math.pow(canvas.width, 2) + Math.pow(canvas.height, 2)) / 4000;
//   gs.ball.pos.x = canvas.width / 2;
//   gs.ball.pos.y = canvas.height / 2;
// }
//
// async function setRandomPosBall(b: IBall) {
//   let newDirection = Math.random() * 2 * Math.PI;
//   if (
//     newDirection >= Math.PI / 2 - Math.PI / 6 &&
//     newDirection <= Math.PI / 2 + Math.PI / 6
//   )
//     newDirection < Math.PI / 2
//       ? (newDirection -= Math.PI / 6)
//       : (newDirection += Math.PI / 6);
//   if (
//     newDirection >= (3 * Math.PI) / 2 - Math.PI / 6 &&
//     newDirection <= (3 * Math.PI) / 2 + Math.PI / 6
//   )
//     newDirection < (3 * Math.PI) / 2
//       ? (newDirection -= Math.PI / 6)
//       : (newDirection += Math.PI / 6);
//
//   b.direction.x = Math.cos(newDirection);
//   b.direction.y = Math.sin(newDirection);
// }
