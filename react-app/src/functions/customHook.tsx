import {
  deleteChatroomBan,
  deleteChatroomMember,
  deleteDMconversation,
  getChatroomBanded,
  getChatroomMessages,
  getChatrooomData,
  getChatrooomList,
  getChatrooomMemebers,
  getCurrentUser,
  getUserConversation,
  getUserConverstaionList,
  getUserConvoMessageList,
  getUserData,
  getUserFriends,
  postChatroomBan,
  postNewChatromm,
  postNewChatrommMessage,
  postNewChatroomMember,
  postUserConvoMessage,
  postUserFriendRequest,
  putChatroomRole,
  putUserFriendRequest,
  putUserProfile,
  removeUserFriend,
} from "../Api-axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ChatroomPost, IMessagePost, IPutUserProfile } from "../interfaces";

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
  });
}

export function useUserConversation(user1: string, user2: string) {
  return useQuery({
    queryKey: ["UserConversation", user1, user2],
    queryFn: () => getUserConversation(user1, user2),
    staleTime: 5 * (60 * 1000), // 5 mins
    cacheTime: 10 * (60 * 1000), // 10 mins
  });
}

export function useUserConvoMessages(user1: string, user2: string) {
  return useQuery({
    queryKey: ["UserConvoMessages", user1, user2],
    queryFn: () => getUserConvoMessageList(user1, user2),
    // staleTime: 5 * (60 * 1000), // 5 mins
    // cacheTime: 10 * (60 * 1000), // 10 mins
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

// ---------- User Relations

export function useUserFriends(user: string) {
  return useQuery({
    queryKey: ["Friends"],
    queryFn: () => getUserFriends(user),
    staleTime: 5 * (60 * 1000), // 5 mins
    cacheTime: 10 * (60 * 1000), // 10 mins
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
  });
}

export function useChatroomMemebers(id: string) {
  return useQuery({
    queryKey: ["ChatroomMemebers", id],
    queryFn: () => getChatrooomMemebers(id),
    staleTime: 5 * (60 * 1000), // 5 mins
    cacheTime: 10 * (60 * 1000), // 10 mins
  });
}

export function useChatroomMessages(id: string) {
  return useQuery({
    queryKey: ["ChatroomMessages", id],
    queryFn: () => getChatroomMessages(id),
    staleTime: 5 * (60 * 1000), // 5 mins
    cacheTime: 10 * (60 * 1000), // 10 mins
  });
}

export function useMutPostNewChatroom() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: ChatroomPost) => postNewChatromm(payload),
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
