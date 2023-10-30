import axios, { HttpStatusCode } from "axios";
import {
  IChatroom,
  IChatroomPost,
  Converstaion,
  ConvoMessage,
  UserData,
  UserFriends,
  IMessage,
  IMessagePost,
  IMember,
  IUsersAll,
  IPutUserProfile,
  IGameState,
  IGameHistory,
  ChatroomStatus,
} from "../interfaces";

// const BASE_URL = "/api/";
const BASE_URL = import.meta.env.VITE_SITE_URL + "/api/";
console.log(BASE_URL);

export const authApi = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

//-------------------------------------------User-------------------------------------------------------//

export const getLogout = async () => {
  authApi.get<string>("/auth/logout").then((r) => {
    r.data;
  });
};

// TODO: this seems very wrong, it should not just return the res.data, what if the call failes?
export const getCurrentUser = async () =>
  authApi.get<string>("/auth/user").then((res) => {
    return res.data;
  });

export const getUserData = async (login42: string | undefined) => {
  return authApi.get<UserData>("/user/" + login42).then((res) => res.data);
};

export const getUsersAll = async (params: IUsersAll) => {
  return authApi
    .get<string[]>("/user/", { params: params })
    .then((res) => res.data);
};

export const getUserToken = async () => {
  return authApi.get<string>("/auth/token").then((r) => r.data);
};

// not used!
export const getUserQRcode = async (user: string) => {
  return authApi.get<File>(`/tfa/${user}`).then((r) => r.data);
};

export const postTFACodeLogin = async (user: string, code: string) => {
  return authApi
    .post<HttpStatusCode>(`/tfa/${user}/login`, { tfaCode: code })
    .then((r) => r.data);
};

export const postTFACodeEnable = async (user: string, code: string) => {
  return authApi
    .post<HttpStatusCode>(`/tfa/${user}/enable`, { tfaCode: code })
    .then((r) => r.data);
};

export const patchTFACodeDisable = async (user: string) => {
  return authApi
    .patch<HttpStatusCode>(`/tfa/${user}/disable`)
    .then((r) => r.data);
};

//--------------------------------------------Friends----------------------------------------------------//

export const getUserFriends = async (current_user: string) => {
  return authApi
    .get<UserFriends>("/user/" + current_user + "/friends")
    .then((res) => res.data);
  // .catch((error) => console.log(error.toJSON));
};

export const getUserBlocked = async (current_user: string) => {
  return authApi
    .get<string[]>("/user/" + current_user + "/block")
    .then((res) => res.data);
};

export const getUserMatchHistory = async (login42: string) => {
  return authApi
    .get<IGameHistory[]>("/pong/history/" + login42)
    .then((res) => res.data);
};

export const postUserFriendRequest = async (
  current_user: string,
  login42: string,
) => {
  return authApi
    .post<HttpStatusCode>("/user/" + current_user + "/friends/" + login42)
    .then((res) => res.data);
  // .catch((error) => console.log(error.toJSON));
};

export const removeUserFriend = async (
  current_user: string,
  login42: string,
) => {
  return authApi
    .delete<HttpStatusCode>("/user/" + current_user + "/friends/" + login42)
    .then((res) => res.data);
  // .catch((error) => console.log(error.toJSON));
};
//TODO : Delete et mettre dans le post
export const putUserFriendRequest = async (
  current_user: string,
  login42: string,
) => {
  return authApi
    .put<HttpStatusCode>("/user/" + current_user + "/friends/" + login42)
    .then((res) => res.data);
  // .catch((error) => console.log(error.toJSON));
};

export const postUserBlock = async (current_user: string, target: string) => {
  return authApi
    .post<HttpStatusCode>("/user/" + current_user + "/block/" + target)
    .then((res) => res.data);
};

export const deleteUserBlock = async (current_user: string, target: string) => {
  return authApi
    .delete<HttpStatusCode>("/user/" + current_user + "/block/" + target)
    .then((res) => res.data);
};

//--------------------------------------------Profile----------------------------------------------------//

export const putUserProfile = async (
  login42: string | undefined,
  payload: IPutUserProfile,
) => {
  return authApi
    .put<UserData>("/user/" + login42, payload)
    .then((res) => res.data);
  // .catch((error) => console.log(error.toJSON));
};

// const formData = new FormData();
//     formData.append("selectedFile", selectedFile);
//     try {
//       const response = await axios({
//         method: "post",
//         url: "/api/upload/file",
//         data: formData,
//         headers: { "Content-Type": "multipart/form-data" },
//       });
//     } catch(error) {
//       console.log(error)
//     }

export const postUserAvatar = async (login42: string, file: File) => {
  const formData = new FormData();
  formData.append("file", file);
  return authApi
    .post<HttpStatusCode>(`/user/${login42}/avatar`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
    .then((r) => r.data);
};

//------------------------------------------Conversations------------------------------------------------//

export const getUserConverstaionList = async (user: string) => {
  return authApi.get<Converstaion[]>("/dm/" + user).then((res) => res.data);
  // .catch((error) => console.log(error.toJSON));
};

// as yet it's unused, and maybe useless
export const getUserConversation = async (user1: string, user2: string) => {
  return authApi
    .get<Converstaion>("/dm/" + user1 + "/" + user2)
    .then((res) => res.data);
  // .catch((error) => console.log(error.toJSON));
};

export const getUserConvoMessageList = async (user1: string, user2: string) => {
  return authApi
    .get<ConvoMessage[]>("/dm/" + user1 + "/" + user2 + "/messages")
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
    .post<string>("/dm/" + user1 + "/" + user2 + "/messages", {
      content: message,
    })
    .then();
  // .catch((error) => console.log(error.toJSON));
};

export const deleteDMconversation = async (user1: string, user2: string) => {
  return authApi.delete<HttpStatusCode>("/dm/" + user1 + "/" + user2).then();
  // .catch((error) => console.log(error.toJSON));
};

//------------------------------------------Chat Room----------------------------------------------//

// {
//   "content": "new message foobar"
// }

export const getChatroomList = async () => {
  return authApi.get<IChatroom[]>("/chatroom/").then((res) => res.data);
};

export const getChatrooomData = async (id: string) => {
  return authApi.get<IChatroom>("/chatroom/" + id).then((res) => res.data);
};

export const getChatroomMembers = async (id: string) => {
  return authApi
    .get<IMember[]>("/chatroom/" + id + "/members")
    .then((res) => res.data);
};

export const getChatroomMember = async (id: string, member: string) => {
  return authApi
    .get<IMember>("/chatroom/" + id + "/members/" + member)
    .then((res) => res.data);
};

export const getUserChatrooms = async (login42: string) => {
  return authApi
    .get<IChatroom[]>("/user/" + login42 + "/chatrooms/")
    .then((res) => res.data);
};

export const getChatroomMessages = async (id: string) => {
  return authApi
    .get<IMessage[]>("/chatroom/" + id + "/messages")
    .then((res) => res.data);
  // .catch((error) => console.log(error.toJSON));
};

export const postNewChatroom = async (payload: IChatroomPost) => {
  return authApi.post<IChatroom>("/chatroom/", payload).then((res) => res.data);
  // .catch((error) => console.log(error.toJSON));
};

export const deleteChatroom = async (id: string) => {
  return authApi
    .delete<HttpStatusCode>("/chatroom/" + id)
    .then((res) => res.data);
};

export const postNewChatroomMessage = async (
  id: string,
  payload: IMessagePost,
) => {
  return authApi
    .post<HttpStatusCode>("/chatroom/" + id + "/messages", payload)
    .then((res) => res.data);
  // .catch((error) => console.log(error.toJSON));
};

// insanity, totall insanity

// POST /chatroom/{id}/members
export const postNewChatroomMember = async (
  id: string,
  payload: { login42: string; password?: string },
) => {
  return authApi
    .post<HttpStatusCode>("/chatroom/" + id + "/members", payload)
    .then((res) => res.data);
};

// DELETE /chatroom/{id}/members/{username}
export const deleteChatroomMember = async (id: string, login42: string) => {
  return authApi
    .delete<HttpStatusCode>("/chatroom/" + id + "/members/" + login42)
    .then((res) => res.data);
};

export const putChatroomStatus = async (
  id: string,
  payload: { status: string; password: string },
) => {
  return authApi
    .put<HttpStatusCode>("/chatroom/" + id + "/visibility", payload)
    .then((res) => res.data);
};

export const putChatroomRole = async (
  id: string,
  login42: string,
  role: "MEMBER" | "ADMIN",
) => {
  return authApi
    .put<HttpStatusCode>("/chatroom/" + id + "/members/" + login42 + "/role", {
      role: role,
    })
    .then((res) => res.data);
};

export const getChatroomBanded = async (id: string) => {
  return authApi
    .get<string[]>(`/chatroom/${id}/banned`)
    .then((res) => res.data);
};

export const postChatroomBan = async (id: string, login42: string) => {
  return authApi
    .post<HttpStatusCode>(`/chatroom/${id}/banned`, {
      login42: login42,
    })
    .then((rest) => rest.data);
};

export const deleteChatroomBan = async (id: string, login42: string) => {
  return authApi
    .delete<HttpStatusCode>(`/chatroom/${id}/banned/${login42}`)
    .then((res) => res.data);
};

export const postChatroomMute = async (
  id: string,
  login42: string,
  duration: number,
) => {
  return authApi
    .post<HttpStatusCode>(`/chatroom/${id}/muted`, {
      login42: login42,
      durationInSeconds: duration,
    })
    .then((res) => res.data);
};

export const deleteChatroomMute = async (id: string, login42: string) => {
  return authApi
    .delete<HttpStatusCode>(`/chatroom/${id}/muted/${login42}`)
    .then((res) => res.data);
};
