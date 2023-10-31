import {
  deleteChatroomBan,
  deleteChatroomMember,
  deleteChatroomMute,
  deleteDMconversation,
  getChatroomBanded,
  getChatroomMessages,
  getChatrooomData,
  getChatroomList,
  getChatroomMembers,
  getCurrentUser,
  getUserConversation,
  getUserConverstaionList,
  getUserConvoMessageList,
  getUserData,
  getUserFriends,
  postChatroomBan,
  postChatroomMute,
  postNewChatroom,
  postNewChatroomMessage,
  postNewChatroomMember,
  postUserConvoMessage,
  postUserFriendRequest,
  putChatroomRole,
  putUserFriendRequest,
  putUserProfile,
  removeUserFriend,
  getChatroomMember,
  postUserAvatar,
  getUserChatrooms,
  deleteChatroom,
  getLogout,
  getUserBlocked,
  postUserBlock,
  deleteUserBlock,
  getUserMatchHistory,
  putChatroomStatus,
  getPongGame,
} from "./axios";
import {
  QueryClient,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import {
  ChatroomStatus,
  IChatroom,
  IChatroomPost,
  IMessagePost,
  IPutUserProfile,
  TUserStatus,
  UserData,
} from "../interfaces";
import { AxiosError } from "axios";
import { useAuth, useNotification } from "../functions/contexts";

export function useCurrentUser() {
  return useQuery({
    queryKey: ["currentUser"],
    queryFn: getCurrentUser,
    // staleTime: 45 * (60 * 1000), // 45 min
    // cacheTime: 60 * (60 * 1000), // 60 mins
    // we switch this off the keep checking if we're still logged in, keeps the current user login state fresh!
    // useErrorBoundary: true,
    retry: false,
  });
}

export function useUserData(login42?: string) {
  return useQuery({
    queryKey: ["UserData", login42],
    queryFn: () => getUserData(login42),
    // staleTime: 5 * (60 * 1000), // 5 mins
    // cacheTime: 10 * (60 * 1000), // 10 mins
    enabled: login42 != "",
  });
}

// export function useInfiniUserData(params: IUsersAll) {
//   const { page, ...everythingExceptPage } = params;
//   const b = everythingExceptPage;
//   return useInfiniteQuery({
//     queryKey: ["UserList", b],
//     queryFn: getUsersAll,
//     getNextPageParam: (_, pages) => pages.length + 1,
//   });
// }

export function useCurrentUserData() {
  const currentUser = useAuth().user;

  return useQuery({
    queryKey: ["UserData", currentUser],
    queryFn: () => getUserData(currentUser),
    // staleTime: 5 * (60 * 1000), // 5 mins
    // cacheTime: 10 * (60 * 1000), // 10 mins
    enabled: currentUser != null && !!currentUser,
  });
}

export function useUserConversations(user: string) {
  return useQuery({
    queryKey: ["UserConversations", user],
    queryFn: () => getUserConverstaionList(user),
    // staleTime: 5 * (60 * 1000), // 5 mins
    // cacheTime: 10 * (60 * 1000), // 10 mins
    enabled: user != "",
  });
}

export function useUserConversation(user1: string, user2: string) {
  return useQuery({
    queryKey: ["UserConversation", user1, user2],
    queryFn: () => getUserConversation(user1, user2),
    // staleTime: 5 * (60 * 1000), // 5 mins
    // cacheTime: 10 * (60 * 1000), // 10 mins
    enabled: user1 != "" && user2 != "",
  });
}

export function useUserConvoMessages(user1: string, user2: string) {
  return useQuery({
    queryKey: ["UserConvoMessages", user1, user2],
    queryFn: () => getUserConvoMessageList(user1, user2),
    // staleTime: 5 * (60 * 1000), // 5 mins
    // cacheTime: 10 * (60 * 1000), // 10 mins
    enabled: user1 != "" && user2 != "",
  });
}

export function usePostUserConvoMessage(user1: string, user2: string) {
  const queryClient = useQueryClient();

  // https://tkdodo.eu/blog/mastering-mutations-in-react-query
  return useMutation({
    mutationFn: ({
      user1,
      user2,
      content,
    }: {
      user1: string;
      user2: string;
      content: string;
    }) => postUserConvoMessage(user1, user2, content),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["UserConvoMessages", user1, user2],
      });
      queryClient.invalidateQueries({
        queryKey: ["UserConversations", user1],
      });
    },
  });
}

export function useMutDeleteUserDMs(user1: string, user2: string) {
  const queryClient = useQueryClient();

  // https://tkdodo.eu/blog/mastering-mutations-in-react-query
  return useMutation({
    mutationFn: ({ user1, user2 }: { user1: string; user2: string }) =>
      deleteDMconversation(user1, user2),
    onSuccess: () => {
      queryClient.removeQueries({
        queryKey: ["UserConvoMessages", user1, user2],
      });
      queryClient.invalidateQueries({
        queryKey: ["UserConversations", user1],
      });
    },
  });
}

export function useMutUserProfile(user: string) {
  const queryClient = useQueryClient();
  return useMutation({
    retry: false,
    mutationFn: (paylaod: IPutUserProfile) => putUserProfile(user, paylaod),
    onSuccess: (_, variables) => {
      queryClient.setQueryData(
        ["UserData", user],
        (oldProfil: UserData | undefined) =>
          oldProfil
            ? {
                ...oldProfil,
                name: variables?.name || oldProfil.name,
                bio: variables?.bio || oldProfil.bio,
              }
            : oldProfil,
      );
    },
  });
}

export function useMutUserAvatar(user: string) {
  const queryClient = useQueryClient();
  return useMutation({
    retry: false,
    mutationFn: (file: File) => postUserAvatar(user, file),
    onSuccess: () => {
      queryClient.removeQueries({
        queryKey: ["UserData", user],
      });
    },
  });
}

// ---------- User Relations

export function useUserFriends(user: string) {
  return useQuery({
    queryKey: ["Friends"],
    queryFn: () => getUserFriends(user),
    // staleTime: 5 * (60 * 1000), // 5 mins
    // cacheTime: 10 * (60 * 1000), // 10 mins
    enabled: user != "",
  });
}

export function useUserBlocked(user: string) {
  return useQuery({
    queryKey: ["Blocked"],
    queryFn: () => getUserBlocked(user),
    // staleTime: 5 * (60 * 1000), // 5 mins
    // cacheTime: 10 * (60 * 1000), // 10 mins
    enabled: user != "",
  });
}

export function useMutPostUserFriendRequest() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      current_user,
      target_user,
    }: {
      current_user: string;
      target_user: string;
    }) => postUserFriendRequest(current_user, target_user),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["Friends"],
      });
    },
  });
}

export function useUserMatchHistory(login42: string) {
  return useQuery({
    queryKey: ["UserMatchHistory", login42],
    queryFn: () => getUserMatchHistory(login42),
    // staleTime: 5 * (60 * 1000), // 5 mins
    // cacheTime: 10 * (60 * 1000), // 10 mins
    enabled: login42 != "",
  });
}

export function useMutPutUserFriendRequest() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      current_user,
      target_user,
    }: {
      current_user: string;
      target_user: string;
    }) => putUserFriendRequest(current_user, target_user),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["Friends"],
      });
    },
  });
}

export function useMutDeleteUserFriendRequest() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      current_user,
      target_user,
    }: {
      current_user: string;
      target_user: string;
    }) => removeUserFriend(current_user, target_user),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["Friends"],
      });
    },
  });
}

// --------- chatrooms / chat

export function useChatroomList() {
  return useQuery({
    queryKey: ["ChatroomList"],
    queryFn: () => getChatroomList(),
    // staleTime: 5 * (60 * 1000), // 5 mins
    // cacheTime: 10 * (60 * 1000), // 10 mins
  });
}

export function useChatroom(
  id: string,
  handleError?: (axiosError: AxiosError) => void,
) {
  return useQuery({
    queryKey: ["Chatroom", id],
    queryFn: () => getChatrooomData(id),
    // staleTime: 5 * (60 * 1000), // 5 mins
    // cacheTime: 10 * (60 * 1000), // 10 mins
    enabled: id != "",
    onError: handleError,
    retry: (count, error) => {
      const error_value = error.response?.status;
      return count < 5 && error_value != 403 && error_value != 404;
    },
  });
}

export function useChatroomMembers(id: string) {
  return useQuery({
    queryKey: ["ChatroomMembers", id],
    queryFn: () => getChatroomMembers(id),
    // staleTime: 5 * (60 * 1000), // 5 mins
    // cacheTime: 10 * (60 * 1000), // 10 mins
    enabled: id != "",
  });
}

export function useChatroomMember(
  id: string,
  member: string,
  handleError?: (axiosError: AxiosError) => void,
) {
  return useQuery({
    queryKey: ["ChatroomMembers", id, member],
    queryFn: () => getChatroomMember(id, member),
    // staleTime: 5 * (60 * 1000), // 5 mins
    // cacheTime: 10 * (60 * 1000), // 10 mins
    enabled: id != "" && member != "",
    onError: handleError,
    retry: (count, error) => {
      const error_value = error.response?.status;
      return count < 5 && error_value != 403 && error_value != 404;
    },
  });
}

export function useUserChatrooms(
  login42: string, //TODO: enlever si api le permet
  handleError?: (axiosError: AxiosError) => void,
) {
  return useQuery({
    queryKey: ["UserChatrooms"],
    queryFn: () => getUserChatrooms(login42),
    // staleTime: 5 * (60 * 1000), // 5 mins
    // cacheTime: 10 * (60 * 1000), // 10 mins
    enabled: login42 != "",
    onError: handleError,
  });
}

export function useChatroomMessages(id: string) {
  return useQuery({
    queryKey: ["ChatroomMessages", id],
    queryFn: () => getChatroomMessages(id),
    // staleTime: 5 * (60 * 1000), // 5 mins
    // cacheTime: 10 * (60 * 1000), // 10 mins
    enabled: id != "",
  });
}

export function useMutPostNewChatroom() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: IChatroomPost) => postNewChatroom(payload),
    onSuccess: (res) => {
      queryClient.invalidateQueries({
        queryKey: ["ChatroomList"],
      });
      queryClient.setQueryData(
        ["UserChatrooms"],
        (oldChatrooms: IChatroom[] | undefined) =>
          oldChatrooms ? oldChatrooms.concat(res) : oldChatrooms,
      );
    },
  });
}

export function useMutPostChatroomMessage(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: IMessagePost) => postNewChatroomMessage(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["ChatroomMessages", id],
      });
    },
  });
}

// this is just intaine!

// POST /chatroom/{id}/members
export function useMutPostChatroomMember(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (login42: string) =>
      postNewChatroomMember(id, { login42: login42 }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["ChatroomMembers", id],
      });
    },
  });
}

// DELETE /chatroom/{id}/members/{username}
export function useMutDeleteChatroomMember(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      login42,
      selfDelete = false,
    }: {
      login42: string;
      selfDelete?: boolean;
    }) => {
      selfDelete; // Only to prevent debug error
      return deleteChatroomMember(id, login42);
    },
    onSuccess: (_, variables) => {
      if (variables.selfDelete) {
        queryClient.removeQueries({
          queryKey: ["ChatroomMembers", id],
        });
        queryClient.removeQueries({
          queryKey: ["ChatroomMessages", id],
        });
        queryClient.removeQueries({
          queryKey: ["ChatroomBannedUsers", id],
        });
        queryClient.setQueriesData(
          ["UserChatrooms"],
          (old_chatrooms: IChatroom[] | undefined) =>
            old_chatrooms
              ? old_chatrooms.filter((c) => {
                  return c.id.toString() != id;
                })
              : old_chatrooms,
        );
      } else {
        queryClient.invalidateQueries({
          queryKey: ["ChatroomMembers", id],
        });
      }
    },
  });
}

// PUT /chatroom/{id}/members/{username}/role
export function useMutPutChatroomRole(id: string, login42: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (
      role: "MEMBER" | "ADMIN", // can only have one argument
    ) => putChatroomRole(id, login42, role),
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: ["ChatroomMembers", id],
      }),
  });
}

export function useChatroomBanned(id: string) {
  return useQuery({
    queryKey: ["ChatroomBannedUsers", id],
    queryFn: () => getChatroomBanded(id),
    // staleTime: 5 * (60 * 1000), // 5 mins
    // cacheTime: 10 * (60 * 1000), // 10 mins
    enabled: id != "",
  });
}

export function useMutPostChatroomBan(id: string, login42: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => postChatroomBan(id, login42),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["ChatroomBannedUsers", id],
      });
      queryClient.invalidateQueries({
        queryKey: ["ChatroomMembers", id],
      });
    },
  });
}

export function useMutDeleteChatroom(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => deleteChatroom(id),
    onSuccess: () => {
      queryClient.removeQueries({
        queryKey: ["Chatroom", id],
      });
      queryClient.setQueryData(
        ["ChatroomList"],
        (oldList: IChatroom[] | undefined) =>
          oldList ? oldList.filter((c) => c.id.toString() != id) : oldList,
      );
      queryClient.removeQueries({
        queryKey: ["ChatroomMembers", id],
      });
      queryClient.removeQueries({
        queryKey: ["ChatroomMessages", id],
      });
      queryClient.removeQueries({
        queryKey: ["ChatroomBannedUsers", id],
      });
      queryClient.setQueriesData(
        ["UserChatrooms"],
        (old_chatrooms: IChatroom[] | undefined) =>
          old_chatrooms
            ? old_chatrooms.filter((c) => {
                return c.id.toString() != id;
              })
            : old_chatrooms,
      );
    },
  });
}

export function useMutDeleteChatroomBan(id: string, login42: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => deleteChatroomBan(id, login42),
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: ["ChatroomBannedUsers", id],
      }),
  });
}

export function useMutChatroomMute(id: string, login42: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (duration: number) => postChatroomMute(id, login42, duration),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["ChatroomMembers", id],
      });
    },
  });
}

export function useMutDeleteChatroomMute(id: string, login42: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => deleteChatroomMute(id, login42),
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: ["ChatroomMembers", id],
      }),
  });
}

export function useMutJoinChatroom() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      chatroom,
      payload,
    }: {
      chatroom: IChatroom;
      payload: { login42: string; password: string };
    }) => postNewChatroomMember(chatroom.id.toString(), payload),
    onSuccess: (_, variables) => {
      queryClient.setQueryData(
        ["UserChatrooms"],
        (oldChatrooms: IChatroom[] | undefined) =>
          oldChatrooms ? oldChatrooms.concat(variables.chatroom) : oldChatrooms,
      );
    },
  });
}

export function useMutChangeChatroomStatus(chatroom: IChatroom) {
  const queryClient = useQueryClient();
  const { addNotif } = useNotification();
  return useMutation({
    mutationFn: async (payload: { status: ChatroomStatus; password: string }) =>
      putChatroomStatus(chatroom.id.toString(), payload),
    onSuccess: (_, variables) => {
      const newChatroom: IChatroom = { ...chatroom, status: variables.status };
      addNotif({ type: "SUCCESS", message: "Chatroom status changed !" });
      // queryClient.setQueryData(
      //   ["UserChatrooms"],
      //   (oldChatrooms: IChatroom[] | undefined) =>
      //     oldChatrooms ? oldChatrooms.map((c) => (c.id.toString() == chatroom.id.toString()) ? newChatroom : c) : oldChatrooms,
      // );
      queryClient.setQueryData(
        ["Chatroom", chatroom.id.toString()],
        (oldChatroom: IChatroom | undefined) => {
          return oldChatroom ? newChatroom : oldChatroom;
        },
      );
      queryClient.refetchQueries(["ChatroomList"]); //TODO: optimiser à l'occasion
    },
  });
}

export function useMutBlockUser(currentUser: string, target: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => postUserBlock(currentUser, target),
    onSuccess: () => {
      queryClient.setQueryData(
        ["Blocked"],
        (oldBlocked: string[] | undefined) =>
          oldBlocked ? oldBlocked.concat(target) : oldBlocked,
      );
    },
  });
}

export function useMutUnblockUser(currentUser: string, target: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => deleteUserBlock(currentUser, target),
    onSuccess: () => {
      queryClient.setQueryData(
        ["Blocked"],
        (oldBlocked: string[] | undefined) =>
          oldBlocked ? oldBlocked.filter((s) => s != target) : oldBlocked,
      );
    },
  });
}

export function useMutLogout() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => getLogout(),
    onSuccess: () => {
      //console.log("Successfully logout !");
      queryClient.clear();
    }
  });
}

export function setStatus(qc: QueryClient, user: string, status: TUserStatus) {
  qc.setQueryData(["UserData", user], (oldUser: UserData | undefined) =>
    oldUser ? { ...oldUser, status: status } : oldUser,
  );
}

export function usePongGame(id?: string) {
  return useQuery({
    queryKey: ["PongGame", id],
    queryFn: () => getPongGame(id),
    retry: false,
  });
}
