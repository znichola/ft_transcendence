import { TUserStatus } from "../interfaces";

export function statusColor(status: TUserStatus) {
  switch (status) {
    case "ONLINE":
      return "green-600";
    case "OFFLINE":
      return "gray-300";
    case "INGAME":
      return "blue-400";
    case "UNAVAILABLE":
      return "red-500";
    default:
      return "ping-700";
  }
}
export function isMatch(login42: string, search: string, name?: string) {
  const s = search.toLowerCase();
  return (
    search === "" ||
    login42.toLowerCase().includes(s) ||
    name?.toLocaleLowerCase()?.includes(s)
  );
}
