import { useQuery } from "@tanstack/react-query";
import { LoadingSpinnerMessage } from "./components";
import { fetchAllUsers, fetchTodoList, fetchUser } from "./api";
import axios, { isCancel, AxiosError } from "axios";

import { Avatar } from "./Profile";

export default function Test() {
  return (
    <>
      <div className="flex ">
        <div className="h-12 bg-pink-500">
          <div className="w-32 bg-blue-400">
            <p>foobar</p>
          </div>
        </div>
        <div className="grow bg-green-400">
          <p>fizbuz</p>
        </div>
      </div>
      <Example />
    </>
  );
}

function Example() {
  const { isLoading, isError, data, error } = useQuery({
    queryKey: ["todos"],
    queryFn: fetchTodoList,
  });

  if (isLoading) {
    return <span>Loading...</span>;
  }

  if (isError) {
    return <span>Error: {error.message}</span>;
  }
  return (
    <div>
      <Avatar
        size="m-2 mb-3 mt-3 w-16 h-16"
        alt={data.name}
        status={data.status}
        img={data.avatar}
      />
    </div>
  );
}

// function Example() {
//   const { isLoading, isError, data, error } = useQuery({
//     queryKey: ["allUserData"],
//     queryFn: fetchAllUsers,
//   });

//   if (isLoading) return <LoadingSpinnerMessage />;

//   if (isError) return "An error has occurred: " + (error as Error)?.message;

//   return (
// <div>
//   <Avatar
//     size="m-2 mb-3 mt-3 w-16 h-16"
//     alt={data.asd}
//     status={data?.status}
//     img={data?.avatar}
//   />
// </div>
//   );
// }
