import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import {Server, Socket} from 'socket.io';
import {ball, gameState, player, twoDimension} from "../../../react-app/src/interfaces";
import {UseGuards} from "@nestjs/common";
import {AuthGuard} from "../auth/auth.guard";
import {AuthService} from "../auth/auth.service";
import {UserService} from "../user/user.service";
import {UserEntity} from "../user/user.entity";
import {UserStatus} from "@prisma/client";
import {Cron} from '@nestjs/schedule';


const canvas: twoDimension = { width: 1 + 111/175, height: 1 };
const timer: number = 1000 / 60;

// const canvas: twoDimension = { width: 858, height: 525 };
// gs.p1.dim.w = gs.p2.dim.w = Math.round(canvas.width / 85);
// gs.p1.dim.h = gs.p2.dim.h = Math.round(canvas.height / 5);

// gs.p1.pos.x = Math.round(canvas.width / 85);
// gs.p2.pos.x = Math.round(canvas.width - canvas.width / 85 - gs.p2.dim.w);
// gs.p1.pos.y = gs.p2.pos.y = Math.round(canvas.height / 2 - gs.p1.dim.h / 2);

// gs.ball.radius = Math.round((canvas.height * canvas.width) / 35000);
// gs.ball.speed = Math.sqrt(Math.pow(canvas.width, 2) + Math.pow(canvas.height, 2)) / 4000;
// gs.ball.pos.x = canvas.width / 2;
// gs.ball.pos.y = canvas.height / 2;

const gameStart: gameState = {
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
    pos: { x: 1 - 2 / 85 , y: 1 / 2 - 1 / 10 },
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
    radius: 1 / 35000, //TODO: multiplier avec canvas h et w
    speed:  1 / 4,
    direction: { x: 1, y: 0 },
  },
  //TODO gameType:
  timerAfk: 15,
};

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

@WebSocketGateway({
  namespace: 'user',
  cors: {
    origin: '*',
  },
})
@UseGuards(AuthGuard)
export class PongGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server: Server;
  constructor(
      private readonly authService: AuthService,
      private readonly userService: UserService,
  ){}

  private userList: UserEntity[] = [];
  private matchmakingList: UserEntity[] = [];
  private gameStateMap: Map<string, gameState> = new Map<string, gameState>();
  private cntGame: number = 0;

  broadcast(event: string, data: any): void {
    this.server.emit(event, data);
  }

  broadcastTo(room: string, event: string, data: any): void {
    this.server.to(room).emit(event, data);
  }
  afterInit(server: Server): void {
    console.log('Init');
  }

  async handleConnection(client: Socket, ...args: any[]): Promise<any> {
    const userLogin: string = client.handshake.headers.user.toString();
    console.log('User connected : ', userLogin, ' with id ', client.id);
    this.broadcast("addUser", userLogin);
    const user: UserEntity = new UserEntity(userLogin, client);
    this.userList.push(user);
    if (this.matchmakingList.findIndex(user => user.login === userLogin) == -1)
      this.matchmakingList.push(user)
    else
    {
      this.gameStateMap.forEach((gs: gameState, roomName: string): void => {
          if (gs.p1.id === userLogin || gs.p2.id === userLogin)
          {
            gs.p1.id === userLogin ?  gs.p1.afk = false: gs.p2.afk = false;
            gs.timerAfk = 15;
            user.client.join(roomName);
          }
        }
      );
    }
    await this.userService.setUserStatus(userLogin, UserStatus.ONLINE); //TODO le mettre dans le findMatch, UserStatus.INGAME
  }
  async handleDisconnect(client: Socket): Promise<any> {
    const userLogin: string = client.handshake.headers.user.toString();
    console.log('User disconnected : ', userLogin);
    let index = this.userList.findIndex(user => user.client.id === client.id);
    if (this.userList.findIndex(user => user.login === userLogin) == -1)
      await this.userService.setUserStatus(userLogin, UserStatus.OFFLINE);
    this.userList.splice(index, 1);
    this.broadcast("removeUser", userLogin);
  }

  @SubscribeMessage('message')
  async handleMessage(
      @MessageBody() data: any,
      @ConnectedSocket() client: Socket,
  ) {
    console.log(data, client.id); // Handle received message
    this.server.emit('message', data); // Broadcast the message to all connected clients
  }

  @SubscribeMessage('moveUp')
  async handleMoveUp(
      @MessageBody() data: boolean,
      @ConnectedSocket() client: Socket,
  ) {
    if (client.id === gameState.p1.id) gameState.p1.moveUp = data;
    else if (client.id === gameState.p2.id) gameState.p2.moveUp = data;
  }

  @SubscribeMessage('moveDown')
  async handleMoveDown(
      @MessageBody() data: boolean,
      @ConnectedSocket() client: Socket,
  ) {
    if (client.id === gameState.p1.id) gameState.p1.moveDown = data;
    else if (client.id === gameState.p2.id) gameState.p2.moveDown = data;
  }
  @Cron('*/5 * * * * *')
  findMatches()
  {
    console.log('finding matches');
    this.matchmakingList.forEach((user: UserEntity): void => { console.log(user.login )});
    if (this.matchmakingList.length > 1)
    {
      this.cntGame++;
      const roomName: string = `game${this.cntGame}`;
      const user1: UserEntity = this.matchmakingList.shift();
      const user2: UserEntity = this.matchmakingList.shift();
      const message: string = 'A game between ' + user1.login + ' and ' + user2.login + ' is about to start';
      user1.client.join(roomName);
      user2.client.join(roomName);
      console.log('making a match. Players are : ', user1.login, ' and ', user2.login);
      this.broadcastTo(roomName, "test", message);

      let newGameState:gameState = {
        ...gameStart,
        p1: { ... gameStart.p1,
          pos: gameStart.p1.pos,
          dim: gameStart.p1.dim,
        },
        p2: { ...gameStart.p2,
          pos: gameStart.p2.pos,
          dim: gameStart.p2.dim,
        },
        ball: { ...gameStart.ball,
          pos: gameStart.ball.pos,
          direction: gameStart.ball.direction,
        },
      };
      setRandomDirBall(newGameState.ball);
      this.gameStateMap.set(roomName, newGameState);

      this.pongCalculus(this.gameStateMap.get(roomName), canvas).then((r: void): void => {} );
    }
    else console.log('Not enough players in matchmaking');
  }

  async pongCalculus(gs: gameState, canvas: twoDimension): Promise<void> {
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
      if (gameStart.timerAfk <= 0) return;
    }
    this.server.emit('upDate', <any>gs);
    setTimeout(() => {
      this.pongCalculus(gs, canvas);
    }, timer);
  }
}

function setBallPos(gs: gameState) {
  gs.ball.pos.x += gs.ball.direction.x * gs.ball.speed * timer / 858;
  gs.ball.pos.y += gs.ball.direction.y * gs.ball.speed * timer / 525;
}
function bounceWallBall(gs: gameState, canvas: twoDimension) {
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

function bouncePlayerBall(p: player, b: ball) {
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

function scoreBall(gs: gameState, canvas: twoDimension) {
  //TOUCHE BORD GAUCHE OU DROITE
  if (
      gs.ball.pos.x - gs.ball.radius < 0 ||
      gs.ball.pos.x + gs.ball.radius > canvas.width
  ) {
    if (gs.ball.pos.x - gs.ball.radius <= 0) gs.p2.score += 1;
    else gs.p1.score += 1;
    setRandomDirBall(gs.ball);
    setInitialPosition(gs, canvas);
  }
}

function positionPlayer(player: player, canvas: twoDimension) {
  if (player.moveUp && !player.moveDown && player.pos.y > 0) {
    player.pos.y -= 1 / 105;
    if (player.pos.y < 0) player.pos.y = 0;
  }
  if (
      player.moveDown &&
      !player.moveUp &&
      player.pos.y < canvas.height - player.dim.h
  ) {
    player.pos.y += 1 / 105;
    if (player.pos.y > canvas.height - player.dim.h)
      player.pos.y = canvas.height - player.dim.h;
  }
}

// function setGameState(gs: gameState, canvas: twoDimension) {
//   //define player dimension proportional to canvas dimension
//   gs.p1.dim.w = gs.p2.dim.w = Math.round(canvas.width / 85);
//   gs.p1.dim.h = gs.p2.dim.h = Math.round(canvas.height / 5);
//   //define ball radius proportional to canvas dimension
//   gs.ball.radius = Math.round((canvas.height * canvas.width) / 35000);
//   setRandomDirBall(gs.ball);
//   setInitialPosition(gs, canvas);
//   console.log(gs.timerAfk);
// }

function setInitialPosition(gs: gameState, canvas: twoDimension) {
  //define player initial pos
  gs.p1.pos.x = Math.round(canvas.width / 85);
  gs.p2.pos.x = Math.round(canvas.width - canvas.width / 85 - gs.p2.dim.w);
  gs.p1.pos.y = gs.p2.pos.y = Math.round(canvas.height / 2 - gs.p1.dim.h / 2);
  //define ball initial pos
  gs.ball.speed =
      Math.sqrt(Math.pow(canvas.width, 2) + Math.pow(canvas.height, 2)) / 4000;
  gs.ball.pos.x = canvas.width / 2;
  gs.ball.pos.y = canvas.height / 2;
}

function setRandomDirBall(b: ball) {
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
