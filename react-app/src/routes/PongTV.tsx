import { useEffect, useState } from "react";
import { IGameState } from "../interfaces";
import DrawPong from "../pong/DrawPong";
import { userSocket } from "../socket";
import { Link } from "react-router-dom";

interface IPongTV {
  id: string;
  gameState: IGameState;
}

export default function PongTV() {
  const [games, setGames] = useState<IPongTV[]>([]);

  useEffect(() => {
    function getGamePreview(ev: IPongTV[]) {
      if (ev) setGames(ev);
    }

    userSocket.on("game-preview", getGamePreview);
    return () => {
      userSocket.off("game-preview", getGamePreview);
    };
  });

  return <UserMatchHistory games={games} />;
}

// let gamePreview: {id: string, gameState: IGameState}[];

function UserMatchHistory({ games }: { games: IPongTV[] }) {
  return (
    <div className="flex w-1/2 flex-col items-center rounded-xl bg-stone-50 px-1 pb-20 shadow-md">
      <h2 className="self-start p-5 text-lg font-semibold">Ongoing games</h2>
      <div
        className="flex w-full flex-wrap justify-center gap-5 overflow-y-auto overflow-x-hidden px-5"
        style={{ gridTemplateAreas: "auto-fill", gridRow: "auto-fill" }}
      >
        {games.map(
          (g) =>
            g.gameState != null ? (
              <MatchCell
                key={g.gameState.id}
                gameState={g.gameState}
                id={g.id}
              />
            ) : (
              <></>
            ), //TODO : MatchCell sould be always displayable
        )}
      </div>
    </div>
  );
}

export function MatchCell({
  gameState,
  id,
}: {
  gameState: IGameState;
  id: string;
}) {
  if (!gameState) {
    return (
      <div className="flex grow justify-center">
        <h1 className="flex h-fit w-full flex-col items-center rounded-xl border border-stone-200 bg-stone-50 px-3 pt-3 sm:w-fit">
          Game not completed
        </h1>
      </div>
    );
  }

  return (
    <Link to={`/pong/${id}`} className="flex grow justify-center">
      <div className="flex h-fit w-full flex-col items-center rounded-xl border border-stone-200 bg-stone-50 px-3 pt-3 sm:w-fit">
        <div className={`h-fit w-fit rounded bg-stone-50 px-2 pt-2`}>
          <h2 className="">{gameState.type ? "special" : "classical"}</h2>
          <div className="h-fit w-fit rounded-xl border-4 border-stone-500 bg-stone-700">
            <DrawPong height={104} width={170} gs={gameState} />
          </div>
          <div className="flex gap-1">
            <span className="w-full text-right font-bold">
              {gameState.p1.score}
            </span>
            <span className="w-full text-center">/</span>
            <span className="w-full text-left font-bold">
              {gameState.p2.score}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
