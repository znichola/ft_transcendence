// import ResponsiveDrawPong from "./ResponsiveDrawPong.tsx";
import { pongSocket } from "../socket.ts";
import { useState, useEffect, useContext } from "react";
import ResponsiveAppPong from "./ResponsiveAppPong.tsx";
import { LoadingSpinnerMessage } from "../components/Loading.tsx";
import { NotificationContext } from "../routes/NotificationProvider.tsx";

export default function TestPong() {
  const [gameFound, setGameFount] = useState(false);
  const { addNotif } = useContext(NotificationContext);

  useEffect(() => {
    function onGameFound(message: string) {
      console.log("gameFound: ", message);
      addNotif({ type: "INFO", message: message });
      setGameFount(true);
    }
    pongSocket.emit("classical");

    pongSocket.on("gameFound", onGameFound);

    return () => {
      pongSocket.off("gameFound", onGameFound);
    };
  }, [addNotif]);

  if (gameFound) return <ResponsiveAppPong />;
  else return <LoadingSpinnerMessage message="looking for game ..." />;
}

// export const gameStart: IGameState = {
//   p1: {
//     pos: { x: 1 / 85, y: 1 / 2 - 1 / 10 },
//     dim: { w: 1 / 85, h: 1 / 5 },
//     score: 0,
//     moveUp: false,
//     moveDown: false,
//     id: undefined,
//     afk: true,
//   },
//   p2: {
//     pos: { x: 1 - 2 / 85, y: 1 / 2 - 1 / 10 },
//     dim: { w: 1 / 85, h: 1 / 5 },
//     score: 0,
//     moveUp: false,
//     moveDown: false,
//     id: undefined,
//     afk: true,
//   },
//   balls: [
//     {
//       pos: { x: 1 / 2, y: 1 / 2 },
//       radius: 1 / 70,
//       speed: 1 / 4,
//       direction: { x: 1, y: 0 },
//       mitosis: false,
//     },
//   ],
//   timerAfk: 15,
//   type: false,
// };
