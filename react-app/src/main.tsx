import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import axios from "axios";

axios.defaults.baseURL = "http://localhost:3000";
// axios.defaults.headers.common["Authorization"] = AUTH_TOKEN;
// axios.defaults.headers.post["Content-Type"] =
// "application/x-www-form-urlencoded";

import "./index.css";
import Board from "./routes/TickTackToe.tsx";
import Root from "./routes/Root.tsx";
import Contact from "./routes/UserPage.tsx";
import Test from "./test-files-and-tmp-stuff/Test.tsx";
import Auth from "./routes/Auth.tsx";
import AllUsers from "./routes/AllUsers.tsx";
import ErrorPage from "./routes/Error-pages.tsx";
import GlobalRanking from "./routes/GlobalRanking.tsx";
import PlayPong from "./routes/PlayPong.tsx";
import PongFeed from "./routes/PongFeed.tsx";
import AddNewChatRoom from "./routes/AddNewChatRoom.tsx";
import AddNewChat from "./routes/AddNewChat.tsx";
import AddNewFriend from "./routes/AddNewFriend.tsx";
import Login from "./routes/UserLogin.tsx";
// import Login from "./routes/Foo.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/play",
        element: <PlayPong />,
      },
      {
        path: "/user/:login42",
        element: <Contact />,
      },
      {
        path: "/users",
        element: <AllUsers />,
      },
      {
        path: "/pong",
        element: <PongFeed />,
      },
      {
        path: "/ranking",
        element: <GlobalRanking />,
      },
      {
        path: "/message",
        element: <AddNewChat />,
      },
      {
        path: "/chatroom",
        element: <AddNewChatRoom />,
      },
      {
        path: "/friend",
        element: <AddNewFriend />,
      },
      // below are the temp dev links
      {
        path: "/ttt",
        element: <Board />,
      },
      {
        path: "/test",
        element: <Test />,
      },
      {
        path: "/auth",
        element: <Auth />,
      },
      {
        path: "/login",
        element: <Login />
      }
    ],
  },
]);

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  </React.StrictMode>,
);
