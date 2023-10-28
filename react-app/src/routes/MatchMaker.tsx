import BoxMenu from "../components/BoxMenu";
import { Heading } from "../components/FormComponents";
import { Link, useNavigate, useParams } from "react-router-dom";
import { DisplayPlayer } from "./PlayPong";
import { IconVS } from "../components/Icons";
import { useEffect, useState } from "react";
import { pongSocket } from "../socket";
import { ISocRoomCreated } from "../interfaces";
import { LoadingSpinnerMessage } from "../components/Loading";

function GameMode({
  className,
  title,
  to,
  children,
}: {
  className: string;
  title: string;
  to: string;
  children?: JSX.Element[] | JSX.Element;
}) {
  return (
    <Link
      className={
        "flex h-[32.3rem] w-[20rem] flex-col items-center rounded-xl p-4 transition-all duration-500 hover:scale-110 " +
        className
      }
      to={to}
    >
      <h2 className="text-4xl font-bold text-white">{title}</h2>
      {children}
    </Link>
  );
}

function GameModeSelection() {
  return (
    <div className="flex h-fit w-fit gap-36 p-10">
      <GameMode
        className="group bg-stone-800"
        title="Classical"
        to="/play/classical"
      >
        <div className="flex h-full w-full px-3 pt-10 ">
          <div className="h-full">
            <div className="h-20 w-3 translate-y-12 rounded-md bg-white transition-all duration-1000 group-hover:translate-y-28" />
          </div>
          <div className="grow">
            <div className="h-6 w-6 translate-x-24 translate-y-32 rounded-full bg-white transition-all duration-1000 group-hover:translate-x-44 group-hover:translate-y-44" />
          </div>
          <div className="h-full">
            <div className="h-20 w-3 translate-y-64 rounded-md bg-white transition-all duration-1000 group-hover:translate-y-40" />
          </div>
        </div>
      </GameMode>
      <GameMode
        className="group bg-gradient-to-br from-fuchsia-600 to-orange-500"
        title="Special"
        to="/play/special"
      >
        <div className="relative flex h-full w-full items-center justify-center overflow-hidden px-3 pb-7 text-[19rem] font-bold text-white transition-all">
          <h2 className="absolute transition-all duration-[1200ms] group-hover:opacity-0">
            ?
          </h2>
          <h2 className="absolute opacity-0 transition-all duration-[1200ms] group-hover:opacity-100">
            !
          </h2>
        </div>
      </GameMode>
    </div>
  );
}

// TODO : wait for game_id when click and then redirect
function GameAlert({
  player1,
  player2,
  setMatchFound,
}: {
  player1: string;
  player2: string;
  setMatchFound: (v: boolean) => void;
}) {
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
          <Link
            className="flex h-14 w-full grow items-center justify-center rounded-xl bg-gradient-to-br from-fuchsia-600 to-orange-500 px-3 text-4xl font-bold text-white"
            to={"/pong/default42/vs/default42/"}
          >
            Fight !
          </Link>
          <button
            className="flex h-14 w-full grow items-center justify-center rounded-xl px-3 text-4xl font-semibold text-slate-600"
            onClick={() => setMatchFound(false)}
          >
            Refuse
          </button>
        </div>
      </div>
    </div>
  );
}

//TODO : invalidate wrong gmae_mode request
function WaitingForGame({ game_mode }: { game_mode: string }) {
  const navigate = useNavigate();
  const [once, setOnce] = useState(true);

  function getRoomCreated(ev: ISocRoomCreated) {
    navigate(`/pong/${ev.user1}/vs/${ev.user2}/${ev.special}`);
  }

  useEffect(() => {
    if (once) {
      pongSocket.emit("looking-for-game", game_mode == "special" );
      setOnce(false);
    }
    pongSocket.on("room-created", getRoomCreated);

    return () => {
      pongSocket.off("room-created", getRoomCreated);
    };
  }),
    [pongSocket, getRoomCreated];

  return (
    <div className="flex h-fit w-fit flex-col gap-5 p-10">
      <LoadingSpinnerMessage message={`Looking for a ${game_mode} game ...`} />
    </div>
  );
}

{
  /* <button
className="rounded-xl border-4 border-stone-200 p-3 hover:cursor-pointer"
onClick={() => setMatchFound(true)}
>
Magic button : Find a game
</button> */
}

export default function MatchMaker() {
  const { game_mode } = useParams<"game_mode">();

  return (
    <div className="relative flex h-full w-full items-center justify-center pt-16">
      <BoxMenu heading={<Heading title="Select your Game Mode" />}></BoxMenu>
      {game_mode ? (
        <WaitingForGame game_mode={game_mode} />
      ) : (
        <GameModeSelection />
      )}
    </div>
  );
}
