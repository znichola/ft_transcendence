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

  // Calculate the time difference in seconds
  const timeDiffInSeconds = Math.floor(
    (currentTime.getTime() - inputTime.getTime()) / 1000,
  );

  if (timeDiffInSeconds <= 44) {
    return "a few seconds ago";
  } else if (timeDiffInSeconds <= 100) {
    return "a minute ago";
  } else if (timeDiffInSeconds <= 2699) {
    // 44 minutes and 59 seconds
    const minutesAgo = Math.floor((timeDiffInSeconds - 90) / 60);
    return `${minutesAgo} minutes ago`;
  } else if (timeDiffInSeconds <= 5399) {
    // 1 hour and 29 minutes
    return "an hour ago";
  } else if (timeDiffInSeconds <= 76559) {
    // 21 hours and 15 minutes
    const hoursAgo = Math.floor((timeDiffInSeconds - 5400) / 3600);
    return `${hoursAgo} hours ago`;
  } else if (timeDiffInSeconds <= 126359) {
    // 35 hours and 5 minutes
    return "a day ago";
  } else if (timeDiffInSeconds <= 2163599) {
    // 25 days
    const daysAgo = Math.floor((timeDiffInSeconds - 126360) / 86400);
    return `${daysAgo} days ago`;
  } else if (timeDiffInSeconds <= 3763599) {
    // 45 days
    return "a month ago";
  } else if (timeDiffInSeconds <= 25919999) {
    // 10 months
    const monthsAgo = Math.floor((timeDiffInSeconds - 3763600) / 2592000);
    return `${monthsAgo} months ago`;
  } else if (timeDiffInSeconds <= 44975999) {
    // 17 months
    return "a year ago";
  } else {
    const yearsAgo = Math.floor((timeDiffInSeconds - 44976000) / 31536000);
    return `${yearsAgo} years ago`;
  }
}
