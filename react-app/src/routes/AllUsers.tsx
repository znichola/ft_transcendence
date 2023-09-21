import { UserData } from "../interfaces";
import Avatar from "../components/Avatar";
import { Link } from "react-router-dom";
import axios from "axios";
import { LoadingSpinner } from "../components/Loading";

import { useInfiniteQuery } from "@tanstack/react-query";
import { useIntersection } from "../functions/uneIntersection";
import { useRef } from "react";

export default function AllUsers({Filter}) {
  const fetchPage = async ({ pageParam = 1 }) =>
    axios.get<UserData[]>("/user/?page=" + pageParam).then((res) => res.data);
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
        {_posts?.map((user) => <Filter user={user}/>)}
      </div>
      <button
        ref={ref}
        // no iead why it's giving me this error but still works, for later
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

export function UserInfo({ user }: { user: UserData }) {
  return (
    <div className="m-4 min-w-[20rem] pr-3 flex max-w-md bg-white shadow">
      <div className="flex flex-col content-center justify-center border-r border-slate-200 p-4 font-bold text-slate-500">
        <p>{user.elo}</p>
      </div>
      <Avatar
        size="m-2 mb-3 mt-3 w-16 h-16"
        alt={user.name}
        status={user.status}
        img={user.avatar}
      />

      <div className="flex flex-col content-center justify-center ">
        <p className="font-semibold text-slate-700">{user.name}</p>
        <Link to={"/user/" + user.login42} className="text-slate-400">
          {"@" + user.login42}
        </Link>
      </div>
    </div>
  );
}
