import { useEffect, useRef, useState } from "react";
import DrawPong from "./DrawPong.tsx";

import { IGameState } from "../interfaces.tsx";

export default function ResponsiveDrawPong({ gs }: { gs: IGameState }) {
  const [dim, setDim] = useState({ x: 858, y: 525 });
  const pong = useRef<HTMLDivElement>(null);
  function handleResize() {
    if (pong.current) {
      setDim({ x: pong.current.offsetWidth, y: pong.current.offsetHeight });
    }
  }

  useEffect(() => {
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);
  return (
    <div ref={pong} className={`h-full w-full`}>
      <DrawPong width={dim.x} height={dim.y} gs={gs} />
    </div>
  );
}
