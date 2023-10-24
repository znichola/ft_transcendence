import { useContext } from "react";
import { AuthContext } from "../routes/AuthProvider";
import { NotificationContext } from "../routes/NotificationProvider";

// moved here bevause was getting warnings about something fast reaload when it was with the AuthProvider
export const useAuth = () => {
  return useContext(AuthContext);
};

export const useNotification = () => {
  return useContext(NotificationContext);
}