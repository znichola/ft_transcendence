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
import Contact from "./routes/contat.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/contact/:contactId",
        element: <Contact />,
      },
    ],
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/profile",
    element: <Profile />,
  },
  {
    path: "/fetch-user",
    element: <FetchUser />,
  },
  {
    path: "/ttt",
    element: <Board />,
  },
  {
    path: "/app",
    element: <App />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
