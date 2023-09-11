import { UserData } from "../interfaces";
import { Avatar } from "../Profile";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { LoadingSpinnerMessage } from "../components";

export default function AllUsers() {
  const {
    data: users,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["/users"],
    queryFn: () => axios.get<UserData[]>("/user").then((res) => res.data),
  });

  if (isLoading) return <LoadingSpinnerMessage message="Loading contacts" />;
  if (isError) return <p>Error fetching contacts</p>;

  return (
    <>
      {users.map(u => (
        <UserInfo user={u} key={u.login42} />
      ))}
    </>
  );
}

export function UserInfo({ user }: { user: UserData; }) {
  return (
    <div className="m-4 flex bg-white shadow ">
      <Avatar
        size="m-2 mb-3 mt-3 w-16 h-16"
        alt={user.name}
        status={user.status}
        img={user.avatar}
      />

      <div className="flex flex-col content-center justify-center ">
        <p className="font-semibold text-slate-700">{user.name}</p>
        <Link to={"/users/" + user.login42} className="text-slate-400">
          {"@" + user.login42}
        </Link>
      </div>
    </div>
  );
}
