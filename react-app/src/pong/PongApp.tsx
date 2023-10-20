import {io} from "socket.io-client";
import {useEffect, useRef} from "react";
import { I2D, IGameState } from "../interfaces.tsx";
import {Socket} from "socket.io";

const gameStart: IGameState = {
  p1: {
    pos: {x: 0, y: 0},
    dim: {w: 0, h: 0},
    score: 0,
    moveUp: false,
    moveDown: false,
    id: undefined,
    afk: true,
  },
  p2: {
    pos: {x: 0, y: 0},
    dim: {w: 0, h: 0},
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
  timerAfk: 0,
  type: false,
};

export default function PongApp({ width, height }: I2D)
{

  const socket: Socket = io('http://localhost:3000');
  console.log('Connected to WebSocket server: ', socket.flags.id);
  return <Canvas width={width} height={height} socket={socket}/>;
}

function Canvas({
                  width,
                  height,
                  socket
                }: {
  width: number;
  height: number;
  socket: Socket;
}) {
  const canvasRef = useCanvas(draw, socket);
  return <canvas ref={canvasRef} width={width} height={height}/>;
}

function useCanvas(draw: (ctx: CanvasRenderingContext2D, gs: IGameState) => void, socket: Socket)
{
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gameState = useRef<IGameState>(gameStart);

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
    socket.on('upDate', (data: IGameState) => {
      gameState.current = data;
      draw(context, gameState.current);
    });
  }, [draw, socket]);
  return canvasRef;
}

function draw(ctx: CanvasRenderingContext2D | null | undefined, gs: IGameState) {
  if (ctx !== null && ctx !== undefined) {
    //resize les proprietes recu du serveur
    resizeGameState(gs, ctx.canvas);
    //supprime tout
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    //dessine si 2 joueurs connectes
    if (!gs.p1.afk && !gs.p2.afk) {
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
    else {
      ctx.fillStyle = "rgb(186 230 253)";
      ctx.font = `${Math.round(ctx.canvas.height * ctx.canvas.width / 9400)}px sans-serif`;
      ctx.fillText(`Remaining: ${Math.round(gs.timerAfk)}sc`, ctx.canvas.width / 8, ctx.canvas.height / 2);
    }
  }
}

function resizeGameState(gs: IGameState, canvas: HTMLCanvasElement){
  //p1
  gs.p1.pos.x *= canvas.width;
  gs.p1.pos.y *= canvas.height;
  gs.p1.dim.w *= canvas.width;
  gs.p1.dim.h *= canvas.height;
  //p2
  gs.p2.pos.x *= canvas.width;
  gs.p2.pos.y *= canvas.height;
  gs.p2.dim.w *= canvas.width;
  gs.p2.dim.h *= canvas.height;
  //ball
  gs.ball.pos.x *= canvas.width;
  gs.ball.pos.y *= canvas.height;
  gs.ball.radius *= canvas.width * canvas.height;
  // gs.balls.forEach((b) => {
  //     b.pos.x *= canvas.width;
  //     b.pos.y *= canvas.height;
  //     b.radius *= canvas.width * canvas.height;
  // });
}