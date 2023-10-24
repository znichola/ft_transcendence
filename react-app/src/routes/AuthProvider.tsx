import { ReactNode, createContext, useEffect, useState } from "react";
import axios, { HttpStatusCode } from "axios";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { setStatus } from "../api/queryMutations";
import { useAuth } from "../functions/contexts";
import {
  pongSocket,
  socketSetHeadersAndReConnect,
  userSocket,
} from "../socket";
import { useQueryClient } from "@tanstack/react-query";
import { useCurrentUser } from "../api/apiHooks";

export type IAuth = {
  isloggedIn: boolean;
  user: string;
  tfa: boolean;
  setFTA: (tfa: boolean) => void;
  logIn: (user: string) => void;
  logOut: () => void;
};

// to avoid this  dumb ass null stuff
export const AuthContext = createContext<IAuth>({
  isloggedIn: false,
  user: "",
  tfa: false,
  setFTA: (_: boolean) => {},
  logIn: (_: string) => {},
  logOut: () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [auth, setToken] = useState({
    isloggedIn: false,
    user: "",
    tfa: false,
  });

  const logIn = (user: string) => {
    setToken((prev) => {
      return { ...prev, isloggedIn: true, user: user };
    });
  };

  const logOut = () => {
    axios
      .get<HttpStatusCode>("/auth/logout")
      .catch((e) => console.log("Auth logout: ", e.data));
    setToken({ isloggedIn: false, user: "", tfa: false });
    userSocket.disconnect();
    pongSocket.disconnect();
  };

  const setFTA = (tfa: boolean) => {
    setToken((prev) => {
      return { ...prev, tfa: tfa };
    });
  };

  return (
    // spread operator to use contruct a new type by combining these elements
    <AuthContext.Provider value={{ ...auth, logIn, logOut, setFTA }}>
      {children}
    </AuthContext.Provider>
  );
};

export const ProtectedRoute = () => {
  const foo = useAuth();
  const location = useLocation();
  const { data: currentUser, isLoading, isError } = useCurrentUser();
  const queryClient = useQueryClient();
  useEffect(() => {
    if (
      foo &&
      currentUser !== "" &&
      !foo.isloggedIn &&
      !isLoading &&
      !isError
    ) {
      foo.logIn(currentUser);
      socketSetHeadersAndReConnect(currentUser);
      setTimeout(() => {
        setStatus(queryClient, currentUser, "ONLINE");
      }, 300); // idk why but if it's intantanious it get over written so meh
    }
  });

  if (!foo)
    return <h1>critical error with auth, this should not be possible</h1>;
  if (isLoading)
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-96 w-96 animate-spin rounded-full border-8 border-slate-300 border-b-transparent" />
      </div>
    );
  if (isError)
    return <Navigate to="/login" replace state={{ from: location }} />;
  // this is here for when the cookie expiers it should kick the user back to the login page
  // important this redirection is not to a child of the protected route otherwise it's an infinate loop!
  return <Outlet />;
};
