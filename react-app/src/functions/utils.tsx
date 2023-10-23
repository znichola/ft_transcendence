import { TChatroomRole, TUserStatus } from "../interfaces";

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

export function randString(length: number) {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const charactersLength = characters.length;
  let result = "";

  // Create an array of 32-bit unsigned integers
  const randomValues = new Uint32Array(length);

  // Generate random values
  window.crypto.getRandomValues(randomValues);
  randomValues.forEach((value) => {
    result += characters.charAt(value % charactersLength);
  });
  return result;
}

export function convertPerms(perms: TChatroomRole | undefined) {
  return perms == undefined
    ? 0
    : perms == "MEMBER"
    ? 1
    : perms == "ADMIN"
    ? 2
    : 3;
}