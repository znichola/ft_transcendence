import { useParams } from "react-router";
import { getCurrentUser } from "../Api-axios";
import { useQuery } from "@tanstack/react-query";
import { UserData } from "../interfaces";
import axios from "axios";
import { LoadingSpinnerMessage } from "../components/Loading";
import PlayPong from "./PlayPong";

export default function PongDuel() {
  const { player1_login42: p1 } = useParams<"player1_login42">();
  const { player2_login42: p2 } = useParams<"player2_login42">();
  // const { game_mode: gm } = useParams<"game_mode">();
  // const { data: user } = useQuery({
  //   queryKey: ["currentUser"],
  //   queryFn: getCurrentUser,
  //   initialData: "default42",
  // });

  // const {
  //   data: gameData,
  //   isLoading,
  //   isError,
  // } = useQuery({
  //   queryKey: ["gameData", p1, "vs", p2],
  //   queryFn: () =>
  //     axios
  //       // fix with corrent type and query
  //       .get<UserData>("/pong/" + p1 + "/vs/" + p2)
  //       .then((res) => res.data),
  // });

  // if (isLoading) {
  //   return (
  //     <div className="text-center">
  //       <h1 className="text-8xl text-fuchsia-300">
  //         <b>{p1}</b> vs <b>{p2}</b>
  //       </h1>
  //       <div className="h-16" />
  //       <p className="text-2xl text-slate-500">
  //         {p1 == user || p2 == user
  //           ? user + " is fighting in the game"
  //           : user + " is spectating the game"}
  //       </p>
  //       <div className="h-16" />
  //       <div className="flex justify-center text-slate-500">
  //         {<LoadingSpinnerMessage message="fetching game data" />}
  //       </div>
  //     </div>
  //   );
  // }

  // if (isError || !p1 || !p2) {
  //   return(
  //     <div className="text-center">
  //       <h1 className="text-4xl text-fuchsia-300">
  //         <b>An error occured during game loading !<br/>Please retry</b>
  //       </h1>
  //     </div>
  //   );
  // }

  return(
    <PlayPong player1={p1 || ""} player2={p2 || "" }/>
  );
}
