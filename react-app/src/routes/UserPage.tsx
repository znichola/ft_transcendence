import { useParams } from "react-router-dom";
import { useCurrentUser, useUserData } from "../functions/customHook";
import { ErrorMessage } from "../components/ErrorComponents";
import { LoadingSpinnerMessage } from "../components/Loading";
import ProfileElo from "../components/ProfileElo";
import { useRef, useState, useEffect } from "react";
import EditBox from "../components/TextBox";
import { putUserProfile } from "../Api-axios";
import { MatchCell } from "../components/MatchCell";

const defaultBio =
  "I am not very inspired today, but i want a bio with at least 2 lines";

export default function UserPage() {
  const { login42 } = useParams<"login42">();
  const { data: currentUser } = useCurrentUser();
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
      <div className="flex h-full w-full min-w-[50rem] flex-col px-28 py-5">
        <div className="grow max-h-32 min-h-[5rem]"/>
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
            <div>
              <h1 className="pl-4 pt-4 text-5xl font-semibold ">
                {user.login42 == currentUser ? (
                  <EditBox
                    className=""
                    maxChar={20}
                    rows={1}
                    startText={user.name}
                    putUpdate={(e) =>
                      putUserProfile(user.login42, undefined, e.target.value)
                    }
                  />
                ) : (
                  <h1 className="gradient-hightlight">{user.name}</h1>
                )}
              </h1>
              <h2 className="pl-4 text-2xl text-slate-400">
                {"@" + user.login42}
              </h2>
            </div>
          </div>
          <div className="max-h-32 w-full px-10 py-6 text-left text-2xl">
            {user.login42 == currentUser ? (
              <EditBox
                className=""
                maxChar={140}
                rows={2}
                startText={user.bio || defaultBio}
                putUpdate={(e) =>
                  putUserProfile(user.login42, e.target.value, undefined)
                }
              />
            ) : (
              <h2>{user.bio || defaultBio}</h2>
            )}
          </div>
        </div>
        <div className="flex items-center grow max-h-72 py-4">
          <div
            ref={elo_graph}
            className="flex min-h-fit min-w-fit rounded-xl border-b-2 border-stone-300 bg-stone-50 p-4 shadow"
          >
            <ProfileElo
              data={user.eloHistory}
              w={graphWidth}
              lineWidth={7}
              fontSize="text-3xl"
              className="max-h-[10rem] h-40 "
            />
          </div>
        </div>
        <div className="flex h-fit w-full gap-5 overflow-x-scroll pl-1 pb-7">
          <MatchCell victory={true} />
          <MatchCell victory={false} />
          <MatchCell victory={true} />
          <MatchCell victory={false} />
          <MatchCell victory={true} />
          <MatchCell victory={false} />
        </div>
      </div>
    </>
  );
}
