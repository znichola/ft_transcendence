import { useContext } from "react";
import { AuthContext } from "../routes/AuthProvider";


// moved here bevause was getting warnings about something fast reaload when it was with the AuthProvider 
export const useAuth = () => {
  return useContext(AuthContext);
};
