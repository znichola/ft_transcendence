import draw from "./draw.tsx";
import { useEffect, useRef } from "react";
import { IGameState } from "../interfaces.tsx";

export default function DrawPong({
  width,
  height,
  gs,
}: {
  width: number;
  height: number;
  gs: IGameState;
}) {
  const canvasRef = useCanvas(gs);
  return <canvas ref={canvasRef} width={width} height={height} />;
}

function useCanvas(gs: IGameState) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const canvas: HTMLCanvasElement | null = canvasRef.current;
  const context: CanvasRenderingContext2D | null | undefined =
    canvas?.getContext("2d");

  useEffect(() => {
    if (context === null || context === undefined) return;
    draw(context, gs);
  }, [gs, context?.canvas.height, context?.canvas.width, context]);
  return canvasRef;
}
