import { useQuery } from "@tanstack/react-query";
import { FriendData, UserData, UserFriends } from "../interfaces";
import axios from "axios";
import { LoadingDots } from "./Loading";
import { UserIcon } from "./UserIcon";
import { Link } from "react-router-dom";
import RelationActions, { relationStatus } from "./UserInfoCardRelations";

export default function NavFriends({ currentUser }: { currentUser: UserData }) {
  const {
    data: friends,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["Friends"],
    queryFn: () =>
      axios
        .get<UserFriends>("/user/" + currentUser.login42 + "/friends")
        .then((res) => res.data),
  });
  if (isLoading) return <LoadingDots />;
  if (isError) return <p>Error fetching freinds</p>;
  return (
    <>
      {friends.requests.map((u) => (
        <NavRequest
          status="pending"
          currentUser={currentUser.login42}
          cardUser={u}
        />
      ))}
      {friends.pending.map((u) => (
        <NavRequest
          status="sent"
          currentUser={currentUser.login42}
          cardUser={u}
        />
      ))}
      {friends.friends.map((u) => (
        <NavRequest
          status="friends"
          currentUser={currentUser.login42}
          cardUser={u}
        />
      ))}
      {/* {friends.friends.map((u) => (
        <Nav
          key={u.login42}
          name={u.name}
          to={"/user/" + u.login42}
          icon={() => <UserIcon user={u.login42} />}
        />
      ))} */}
    </>
  );
}

function NavRequest({
  currentUser,
  cardUser,
  status,
}: {
  status: relationStatus;
  currentUser: string;
  cardUser: FriendData;
}) {
  return (
    <nav className="flex flex-1">
      <Link
        to={"/user/" + cardUser.login42}
        className="flex flex-grow cursor-pointer items-center border-l-rose-600 px-4 py-2 text-sm font-medium text-slate-600 outline-none transition-all duration-100 ease-in-out hover:border-l-4 hover:border-l-rose-600 hover:text-rose-600 focus:border-l-4"
      >
        <UserIcon user={cardUser.login42} />
        <p className="pl-4">{cardUser.name}</p>
      </Link>
      <RelationActions
        status={status}
        currentUser={currentUser}
        cardUser={cardUser.login42}
      />
    </nav>
  );
}
