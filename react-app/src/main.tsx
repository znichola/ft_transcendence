import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

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

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/contact/:contactId",
        element: <Contact key={1} />,
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
    element: <Auth />
  }
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
);
