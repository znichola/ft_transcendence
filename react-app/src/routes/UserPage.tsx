import { UserData } from "../interfaces";
import { NavigateFunction, useNavigate, useParams } from "react-router-dom";
import { LoadingSpinnerMessage } from "../components/Loading";
import { IconTrophy } from "../components/Icons";
import { useUserData } from "../functions/customHook";

const bio_test = "Venez vous battre bande de fous !"

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
      <p className="text-center">Match History</p>
    </div>
  );
}

function MessageButton({ navigate }: { navigate: NavigateFunction }) {
  return (
    <div
      className="flex h-[100%] grow cursor-pointer items-center justify-center rounded-md bg-gradient-to-tl from-green-600 to-lime-400 shadow-md transition-transform hover:scale-105"
      onClick={() => navigate("/user")}
    >
      <p>Messages</p>
    </div>
  );
}

function ChallengeButton({ navigate }: { navigate: NavigateFunction }) {
  return (
		<div
			className="flex max-h-[7em] w-[20em] grow cursor-pointer items-center justify-center rounded-md bg-gradient-to-tl from-red-600 to-amber-400 shadow-md transition-transform hover:scale-105"
			onClick={() => navigate("/user")}
		>
			<p className="text-[1.75em]">Challenge</p>
		</div>
  );
}

function UserInfo({ user }: { user: UserData }) {
  return (
    <div className="flex max-h-[7em] w-[20em] items-center gap-[1em] rounded-2xl bg-gradient-to-tl from-blue-500 to-sky-300 p-[0.75em] shadow-md">
			<div className="group relative flex h-[5em] w-[5em] items-center gap-[0.3em]">
				<img
					className="h-[5em] w-[5em] z-10 aspect-square rounded-full border-x-4 border-y-4 border-neutral-100 object-cover shadow-md transition-transform duration-700 group-hover:rotate-[360deg] group-hover:scale-110"
					key={user.id}
					src={user.avatar}
					alt={user.login42}
				/>
				<div className="z-0 flex h-[7.5em] min-w-[20.25em] translate-x-[-12em] scale-[0.01] items-center overflow-y-auto rounded-xl bg-slate-100 pl-[8em] pt-[2em] pb-[2em] pr-10 shadow transition-all duration-500 group-hover:visible group-hover:translate-x-[-6.2em] group-hover:scale-100">
					<p className="text-justify text-[0.75em] text-gray-800">{user.bio || bio_test}</p>
				</div>
			</div>
      <div className="flex h-[100%] w-[100%] flex-col items-center justify-center overflow-hidden p-3 pl-5 font-bold text-white">
        <div className="flex grow items-center text-center">
          <p>{user.name}</p>
        </div>
        <div className="max-h-0 w-[100%] rounded-md border-[0.1em] border-slate-200"></div>
        <div className="flex grow items-center">
          <div className="flex h-[100%] w-[100%] items-center justify-center gap-1">
            <p>{user.elo}</p>
            <IconTrophy className="h-[0.75em] w-[0.75em]" />
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
  } = useUserData(login42)

  // see comment below, feel free to remove
  // my shitty change if you don't like it.

  if (isLoading) return <LoadingSpinnerMessage message="Loading Profile" />;
  if (isError)
    return <p className="text-3xl text-red-600">Error when loading page</p>;

  return (
		<div className="flex justify-center items-center font-bold sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl text-white h-[70em] w-[80%] flex-col gap-5 p-10">
			<UserInfo user={user} />
			<div className="flex h-[7em] w-[20em] items-center justify-center gap-7 pt-2">
				<HistoryButton navigate={navigate} />
				<MessageButton navigate={navigate} />
			</div>
			<ChallengeButton navigate={navigate} />
		</div>
  );
}
