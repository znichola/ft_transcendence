import axios, { HttpStatusCode } from "axios";
import {
  Converstaion,
  Converstaions,
  ConvoMessages,
  UserData,
  UserFriends,
} from "./interfaces";
import { useCurrentUser } from "./functions/customHook";

// const BASE_URL = "/api/";
const BASE_URL = "http://10.12.2.6:8080/api/";

export const authApi = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

//-------------------------------------------User-------------------------------------------------------//

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
      .catch((error) => console.log(error.toJSON));
  };
};

//--------------------------------------------Friends----------------------------------------------------//

export const getUserFriends = async (current_user: string) => {
  return authApi
    .get<UserFriends>("/user/" + current_user + "/friends")
    .then((res) => res.data)
    .catch((error) => console.log(error.toJSON));
}

export const postUserFriendRequest = async (current_user: string, login42: string) => {

  return authApi
    .post<HttpStatusCode>("/user/" + current_user + "/friends", {target: login42})
    .then((res) => res.data)
    .catch((error) => console.log(error.toJSON));
}

export const removeUserFriend = async (current_user: string, login42: string) => {

  return authApi
    .post<HttpStatusCode>("/user/" + current_user + "/friends", {target: login42})
    .then((res) => res.data)
    .catch((error) => console.log(error.toJSON));
}
//TODO : Delete et mettre dans le post
export const putUserFriendRequest = async (current_user: string, login42: string) => {

  return authApi
    .put<HttpStatusCode>("/user/" + current_user + "/friends", {target: login42})
    .then((res) => res.data)
    .catch((error) => console.log(error.toJSON));
}

//--------------------------------------------Profile----------------------------------------------------//

export const putUserProfile = async (
  login42: string | undefined,
  bio?: string,
  displayName?: string,
) => {
  return authApi
    .put<UserData>("/user/" + login42, { name: displayName, bio: bio })
    .then((res) => res.data)
    .catch((error) => console.log(error.toJSON));
};

//------------------------------------------Conversations------------------------------------------------//


export const getUserConverstaions = async (user: string) => {
  return authApi
    .get<Converstaions>("/conversations/" + user)
    .then((res) => res.data)
    .catch((error) => console.log(error.toJSON));
};

// as yet it's unused, and maybe useless
export const getUserConversation = async (user1: string, user2: string) => {
  return authApi
    .get<Converstaion>("/conversations/" + user1 + "/" + user2)
    .then((res) => res.data)
    .catch((error) => console.log(error.toJSON));
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
    .catch((error) => console.log(error.toJSON));
};

//------------------------------------------Chat Room----------------------------------------------//


// {
//   "content": "new message foobar"
// }
