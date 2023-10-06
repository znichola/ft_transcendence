import { useQuery } from "@tanstack/react-query";
import { UserData, UserFriends } from "../interfaces";
import axios from "axios";
import { LoadingDots } from "./Loading";
import { Nav } from "./SideMenu";
import { UserIcon } from "./UserIcon";

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
      {friends.friends.map((u) => (
        <Nav
          key={u.login42}
          name={u.name}
          to={"/user/" + u.login42}
          icon={() => <UserIcon user={u.login42} />}
        />
      ))}
    </>
  );
}
