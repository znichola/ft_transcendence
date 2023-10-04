import { useParams } from "react-router-dom";
import { useCurrentUser, useUserData } from "../functions/customHook";
import { ErrorMessage } from "../components/ErrorComponents";
import { LoadingSpinnerMessage } from "../components/Loading";
import ProfileElo from "../components/ProfileElo";
import { useRef, useState, useEffect } from "react";

export default function UserPage() {
  const { login42 } = useParams<"login42">();
  const { data: user, isLoading, isError } = useUserData(login42);
  const [ graphWidth, setGraphWidth ] = useState(0);
  const elo_graph = useRef(null);

  function handleResize() {
    if (elo_graph.current && (elo_graph.current instanceof Node)) {
      setGraphWidth(elo_graph.current.offsetWidth * 2);
    }
  }

  useEffect(() => {
    handleResize();
  })

  useEffect(() => {
    handleResize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    }
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
      <div className="flex-col h-full w-full px-28 py-5">
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
              <h2 className="text-2xl pl-4  text-slate-400">{"@" + user.login42}</h2>
            </div>
          </div>
          <div className="text-left w-full overflow-auto max-h-32 text-2xl px-10 py-6">
            {user.bio || "I am not very inspired today, but i want a bio with at least 2 lines"}
          </div>
        </div>
        <div className="h-7"/>
        <div ref={elo_graph} className="flex min-h-fit min-w-fit p-4 rounded-xl bg-stone-50 shadow-inner">
          <ProfileElo data={user.eloHistory} w={graphWidth} lineWidth={7} fontSize="text-3xl" className="max-h-[5rem]"/>
        </div>
      </div>
    </>
  );
}
