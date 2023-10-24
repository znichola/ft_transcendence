import { ReactNode, useEffect, useState } from "react";
import { useNotification } from "../functions/contexts";
import { chatroomSocket, dmSocket } from "../socket";
import { useChatroomMessages } from "../api/apiHooks";
import { Converstaion, IMessage } from "../interfaces";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  setChatroomMessage,
  useQuerySubscription,
} from "../api/queryMutations";
import { randString } from "../functions/utils";

// interface IFetch {
//   user
// }

export default function SocketNotificatinos({
  children,
}: {
  children: ReactNode;
}) {
  const { addNotif } = useNotification();
  const queryClient = useQueryClient();
  const [foo, setFoo] = useState(false);

  useEffect(() => {
    if (foo) {
      setFoo(false);
    }
  }, [foo, setFoo]);

  function getChatroomMessage(id: string) {
    setFoo(true);
    // const id = "5";
    addNotif({
      type: "MESSAGE",
      from: id,
      message: `message from ${id}`,
      to: `chatroom/${id}`,
    });
    queryClient.refetchQueries({ queryKey: ["ChatroomMessages", id] });
    console.log("new message in use effect", id);
    console.log("new message, foo is true", id);
  }

  useEffect(() => {
    chatroomSocket.on("newChatroomMessage", getChatroomMessage);

    return () => {
      chatroomSocket.off("newChatroomMessage", getChatroomMessage);
    };
  }, [queryClient]);

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
