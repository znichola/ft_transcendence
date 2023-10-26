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

export function timeAgo(time: string): string {
  const currentTime = new Date();
  const inputTime = new Date(time);

  const timeDiffInSeconds = Math.floor(
    (currentTime.getTime() - inputTime.getTime()) / 1000,
  );

  const HOUR = 3600;
  const DAY = 86400;
  const MONTH = 2.628e6;
  const YEAR = 3.154e7;

  if (timeDiffInSeconds <= 50) {
    return "a few seconds ago";
  } else if (timeDiffInSeconds <= 100) {
    return "a minute ago";
  } else if (timeDiffInSeconds <= 55 * 60) {
    return `${Math.floor(timeDiffInSeconds / 60)} minutes ago`;
  } else if (timeDiffInSeconds <= 1.5 * HOUR) {
    return "an hour ago";
  } else if (timeDiffInSeconds <= 21 * HOUR) {
    return `${Math.floor(timeDiffInSeconds / HOUR)} hours ago`;
  } else if (timeDiffInSeconds <= 1.2 * DAY) {
    return "a day ago";
  } else if (timeDiffInSeconds <= 27 * DAY) {
    return `${Math.floor(timeDiffInSeconds / DAY)} days ago`;
  } else if (timeDiffInSeconds <= 1.2 * MONTH) {
    return "a month ago";
  } else if (timeDiffInSeconds <= 11.8 * MONTH) {
    return `${Math.floor(timeDiffInSeconds / MONTH)} months ago`;
  } else if (timeDiffInSeconds <= 1.9 * YEAR) {
    return "a year ago";
  } else {
    return `${Math.floor(timeDiffInSeconds / YEAR)} years ago`;
  }
}
