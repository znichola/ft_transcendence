import Avatar from "../components/Avatar";
import { ErrorMessage } from "../components/ErrorComponents";
import { IconTrophy } from "../components/Icons";
import { LoadingSpinnerMessage } from "../components/Loading";
import { useUserData } from "../functions/customHook";
import PongApp from "../pong/PongApp";

export function DisplayPlayer({
  name,
  right = false,
}: {
  name: string;
  right?: boolean;
}) {
  const { data: user, isLoading, isError } = useUserData(name);

  if (isLoading) {
    return <LoadingSpinnerMessage message={"Loading player : " + name} />;
  }

  if (isError) {
    <ErrorMessage message={"Error : cannot load player " + name} />;
  }

  return (
    <div
      className={
        "h-30 flex w-72 rounded-full border-b-4 bg-stone-50 px-0.5 py-1 shadow-md font-extrabold" +
        (right ? " flex-row-reverse " : "")
      }
    >
      <img
        src={user?.avatar}
        alt={user?.login42}
        className={"h-20 w-20 self-center mx-2 rounded-full" + (right ? " " : "")}
      />
      <div
        className={
          "flex flex-col justify-center p-2" + (right ? " items-end text-right" : "")
        }
      >
        <p className="">{user?.name}</p>
        <div className="flex items-center text-2xl">
          <p className="">{user?.elo}</p>
          <IconTrophy />
        </div>
      </div>
    </div>
  );
}

export default function PlayPong({
  player1,
  player2,
}: {
  player1: string;
  player2: string;
}) {
  return (
    <div className="relative flex h-full w-full flex-col items-center overflow-hidden px-12 pt-5">
      <div className="absolute left-auto right-auto h-full w-0.5 bg-stone-300 opacity-30"></div>
      <div className="flex w-full text-xl font-bold text-slate-600">
        <div className="flex">
          <DisplayPlayer name={player1} />
        </div>
        <div className="flex grow items-end justify-center">
          <div className="flex gap-3 text-5xl">
            <p className="">10</p>
            <div className="w-1 bg-slate-600"></div>
            <p className="">10</p>
          </div>
        </div>
        <div className="flex">
          <DisplayPlayer name={player2} right={true} />
        </div>
      </div>
      <div className="flex grow items-center justify-center pb-14 pt-3">
        <div className="h-fit w-fit rounded-xl border-2 border-stone-600 bg-stone-700 text-sky-200 shadow-2xl ">
          <PongApp width={858} height={525} />
        </div>
      </div>
    </div>
  );
}

// for resizing
// https://codesandbox.io/s/resizing-canvas-with-react-hooks-gizc5?file=/src/index.js
