import { useParams } from "react-router";
import PlayPong, { DisplayPlayer } from "./PlayPong";
import { useEffect, useState } from "react";
import { userSocket } from "../socket.ts";
import { ISocGameOver, ISocRoomCreated, UserData } from "../interfaces.tsx";
import { LoadingSpinnerMessage } from "../components/Loading.tsx";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { usePongGame, useUserData } from "../api/apiHooks.tsx";
import { ErrorMessage } from "../components/ErrorComponents.tsx";
import { IconTrophy, IconVS } from "../components/Icons.tsx";
import { useAuth } from "../functions/contexts.tsx";

export default function PongDuel() {
  const { id } = useParams<"id">();
  const [searchParams] = useSearchParams();
  const { data: game, isLoading, isError } = usePongGame(id);
  const [state, setState] = useState<
    | "PENDING"
    | "READY"
    | "PLAYING"
    | "GAME-OVER"
    | "RECONNECTION"
    | "CANCELLED"
    | "JOIN-GAME"
  >("PENDING");
  const [gameOver, setGameOver] = useState<ISocGameOver | undefined>(undefined);
  const navigate = useNavigate();
  const [waitingMSG, setWaitingMSG] = useState(false);
  const [waitingMSG2, setWaitingMSG2] = useState(false);

  useEffect(() => {
    if (searchParams.get("reconnection") == "true") {
      userSocket.emit("reconnect", id);
      setState("RECONNECTION");
    }

    setTimeout(() => {
      setWaitingMSG(true);
    }, 20000);
  }, [searchParams, id]);

  useEffect(() => {
    function getRoomCreated(ev: string) {
      console.log("ACOUNA MY FUCKNIG TATAS");
      setState("READY");
      userSocket.emit("ready", { id: ev });
      setTimeout(() => {
        setWaitingMSG2(true);
      }, 20000);
    }
    function getStartGame(_: ISocRoomCreated) {
      setState("PLAYING");
      _;
    }
    function getGameOver(ev: ISocGameOver) {
      setState("GAME-OVER");
      setGameOver(ev);
      console.log("game is over motherfucker");
      // navigate("/play");
    }
    function getCancelled(_: ISocRoomCreated) {
      setState("CANCELLED");
      _;
    }

    userSocket.on("room-created", getRoomCreated);
    userSocket.on("start-game", getStartGame);
    userSocket.on("game-over", getGameOver);
    userSocket.on("cancelled", getCancelled);

    return () => {
      userSocket.off("room-created", getRoomCreated);
      userSocket.off("start-game", getStartGame);
      userSocket.off("game-over", getGameOver);
      userSocket.off("cancelled", getCancelled);
    };
  }, [navigate]);

  // useEffect(() => {
  //   setTimeout(() => {
  //     navigate("/play");
  //   }, 20 * 3600);
  // }, [navigate]);

  if (isLoading)
    return <LoadingSpinnerMessage message="Getting rooom data.." />;
  if (isError || !game)
    return (
      <div>
        game not found,{" "}
        <Link to="/play" className="underline">
          go back
        </Link>
      </div>
    );

  const p1 = game.player1;
  const p2 = game.player2;

  if (game.gameState) {
    if (gameOver && p1 && p2) {
      return (
        <GameOver {...gameOver} p1={p1} p2={p2} special={game.gameState.type} />
      );
    }
    return <div>Gameover</div>;
  }

  console.log("state:", state);
  if (state == "PLAYING" || state == "RECONNECTION" || state == "JOIN-GAME")
    return <PlayPong player1={p1 || ""} player2={p2 || ""} />;

  console.log("ongong game:? ", game);

  if (game.gameState !== undefined)
    return (
      <GameAlert
        player1={p1}
        player2={p2}
        onJoin={() => {
          setState("JOIN-GAME");
          console.log("state to join game");
          userSocket.emit("join-game", { id: id });
        }}
      />
    );

  if (state == "PENDING")
    return (
      <>
        <LoadingSpinnerMessage message={"waiting for confirmation"} />
        {waitingMSG ? (
          <div>
            you've been here a while,{" "}
            <Link to="/play" className="underline">
              go back
            </Link>
          </div>
        ) : (
          <></>
        )}
      </>
    );
  if (state == "READY")
    return (
      <>
        <LoadingSpinnerMessage
          message={"waiting for the other player to join"}
        />
        {waitingMSG2 ? (
          <></>
        ) : (
          <div>
            you've been here a while,{" "}
            <Link to="/play" className="underline">
              go back
            </Link>
          </div>
        )}
      </>
    );
  if (state == "GAME-OVER") {
    if (gameOver && p1 && p2) {
      return <GameOver {...gameOver} p1={p1} p2={p2} special={false} />;
    }
    return <div>Gameover</div>;
  }
  if (state == "CANCELLED")
    return (
      <div>
        game cancelled,{" "}
        <Link to="/play" className="underline">
          go back
        </Link>
      </div>
    );
}

interface IGameOver extends ISocGameOver {
  p1: string;
  p2: string;
  special: boolean;
}

function GameOver({
  p1,
  p2,
  special,
  winner,
  ratedGame,
  player1RatingChange,
  player2RatingChange,
}: IGameOver) {
  const { data: p1d, isSuccess: p1Suc } = useUserData(p1);
  const { data: p2d, isSuccess: p2Suc } = useUserData(p2);

  if (!p1Suc || !p2Suc)
    return <ErrorMessage message={`error fetching ${p1} or ${p2} data`} />;

  return (
    <div className="flex w-full flex-col items-center">
      <h1 className="p-8 text-5xl font-bold">Game Over</h1>
      <h2 className="flex pb-10 text-3xl">
        <IconTrophy className="h-10" />
        <b className={`${special ? "gradient-hightlight" : "text-stone-500"}`}>
          {winner == p1 ? p1d.name : p2d.name}
        </b>
        <IconTrophy className="h-10" />
      </h2>
      {ratedGame ? (
        <div className="flex w-full gap-10 border-t-2 p-10">
          <EloChange user={p1d} elo={player1RatingChange} />
          <EloChange user={p2d} elo={player2RatingChange} />
        </div>
      ) : (
        <></>
      )}
      <Link to="/play" className="text-xl italic underline ">
        find another game?
      </Link>
    </div>
  );
}

function EloChange({ user, elo }: { user: UserData; elo: number }) {
  return (
    <div className="w-full text-center text-xl">
      <span>{user.name}</span>
      <b className={` ${elo < 0 ? "text-rose-500" : "text-green-500"}`}>
        {(elo < 0 ? " " : " +") + elo}
      </b>
    </div>
  );
}

// TODO : wait for game_id when click and then redirect
function GameAlert({
  player1,
  player2,
  onJoin,
}: {
  player1: string;
  player2: string;
  onJoin: () => void;
}) {
  const { user } = useAuth();
  const navigate = useNavigate();
  return (
    <div className="min-w-screen fixed inset-0 z-50 flex min-h-screen items-center justify-center backdrop-blur-sm ">
      <div className="flex h-80 w-[42rem] max-w-[75%] flex-col items-center justify-center overflow-hidden rounded-xl border-b-4 border-stone-300 bg-stone-50 bg-size-200 pt-6 shadow-lg">
        <h1 className="flex grow items-center justify-center bg-gradient-to-br from-fuchsia-600 to-orange-500 bg-clip-text text-5xl font-bold text-transparent">
          {"Game Found !"}
        </h1>
        <div className="flex grow items-center justify-center">
          <DisplayPlayer name={player1} />
          <h1 className="flex grow translate-y-4 items-center justify-center bg-gradient-to-br from-fuchsia-600 to-orange-500 bg-clip-text text-5xl font-bold text-transparent">
            <IconVS className="h-16 w-16" />
          </h1>
          <DisplayPlayer name={player2} right={true} />
        </div>
        <div className="flex grow items-center justify-center gap-5">
          <button
            className="flex h-14 w-full grow items-center justify-center rounded-xl bg-gradient-to-br from-fuchsia-600 to-orange-500 px-3 text-4xl font-bold text-white"
            onClick={onJoin}
          >
            {user == player1 || user == player2 ? "Fight" : "Spectate"}
          </button>
          <button
            onClick={() => navigate(-1)}
            className="flex h-14 w-full grow items-center justify-center rounded-xl px-3 text-3xl font-semibold text-slate-600"
          >
            go back
          </button>
        </div>
      </div>
    </div>
  );
}
