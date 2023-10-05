import {
  useCurrentUser,
  usePostUserConvoMessage,
  useUserConvoMessages,
  useUserData,
} from "../functions/customHook";
import ChatRoomMenu from "../components/ChatRoomMenu";
import { useParams } from "react-router-dom";
import { LoadingSpinnerMessage } from "../components/Loading";
import { ErrorMessage } from "../components/ErrorComponents";
import { Message } from "../components/ChatMassages";
import { UserData } from "../interfaces";
import { useState } from "react";

export default function DirectMessage() {
  const { login42: target_string } = useParams<"login42">();
  const { data: user_string } = useCurrentUser();
  const { data: target, isSuccess: targetSuccess } = useUserData(target_string);
  const { data: user, isSuccess: userSuccess } = useUserData(user_string);
  const {
    data: messages,
    isLoading,
    isError,
  } = useUserConvoMessages(user_string, target_string || "err");
  if (isLoading)
    return <LoadingSpinnerMessage message="Loading chat history ..." />;
  if (isError || !targetSuccess || !userSuccess) {
    console.log("error this that");
    return <ErrorMessage message="Error fetching chat history" />;
  }

  return (
    <div className="relative flex h-full max-h-full min-h-0 w-full flex-grow-0 flex-col items-center">
      <ChatRoomMenu title={target.name} type="dm" />
      <div className="flex h-full min-h-0 w-full flex-col gap-1 overflow-auto bg-stone-100 p-3 px-10 pb-52 pt-56">
        {messages
          .sort(
            (m1, m2) =>
              new Date(m1.sentAt).getTime() - new Date(m2.sentAt).getTime(),
          )
          .map((m) => {
            const sender = m.senderLogin42 === user_string ? user : target;
            const senderSelf = m.senderLogin42 === user_string;
            return (
              <Message
                sender={sender}
                text={m.content}
                left={senderSelf}
                key={m.id}
              />
            );
          })}
      </div>
      <MessageInput user={user} target={target} />
    </div>
  );
}

function MessageInput({ user, target }: { user: UserData; target: UserData }) {
  const [inputValue, setInputValue] = useState("");
  const addMessage = usePostUserConvoMessage(user.login42, target.login42);

  function sendMessage() {
    console.log(user.login42, target.login42, inputValue);
    addMessage.mutate({
      user1: user.login42,
      user2: target.login42,
      content: inputValue,
    });
    setInputValue("");
  }

  return (
    <form
      className="absolute bottom-20 top-auto flex w-full justify-center px-20"
      onKeyDown={(e) => {
        if (e.key == "Enter" && e.shiftKey == false) sendMessage();
      }}
      onSubmit={(e) => {
        e.preventDefault();
        sendMessage();
      }}
    >
      <textarea
        onChange={(e) => setInputValue(e.currentTarget.value)}
        className={`z-10 h-32 w-full rounded-full border-b-4 px-6 shadow-lg outline-none ${
          inputValue.length < 85 ? "pt-2" : "pt-3"
        } resize-none transition-all duration-700`}
        style={{
          maxWidth: inputValue.length < 50 ? "25rem" : "40rem",
          maxHeight: inputValue.length < 80 ? "2.5rem" : "5rem",
        }}
        placeholder="Enter a message..."
        value={inputValue}
      />
    </form>
  );
}
