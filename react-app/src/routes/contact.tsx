import { UserData } from "../interfaces";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { LoadingSpinnerMessage } from "../components";
import { useQuery } from "@tanstack/react-query";

export default function Contact() {
  const { login42 } = useParams<"login42">();
  const navigate = useNavigate();
  const {
    data: user,
    isLoading,
    isError,
  } = useQuery({
    queryKey: [login42],
    queryFn: () =>
      axios.get<UserData>("/user/" + login42).then((res) => res.data),
  });

  function handleHistoryClick() {
    navigate("/users");
  }

  function handleMessageClick() {
    navigate("/users");
  }

  function handleChallengeClick() {
    navigate("/users");
  }

  if (isLoading) return <LoadingSpinnerMessage message="Loading Profile" />;
  if (isError)
    return <p className="text-3xl text-red-600">Error when loading page</p>;

  return (
    <div className="h-[100%] w-[100%] bg-slate-200">
      <div className="flex h-[100%] max-h-[60rem] w-[100%] max-w-3xl flex-col items-center gap-5 bg-slate-200 p-5">
        <div className="flex max-h-[25%] w-[90%] items-center gap-3 rounded-2xl bg-slate-100 object-cover p-4 shadow-md">
          <img
            className="aspect-square h-[90%] rounded-full object-cover shadow-md"
            key={user.id}
            src={user.avatar}
            alt={user.login42}
          />
          <div className="flex h-[100%] w-[100%] flex-col items-center justify-center">
            <div className="flex grow items-center text-[300%]">
              <p>{user.name}</p>
            </div>
            <div className="max-h-0 w-[100%] border-b border-slate-400 bg-slate-300"></div>
            <div className="flex grow items-center">
              <div className="flex h-[100%] w-[100%] items-center justify-center gap-1 text-[3rem]">
                <p>{user.elo}</p>
                <img
                  className="h-[4rem] w-[4rem]"
                  src={user.avatar}
                  alt="elo"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex h-[25%] w-[90%] items-center justify-center gap-7 pt-2 text-white">
          <div
            className="flex h-[100%] grow cursor-pointer items-center justify-center rounded-md bg-indigo-700 shadow-md"
            onClick={handleHistoryClick}
          >
            <p className="text-3xl font-bold">Match History</p>
          </div>
          <div
            className="flex h-[100%] grow cursor-pointer items-center justify-center rounded-md bg-orange-500 shadow-md"
            onClick={handleMessageClick}
          >
            <p className="text-3xl font-bold">Messages</p>
          </div>
        </div>
        <div className="flex h-[25%] w-[90%] items-center justify-center gap-7 pt-2 text-white">
          <div
            className="flex h-[100%] grow cursor-pointer items-center justify-center rounded-md bg-amber-500 shadow-md"
            onClick={handleChallengeClick}
          >
            <p className="text-5xl font-bold">Challenge</p>
          </div>
        </div>
      </div>
    </div>
  );
}
