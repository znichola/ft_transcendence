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
} from "./interfaces";

// const BASE_URL = "/api/";
const BASE_URL = import.meta.env.VITE_SITE_URL + "/api/";
console.log(BASE_URL);

export const authApi = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

authApi.interceptors.response.use(
  function (response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    return response;
  },
  function (error) {
    // const foo = useAuth();

    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    if (error.response.status) {
      // console.log(401, "error found baby!");
      // user?.logOut();
      // foo?.logOut()
      // console.log(AuthContext);
      console.log("Error intercepted:", error.response.status);
    }
    return Promise.reject(error);
    // https://stackoverflow.com/questions/62888255/how-to-use-react-usecontext-in-a-function-that-does-not-render-any-components
  },
);

//-------------------------------------------User-------------------------------------------------------//

// TODO: this seems very wrong, it should not just return the res.data, what if the call failes?
export const getCurrentUser = async () =>
  authApi.get<string>("/auth/user").then((res) => {
    console.log("Get current user : ", res.data);
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

export const postUserQR = async (user: string) => {
  return authApi.post<File>(`/tfa/${user}`).then((r) => r.data);
};

//--------------------------------------------Friends----------------------------------------------------//

export const getUserFriends = async (current_user: string) => {
  return authApi
    .get<UserFriends>("/user/" + current_user + "/friends")
    .then((res) => res.data);
  // .catch((error) => console.log(error.toJSON));
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

export const getChatrooomList = async () => {
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

export const getChatroomMessages = async (id: string) => {
  return authApi
    .get<IMessage[]>("/chatroom/" + id + "/messages")
    .then((res) => res.data);
  // .catch((error) => console.log(error.toJSON));
};

export const postNewChatromm = async (payload: IChatroomPost) => {
  return authApi.post<IChatroom>("/chatroom/", payload).then((res) => res.data);
  // .catch((error) => console.log(error.toJSON));
};

export const postNewChatrommMessage = async (
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
  payload: { login42: string },
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
