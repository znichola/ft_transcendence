import { IGameState } from "../interfaces";
import DrawPong from "../pong/DrawPong";

const gameStart: IGameState = {
  p1: {
    pos: {x: 0, y: 52},
    dim: {w: 2, h: 20},
    score: 0,
    moveUp: false,
    moveDown: false,
    id: undefined,
    afk: true,
  },
  p2: {
    pos: {x: 166, y: 52},
    dim: {w: 2, h: 20},
    score: 0,
    moveUp: false,
    moveDown: false,
    id: undefined,
    afk: true,
  },
  balls: [
    {
      pos: { x: 50, y: 50 },
      radius: 3,
      speed: 1,
      direction: { x: 1, y: 0 },
      mitosis: false,
      bounce: 0,
    }
  ],
  timerAfk: 0,
  type: false,
};

export function MatchCell({ victory }: { victory: boolean }) {
  return (
    <div className="h-fit w-fit rounded-xl border-b-2 border-stone-300 bg-stone-50 p-3 shadow">
      <div
        className={`${
          victory ? "text-green-500" : "text-red-600"
        } text-center font-semibold`}
      >
        {victory ? "Victory" : "Defeat"}
      </div>
      <div className={`h-fit w-fit rounded bg-stone-50 p-2`}>
        <span className="ml-1 w-full font-light">
          vs <span className="font-bold">player</span>
        </span>
        <div className="h-fit w-fit rounded-xl  border-4 border-stone-500 bg-stone-700">
            <DrawPong height={104} width={170} gs={gameStart}/>
        </div>
        <div className="flex gap-1">
          <span className="w-full text-right font-bold">7</span>
          <span className="w-full text-center">/</span>
          <span className="w-full text-left font-bold">10</span>
        </div>
      </div>
    </div>
  );
}