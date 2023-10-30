import { ReactNode, createContext, useState } from "react";
import { INotification } from "../interfaces";
import { AxiosInterceptors } from "../api/AxiosInterceptors";
import { randString } from "../functions/utils";

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

  const addNotif = (notif: INotification) => {
    console.log(
      "notification href",
      window.location.pathname,
      `/${notif.to?.split("#")[0]}`,
    );
    if (window.location.pathname !== `/login` && window.location.pathname !== `/${notif.to?.split("#")[0]}`) {
      if (
        notifications.length > 0 &&
        (notifications[notifications.length - 1].from === notif.from &&
          notifications[notifications.length - 1].to === notif.to &&
          notifications[notifications.length - 1].type === notif.type &&
          notifications[notifications.length - 1].onClick === notif.onClick &&
          notifications[notifications.length - 1].message === notif.message)
      ) {
        console.log("already displayed", notifications);

        const updated = notifications.map((n, i) =>
          i == notifications.length - 1
            ? { ...n, count: (n.count || 0) + 1 }
            : n,
        );
        setNotifications(updated);
        return;
      }
      console.log("this bar ");
      
      setNotifications((prevNotifications) => [
        ...prevNotifications,
        { ...notif, id: randString(8), count: 0 },
      ]);
    }
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
      <AxiosInterceptors>{children}</AxiosInterceptors>
    </NotificationContext.Provider>
  );
}
