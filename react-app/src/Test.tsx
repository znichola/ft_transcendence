import { useQuery } from "@tanstack/react-query";
import { LoadingSpinnerMessage } from "./components";
import { fetchAllUsers, fetchTodoList, fetchUser } from "./api";
import axios, { isCancel, AxiosError } from "axios";

import { Avatar } from "./Profile";
import { useEffect, useState } from "react";
import { UserData } from "./interfaces";

export default function Test() {
  return (
    <>
      <h1 className="text-xl font-bold">
        This is a basic test root, do with it what you will!
      </h1>
      <ExampleWorkigAxiosGet />
    </>
  );
}
// don't touch it!!!!
function ExampleWorkigAxiosGet() {
  const [posts, setPosts] = useState<UserData[]>([]);

  useEffect(() => {
    axios
      .get<UserData[]>("http://localhost:3000/user/")
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
        <li key={post.login42}>{post.elo}</li>
      ))}
    </ul>
  );
}
