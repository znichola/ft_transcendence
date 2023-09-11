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
import Login from "./Login.tsx";
import Profile from "./Profile.tsx";
import FetchUser from "./FetchUser.tsx";
import Board from "./NikiTickTackToe.tsx";
import Root from "./routes/Root.tsx";
import ErrorPage from "./error-page.tsx";
import Contact from "./routes/contact.tsx";
import Test from "./Test.tsx";
import Auth from "./routes/auth.tsx";
import AllUsers from "./routes/AllUsers.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/users/:login42",
        element: <Contact key={0} />,
        // element: <Contact key={0} />,
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
        path: "/fetch-user",
        element: <FetchUser key={4} />,
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
