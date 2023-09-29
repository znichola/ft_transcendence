import { getCurrentUser, getUserData } from "../Api-axios";
import { useQuery } from "@tanstack/react-query";

export function useCurrentUser() {
  return useQuery({
    queryKey: ["currentUser"],
    queryFn: getCurrentUser,
    staleTime: 45 * (60 * 1000), // 45 min
    cacheTime: 60 * (60 * 1000), // 60 mins
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
