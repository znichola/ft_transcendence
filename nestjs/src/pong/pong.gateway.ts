import {
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

type twoDimension = { width: number; height: number };
// eslint-disable-next-line prefer-const
interface gameState {
  p1: player;
  p2: player;
  ball: ball;
  timerAfk: number;
}
interface ball {
  pos: pos;
  radius: number;
  speed: number;
  direction: pos;
}
interface pos {
  x: number;
  y: number;
}

interface dim {
  w: number;
  h: number;
}

interface player {
  pos: pos;
  dim: dim;
  score: number;
  moveUp: boolean;
  moveDown: boolean;
  id: string;
  afk: boolean;
}

const gameStart: gameState = {
  p1: {
    pos: { x: 0, y: 0 },
    dim: { w: 0, h: 0 },
    score: 0,
    moveUp: false,
    moveDown: false,
    id: undefined,
    afk: true,
  },
  p2: {
    pos: { x: 0, y: 0 },
    dim: { w: 0, h: 0 },
    score: 0,
    moveUp: false,
    moveDown: false,
    id: undefined,
    afk: true,
  },
  ball: {
    pos: { x: 200, y: 50 },
    radius: 20,
    speed: 1,
    direction: { x: 1, y: 0 },
  },
  timerAfk: 15,
};

let gameState: gameState = gameStart;
const canvas: twoDimension = { width: 858, height: 525 };
const timer: number = 1000 / 60;

@WebSocketGateway({ cors: { origin: '*' } })
export class PongGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  async handleConnection(client: Socket) {
    console.log('connected: ', client.id, this.server.engine.clientsCount);
    await setGameState(gameState, canvas);
    if (gameState.p1.id === undefined) {
      gameState.p1.id = client.id;
      gameState.p1.afk = false;
    } else if (gameState.p2.id === undefined) {
      gameState.p2.id = client.id;
      gameState.p2.afk = false;
    }
    if (!gameState.p1.afk && !gameState.p2.afk) gameState.timerAfk = 15;
    if (this.server.engine.clientsCount == 2)
      await this.pongCalculus(gameState, canvas);
  }

  async handleDisconnect(client: Socket) {
    if (gameState.p1.id === client.id) {
      gameState.p1.afk = true;
      gameState.p1.id = undefined;
    } else if (gameState.p2.id === client.id) {
      gameState.p2.afk = true;
      gameState.p2.id = undefined;
    }
    console.log('disconnected: ', client.id); // Handle disconnection event
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

  async pongCalculus(gs: gameState, canvas: twoDimension) {
    if (!gs.p1.afk && !gs.p2.afk) {
      positionPlayer(gameState.p1, canvas);
      positionPlayer(gameState.p2, canvas);
      setBallPos(gameState);
      bounceWallBall(gameState, canvas);
      gameState.ball.pos.x < canvas.width / 2
        ? bouncePlayerBall(gameState.p1, gameState.ball)
        : bouncePlayerBall(gameState.p2, gameState.ball);
      scoreBall(gameState, canvas);
    } else {
      gameState.timerAfk -= timer / 1000;
      console.log(gameState.timerAfk);
      if (gameStart.timerAfk <= 0) return;
    }
    this.server.emit('upDate', <any>gameState);
    setTimeout(() => {
      this.pongCalculus(gameState, canvas);
    }, timer);
  }
}

async function setBallPos(gs: gameState) {
  gs.ball.pos.x += gs.ball.direction.x * gs.ball.speed * timer;
  gs.ball.pos.y += gs.ball.direction.y * gs.ball.speed * timer;
}
async function bounceWallBall(gs: gameState, canvas: twoDimension) {
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

async function bouncePlayerBall(p: player, b: ball) {
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

async function scoreBall(gs: gameState, canvas: twoDimension) {
  //TOUCHE BORD GAUCHE OU DROITE
  if (
    gs.ball.pos.x - gs.ball.radius < 0 ||
    gs.ball.pos.x + gs.ball.radius > canvas.width
  ) {
    if (gs.ball.pos.x - gs.ball.radius <= 0) gs.p2.score += 1;
    else gs.p1.score += 1;
    setRandomPosBall(gs.ball);
    setInitialPosition(gs, canvas);
  }
}

async function positionPlayer(player: player, canvas: twoDimension) {
  if (player.moveUp && !player.moveDown && player.pos.y > 0) {
    player.pos.y -= 3;
    if (player.pos.y < 0) player.pos.y = 0;
  }
  if (
    player.moveDown &&
    !player.moveUp &&
    player.pos.y < canvas.height - player.dim.h
  ) {
    player.pos.y += 3;
    if (player.pos.y > canvas.height - player.dim.h)
      player.pos.y = canvas.height - player.dim.h;
  }
}

async function setGameState(gs: gameState, canvas: twoDimension) {
  //define player dimension proportional to canvas dimension
  gs.p1.dim.w = gs.p2.dim.w = Math.round(canvas.width / 85);
  gs.p1.dim.h = gs.p2.dim.h = Math.round(canvas.height / 5);
  //define ball radius proportional to canvas dimension
  gs.ball.radius = Math.round((canvas.height * canvas.width) / 35000);
  setRandomPosBall(gs.ball);
  setInitialPosition(gs, canvas);
  console.log(gameState.timerAfk);
}

async function setInitialPosition(gs: gameState, canvas: twoDimension) {
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

async function setRandomPosBall(b: ball) {
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
