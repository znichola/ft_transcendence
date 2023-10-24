import { useEffect, useRef } from "react";
import { I2D, IGameState } from "../interfaces.tsx";
import { pongSocket } from "../socket.ts";
import { caseDraw } from "./draw.tsx";

export default function PongApp({ width, height }: I2D) {
  return <Canvas width={width} height={height} />;
}

function Canvas({ width, height }: { width: number; height: number }) {
  const canvasRef = useCanvas(caseDraw);
  return <canvas ref={canvasRef} width={width} height={height} />;
}

function useCanvas(
  draw: (
    ctx: CanvasRenderingContext2D | null | undefined,
    gs: IGameState,
  ) => void,
) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  // const gameState = useRef<IGameState>(gameStart);

  useEffect(() => {
    const canvas: HTMLCanvasElement | null = canvasRef.current;
    const context: CanvasRenderingContext2D | null | undefined =
      canvas?.getContext("2d");

    // capturing keyboard inputs
    if (context === null || context === undefined) return;
    window.addEventListener("keydown", keyDown);
    window.addEventListener("keyup", keyUp);

    function keyDown(event: KeyboardEvent) {
      if (event.key === "ArrowUp" || event.key === "w")
        pongSocket.emit("moveUp", true);
      if (event.key === "ArrowDown" || event.key === "s")
        pongSocket.emit("moveDown", true);
    }

    function keyUp(event: KeyboardEvent) {
      if (event.key === "ArrowUp" || event.key === "w")
        pongSocket.emit("moveUp", false);
      if (event.key === "ArrowDown" || event.key === "s")
        pongSocket.emit("moveDown", false);
    }

    // socket communication
    function onUpdate(data: IGameState) {
      // gameState.current = data;
      draw(context, data);
    }
    pongSocket.on("upDate", onUpdate);

    // clean up on quit
    return () => {
      pongSocket.off("update", onUpdate);
    };
  }, [draw]);
  return canvasRef;
}
