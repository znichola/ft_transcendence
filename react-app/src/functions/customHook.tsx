import {
  deleteDMconversation,
  getChatrooomList,
  getCurrentUser,
  getUserConversation,
  getUserConverstaionList,
  getUserConvoMessageList,
  getUserData,
  postNewChatromm,
  postUserConvoMessage,
  postUserFriendRequest,
  putUserFriendRequest,
  removeUserFriend,
} from "../Api-axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ChatroomPost } from "../interfaces";

export function useCurrentUser() {
  return useQuery({
    queryKey: ["currentUser"],
    queryFn: getCurrentUser,
    // staleTime: 45 * (60 * 1000), // 45 min
    // cacheTime: 60 * (60 * 1000), // 60 mins
    initialData: "default42", // TODO : Au cas ou on est pas connecté
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
    mutationFn: ({
      user1,
      user2,
    }: {
      user1: string;
      user2: string;
    }) => deleteDMconversation(user1, user2),
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

// ---------- User Relations

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

export function useMutPostNewChatroom() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: ChatroomPost) => postNewChatromm(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["Friends"],
      });
    },
  });
}