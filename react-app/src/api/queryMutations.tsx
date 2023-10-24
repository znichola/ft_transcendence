import { QueryClient } from "@tanstack/react-query";
import { TUserStatus, UserData } from "../interfaces";

export function setStatus(qc: QueryClient, user: string, status: TUserStatus) {
  qc.setQueryData(["UserData", user], (oldUser: UserData | undefined) =>
    oldUser ? { ...oldUser, status: status } : oldUser,
  );
}
