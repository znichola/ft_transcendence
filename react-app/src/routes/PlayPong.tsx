import Avatar from "../components/Avatar";
import { ErrorMessage } from "../components/ErrorComponents";
import { LoadingSpinnerMessage } from "../components/Loading";
import { useUserData } from "../functions/customHook";
import PongApp from "../pong/PongApp";

function DisplayPlayer({ name }: { name: string }) {
  const { data: user, isLoading, isError } = useUserData(name);

  if (isLoading) {
    return <LoadingSpinnerMessage message={"Loading player : " + name} />;
  }

  if (isError) {
    <ErrorMessage message={"Error : cannot load player " + name} />;
  }

  return <div className="h-10 w-20 rounded-xl bg-green-300"></div>;
}

export default function PlayPong() {
  return (
    <div className="flex relative h-full w-full flex-col items-center pt-5">
      <div className="absolute left-[50%] right-[50%] h-full w-0.5 bg-blue-300"></div>
      <div className="flex w-full">
        <div className="flex px-10">
          <DisplayPlayer name="default42" />
        </div>
        <div className="grow justify-center bg-blue-300">
          <p className="text-center">VS</p>
        </div>
        <div className="flex px-10">
          <DisplayPlayer name="default42" />
        </div>
      </div>
      <div className="h-8 w-5 bg-stone-200"/>
      <div className="h-min w-min rounded-xl border-2 border-stone-600 bg-stone-700 text-sky-200 shadow-2xl ">
        <PongApp width={858} height={525} />
      </div>
    </div>
  );
}

// for resizing
// https://codesandbox.io/s/resizing-canvas-with-react-hooks-gizc5?file=/src/index.js
