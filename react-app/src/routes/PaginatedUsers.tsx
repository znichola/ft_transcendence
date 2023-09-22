import { useInfiniteQuery } from "@tanstack/react-query";
import { UserData } from "../interfaces";
import axios from "axios";
import React from "react";
import { UserInfo } from "./AllUsers";

export default function PaginatedUsers() {
  const fetchProjects = async ({ pageParam = 0 }) => {
    const res = await fetch("/api/projects?cursor=" + pageParam);
    return res.json();
  };

  const fetchPage = async ({ pageParam = 1 }) => {
    const response = await axios.get<UserData[]>("/user/?page=" + pageParam);
    return response.data;
  };
  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery({
    queryKey: ["projects"],
    queryFn: fetchPage,
    getNextPageParam: (lastPage, pages) => lastPage.nextCursor,
  });

  return status === "loading" ? (
    <p>Loading...</p>
  ) : status === "error" ? (
    <p>Error: {error.message}</p>
  ) : (
    <>
      <div className="m-4 flex-col gap-4">
        {data.pages[0].map((u) => (
          <UserInfo user={u} key={u.login42} />
        ))}
      </div>
      <div>
        <button
          onClick={() => fetchNextPage()}
          disabled={!hasNextPage || isFetchingNextPage}
        >
          {isFetchingNextPage
            ? "Loading more..."
            : hasNextPage
            ? "Load More"
            : "Nothing more to load"}
        </button>
      </div>
      <div>{isFetching && !isFetchingNextPage ? "Fetching..." : null}</div>
    </>
  );
}

{/* <>
  <div className="m-4 flex-col gap-4">
    {users.map((u) => (
      <UserInfo user={u} key={u.login42} />
    ))}
  </div>
  <button onClick={() => fetchNextPage()} disabled={isFetchingNextPage}>
    {isFetchingNextPage
      ? "Loading more..."
      : (data?.pages.length ?? 0) < 5
      ? "Load more?"
      : "Nothing more to load"}
  </button>
</>; */}
