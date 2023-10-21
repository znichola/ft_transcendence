import { ReactNode, createContext, useEffect, useState } from "react";
import axios from "axios";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useCurrentUser } from "../functions/customHook";
import { useAuth } from "../functions/useAuth";

export type IAuth = {
  isloggedIn: boolean;
  user: string;
  logIn: (user: string) => void;
  logOut: () => void;
};

export const AuthContext = createContext<IAuth | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [auth, setToken] = useState({ isloggedIn: false, user: "" });

  const logIn = (user: string) => {
    // getCurrentUser()
    //   .then((u) => setToken({ isloggedIn: true, user: u }))
    //   .catch((e) => console.log(e.data));
    // if (user) {
    //   setToken({ isloggedIn: true, token: user });
    // }
    setToken({ isloggedIn: true, user: user });
  };
  const logOut = () => {
    axios
      .get<string>("/auth/logout")
      .then((r) => r.data)
      .catch((e) => console.log("Auth logout: ", e.data));
    setToken({ isloggedIn: false, user: "" });
  };

  return (
    // spread operator to use contruct a new type by combining these elements
    <AuthContext.Provider value={{ ...auth, logIn, logOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const ProtectedRoute = () => {
  const foo = useAuth();
  const location = useLocation();
  const { data: currentUser, isLoading, isError } = useCurrentUser();
  // console.log("useAuth is here", foo);

  useEffect(() => {
    if (
      foo &&
      currentUser !== "" &&
      !foo.isloggedIn &&
      !isLoading &&
      !isError
    ) {
      console.log("cu:", currentUser, "foo:", foo.user);
      foo.logIn(currentUser);
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
  if (isError && !foo.user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
    // important this redirection is not to a child of the protected route otherwise it's an infinate loop!
  }
  if (isError)
    return <Navigate to="/login" replace state={{ from: location }} />;
  // this is here for when the cookie expiers it should kick the user back to the login page
  return <Outlet />;
};
