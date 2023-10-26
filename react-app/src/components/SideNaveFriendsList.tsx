import { RelationData, UserData } from "../interfaces";
import { LoadingDots } from "./Loading";
import { UserIcon } from "./UserIcon";
import { Link } from "react-router-dom";
import RelationActions, { relationStatus } from "./UserInfoCardRelations";
import { useUserFriends } from "../api/apiHooks";

export default function NavFriends({ currentUser }: { currentUser: UserData }) {
  const {
    data: friends,
    isLoading,
    isError,
  } = useUserFriends(currentUser.login42);
  if (isLoading) return <LoadingDots />;
  if (isError) return <p>Error fetching freinds</p>;
  return (
    <>
      {friends.requests.map((u) => (
        <NavRequest
          status="pending"
          currentUser={currentUser.login42}
          cardUser={u}
          key={u.login42 + "-pending"}
        />
      ))}
      {friends.pending.map((u) => (
        <NavRequest
          status="sent"
          currentUser={currentUser.login42}
          cardUser={u}
          key={u.login42 + "-sent"}
        />
      ))}
      {friends.friends.map((u) => (
        <NavRequest
          status="friends"
          currentUser={currentUser.login42}
          cardUser={u}
          key={u.login42 + "-friends"}
        />
      ))}
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
  cardUser: RelationData;
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
