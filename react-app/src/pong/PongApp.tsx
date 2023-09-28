import React, { useEffect, useRef, useState } from "react";

//const gameStart = { p1y: 0, p2y: 0, ball: {pos: {x: 0, y: 0}, radius: 20, speed: 1, direction: {dx: 0, dy: 0}}, time: Date.now()}
// const newTime = useRef(0)
type twoDimension = { width: number; height: number };
interface gameState {
  p1y: number;
  p2y: number;
  ball: ball;
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

const gameStart: gameState = {
  p1y: 0,
  p2y: 0,
  ball: {
    pos: { x: 200, y: 50 },
    radius: 20,
    speed: 1,
    direction: { x: 1, y: 1 },
  },
};

export default function PongApp({ width, height }: twoDimension) {
  //const gameState = useRef(gameStart)
  function draw(ctx: any, gs: gameState) {
    //console.log (gs)
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.fillStyle = "rgb(186 230 253)";
    // ctx.strokeRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.beginPath();
    ctx.arc(gs.ball.pos.x, gs.ball.pos.y, gs.ball.radius, 0, 2 * Math.PI);
    ctx.fill();
  }
  return <Canvas draw={draw} width={width} height={height} />;
}

function Canvas({
  draw,
  width,
  height,
}: {
  draw: (ctx: any, gs: gameState) => void;
  width: number;
  height: number;
}) {
  const canvasRef = useCanvas(draw);

  return <canvas ref={canvasRef} width={width} height={height} />;
}
function useCanvas(draw: (ctx: any, gs: gameState) => void) {
  const canvasRef = useRef<null>(null);
  const gameState = useRef<gameState>(gameStart);
  const oldTime = useRef<number>(0);

  useEffect(() => {
    const canvas: any = canvasRef.current;
    const context = canvas.getContext("2d");
    let animationFrameId: number;

    const render = (now: number) => {
      if (oldTime.current === undefined) oldTime.current = 0;
      gameState.current.ball.pos.x +=
        (gameState.current.ball.direction.x * (now - oldTime.current)) / 5;
      gameState.current.ball.pos.y +=
        (gameState.current.ball.direction.y * (now - oldTime.current)) / 5;
      if (
        gameState.current.ball.pos.y - gameState.current.ball.radius < 0 ||
        gameState.current.ball.pos.y + gameState.current.ball.radius >
          context.canvas.height
      ) {
        gameState.current.ball.direction.y *= -1;
        if (gameState.current.ball.pos.y - gameState.current.ball.radius <= 0)
          gameState.current.ball.pos.y = gameState.current.ball.radius;
        else
          gameState.current.ball.pos.y =
            context.canvas.height - gameState.current.ball.radius;
      }
      if (
        gameState.current.ball.pos.x - gameState.current.ball.radius < 0 ||
        gameState.current.ball.pos.x + gameState.current.ball.radius >
          context.canvas.width
      ) {
        gameState.current.ball.direction.x *= -1;
        if (gameState.current.ball.pos.x - gameState.current.ball.radius <= 0)
          gameState.current.ball.pos.x = gameState.current.ball.radius;
        else
          gameState.current.ball.pos.x =
            context.canvas.width - gameState.current.ball.radius;
      }
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
