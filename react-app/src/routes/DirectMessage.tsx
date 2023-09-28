import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router";
import { UserData } from "../interfaces";
import axios from "axios";
import { getCurrentUser } from "../Api-axios";
import { LoadingSpinnerMessage } from "../components/Loading";

export default function DirectMessage() {
  const { login42 } = useParams<"login42">();
  const { data: user } = useQuery({
    queryKey: ["currentUser"],
    queryFn: getCurrentUser,
    initialData: "default42",
  });

  const {
    data: messages,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["message history with", login42],
    queryFn: () =>
      axios
        // fix with the correct data type after
        .get<UserData>("/message/" + user + "/with/" + login42)
        .then((res) => res.data),
  });
  return (
    <div className="">
      <h1 className="text-center text-6xl text-zinc-400">
        <b>{user}'s</b> conversation with <br /> <b>{login42}</b>{" "}
      </h1>
      <div className="h-24" />
      <div className="flex justify-center text-slate-500">
        {isLoading ? (
          <LoadingSpinnerMessage message="fetching message history" />
        ) : isError ? (
          <div>
            Error Fetching your message history with <b>{login42}</b>
          </div>
        ) : (
          <div>
            Your message hostory with {login42} is here: {messages?.bio}
          </div>
        )}
      </div>
    </div>
  );
}
