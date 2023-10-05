import { getCurrentUser, getUserConverstaion, getUserConverstaions, getUserConvoMessages, getUserData } from "../Api-axios";
import { useQuery } from "@tanstack/react-query";

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

export function useUserConverstaions(user: string) {
  return useQuery({
    queryKey: ["UserConversations", user],
    queryFn: () => getUserConverstaions(user),
    staleTime: 5 * (60 * 1000), // 5 mins
    cacheTime: 10 * (60 * 1000), // 10 mins
  });
}

export function useUserConversation(user1: string, user2: string) {
  return useQuery({
    queryKey: ["UserConversation", user1, user2],
    queryFn: () => getUserConverstaion(user1, user2),
    staleTime: 5 * (60 * 1000), // 5 mins
    cacheTime: 10 * (60 * 1000), // 10 mins
  });
}

export function useUserConvoMessages(user1: string, user2: string) {
  return useQuery({
    queryKey: ["UserConvoMessages", user1, user2],
    queryFn: () => getUserConvoMessages(user1, user2),
    // staleTime: 5 * (60 * 1000), // 5 mins
    // cacheTime: 10 * (60 * 1000), // 10 mins
  });
}
