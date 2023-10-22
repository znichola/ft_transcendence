import { I2D, IBall, IBalls, IGameState, IPlayer } from '../interfaces';

export const canvas: I2D = { width: 1, height: 1 };
export const timer: number = 1000 / 60;
export const minV: number = 3 / 10000;
export const maxV: number = (1 / 85 + 2 / 70) / timer;

export const gameStart: IGameState = {
  p1: {
    pos: { x: 1 / 85, y: 1 / 2 - 1 / 10 },
    dim: { w: 1 / 85, h: 1 / 5 },
    score: 0,
    moveUp: false,
    moveDown: false,
    id: undefined,
    afk: false,
    //halo:
  },
  p2: {
    pos: { x: 1 - 2 / 85, y: 1 / 2 - 1 / 10 },
    dim: { w: 1 / 85, h: 1 / 5 },
    score: 0,
    moveUp: false,
    moveDown: false,
    id: undefined,
    afk: false,
    //halo:
  },
  balls: [
    {
      pos: { x: 1 / 2, y: 1 / 2 },
      radius: 1 / 70,
      speed: minV,
      direction: { x: 1, y: 0 },
      mitosis: false,
      bounce: 0,
    },
  ],
  timerAfk: 15,
  type: false,
};

export function definePlayerContact(b: IBall, gs: IGameState, canvas: I2D) {
  b.pos.x < canvas.width / 2
    ? bouncePlayerBall(gs.p1, b)
    : bouncePlayerBall(gs.p2, b);
}

export function setBallPos(b: IBall) {
  b.pos.x += b.direction.x * b.speed * timer;
  b.pos.y += b.direction.y * b.speed * timer;
}
export function bounceWallBall(b: IBall, canvas: I2D) {
  //TOUCHE BORD HAUT OU BAS
  if (b.pos.y - b.radius < 0 || b.pos.y + b.radius > canvas.height) {
    b.direction.y *= -1;
    if (b.pos.y - b.radius <= 0) b.pos.y = b.radius;
    else b.pos.y = canvas.height - b.radius;
  }
}

function bouncePlayerBall(p: IPlayer, b: IBall) {
  if (
    b.pos.x + b.radius > p.pos.x &&
    b.pos.y - b.radius < p.pos.y + p.dim.h &&
    b.pos.x - b.radius < p.pos.x + p.dim.w &&
    b.pos.y + b.radius > p.pos.y
  ) {
    b.bounce++;
    const contactRatioY = (b.pos.y - (p.pos.y + p.dim.h / 2)) / (p.dim.h / 2);
    const angle = (Math.PI / 3) * contactRatioY;
    const direction = b.direction.x < 0 ? -1 : 1;
    b.direction.x = -direction * Math.cos(angle);
    b.direction.y = Math.sin(angle);
    b.mitosis = false;
    if (direction < 0) b.pos.x = p.pos.x + p.dim.w + b.radius + 1 / 100;
    else b.pos.x = p.pos.x - b.radius - 1 / 100;
    //put lim to Vmax pending on p.w and ball.diam
    if (b.speed < maxV) {
      b.speed *= 1.1;
      if (b.speed > maxV) b.speed = maxV;
    }
  }
}

export function scoreBall(gs: IGameState, canvas: I2D) {
  for (let index = 0; index < gs.balls.length; index++) {
    //TOUCHE BORD GAUCHE OU DROITE
    if (
      gs.balls[index].pos.x - gs.balls[index].radius < 0 ||
      gs.balls[index].pos.x + gs.balls[index].radius > canvas.width
    ) {
      if (gs.balls[index].pos.x - gs.balls[index].radius <= 0) gs.p2.score += 1;
      else gs.p1.score += 1;
      if (gs.balls.length > 1) gs.balls.splice(index, 1);
      else {
        setRandomDirBall(gs.balls[index]);
        // setInitialPosition(gs, canvas);
        setInitialPosition(gs);
      }
    }
  }
}

export function createNewBall(bs: IBalls, canvas: I2D) {
  for (let index = 0; index < bs.length; index++) {
    // IF BALL IS TOUCHING THE MIDDLE LINE
    if (
      bs[index].pos.x - bs[index].radius <= canvas.width / 2 &&
      bs[index].pos.x + bs[index].radius >= canvas.width / 2 &&
      !bs[index].mitosis
    ) {
      // IF GOT LUCKY TO CREATE NEW BALL
      if (Math.random() * 100 - bs.length >= 80) {
        bs[index].mitosis = true;
        const b0 = bs[index];
        const ball: IBall = {
          ...b0,
          pos: { ...b0.pos },
          direction: { ...b0.direction },
        };
        ball.direction.x = -bs[index].direction.x;
        ball.direction.y = -bs[index].direction.y;
        // ADDING NEW BALL
        bs.push(ball);
      }
    }
  }
}

export function positionPlayer(p: IPlayer, canvas: I2D) {
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
  gs.balls[0].speed = minV;
  gs.balls[0].bounce = 0;
  gs.balls[0].pos.x = 1 / 2;
  gs.balls[0].pos.y = 1 / 2;
}

export function setRandomDirBall(b: IBall) {
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
