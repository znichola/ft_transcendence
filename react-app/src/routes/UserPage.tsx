import { UserData } from "../interfaces";
import { NavigateFunction, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { LoadingSpinnerMessage } from "../components/Loading";
import { useQuery } from "@tanstack/react-query";
import { IconTrophy } from "../components/Icons";

const bio_test =
  "Pong est un des premiers jeux vidéo d'arcade et le premier jeu vidéo d'arcade de sport. Il a été imaginé par l'Américain Nolan Bushnell et développé par Allan Alcorn, et la société Atari le commercialise à partir de novembre 1972. Bien que d'autres jeux vidéo aient été inventés précédemment, comme Computer Space, Pong est le premier à devenir populaire. Le jeu est inspiré du tennis de table en vue de dessus, et chaque joueur s'affronte en déplaçant la raquette virtuelle de haut en bas, via un bouton rotatif, de façon à garder la balle dans le terrain de jeu. Le joueur peut changer la direction de la balle en fonction de l'endroit où celle-ci tape sur la raquette, alors que sa vitesse augmente graduellement au cours de la manche. Un score est affiché pour la partie en cours et des bruitages accompagnent la frappe de la balle sur les raquettes. ";

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
      <p className="text-center text-4xl font-bold">Match History</p>
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
    <div className="flex max-h-[25%] w-[90%] items-center gap-3 rounded-2xl bg-gradient-to-tl from-blue-500 to-sky-300 p-4 shadow-md">
      <div className="flex h-40 w-40 items-center overflow-visible">
        <div className="group relative flex h-40 w-40 items-center gap-5">
          <img
            className="h-30 w-30 z-10 aspect-square rounded-full border-x-4 border-y-4 border-neutral-100 object-cover shadow-md transition-transform duration-700 hover:rotate-[360deg] hover:scale-110"
            key={user.id}
            src={user.avatar}
            alt={user.login42}
          />
          <div className="z-0 flex h-60 min-w-[530%] translate-x-[-35rem] scale-[0.01] items-center overflow-y-auto rounded-xl bg-slate-100 pl-64 pt-28 pb-8 pr-10 shadow transition-all duration-500 group-hover:visible group-hover:translate-x-[-15rem] group-hover:scale-100">
            <p className="text-justify">{bio_test}</p>
          </div>
        </div>
      </div>
      <div className="flex h-[100%] w-[100%] flex-col items-center justify-center overflow-hidden p-3 pl-5 font-bold text-white">
        <div className="flex grow items-center text-center text-[300%]">
          <p>{user.name}</p>
        </div>
        <div className="max-h-0 w-[100%] rounded-md border-2 border-slate-200"></div>
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
        <ChallengeButton navigate={navigate} />
      </div>
    </div>
  );
}
