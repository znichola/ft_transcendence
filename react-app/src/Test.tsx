import { useQuery } from "@tanstack/react-query";
import { LoadingSpinnerMessage } from "./components/Loading";
import { fetchAllUsers, fetchTodoList, fetchUser } from "./api";
import axios from "axios";

import { Avatar } from "./Profile";
import { useEffect, useState } from "react";
import { UserData } from "./interfaces";

export default function Test() {
  return (
    <>
      <h1 className="text-xl font-bold">
        This is a basic test root, do with it what you will!
      </h1>
      <ExampleGet />
    </>
  );
}

function ExampleGet() {
  const {
    data: users,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["users"],
    queryFn: () => axios.get<UserData[]>("/user").then((res) => res.data),
  });
  if (isLoading) return <LoadingSpinnerMessage />;
  if (isError) {
    console.log(error);
    return <p>Error fethcing data</p>;
  }
  return (
    <>
      <ul>
        {users.map((user) => (
          <li key={user.login42}>{user.name}</li>
        ))}
      </ul>
    </>
  );
}

// it's works leave it alone!
function ExampleWorkingRactQueryWithAxiosGet() {
  const foo = useQuery({
    queryKey: ["users"],
    queryFn: () => axios.get<UserData[]>("/user").then((res) => res.data),
  });
  if (foo.isLoading) return <LoadingSpinnerMessage />;
  if (foo.isError) return <p>Error </p>;
  console.log(foo.error);
  return (
    <ul>
      {foo.data.map((user) => (
        <li key={user.login42}>{user.name}</li>
      ))}
    </ul>
  );
}

// don't touch it!!!!
function ExampleWorkigAxiosGet() {
  const [posts, setPosts] = useState<UserData[]>([]);

  useEffect(() => {
    axios
      // .get<UserData[]>("http://localhost:3000/user/")
      .get<UserData[]>("/user") // this also works because we set the other part of the url as default!
      .then((response) => {
        setPosts(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  return (
    <ul>
      {posts.map((post) => (
        <li key={post.login42}>{post.name}</li>
      ))}
    </ul>
  );
}
