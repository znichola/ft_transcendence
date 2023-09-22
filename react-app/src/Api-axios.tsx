import axios from "axios";
import { UserData } from "./interfaces";
import { QueryKey } from "@tanstack/react-query";

const BASE_URL = "http://localhost:3000";

export const authApi = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

export const getCurrentUser = async () =>
  authApi.get<string>("/auth/user").then((res) => res.data);

export const getUserProfile = async ({ queryKey }: { queryKey: QueryKey }) => {
  const [_key,  user ] = queryKey;
  return authApi.get<UserData[]>("/user/" + user).then((res) => res.data);
};
