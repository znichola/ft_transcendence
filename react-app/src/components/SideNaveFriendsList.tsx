import { useQuery } from "@tanstack/react-query";
import { UserData, UserFriend } from "../interfaces";
import axios from "axios";
import { LoadingDots } from "./Loading";
import { Nav } from "./SideMenu";

export default function NavFriends({ currentUser }: { currentUser: UserData }) {
  const {
    data: friends,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["users"],
    queryFn: () => axios.get<UserFriend>("/user/" + currentUser.login42 +"/friends").then((res) => res.data),
  });
  if (isLoading) return <LoadingDots/>
  if (isError) return <p>Error fetching freinds</p>
  
    function statusColor(status : UserData["status"]) {
    switch (status) {
      case "ONLINE":
        return "ring-green-600";
      case "OFFLINE":
        return "ring-gray-300";
      case "INGAME":
        return "ring-blue-400";
      case "UNAVAILABLE":
        return "ring-red-500";
      default:
        return "ring-ping-700";
    }
  }
  
  console.log(friends)

  return (
    <>
      {friends.friends.map((u) => (
        <Nav
          key={u.login42}
          name={u.name}
          to={"/user/" + u.login42}
          icon={() => (
            <img
              className={
                "h-5 w-5 rounded-full ring-2" + " " + statusColor(u.status)}
              src={u.avatar}
              alt={u.login42 || "undefined" + " profile image"}
            />
          )}
        />
      ))}
    </>
  );
}
