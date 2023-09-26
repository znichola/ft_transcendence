import { UserData } from "../interfaces";
import axios from "axios";
import { LoadingSpinner } from "../components/Loading";

import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { useIntersection } from "../functions/uneIntersection";
import { useRef } from "react";
import { getCurrentUser } from "../Api-axios";

export default function AllUsers({ Filter }) {
  const { data: currentUser } = useQuery({
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

  console.log("fooo", data);

  const _posts = data?.pages.flatMap((p) => p);

  console.log("asd", data?.pages.length ?? 0);
  console.log("asda", data?.pages[data?.pageParams.length - 1]);

  const ref = useRef();
  const inViewport = useIntersection(ref, "0px");

  if (
    inViewport &&
    (data?.pages[data?.pageParams.length - 1].length ?? 0) > 0
  ) {
    fetchNextPage();
    console.log("it's in the viewport", ref.current);
  }

  return (
    <>
      <div className="m-4 flex-col gap-4">
        {_posts?.map((u) => <Filter cardUser={u} currentUser={currentUser} />)}
      </div>
      <button
        ref={ref} // no iead why it's giving me this error but still works, for later
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
