import { QueryClient, useQueryClient } from "@tanstack/react-query";
import { Converstaion, IMessage, TUserStatus, UserData } from "../interfaces";
import { useEffect } from "react";
import { userSocket } from "../socket";
import { useNotification } from "../functions/contexts";
import { randString } from "../functions/utils";

export function setStatus(qc: QueryClient, user: string, status: TUserStatus) {
  qc.setQueryData(["UserData", user], (oldUser: UserData | undefined) =>
    oldUser ? { ...oldUser, status: status } : oldUser,
  );
}

export function setChatroomMessage(
  qc: QueryClient,
  id: string,
  message: IMessage,
) {
  qc.setQueryData(["ChatroomMessages", id], (prev: IMessage[] | undefined) =>
    prev ? [...prev, message] : prev,
  );
}

export const useQuerySubscription = () => {
  const { addNotif } = useNotification();
  const queryClient = useQueryClient();

  useEffect(() => {
    function getChatroomMessage(id: string) {
      // addNotif({
      //   type: "MESSAGE",
      //   from: id,
      //   message: `message from ${id}`,
      //   to: `chatroom/${id}`,
      // });
      queryClient.refetchQueries({ queryKey: ["ChatroomMessages", id] });

      // CHECK HERE: this used to the the refetch qery, maybe it's wrong !
      // setTimeout(() => {
      //   queryClient.refetchQueries({ queryKey: ["ChatroomMessages", id] });
      // }, 500);

      // const m: IMessage = {
      //   id: parseInt(id) + Math.random(),
      //   senderLogin42: "default42",
      //   content: "this is message content",
      //   sentAt: Date.toString(),
      //   isBlocked: false,
      // };
      // // setChatroomMessage(queryClient, id, m);

      // queryClient.setQueryData(
      //   ["ChatroomMessages", id],
      //   (prev: IMessage[] | undefined) => (prev ? [...prev, m] : prev),
      // );

      console.log("new message", id);
    }

    function getChatroomMessageDM(m: Converstaion) {
      addNotif({
        type: "MESSAGE",
        from: m.id + randString(3),
        message: `message from ${m}`,
      });
      queryClient.refetchQueries([
        "UserConvoMessages",
        m.user1Login42,
        m.user2Login42,
      ]);
    }

    userSocket.on("newChatroomMessage", getChatroomMessage);
    userSocket.on("newDirectMessage", getChatroomMessageDM);

    return () => {
      userSocket.off("newChatroomMessage", getChatroomMessage);
      userSocket.off("newDirectMessage", getChatroomMessageDM);
    };
  }, [queryClient, addNotif]);
};

// const useReactQuerySubscription = () => {
//   const queryClient = useQueryClient()
//   React.useEffect(() => {
//     const websocket = new WebSocket('wss://echo.websocket.org/')
//     websocket.onopen = () => {
//       console.log('connected')
//     }
//     websocket.onmessage = (event) => {
//       const data = JSON.parse(event.data)
//       queryClient.setQueriesData(data.entity, (oldData) => {
//         const update = (entity) =>
//           entity.id === data.id
//             ? { ...entity, ...data.payload }
//             : entity
//         return Array.isArray(oldData)
//           ? oldData.map(update)
//           : update(oldData)
//       })
//     }

//     return () => {
//       websocket.close()
//     }
//   }, [queryClient])
// }
