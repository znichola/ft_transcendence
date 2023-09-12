import { UserData } from "../interfaces";
import { useParams } from "react-router-dom";
import axios from "axios";
import { LoadingSpinnerMessage } from "../components";
import { useQuery } from "@tanstack/react-query";

export default function Contact() {
  const { login42 } = useParams<"login42">();
  const {
    data: user,
    isLoading,
    isError,
  } = useQuery({
    queryKey: [login42],
    queryFn: () => axios.get<UserData>("/user/" + login42).then((res) => res.data)
  });

	if (isLoading) return <LoadingSpinnerMessage message="Loading Profile"/>
	if (isError) return(
			<p className="text-red-600 text-3xl">Error when loading page</p>
	);

  return (
		<div className="flex w-[100%] h-[100%] flex-col items-center p-5 gap-5 bg-slate-200">
			<img className="rounded-2xl w-[90%] max-h-[25%] object-cover bg-red-100 shadow-md"
				key={user.id}
				src={user.avatar}
				alt={user.login42}
			/>

			<div className="flex w-[90%] h-[25%] max-h-[25%] justify-center items-center gap-7 pt-2">
				<div className="flex grow h-[100%] bg-teal-300 justify-center items-center rounded-md shadow-md">
					<p className="text-3xl font-mono">Match History</p>
				</div>
				<div className="flex grow h-[100%] bg-lime-300 justify-center items-center rounded-md shadow-md">
					<p className="text-3xl font-mono">Messages</p>
				</div>
			</div>
		</div>
  );
}
