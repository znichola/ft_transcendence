import { UserFriends } from "../interfaces";
import axios from "axios";
import { LoadingSpinner, LoadingSpinnerMessage } from "../components/Loading";

import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { useIntersection } from "../functions/uneIntersection";
import { useRef } from "react";
import { getCurrentUser } from "../Api-axios";
import { filter } from "../routes/GlobalRanking";

export default function AllUsers({ filter: Filter }: { filter: filter }) {
  const { data: currentUser, isLoading: userLoading, isError: userError } = useQuery({
    queryKey: ["currentUser"],
    queryFn: getCurrentUser,
    initialData: "default42",
  });
  const fetchPage = async ({ pageParam = 1 }) =>
    axios.get<string[]>("/user/?page=" + pageParam).then((res) => res.data);
  const { data, fetchNextPage, isFetchingNextPage } = useInfiniteQuery({
    queryKey: ["GlobalRanking"],
    queryFn: fetchPage,
    getNextPageParam: (_, pages) => pages.length + 1,
  });
  const {
    data: friends,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["Friends"],
    queryFn: () =>
    axios
    .get<UserFriends>("/user/" + currentUser + "/friends")
    .then((res) => res.data),
    enabled: currentUser != undefined,
  });

  const _posts = data?.pages.flatMap((p) => p);

  const ref = useRef(null);
  const inViewport = useIntersection(ref, "0px");

  if (isLoading || userLoading) return <LoadingSpinnerMessage message="loading profile" />;
  // if (userError) return <div>Error loading current user, try signing in</div>
  if (userError) console.log("Error loading current user, try signing in");
  if (isError) return <div>Error loading profile</div>;

  if (
    inViewport &&
    (data?.pages[data?.pageParams.length - 1].length ?? 0) > 0
  ) {
    fetchNextPage();
    // console.log("it's in the viewport", ref.current);
  }

  return (
    <>
      <div className="m-4 flex-col gap-4">
        {_posts?.map((u) => (
          <Filter
            cardUser={u}
            currentUser={currentUser}
            userFriends={friends}
            key={u}
          />
        ))}
      </div>
      <button
        ref={ref}
        onClick={() => fetchNextPage()}
        disabled={isFetchingNextPage}
      >
        {isFetchingNextPage ? (
          <LoadingSpinner />
        ) : (data?.pages[data?.pageParams.length - 1].length ?? 0) > 0 ? (
          "Load more?"
        ) : (
          "Nothing more to load"
        )}
      </button>
    </>
  );
}
