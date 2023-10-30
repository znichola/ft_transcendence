import { useParams } from "react-router";
import PlayPong from "./PlayPong";
import { useEffect, useState } from "react";
import { userSocket } from "../socket.ts";
import { ISocGameOver, ISocRoomCreated, UserData } from "../interfaces.tsx";
import { LoadingSpinnerMessage } from "../components/Loading.tsx";
import { Link, useNavigate } from "react-router-dom";
import { useUserData } from "../api/apiHooks.tsx";
import { ErrorMessage } from "../components/ErrorComponents.tsx";
import { IconTrophy } from "../components/Icons.tsx";

export default function PongDuel() {
  const { player1_login42: p1 } = useParams<"player1_login42">();
  const { player2_login42: p2 } = useParams<"player2_login42">();
  const { game_mode } = useParams<"game_mode">();
  const [state, setState] = useState<
    "PENDING" | "READY" | "PLAYING" | "GAME-OVER"
  >("PENDING");
  const [gameOver, setGameOver] = useState<ISocGameOver | undefined>(undefined);
  const navigate = useNavigate();
  const [waitingMSG, setWaitingMSG] = useState(false);
  const [waitingMSG2, setWaitingMSG2] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setWaitingMSG(true);
    }, 20000);
  }, []);

  useEffect(() => {
    function getRoomCreated(ev: ISocRoomCreated) {
      console.log("ACOUNA MY FUCKNIG TATAS");
      setState("READY");
      setTimeout(() => {
        setWaitingMSG2(false);
      }, 20000);
      userSocket.emit("ready", ev);
    }
    function getStartGame(_: ISocRoomCreated) {
      setState("PLAYING");
    }
    function getGameOver(ev: ISocGameOver) {
      setState("GAME-OVER");
      setGameOver(ev);
      console.log("game is over motherfucker");
      // navigate("/play");
    }

    userSocket.on("room-created", getRoomCreated);
    userSocket.on("start-game", getStartGame);
    userSocket.on("game-over", getGameOver);

    return () => {
      userSocket.off("room-created", getRoomCreated);
      userSocket.off("start-game", getStartGame);
      userSocket.off("game-over", getGameOver);
    };
  }, [navigate]);

  // useEffect(() => {
  //   setTimeout(() => {
  //     navigate("/play");
  //   }, 20 * 3600);
  // }, [navigate]);

  console.log("game over ev:", gameOver);

  if (state == "PENDING")
    return (
      <>
        <LoadingSpinnerMessage message={"waiting for confirmation"} />
        {waitingMSG ? (
          <div>
            your've been here a while,{" "}
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
        {waitingMSG2 ? (
          <></>
        ) : (
          <div>
            your've been here a while,{" "}
            <Link to="/play" className="underline">
              go back
            </Link>
          </div>
        )}
        <LoadingSpinnerMessage
          message={"waiting for the other player to join"}
        />
      </>
    );
  if (state == "PLAYING")
    return <PlayPong player1={p1 || ""} player2={p2 || ""} />;
  if (state == "GAME-OVER") {
    if (gameOver && p1 && p2) {
      return (
        <GameOver
          {...gameOver}
          p1={p1}
          p2={p2}
          special={game_mode == "special"}
        />
      );
    }
    return <div>Gameover</div>;
  }
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
