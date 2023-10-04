import React, {useEffect, useRef} from "react";

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
    direction: { x: 1, y: 0 },
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
    else {
      console.log(canvasRef.current);
    }
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
      positionPlayer(gameState.current.p1, context);
      positionPlayer(gameState.current.p2, context);
      setBallPos(gameState.current, now, oldTime.current)
      bounceWallBall(gameState.current, context);
      gameState.current.ball.pos.x < context.canvas.width / 2 ? bouncePlayerBall(gameState.current.p1, gameState.current.ball): bouncePlayerBall(gameState.current.p2, gameState.current.ball)
      // bouncePlayerBall(gameState.current.p2, gameState.current.ball)
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

function setBallPos(gs: gameState, now: number, oldTime: number) {
  gs.ball.pos.x +=
      gs.ball.direction.x * gs.ball.speed * (now - oldTime);
  gs.ball.pos.y +=
      gs.ball.direction.y * gs.ball.speed * (now - oldTime);
}
function bounceWallBall(gs: gameState, ctx: CanvasRenderingContext2D) {
  //TOUCHE BORD HAUT OU BAS
  if (
      gs.ball.pos.y - gs.ball.radius < 0 ||
      gs.ball.pos.y + gs.ball.radius >
      ctx.canvas.height
  ) {
    gs.ball.direction.y *= -1;
    if (gs.ball.pos.y - gs.ball.radius <= 0)
      gs.ball.pos.y = gs.ball.radius;
    else
      gs.ball.pos.y =
          ctx.canvas.height - gs.ball.radius;
  }
}

function bouncePlayerBall(p: player, b: ball) {
  if (b.pos.x + b.radius > p.pos.x
      && b.pos.y - b.radius < p.pos.y + p.dim.h
      && b.pos.x - b.radius < p.pos.x + p.dim.w
      && b.pos.y + b.radius > p.pos.y)
  {
    const contactRatioY = (b.pos.y - (p.pos.y + p.dim.h / 2)) / (p.dim.h / 2);
    const angle = Math.PI/3 * contactRatioY;
    const direction = b.direction.x < 0 ? -1: 1;
    b.direction.x = -direction * Math.cos(angle)
    b.direction.y = Math.sin(angle)
     if (direction < 0)
      b.pos.x = p.pos.x + p.dim.w + b.radius + 1;
    else
      b.pos.x = p.pos.x - b.radius - 1;
    //put lim to Vmax pending on p.w and ball.diam
    if (b.speed < (p.dim.w + b.radius * 2) / 16)
    {
      b.speed *= 1.12;
      if (b.speed > (p.dim.w + b.radius * 2) / 16)
        b.speed = (p.dim.w + b.radius * 2) / 16;
    }
  }
}

function scoreBall(gs: gameState, ctx: CanvasRenderingContext2D) {
  //TOUCHE BORD GAUCHE OU DROITE
  if (
      gs.ball.pos.x - gs.ball.radius < 0 ||
      gs.ball.pos.x + gs.ball.radius >
      ctx.canvas.width
  ) {
    if (gs.ball.pos.x - gs.ball.radius <= 0)
      gs.p2.score += 1;
    else
      gs.p1.score += 1;
    setRandomPosBall(gs.ball)
    setInitialPosition(gs, ctx)
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
  //define ball radius proportional to canvas dimension
  gs.ball.radius = Math.round(ctx.canvas.height * ctx.canvas.width / 35000);
  setRandomPosBall(gs.ball)
  setInitialPosition(gs, ctx)
}

function setInitialPosition(gs:gameState , ctx: CanvasRenderingContext2D)
{
  //define player initial pos
  gs.p1.pos.x = Math.round(ctx.canvas.width / 85);
  gs.p2.pos.x = Math.round(ctx.canvas.width - ctx.canvas.width / 85 - gs.p2.dim.w);
  gs.p1.pos.y = gs.p2.pos.y = Math.round(ctx.canvas.height / 2 - gs.p1.dim.h / 2);
  //define ball initial pos
  gs.ball.speed = Math.sqrt(Math.pow(ctx.canvas.width, 2) + Math.pow(ctx.canvas.height, 2)) / 4000
  gs.ball.pos.x = ctx.canvas.width / 2;
  gs.ball.pos.y = ctx.canvas.height / 2;
}

function setRandomPosBall(b: ball)
{
  let newDirection = Math.random() * 360;
  if (newDirection >= 80 && newDirection<=100)
    newDirection < 90 ? newDirection -= 10 : newDirection += 10
  if (newDirection <= 260 && newDirection <= 280)
    newDirection < 270 ? newDirection -= 10 : newDirection += 10
  b.direction.x = Math.cos(newDirection)
  b.direction.y = Math.sin(newDirection)
}