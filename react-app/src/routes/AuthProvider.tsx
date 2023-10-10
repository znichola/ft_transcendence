import { ReactNode, createContext, useContext, useState } from "react";
import axios from "axios";
import { Navigate, Outlet, useLocation } from "react-router-dom";

type IAuth = {
  isloggedIn: boolean;
  user: string;
  logIn: (user: string) => void;
  logOut: () => void;
};

// export interface IAuth {
//   loggedIn: boolean;
//   role: string;
//   logIn: () => void;
//   logOut: () => void;
// }

const AuthContext = createContext<IAuth | null>(null);

export const useAuth = () => {
  return useContext(AuthContext);
};

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
      .catch((e) => console.log(e.data));
    setToken({ isloggedIn: false, user: "" });
  };

  // const contextValue: IAuth = {
  //   loggedIn: false,
  //   token,
  //   onLogin: handleLogin,
  //   onLogout: handleLogout,
  // };

  return (
    // spread operator to use contruct a new type by combining these elements
    <AuthContext.Provider value={{ ...auth, logIn, logOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const ProtectedRoute = () => {
  const foo = useAuth();
  console.log("useAuth is here", foo)
  const location = useLocation();
  if (!foo) return <h1>critical error</h1>;
  if (!foo.user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
    // important this redirection is not to a child of the protected route otherwise it's an infinate loop!
  }
  return <Outlet/>;
};
