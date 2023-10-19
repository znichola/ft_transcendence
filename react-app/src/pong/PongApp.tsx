import {io} from "socket.io-client";
import {useEffect, useRef} from "react";

type twoDimension = { width: number; height: number };
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
    pos: {x: 0, y: 0},
    dim: {w: 0, h: 0},
    score: 0,
    moveUp: false,
    moveDown: false,
    id: '',
    afk: true,
  },
  p2: {
    pos: {x: 0, y: 0},
    dim: {w: 0, h: 0},
    score: 0,
    moveUp: false,
    moveDown: false,
    id: '',
    afk: true,
  },
  ball: {
    pos: { x: 200, y: 50 },
    radius: 20,
    speed: 1,
    direction: { x: 1, y: 0 },
  },
  timerAfk: 0,
};

export default function PongApp({ width, height }: twoDimension)
{

  const socket = new io('http://localhost:3000');
  console.log('Connected to WebSocket server: ', socket.flags.id);
  function draw(ctx: CanvasRenderingContext2D | null | undefined, gs: gameState)
  {
    if (ctx !== null && ctx !== undefined)
    {
      //supprime tout
      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
      //dessine si 2 joueurs connectes
      if (!gs.p1.afk && !gs.p2.afk)
      {
        //dessine balle
        ctx.fillStyle = "rgb(186 230 253)";
        ctx.strokeRect(0, 0, ctx.canvas.width, ctx.canvas.height);
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
        ctx.fillText(`${gs.p1.score}`, ctx.canvas.width / 6, ctx.canvas.height / 7);
        ctx.fillText(`${gs.p2.score}`, ctx.canvas.width * 5 / 6 - Math.round(ctx.canvas.height * ctx.canvas.width / 9400) / 3, ctx.canvas.height / 7);
        //dessine le milieu de terrain
        ctx.fillStyle = "rgb(186 230 253)";
        for (let i = 0; i < ctx.canvas.height; i += 14)
          ctx.fillRect((ctx.canvas.width / 2 - ctx.canvas.width / 510), i, ctx.canvas.width / 170, ctx.canvas.height / 50)
      }
      //si 1 des 2 joueurs est afk
      else
      {
        ctx.fillStyle = "rgb(186 230 253)";
        ctx.font = `${Math.round(ctx.canvas.height * ctx.canvas.width / 9400)}px sans-serif`;
        ctx.fillText(`Remaining: ${Math.round(gs.timerAfk)}sc`, ctx.canvas.width / 8, ctx.canvas.height / 2);
      }
    }
  }
  return <Canvas draw={draw} width={width} height={height} socket={socket}/>;
}

function Canvas({
                  draw,
                  width,
                  height,
                  socket
                }: {
  draw: (ctx: CanvasRenderingContext2D, gs: gameState) => void;
  width: number;
  height: number;
  socket: any;
}) {
  const canvasRef = useCanvas(draw, socket);
  return <canvas ref={canvasRef} width={width} height={height}/>;
}

function useCanvas(draw: (ctx: CanvasRenderingContext2D, gs: gameState) => void, socket: any)
{
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gameState = useRef<gameState>(gameStart);

  useEffect(() =>
  {
    const canvas: HTMLCanvasElement | null = canvasRef.current;
    const context: CanvasRenderingContext2D | null | undefined = canvas?.getContext("2d");

    if (context === null || context === undefined)
      return;
    window.addEventListener("keydown", keyDown);
    window.addEventListener("keyup", keyUp);

    function keyDown(event: KeyboardEvent)
    {
      if (event.key === "ArrowUp" || event.key === 'w')
        socket.emit('moveUp', true)
      if (event.key === "ArrowDown" || event.key === 's')
        socket.emit('moveDown', true)
    }

    function keyUp(event: KeyboardEvent)
    {
      if (event.key === "ArrowUp" || event.key === 'w')
        socket.emit('moveUp', false)
      if (event.key === "ArrowDown" || event.key === 's')
        socket.emit('moveDown', false)
    }
    //setGameState(gameState.current, context.canvas);
    socket.on('upDate', (data: gameState) => {
      gameState.current = data;
      draw(context, gameState.current);
    });
  }, [draw]);
  return canvasRef;
}
