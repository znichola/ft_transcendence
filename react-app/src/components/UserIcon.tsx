import { Link, useNavigate } from "react-router-dom";
import { useUserData } from "../functions/customHook";
import { UserData } from "../interfaces";
import { IconUser } from "./Icons";

export function UserIcon({ user }: { user: string }) {
  const { data: u, isSuccess } = useUserData(user);
  const navigate = useNavigate();
  if (!isSuccess) return <IconUser />;
  return (
    <img
      onClick={() => navigate("/user/" + user)}
      className={"h-7 w-7 rounded-full border-[3px] " + statusColor(u.status)}
      src={u.avatar}
      alt={u.login42 || "undefined" + " profile image"}
    />
  );
}

function statusColor(status: UserData["status"]) {
  switch (status) {
    case "ONLINE":
      return "border-green-600";
    case "OFFLINE":
      return "border-gray-300";
    case "INGAME":
      return "border-blue-400";
    case "UNAVAILABLE":
      return "border-red-500";
    default:
      return "border-ping-700";
  }
}
