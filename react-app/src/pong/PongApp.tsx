import React, {SyntheticEvent, useEffect, useRef, useState} from "react";

//const gameStart = { p1y: 0, p2y: 0, ball: {pos: {x: 0, y: 0}, radius: 20, speed: 1, direction: {dx: 0, dy: 0}}, time: Date.now()}
// const newTime = useRef(0)
type twoDimension = { width: number; height: number };
interface gameState {
  p1: player;
  p2: player;
  ball: ball;
  //canvas: width, height
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
}

const gameStart: gameState = {
  p1: {
    pos: {x: 0, y: 0},
    dim: {w: 0, h: 0},
    score: 0,
    moveUp: false,
    moveDown: false,
  },
  p2: {
    pos: {x: 0, y: 0},
    dim: {w: 0, h: 0},
    score: 0,
    moveUp: false,
    moveDown: false,
  },
  ball: {
    pos: { x: 200, y: 50 },
    radius: 20,
    speed: 1,
    direction: { x: 1, y: 1 },
  },
};

export default function PongApp({ width, height }: twoDimension) {
  //const gameState = useRef(gameStart)
  function draw(ctx: CanvasRenderingContext2D | null | undefined, gs: gameState) {
    //console.log (gs)
    if (ctx !== null && ctx !== undefined)
    {
      //supprime tout
      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
      //dessine balle
      ctx.fillStyle = "rgb(186 230 253)";
      // ctx.strokeRect(0, 0, ctx.canvas.width, ctx.canvas.height);
      ctx.beginPath();
      //ctx.arc(gs.ball.pos.x, gs.ball.pos.y, Math.round(ctx.canvas.height * ctx.canvas.width / 35000), 0, 2 * Math.PI);
      ctx.arc(gs.ball.pos.x, gs.ball.pos.y, gs.ball.radius, 0, 2 * Math.PI);
      ctx.fill();
      //dessine les joueurs
      ctx.fillStyle = "rgb(186 230 253)";
      ctx.fillRect(gs.p1.pos.x, gs.p1.pos.y, gs.p1.dim.w, gs.p1.dim.h);
      ctx.fillRect(gs.p2.pos.x, gs.p2.pos.y, gs.p2.dim.w, gs.p2.dim.h);
      //dessine le score
      ctx.fillStyle = "rgb(186 230 253)";
      ctx.font = `${Math.round(ctx.canvas.height * ctx.canvas.width / 9400)}px sans-serif`;
      ctx.fillText(`${gs.p1.score}`, ctx.canvas.width / 6, ctx.canvas.height/ 7);
      ctx.fillText(`${gs.p2.score}`, ctx.canvas.width * 5/ 6, ctx.canvas.height/ 7);
      //dessine le milieu de terrain
      ctx.fillStyle = "rgb(186 230 253)";
      for(let i = 0; i < ctx.canvas.height; i += 14)
        ctx.fillRect(ctx.canvas.width / 2 - (ctx.canvas.width / 170), i, ctx.canvas.width / 170, ctx.canvas.height / 50)
    }
  }
  return <Canvas draw={draw} width={width} height={height} />;
}

function Canvas({
  draw,
  width,
  height,
}: {
  draw: (ctx: CanvasRenderingContext2D, gs: gameState) => void;
  width: number;
  height: number;
}) {
  const canvasRef = useCanvas(draw);

  return <canvas ref={canvasRef} width={width} height={height} />;
}
function useCanvas(draw: (ctx:  CanvasRenderingContext2D, gs: gameState) => void) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gameState = useRef<gameState>(gameStart);
  const oldTime = useRef<number>(0);

  useEffect(() => {
    const canvas: HTMLCanvasElement| null = canvasRef.current;
    const context:CanvasRenderingContext2D | null | undefined = canvas?.getContext("2d");
    let animationFrameId: number;

    if (context === null || context === undefined)
      return ;
    window.addEventListener("keydown", keyDown);
    window.addEventListener("keyup", keyUp);
    function keyDown(event: KeyboardEvent) {
      if (event.key === "ArrowUp" || event.key === 'w')
          gameState.current.p1.moveUp = true;
      if (event.key === "ArrowDown" || event.key === 's')
        gameState.current.p1.moveDown = true;
      if (event.key  === 'o')
        gameState.current.p2.moveUp = true;
      if (event.key === "l")
        gameState.current.p2.moveDown = true;
    }
    function keyUp(event: KeyboardEvent) {
      if (event.key === "ArrowUp" || event.key === 'w')
        gameState.current.p1.moveUp = false;
      if (event.key === "ArrowDown" || event.key === 's')
        gameState.current.p1.moveDown = false;
      if (event.key  === 'o')
        gameState.current.p2.moveUp = false;
      if (event.key === "l")
        gameState.current.p2.moveDown = false;
    }
    const render = (now: number) => {
      if (oldTime.current === undefined || oldTime.current === 0)
      {
        setGameState(gameState.current, context);
        oldTime.current = 0;
      }
      //norm le vecteur direction afin davoir meme vitesse qu'importe direction
      setBallPos(gameState.current, now, oldTime.current)
      positionPlayer(gameState.current.p1, context);
      positionPlayer(gameState.current.p2, context);
      bounceWallBall(gameState.current, context);
      bouncePlayerBall(gameState.current.p1, gameState.current.ball)
      bouncePlayerBall(gameState.current.p2, gameState.current.ball)
      scoreBall(gameState.current, context);
      draw(context, gameStart);
      oldTime.current = now;
      animationFrameId = window.requestAnimationFrame(render);
    };
    window.requestAnimationFrame(render);
    return () => {
      window.cancelAnimationFrame(animationFrameId);
    };
  }, [draw]);
  return canvasRef;
}

function setBallPos(gameState: gameState, now: number, oldTime: number) {
  const norm = Math.sqrt(Math.pow(gameState.ball.direction.x, 2) + Math.pow(gameState.ball.direction.y, 2));
  gameState.ball.direction.x /= norm;
  gameState.ball.direction.y /= norm;
  gameState.ball.pos.x +=
      (gameState.ball.direction.x * (now - oldTime)) / 5 * gameState.ball.speed;
  gameState.ball.pos.y +=
      (gameState.ball.direction.y * (now - oldTime)) / 5 * gameState.ball.speed;
}
function bounceWallBall(gameState: gameState, context: CanvasRenderingContext2D) {
  //TOUCHE BORD HAUT OU BAS
  if (
      gameState.ball.pos.y - gameState.ball.radius < 0 ||
      gameState.ball.pos.y + gameState.ball.radius >
      context.canvas.height
  ) {
    gameState.ball.direction.y *= -1;
    if (gameState.ball.pos.y - gameState.ball.radius <= 0)
      gameState.ball.pos.y = gameState.ball.radius;
    else
      gameState.ball.pos.y =
          context.canvas.height - gameState.ball.radius;
  }
}

function bouncePlayerBall(p: player, b: ball) {
  if (b.pos.x + b.radius >= p.pos.x
      && b.pos.y + b.radius <= p.pos.y + p.dim.h
      && b.pos.x - b.radius <= p.pos.x + p.dim.w
      && b.pos.y + b.radius >= p.pos.y)
  {
    b.direction.x *= -1;
    b.pos.x += b.direction.x * 10;
    b.pos.y += b.direction.y * 10;
    b.speed *= 1.2;
  }
}

function scoreBall(gameState: gameState, context: CanvasRenderingContext2D) {
  //TOUCHE BORD GAUCHE OU DROITE
  if (
      gameState.ball.pos.x - gameState.ball.radius < 0 ||
      gameState.ball.pos.x + gameState.ball.radius >
      context.canvas.width
  ) {
    if (gameState.ball.pos.x - gameState.ball.radius <= 0)
    {
      gameState.ball.pos.x = gameState.ball.radius;
      gameState.p2.score += 1;
    }
    else
    {
      gameState.ball.pos.x =
          context.canvas.width - gameState.ball.radius;
      gameState.p1.score += 1;
    }
    gameState.ball.direction.x = 1 - Math.random();
    gameState.ball.direction.y = 1 - Math.random();
    let ratio = gameState.ball.direction.x / gameState.ball.direction.y
    //eviter trajectoire trop horizontal

    if (ratio >= 5)
      gameState.ball.direction.y *= Math.round(ratio) - 1;
    //eviter trajectoire trop vertical
    ratio = gameState.ball.direction.y / gameState.ball.direction.x
    if (ratio >= 5)
      gameState.ball.direction.x *=  Math.round(ratio) - 1;

    //randomiser direction balle
    if (Math.random() >= 0.5)
      gameState.ball.direction.x *= -1;
    if (Math.random() <= 0.5)
      gameState.ball.direction.y *= -1;
    gameState.ball.pos.x = context.canvas.width / 2;
    gameState.ball.pos.y = context.canvas.height / 2;
    //reset player pos
    gameState.p1.pos.x = Math.round(context.canvas.width / 85);
    gameState.p2.pos.x = Math.round(context.canvas.width - context.canvas.width / 85 - gameState.p2.dim.w);
    gameState.p1.pos.y = gameState.p2.pos.y = Math.round(context.canvas.height / 2 - gameState.p1.dim.h / 2);
    gameState.ball.speed = 1;
  }
}

function positionPlayer(player: player, context: CanvasRenderingContext2D){
  if (player.moveUp && !player.moveDown && player.pos.y > 0)
  {
    player.pos.y -= 3;
    if (player.pos.y < 0)
      player.pos.y = 0
  }
  if (player.moveDown && !player.moveUp && player.pos.y < context.canvas.height - player.dim.h)
  {
    player.pos.y += 3;
    if (player.pos.y > context.canvas.height - player.dim.h)
      player.pos.y = context.canvas.height - player.dim.h
  }
}

function setGameState(gs: gameState, ctx: CanvasRenderingContext2D)  {
  //define player dimension proportional to canvas dimension
  gs.p1.dim.w = gs.p2.dim.w = Math.round(ctx.canvas.width / 85);
  gs.p1.dim.h = gs.p2.dim.h = Math.round(ctx.canvas.height / 5);
  //define player initial pos
  gs.p1.pos.x = Math.round(ctx.canvas.width / 85);
  gs.p2.pos.x = Math.round(ctx.canvas.width - ctx.canvas.width / 85 - gs.p2.dim.w);
  gs.p1.pos.y = gs.p2.pos.y = Math.round(ctx.canvas.height / 2 - gs.p1.dim.h / 2);
  //define ball initial pos
  gs.ball.pos.x = ctx.canvas.width / 2;
  gs.ball.pos.y = ctx.canvas.height / 2;
  //define ball radius proportional to canvas dimension
  gs.ball.radius = Math.round(ctx.canvas.height * ctx.canvas.width / 35000);
}
