import { Link } from "react-router-dom";
import { IGameHistory } from "../interfaces";
import DrawPong from "../pong/DrawPong";

export function MatchCell({ gameData, profile_user }: { gameData: IGameHistory, profile_user: string }) {

  const opponent = (gameData.player1 == profile_user) ? gameData.player2 : gameData.player1;
  const isVictory = (gameData.player1 == profile_user) == (gameData.gameState.p1.score > gameData.gameState.p2.score);

  return (
    <div className="flex grow justify-center">
      <Link to={"/user/" + opponent} className="flex flex-col items-center h-fit w-full sm:w-fit rounded-xl border border-stone-200 bg-stone-50 px-3 pt-3">
        <div
          className={`${
            isVictory ? "text-green-500" : "text-red-600"
          } text-center font-semibold text-2xl`}
        >
          {isVictory ? "Victory" : "Defeat"}
        </div>
        <div className={`h-fit w-fit rounded bg-stone-50 px-2 pt-2`}>
          <span className="ml-1 w-full font-light">
            vs <span className="font-bold">{opponent}</span>
          </span>
          <div className="h-fit w-fit rounded-xl border-4 border-stone-500 bg-stone-700">
            <DrawPong height={104} width={170} gs={gameData.gameState} />
          </div>
          <div className="flex gap-1">
            <span className="w-full text-right font-bold">{gameData.gameState.p1.score}</span>
            <span className="w-full text-center">/</span>
            <span className="w-full text-left font-bold">{gameData.gameState.p2.score}</span>
          </div>
        </div>
        <h2 className="text-center p-2 italic text-sm">{gameData.rated ? "Ranked" : "Friendly"} game</h2>
      </Link>
    </div>
  );
}
