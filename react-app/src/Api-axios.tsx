import axios from "axios";
import { Converstaions, ConvoMessages, UserData } from "./interfaces";

// const BASE_URL = "/api/";
const BASE_URL = "http://localhost:8080/api/";

export const authApi = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

export const getCurrentUser = async () =>
  authApi.get<string>("/auth/user").then((res) => res.data);

export const getUserData = async (login42: string | undefined) => {
  return authApi.get<UserData>("/user/" + login42).then((res) => res.data);
};

export const getCurrentUserData = async () => {
  return () => { // we loose the type information if we do this I think?
    authApi
      .get<string>("/auth/user")
      .then((res) => res.data)
      .then()
      .catch();
  };
};

export const putUserProfile = async (
  login42: string | undefined,
  bio?: string,
  displayName?: string,
) => {
  return authApi
    .put<UserData>("/user/" + login42, { name: displayName, bio: bio })
    .then((res) => res.data);
};

export const getUserConverstaions = async (user: string) => {
  return authApi
    .get<Converstaions>("/conversations/" + user)
    .then((res) => res.data)
    .then() // what's this then for!?
    .catch();
};

export const getUserConvoMessages = async (user1: string, user2: string) => {
  return authApi
    .get<ConvoMessages>("/conversations/" + user1 + "/" + user2 + "/messages")
    .then((res) => res.data)
    .then() // what's this then for!?
    .catch();
};
