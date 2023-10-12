import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import axios from "axios";

// axios.defaults.baseURL = "/api/";
axios.defaults.baseURL =
  "http://" + import.meta.env.VITE_IP_ADDR + ":8080/api/";

axios.defaults.withCredentials = true;
// axios.defaults.headers.common["Authorization"] = AUTH_TOKEN;
// axios.defaults.headers.post["Content-Type"] =
// "application/x-www-form-urlencoded";

import "./index.css";
import Board from "./routes/TickTackToe.tsx";
import Root from "./routes/Root.tsx";
import Test from "./test-files-and-tmp-stuff/Test.tsx";
import Auth from "./routes/Auth.tsx";
import ErrorPage from "./routes/Error-pages.tsx";
import GlobalRanking from "./routes/GlobalRanking.tsx";
import PlayPong from "./routes/PlayPong.tsx";
import PongFeed from "./routes/PongFeed.tsx";
import AddOrJoinChatroom from "./routes/ChatroomBrowser.tsx";
import AddNewChat from "./routes/AddNewChat.tsx";
import AddNewFriend from "./routes/AddNewFriend.tsx";
import Login from "./routes/UserLogin.tsx";
import DirectMessage from "./routes/DirectMessage.tsx";
import PongDuel from "./routes/PongDuel.tsx";
import ChatRoomChat from "./routes/ChatroomChat.tsx";
import UserPage from "./routes/UserPage.tsx";
import { AuthProvider, ProtectedRoute } from "./routes/AuthProvider.tsx";

const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/auth",
    element: <Auth />,
  },
  {
    path: "/test",
    element: <Test />,
  },
  {
    path: "/",
    element: <ProtectedRoute />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/",
        element: <Root />,
        children: [
          {
            path: "/play",
            element: <PlayPong />,
          },
          {
            path: "/user/:login42",
            element: <UserPage />,
          },
          {
            path: "/pong",
            element: <PongFeed />,
          },
          {
            path: "/pong/:player1_login42/vs/:player2_login42/:game_mode",
            element: <PongDuel />,
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
            path: "/message/:login42",
            element: <DirectMessage />,
          },
          {
            path: "/chatroom",
            element: <AddOrJoinChatroom />,
          },
          {
            path: "/chatroom/:id",
            element: <ChatRoomChat />,
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
          // {
          //   path: "/test",
          //   element: <Test />,
          // },
          // {
          //   path: "/login",
          //   element: <Login />,
          // },
        ],
      },
    ],
  },
]);

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  </React.StrictMode>,
);
