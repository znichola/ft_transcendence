import axios from "axios";
import {
  Converstaion,
  Converstaions,
  ConvoMessages,
  UserData,
} from "./interfaces";

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
  return () => {
    // we loose the type information if we do this I think?
    authApi
      .get<string>("/auth/user")
      .then((res) => res.data)
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
    .catch();
};

// as yet it's unused, and maybe useless
export const getUserConverstaion = async (user1: string, user2: string) => {
  return authApi
    .get<Converstaion>("/conversations/" + user1 + "/" + user2)
    .then((res) => res.data)
    .catch();
};

export const getUserConvoMessages = async (user1: string, user2: string) => {
  return authApi
    .get<ConvoMessages>("/conversations/" + user1 + "/" + user2 + "/messages")
    .then((res) => {
      if (res.status == 404) {
        console.log("caught the 404 here");
        return [];
      }
      return res.data;
    })
    .catch((e) => {
      if (e.response.status == 404) return [];
      else throw e;
    });
};

export const postUserConvoMessage = async (
  user1: string,
  user2: string,
  message: string,
) => {
  return authApi
    .post<string>("/conversations/" + user1 + "/" + user2 + "/messages", {
      content: message,
    })
    .then()
    .catch();
};

// {
//   "content": "new message foobar"
// }
