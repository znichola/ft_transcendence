import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import axios from "axios";

// axios.defaults.baseURL = "/api/";
axios.defaults.baseURL = import.meta.env.VITE_SITE_URL + "/api/";

axios.defaults.withCredentials = true;
// axios.defaults.headers.common["Authorization"] = AUTH_TOKEN;
// axios.defaults.headers.post["Content-Type"] =
// "application/x-www-form-urlencoded";

import "./index.css";
import Root from "./routes/Root.tsx";
import Auth from "./routes/Auth.tsx";
import ErrorPage from "./routes/Error-pages.tsx";
import PongFeed from "./routes/PongFeed.tsx";
import AddOrJoinChatroom from "./routes/ChatroomBrowser.tsx";
import AddNewChat from "./routes/AddNewChat.tsx";
import AddNewFriend from "./routes/AddNewFriend.tsx";
import Login from "./routes/UserLogin.tsx";
import DirectMessage from "./routes/DirectMessage.tsx";
import PongDuel from "./routes/PongDuel.tsx";
import { AuthProvider, ProtectedRoute } from "./routes/AuthProvider.tsx";
import MatchMaker from "./routes/MatchMaker.tsx";
import AuthLoginTFA from "./routes/AuthLoginTFA.tsx";
import UserProfile from "./routes/UserProfile.tsx";
import NewGlobalRanking from "./routes/NewGlobalRanking.tsx";
import SocketTest from "./routes/SocketTest.tsx";
import ChatroomManager from "./routes/ChatroomChat.tsx";
import NotificationProvider from "./routes/NotificationProvider.tsx";
import SocketNotificatinos from "./components/SocketNofifications.tsx";
import PongTV from "./routes/PongTV.tsx";

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
    path: "/tfa/:login42",
    element: <AuthLoginTFA />,
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
            path: "/play/:game_mode?",
            element: <MatchMaker />,
          },
          {
            path: "/user/:login42",
            element: <UserProfile />,
          },
          {
            path: "/pong",
            element: <PongFeed />,
          },
          {
            path: "/pong/:id",
            element: <PongDuel />,
          },
          {
            path: "/pong-tv",
            element: <PongTV />,
          },
          {
            path: "/ranking",
            element: <NewGlobalRanking />,
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
            element: <ChatroomManager />,
          },
          {
            path: "/friend",
            element: <AddNewFriend />,
          },
          {
            path: "/socket",
            element: <SocketTest />,
          },
        ],
      },
    ],
  },
]);

const queryClient = new QueryClient({
  logger: {
    log: () => {},
    warn: () => {},
    error: () => {},
  },
}); // remove the annoying error logs for failed requests, but it might bight up later ?! who knows.

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <NotificationProvider>
          <SocketNotificatinos>
            <RouterProvider router={router} />
          </SocketNotificatinos>
        </NotificationProvider>
      </AuthProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  </React.StrictMode>,
);
