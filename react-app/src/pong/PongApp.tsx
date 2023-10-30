import { useEffect, useRef } from "react";
import { I2D, IGameState, IScore } from "../interfaces.tsx";
import { userSocket } from "../socket.ts";
import { caseDraw } from "./draw.tsx";

export default function PongApp({ width, height, setScore }: I2D) {
  return <Canvas width={width} height={height} setScore={setScore} />;
}

function Canvas({ width, height, setScore }: I2D) {
  const canvasRef = useCanvas(caseDraw, setScore);
  return <canvas ref={canvasRef} width={width} height={height} />;
}

function useCanvas(
  draw: (
    ctx: CanvasRenderingContext2D | null | undefined,
    gs: IGameState,
  ) => void,
  setScore: (value: IScore) => void,
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
        userSocket.emit("moveUp", true);
      if (event.key === "ArrowDown" || event.key === "s")
        userSocket.emit("moveDown", true);
    }

    function keyUp(event: KeyboardEvent) {
      if (event.key === "ArrowUp" || event.key === "w")
        userSocket.emit("moveUp", false);
      if (event.key === "ArrowDown" || event.key === "s")
        userSocket.emit("moveDown", false);
    }

    // socket communication
    function onUpdate(data: IGameState) {
      // gameState.current = data;
      draw(context, data);
      setScore({p1Score: data.p1.score, p2Score: data.p2.score});
    }
    userSocket.on("upDate", onUpdate);

    // clean up on quit
    return () => {
      userSocket.off("upDate", onUpdate);
    };
  }, [draw, setScore]);
  return canvasRef;
}
