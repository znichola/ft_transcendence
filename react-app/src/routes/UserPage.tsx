import { useParams } from "react-router-dom";
import { useUserData } from "../functions/customHook";
import { ErrorMessage } from "../components/ErrorComponents";
import { LoadingSpinnerMessage } from "../components/Loading";
import ProfileElo from "../components/ProfileElo";
import { useRef, useState, useEffect } from "react";
import PongApp from "../pong/PongApp";

function MatchCell({victory}:{victory: boolean}) {
  return (
    <div className="h-fit w-fit border-b-2 rounded-xl shadow border-stone-300 bg-stone-50 p-3">
      <div className={`${victory ? "text-green-500" : "text-red-600"} text-center font-semibold`}>{victory ? "Victory" : "Defeat"}</div>
      <div className={`h-fit w-fit bg-stone-50 p-2 rounded`}>
        <span className="w-full font-light ml-1">vs <span className="font-bold">player</span></span>
        <div className="h-fit w-fit rounded-xl border-4 border-stone-500 bg-stone-700">
          <PongApp width={170} height={104} />
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

export default function UserPage() {
  const { login42 } = useParams<"login42">();
  const { data: user, isLoading, isError } = useUserData(login42);
  const [graphWidth, setGraphWidth] = useState(0);
  const elo_graph = useRef(null);

  function handleResize() {
    if (elo_graph.current && elo_graph.current instanceof Node) {
      setGraphWidth(elo_graph.current.offsetWidth * 2);
    }
  }

  useEffect(() => {
    handleResize();
  });

  useEffect(() => {
    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // if (noCurrentUser)
  //   return <ErrorMessage message="no current user, try loggin in" />;
  if (isLoading)
    return (
      <LoadingSpinnerMessage message={"Loading " + login42 + "'s profile"} />
    );
  if (isError)
    return <ErrorMessage message={"Error loading " + login42 + "'s profile"} />;
  return (
    <>
      <div className="flex h-full w-full flex-col px-28 py-5">
        <div className="h-40" />
        <div className="box-theme flex flex-col items-center justify-center">
          <div className="flex w-full">
            <div className="w-7 " />
            <div className="relative w-56 min-w-[10rem]">
              <div className="absolute -top-24 bottom-auto right-auto aspect-square w-full overflow-hidden rounded-full bg-stone-50 p-4 ">
                <img
                  src={user.avatar}
                  alt={user.login42 + "'s profile image"}
                  className="h-full w-full rounded-full object-cover"
                />
              </div>
            </div>
            <div className="grow ">
              <h1 className="gradient-hightlight min-w-0 pl-4 pt-4 text-5xl font-semibold ">
                {user.name}
              </h1>
              <h2 className="pl-4 text-2xl  text-slate-400">
                {"@" + user.login42}
              </h2>
            </div>
          </div>
          <div className="max-h-32 w-full overflow-auto px-10 py-6 text-left text-2xl">
            {user.bio ||
              "I am not very inspired today, but i want a bio with at least 2 lines"}
          </div>
        </div>
        <div className="h-12" />
        <div
          ref={elo_graph}
          className="flex min-h-fit border-b-2 border-stone-300 min-w-fit rounded-xl bg-stone-50 p-4 shadow"
        >
          <ProfileElo
            data={user.eloHistory}
            w={graphWidth}
            lineWidth={7}
            fontSize="text-3xl"
            className="max-h-[5rem]"
          />
        </div>
        <div className="h-5"></div>
        <div className="flex h-fit py-7 px-3 w-full gap-5 overflow-x-scroll">
          <MatchCell victory={true}/>
          <MatchCell victory={false}/>
          <MatchCell victory={true}/>
          <MatchCell victory={false}/>
          <MatchCell victory={true}/>
          <MatchCell victory={false}/>
        </div>
      </div>
    </>
  );
}
