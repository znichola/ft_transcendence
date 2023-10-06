import { useUserData } from "../functions/customHook";
import { UserData } from "../interfaces";
import { IconUser } from "./Icons";

export function UserIcon({ user }: { user: string }) {
  const { data: u, isSuccess } = useUserData(user);
  if (!isSuccess) return <IconUser />;
  return (
    <img
      className={"h-5 w-5 rounded-full ring-2" + " " + statusColor(u.status)}
      src={u.avatar}
      alt={u.login42 || "undefined" + " profile image"}
    />
  );
}

function statusColor(status: UserData["status"]) {
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
