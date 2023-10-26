import { ReactNode, useEffect, useState } from "react";
import { useNotification } from "../functions/contexts";
import { chatroomSocket, dmSocket, userSocket } from "../socket";
import { ConvoMessage, RelationData, IMessage, ISocFriendRequest } from "../interfaces";
import { useQueryClient } from "@tanstack/react-query";

export default function SocketNotificatinos({
  children,
}: {
  children: ReactNode;
}) {
  const { addNotif } = useNotification();
  const queryClient = useQueryClient();

  // chatrooms
  const [chatroomEV, setChatroomEV] = useState<IMessage[]>([]);
  const addChatroomEV = (e: IMessage) => {
    setChatroomEV((prev) => [...prev, e]);
  };
  const removeFirstChatroomEV = () => {
    setChatroomEV((prev) => prev.filter((_, i) => i !== 0));
  };

  // dms
  const [dmEV, setDMEV] = useState<ConvoMessage[]>([]);
  const addDMEV = (e: ConvoMessage) => {
    setDMEV((prev) => [...prev, e]);
  };
  const removeFirstDMEV = () => {
    setDMEV((prev) => prev.filter((_, i) => i !== 0));
  };

  // friendRequests
  const [frEV, setFREV] = useState<ISocFriendRequest[]>([]);
  const addFREV = (e: ISocFriendRequest) => {
    setFREV((prev) => [...prev, e]);
  };
  const removeFirstFREV = () => {
    setFREV((prev) => prev.filter((_, i) => i !== 0));
  };

  useEffect(() => {
    const chat_ev = chatroomEV[0];
    if (chat_ev) {
      addNotif({
        type: "MESSAGE",
        from: "chatroom " + chat_ev.id,
        message: chat_ev.content,
        to: `chatroom/${chat_ev.id}`,
      });
      console.log("should be removing the chatroom ev");
      // queryClient.refetchQueries({ queryKey: ["ChatroomMessages", chat_ev.id] });
      console.log("asd", ["ChatroomMessages", chat_ev.id + ""]);
      queryClient.setQueryData(
        ["ChatroomMessages", chat_ev.id + ""],
        (prev: IMessage[] | undefined) => (prev ? [...prev, chat_ev] : prev),
      );
      removeFirstChatroomEV();
    }

    const dm_ev = dmEV[0];
    if (dm_ev) {
      addNotif({
        type: "MESSAGE",
        from: dm_ev.senderLogin42,
        message: dm_ev.content,
        to: `message/${dm_ev.senderLogin42}`,
      });
      console.log("should be removing the dm ev", dm_ev);
      // queryClient.refetchQueries({ queryKey: ["UserConversations", dm_ev.senderLogin42] });
      queryClient.setQueryData(
        ["UserConversations", dm_ev.senderLogin42],
        (prev: ConvoMessage[] | undefined) => (prev ? [...prev, dm_ev] : prev),
      );
      removeFirstDMEV();
    }

    const fr_ev = frEV[0];
    if (fr_ev) {
      addNotif({
        type: "INFO",
        from: fr_ev.name,
        message: "new friend request",
        to: `user/${fr_ev.from}`,
      });
      queryClient.refetchQueries({ queryKey: ["Friends"] });
      removeFirstFREV();
    }
  }, [dmEV, setDMEV, chatroomEV, setChatroomEV, frEV, setFREV]); //

  console.log("dms: ", chatroomEV);
  // console.log("chats: ", chatroomEV);

  function getChatroomMessage(ev: IMessage) {
    addChatroomEV(ev);
    console.log("adding to que the chatroom message");
  }

  function getDMmessage(ev: ConvoMessage) {
    addDMEV(ev);
    console.log("adding to que the dm message", ev);
  }

  function getFriendRequest(ev: ISocFriendRequest) {
    addFREV(ev);
    console.log("adding to que the dm message", ev);
  }

  useEffect(() => {
    chatroomSocket.on("newChatroomMessage", getChatroomMessage);
    dmSocket.on("newDirectMessage", getDMmessage);
    userSocket.on("newFriendRequest", getFriendRequest);

    return () => {
      chatroomSocket.off("newChatroomMessage", getChatroomMessage);
      dmSocket.off("newDirectMessage", getDMmessage);
    };
  }, []);

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
