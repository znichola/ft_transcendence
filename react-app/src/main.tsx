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
import App from "./App.tsx";
import Login from "./routes/Login.tsx";
import Profile from "./Profile.tsx";
import Board from "./routes/TickTackToe.tsx";
import Root from "./routes/Root.tsx";
import Contact from "./routes/UserListing.tsx";
import Test from "./Test.tsx";
import Auth from "./routes/auth.tsx";
import AllUsers from "./routes/AllUsers.tsx";
import SideMenu from "./components/SideMenu.tsx";
import GlobalRanking from "./routes/GlobalRanking.tsx";
import ErrorPage from "./routes/Error-page.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/users/:login42",
        element: <Contact key={0} />,
      },
      {
        path: "/users",
        element: <AllUsers key={1} />,
      },
      {
        path: "/login",
        element: <Login key={2} />,
      },
      {
        path: "/profile",
        element: <Profile key={3} />,
      },
      {
        path: "/ttt",
        element: <Board key={5} />,
      },
      {
        path: "/app",
        element: <App key={6} />,
      },
    ],
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
    path: "/side",
    element: <SideMenu />,
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
