import { useParams } from "react-router-dom";
import { useCurrentUser, useUserData } from "../functions/customHook";
import { ErrorMessage } from "../components/ErrorComponents";
import { LoadingSpinnerMessage } from "../components/Loading";
import ProfileElo from "../components/ProfileElo";

export default function UserPage() {
  const { login42 } = useParams<"login42">();
  const { data: cu, isError: noCurrentUser } = useCurrentUser();
  const { data: user, isLoading, isError } = useUserData(login42);

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
      <div className=" h-full w-full px-28 py-5">
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
          <div className="text-2xl p-5">
            {user.bio}
          </div>
          <ProfileElo data={user.eloHistory} className="p-10"/>
        </div>
      </div>
    </>
  );
}
