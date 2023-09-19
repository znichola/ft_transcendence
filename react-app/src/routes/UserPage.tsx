import { UserData } from "../interfaces";
import { NavigateFunction, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { LoadingSpinnerMessage } from "../components/Loading";
import { useQuery } from "@tanstack/react-query";
import { IconTrophy } from "../components/Icons";

function HistoryButton({ navigate }: { navigate: NavigateFunction }) {
  return (
    <div
      className="flex h-[100%] grow cursor-pointer items-center justify-center rounded-md bg-gradient-to-tl from-indigo-700 to-purple-500 shadow-md transition-transform hover:scale-105"
      // You can declair an anon funciton right here are just have a
      // result which is the function you wanted with a parameter
      onClick={() => {
        navigate("/user");
      }}
    >
      <p className="text-4xl text-center font-bold">Match History</p>
    </div>
  );
}

function MessageButton({ navigate }: { navigate: NavigateFunction }) {
  return (
    <div
      className="flex h-[100%] grow cursor-pointer items-center justify-center rounded-md bg-gradient-to-tl from-green-600 to-lime-400 shadow-md transition-transform hover:scale-105"
      onClick={() => navigate("/user")}
    >
      <p className="text-4xl font-bold">Messages</p>
    </div>
  );
}

function ChallengeButton({ navigate }: { navigate: NavigateFunction }) {
  return (
    <div className="flex h-[25%] w-[90%] items-center justify-center gap-7 pt-2 text-white">
      <div
        className="flex h-[100%] grow cursor-pointer items-center justify-center rounded-md bg-gradient-to-tl from-red-600 to-amber-400 shadow-md transition-transform hover:scale-105"
        onClick={() => navigate("/user")}
      >
        <p className="text-7xl font-bold">Challenge</p>
      </div>
    </div>
  );
}

function UserInfo({ user }: { user: UserData }) {
  return (
    <div className="flex max-h-[25%] w-[90%] items-center gap-3 rounded-2xl bg-gradient-to-tl from-blue-500 to-sky-300 object-cover p-4 shadow-md">
      <div className="flex items-center h-40 w-40 bg-green-600 overflow-visible">
				<div className="flex items-center translate-x-[-3rem] p-10 h-60 w-60 bg-green-600">
					<img
						className="aspect-square hover:rotate-[360deg] h-40 hover:scale-110 transition-transform duration-700 rounded-full border-neutral-100 border-x-4 border-y-4 shadow-md"
						key={user.id}
						src={user.avatar}
						alt={user.login42}
					/>
				</div>
			</div>
      <div className="flex h-[100%] w-[100%] flex-col overflow-hidden p-3 pl-5 text-white font-bold items-center justify-center">
        <div className="flex grow items-center text-center text-[300%]">
          <p>{user.name}</p>
        </div>
        <div className="max-h-0 w-[100%] border-2 rounded-md border-slate-200"></div>
        <div className="flex grow items-center">
          <div className="flex h-[100%] w-[100%] items-center justify-center gap-1 text-[3rem]">
            <p>{user.elo}</p>
            <IconTrophy className="h-9 w-9" />
          </div>
        </div>
      </div>
    </div>
  );
}

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

  // see comment below, feel free to remove
  // my shitty change if you don't like it.

  if (isLoading) return <LoadingSpinnerMessage message="Loading Profile" />;
  if (isError)
    return <p className="text-3xl text-red-600">Error when loading page</p>;

  return (
    <div className="h-[100%] w-[100%] bg-slate-200">
      <div className="flex h-[100%] max-h-[70rem] w-[100%] max-w-4xl flex-col items-center gap-5 bg-opacity-0 p-5">
        <UserInfo user={user} />
        <div className="flex h-[25%] w-[90%] items-center justify-center gap-7 pt-2 text-white">
          <HistoryButton navigate={navigate} />
          <MessageButton navigate={navigate} />
        </div>
				<ChallengeButton navigate={navigate}/>
      </div>
    </div>
  );
}
