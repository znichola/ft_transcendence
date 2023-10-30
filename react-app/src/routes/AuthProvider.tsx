import { ReactNode, createContext, useEffect, useState } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../functions/contexts";
import { socketDisconnect, socketSetHeadersAndReConnect } from "../socket";
import { useCurrentUser, useMutLogout, useUserData } from "../api/apiHooks";

export type IAuth = {
  isloggedIn: boolean;
  user: string;
  tfa: boolean;
  setFTA: (tfa: boolean) => void;
  logIn: (userData: string, tfa?: boolean) => void;
  logOut: () => void;
};

// prettier-ignore
export const AuthContext = createContext<IAuth>({
  isloggedIn: false,
  user: "",
  tfa: false,
  setFTA: (_: boolean) => {_},
  logIn: (_: string, __: boolean = false) => {_; __},
  logOut: () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const logOutMut = useMutLogout();

  const [auth, setToken] = useState({
    isloggedIn: false,
    user: "",
    tfa: false,
  });

  const logIn = (user: string, tfa: boolean = false) => {
    setToken((prev) => {
      return {
        ...prev,
        isloggedIn: true,
        user: user,
        tfa: tfa,
      };
    });
  };

  const logOut = () => {
    logOutMut.mutate();
    setToken({ isloggedIn: false, user: "", tfa: false });
    socketDisconnect();
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
  const {
    data: currentUserData,
    isLoading: isDataLoading,
    isError: isDataError,
  } = useUserData(currentUser ? currentUser : "");
  // const queryClient = useQueryClient();
  useEffect(() => {
    if (
      foo &&
      currentUser !== "" &&
      !foo.isloggedIn &&
      !isLoading &&
      !isDataLoading &&
      !isError &&
      !isDataError
    ) {
      foo.logIn(
        currentUser,
        currentUserData.tfaStatus ? currentUserData.tfaStatus : false,
      );
      socketSetHeadersAndReConnect();
      // setTimeout(() => {
      //   setStatus(queryClient, currentUser, "ONLINE");
      // }, 300); // idk why but if it's intantanious it get over written so meh
    }
  });

  if (!foo) return <h1>critical error with auth</h1>;
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
