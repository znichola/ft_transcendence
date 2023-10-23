import { ReactNode, createContext, useState } from "react";
import { INotification } from "../interfaces";

interface INotifContext {
  notifications: INotification[];
  addNotif: (notif: INotification) => void;
  removeNotif: (index: number) => void;
}

export const NotificationContext = createContext<INotifContext>({
  notifications: [],
  addNotif: () => {},
  removeNotif: () => {},
});

export default function NotificationProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [notifications, setNotifications] = useState<INotification[]>([]);
  const [count, setCount] = useState(0);

  const addNotif = (notif: INotification) => {
    setCount((prevCount) => prevCount + 1);
    setNotifications((prevNotifications) => [
      ...prevNotifications,
      { ...notif, id: count + "" },
    ]);
  };

  const removeNotif = (index: number) => {
    setNotifications((prevNotifications) =>
      prevNotifications.filter((_, i) => i !== index),
    );
  };

  return (
    <NotificationContext.Provider
      value={{ notifications, removeNotif, addNotif }}
    >
      {children}
    </NotificationContext.Provider>
  );
}
