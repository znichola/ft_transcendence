import { ReactNode, useEffect, useState } from "react";
import { authApi } from "./axios";
import { useNotification } from "../functions/contexts";

export function AxiosInterceptors({ children }: { children: ReactNode }) {
  const [isSet, setIsSet] = useState(false);
  const { addNotif } = useNotification();
  useEffect(() => {
    setIsSet(true);
    const interceptor = authApi.interceptors.response.use(
      (response) => {
        return response;
      },
      (error) => {
        if (error.response.status) {
          console.log(error.response);
          if (window.location.pathname !== "/login") {
            addNotif({
              from: error.response.statusText,
              message: error.response.data.message,
              type: "ERROR",
            });
          } else {
            console.log("skipped error adding");  
          }
        }
        return Promise.reject(error);
      },
    );

    return () => authApi.interceptors.response.eject(interceptor);
  }, [addNotif]); // TODO this was added from lint maybe it's a bad idea?!
  // console.log("isSet:          ", isSet);
  return isSet && children;
}

// authApi.interceptors.response.use(
//   function (response) {
//     // Any status code that lie within the range of 2xx cause this function to trigger
//     // Do something with response data
//     return response;
//   },
//   function (error) {
//     // const foo = useAuth();

//     // Any status codes that falls outside the range of 2xx cause this function to trigger
//     // Do something with response error
//     if (error.response.status) {
//       // console.log(401, "error found baby!");
//       // user?.logOut();
//       // foo?.logOut()
//       // console.log(AuthContext);
//       console.log("Error intercepted:", error.response.status);
//     }
//     return Promise.reject(error);
//     // https://stackoverflow.com/questions/62888255/how-to-use-react-usecontext-in-a-function-that-does-not-render-any-components
//   },
// );

// function AxiosIntercetor({children}) {
//   const [isSet, setIsSet] = useState(false)

//   useEffect(()=>{
//     ...
//     setIsSet(true)
//   })

//   return isSet && children
// }

// https://dev.to/arianhamdi/react-hooks-in-axios-interceptors-3e1h
