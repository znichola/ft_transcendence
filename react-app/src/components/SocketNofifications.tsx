import { ReactNode, useEffect, useState } from "react";
import { useAuth, useNotification } from "../functions/contexts";
import { userSocket } from "../socket";
import {
  ISocChallenge,
  ISocChatroomMessage,
  ISocDirectMessage,
  ISocFriendRequest,
  ISocReconnection,
} from "../interfaces";
import { useQueryClient } from "@tanstack/react-query";

export default function SocketNotificatinos({
  children,
}: {
  children: ReactNode;
}) {
  const { addNotif } = useNotification();
  const queryClient = useQueryClient();
  const { user: currentUser } = useAuth();
  const [chatroomEV, setChatroomEV] = useState<ISocChatroomMessage[]>([]);
  const [dmEV, setDMEV] = useState<ISocDirectMessage[]>([]);
  const [frEV, setFREV] = useState<ISocFriendRequest[]>([]);
  // const [reconnectEV, setReconnectEV] = useState<ISocRoomCreated[]>([]);
  const [updatedUser, setUpdatedUser] = useState<string[]>([]);

  // chatrooms
  const addChatroomEV = (e: ISocChatroomMessage) => {
    setChatroomEV((prev) => [...prev, e]);
  };
  const removeFirstChatroomEV = () => {
    setChatroomEV((prev) => prev.filter((_, i) => i !== 0));
  };

  // dms
  const addDMEV = (e: ISocDirectMessage) => {
    setDMEV((prev) => [...prev, e]);
  };
  const removeFirstDMEV = () => {
    setDMEV((prev) => prev.filter((_, i) => i !== 0));
  };

  // friendRequests
  const addFREV = (e: ISocFriendRequest) => {
    setFREV((prev) => [...prev, e]);
  };
  const removeFirstFREV = () => {
    setFREV((prev) => prev.filter((_, i) => i !== 0));
  };

  // updatedUser
  const addUpdatedUser = (e: string) => {
    setUpdatedUser((prev) => [...prev, e]);
  };
  const removeFirstUpdatedUser = () => {
    setUpdatedUser((prev) => prev.filter((_, i) => i !== 0));
  };

  // // updatedUser
  // const addReconnectEV = (e: ISocRoomCreated) => {
  //   setReconnectEV((prev) => [...prev, e]);
  // };
  // const removeFirstReconnectEV = () => {
  //   setReconnectEV((prev) => prev.filter((_, i) => i !== 0));
  // };

  useEffect(() => {
    const chat_ev = chatroomEV[0];
    if (chat_ev) {
      addNotif({
        type: "MESSAGE",
        from: chat_ev.name,
        message: chat_ev.message.content,
        to: `chatroom/${chat_ev.id}#message-${chat_ev.message.id}`,
      });
      //console.log("should be removing the chatroom ev", chat_ev.id);
      queryClient.invalidateQueries({
        queryKey: ["ChatroomMessages", chat_ev.id + ""],
      });
      // console.log("asd", ["ChatroomMessages", chat_ev.id + ""]);
      // queryClient.setQueryData(
      //   ["ChatroomMessages", chat_ev.id + ""],
      //   (prev: IMessage[] | undefined) =>
      //     prev ? [...prev, chat_ev.message] : prev,
      // );
      removeFirstChatroomEV();
    }

    const dm_ev = dmEV[0];
    if (dm_ev) {
      // console.log("message content:", dm_ev);
      addNotif({
        type: "MESSAGE",
        from: dm_ev.name,
        message: dm_ev.message.content,
        to: `message/${dm_ev.message.senderLogin42}#message-${dm_ev.message.id}`,
      });
      //console.log("should be removing the dm ev", dm_ev);
      queryClient.invalidateQueries({
        queryKey: [
          "UserConvoMessages",
          currentUser,
          dm_ev.message.senderLogin42,
        ],
      });
      queryClient.invalidateQueries({
        queryKey: ["UserConversations", dm_ev.message.senderLogin42],
      });
      // queryClient.setQueryData(
      //   ["UserConvoMessages", currentUser, dm_ev.message.senderLogin42],
      //   (prev: ConvoMessage[] | undefined) =>
      //     prev ? [...prev, dm_ev.message] : prev,
      // );
      removeFirstDMEV();
    }

    const fr_ev = frEV[0];
    if (fr_ev) {
      // console.log("friend request:", fr_ev);
      addNotif({
        type: "FRIEND",
        from: fr_ev.name,
        to: `user/${fr_ev.login}`,
      });
      queryClient.resetQueries({ queryKey: ["Friends"] });
      removeFirstFREV();
    }

    const us_ev = updatedUser[0];
    if (us_ev) {
      //console.log("mutating", us_ev);
      queryClient.resetQueries({ queryKey: ["UserData", us_ev] });
      removeFirstUpdatedUser();
    }
  }, [dmEV, chatroomEV, frEV, updatedUser, queryClient, addNotif, currentUser]);

  useEffect(() => {
    function getChatroomMessage(ev: ISocChatroomMessage) {
      addChatroomEV(ev);
      //console.log("adding to que the chatroom message");
    }

    function getDMmessage(ev: ISocDirectMessage) {
      addDMEV(ev);
      //console.log("adding to que the dm message", ev);
    }

    function getFriendRequest(ev: ISocFriendRequest) {
      addFREV(ev);
      //console.log("adding to que the freind request", ev);
    }

    function getChallenge(ev: ISocChallenge) {
      const type = ev.special ? "SPECIAL" : "CLASSICAL";
      const accept = { id: ev.id };
      //console.log("challenge responce", accept);
      addNotif({
        type: type,
        from: ev.from,
        message: `${ev.from} has challenged you, do you accept?`,
        to: `/pong/${ev.id}`,
        onClick: () => userSocket.emit("accept", accept),
      });
    }

    function getUserUpdated(ev: string) {
      //console.log("getUserUpdated:", ev);
      addUpdatedUser(ev);
    }

    function getReconnect(ev: ISocReconnection) {
      //console.log("resume game");
      const type = ev.special ? "SPECIAL" : "CLASSICAL";
      addNotif({
        type: "INFO",
        message: `resume ${type.toLowerCase()} game ${ev.user1} vs ${ev.user2}`,
        to: `/pong/${ev.id}`,
      });
    }

    userSocket.on("chatroomMessage", getChatroomMessage);
    userSocket.on("dm", getDMmessage);
    userSocket.on("friendRequest", getFriendRequest);
    userSocket.on("challenge", getChallenge);
    userSocket.on("userUpdated", getUserUpdated);
    userSocket.on("reconnection", getReconnect);

    return () => {
      userSocket.off("chatroomMessage", getChatroomMessage);
      userSocket.off("dm", getDMmessage);
      userSocket.off("friendRequest", getFriendRequest);
      userSocket.off("challenge", getChallenge);
      userSocket.off("userUpdated", getUserUpdated);
      userSocket.off("reconnection", getReconnect);
    };
  }, [addNotif]);

  // useQuerySubscription();

  return (
    <div>
      <div>
        {/* <button onClick={() => getChatroomMessage("5")}>foobar</button> */}
      </div>
      {children}
    </div>
  );
}
