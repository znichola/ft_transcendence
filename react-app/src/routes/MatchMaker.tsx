import BoxMenu from "../components/BoxMenu";
import { Heading } from "../components/FormComponents";
import {
  Link,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import { useEffect, useState } from "react";
import { userSocket } from "../socket";
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

//TODO : invalidate wrong gmae_mode request
function WaitingForGame({ game_mode }: { game_mode: string }) {
  const navigate = useNavigate();
  const [waiting, setWaiting] = useState(true);
  const [searchParams] = useSearchParams();

  useEffect(() => {
    setTimeout(() => {
      setWaiting(false);
    }, 20000);
  }, []);

  useEffect(() => {
    if (searchParams.get("challenge") === "true") {
      console.log("it's a challenge");
    } else {
      userSocket.emit("looking-for-game", game_mode == "special");
    }
  }, [game_mode, searchParams]);

  useEffect(() => {
    function getRoomCreated(ev: string) {
      console.log("event game found:", ev);
      navigate(`/pong/${ev}`);
    }
    userSocket.on("room-created", getRoomCreated);

    return () => {
      userSocket.off("room-created", getRoomCreated);
    };
  }, [game_mode, navigate]);

  return (
    <div className="flex h-fit w-fit flex-col gap-5 p-10">
      <LoadingSpinnerMessage message={`Looking for a ${game_mode} game ...`} />
      {waiting ? (
        <></>
      ) : (
        <div>
          your've been here a while,{" "}
          <Link to="/play" className="underline">
            go back
          </Link>
        </div>
      )}
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

  console.log("match maker:", game_mode);
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
