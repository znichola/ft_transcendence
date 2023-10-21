import {
  deleteChatroomBan,
  deleteChatroomMember,
  deleteChatroomMute,
  deleteDMconversation,
  getChatroomBanded,
  getChatroomMessages,
  getChatrooomData,
  getChatrooomList,
  getChatroomMembers,
  getCurrentUser,
  getUserConversation,
  getUserConverstaionList,
  getUserConvoMessageList,
  getUserData,
  getUserFriends,
  postChatroomBan,
  postChatroomMute,
  postNewChatromm,
  postNewChatrommMessage,
  postNewChatroomMember,
  postUserConvoMessage,
  postUserFriendRequest,
  putChatroomRole,
  putUserFriendRequest,
  putUserProfile,
  removeUserFriend,
  getChatroomMember,
  postUserAvatar,
} from "../Api-axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { IChatroomPost, IMessagePost, IPutUserProfile } from "../interfaces";
import { AxiosError } from "axios";

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
    staleTime: 5 * (60 * 1000), // 5 mins
    cacheTime: 10 * (60 * 1000), // 10 mins
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
  const { data: currentUser } = useCurrentUser();

  return useQuery({
    queryKey: ["UserData", currentUser],
    queryFn: () => getUserData(currentUser),
    staleTime: 5 * (60 * 1000), // 5 mins
    cacheTime: 10 * (60 * 1000), // 10 mins
    enabled: !!currentUser,
  });
}

export function useUserConversations(user: string) {
  return useQuery({
    queryKey: ["UserConversations", user],
    queryFn: () => getUserConverstaionList(user),
    staleTime: 5 * (60 * 1000), // 5 mins
    cacheTime: 10 * (60 * 1000), // 10 mins
    enabled: user != "",
  });
}

export function useUserConversation(user1: string, user2: string) {
  return useQuery({
    queryKey: ["UserConversation", user1, user2],
    queryFn: () => getUserConversation(user1, user2),
    staleTime: 5 * (60 * 1000), // 5 mins
    cacheTime: 10 * (60 * 1000), // 10 mins
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
    onSuccess: () => {
      queryClient.removeQueries({
        queryKey: ["UserData", user],
      });
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
    staleTime: 5 * (60 * 1000), // 5 mins
    cacheTime: 10 * (60 * 1000), // 10 mins
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
    queryFn: () => getChatrooomList(),
    staleTime: 5 * (60 * 1000), // 5 mins
    cacheTime: 10 * (60 * 1000), // 10 mins
  });
}

export function useChatroom(id: string) {
  return useQuery({
    queryKey: ["Chatroom", id],
    queryFn: () => getChatrooomData(id),
    staleTime: 5 * (60 * 1000), // 5 mins
    cacheTime: 10 * (60 * 1000), // 10 mins
    enabled: id != "",
  });
}

export function useChatroomMembers(id: string) {
  return useQuery({
    queryKey: ["ChatroomMemebers", id],
    queryFn: () => getChatroomMembers(id),
    staleTime: 5 * (60 * 1000), // 5 mins
    cacheTime: 10 * (60 * 1000), // 10 mins
    enabled: id != "",
  });
}

export function useChatroomMember(
  id: string,
  member: string,
  handleError?: (axiosError: AxiosError) => void,
) {
  return useQuery({
    queryKey: ["ChatroomMemebers", id, member],
    queryFn: () => getChatroomMember(id, member),
    staleTime: 5 * (60 * 1000), // 5 mins
    cacheTime: 10 * (60 * 1000), // 10 mins
    enabled: id != "" && member != "",
    onError: handleError,
    retry: (count, error) => {
      return count < 5 && error.response?.status != 403;
    },
  });
}

export function useChatroomMessages(id: string) {
  return useQuery({
    queryKey: ["ChatroomMessages", id],
    queryFn: () => getChatroomMessages(id),
    staleTime: 5 * (60 * 1000), // 5 mins
    cacheTime: 10 * (60 * 1000), // 10 mins
    enabled: id != "",
  });
}

export function useMutPostNewChatroom() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: IChatroomPost) => postNewChatromm(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["ChatroomList"],
      });
    },
  });
}

export function useMutPostChatroomMessage(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: IMessagePost) => postNewChatrommMessage(id, payload),
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
        queryKey: ["ChatroomMemebers", id],
      });
    },
  });
}

// DELETE /chatroom/{id}/members/{username}
export function useMutDeleteChatroomMember(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (login42: string) => deleteChatroomMember(id, login42),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["ChatroomMemebers", id],
      });
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
        queryKey: ["ChatroomMemebers", id],
      }),
  });
}

export function useChatroomBanned(id: string) {
  return useQuery({
    queryKey: ["chatroomBannedUsers", id],
    queryFn: () => getChatroomBanded(id),
    staleTime: 5 * (60 * 1000), // 5 mins
    cacheTime: 10 * (60 * 1000), // 10 mins
    enabled: id != "",
  });
}

export function useMutPostChatroomBan(id: string, login42: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => postChatroomBan(id, login42),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["chatroomBannedUsers", id],
      });
      queryClient.invalidateQueries({
        queryKey: ["ChatroomMemebers", id],
      });
    },
  });
}

export function useMutDeleteChatroomBan(id: string, login42: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => deleteChatroomBan(id, login42),
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: ["chatroomBannedUsers", id],
      }),
  });
}

export function useMutChatroomMute(id: string, login42: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (duration: number) => postChatroomMute(id, login42, duration),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["ChatroomMemebers", id],
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
        queryKey: ["ChatroomMemebers", id],
      }),
  });
}
