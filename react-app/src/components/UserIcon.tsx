import { useNavigate } from "react-router-dom";
import { useUserData } from "../api/apiHooks";
import { UserData } from "../interfaces";
import { IconUser } from "./Icons";

type TSizes = 7 | 8 | 12;

export function UserIcon({ user, size = 7 }: { user: string; size?: TSizes }) {
  const { data: u, isSuccess } = useUserData(user);
  const navigate = useNavigate();
  if (!isSuccess) return <IconUser />;
  return (
    <img
      onClick={() => navigate("/user/" + user)}
      className={s(size) +
        " cursor-pointer rounded-full border-[3px] z-10" +
        statusColor(u.status)
      }
      src={u.avatar}
      alt={u.login42 || "undefined" + " profile image"}
    />
  );
}

function s(s: TSizes) {
  switch (s) {
    case 8: return "h-8 w-8";
    case 12: return "h-12 w-12";
    default: return "h-7 w-7"
  }
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
