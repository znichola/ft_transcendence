import {
  useMutDeleteUserDMs,
  usePostUserConvoMessage,
  useUserConvoMessages,
  useUserData,
} from "../api/apiHooks";
import { useNavigate, useParams } from "react-router-dom";
import { LoadingSpinnerMessage } from "../components/Loading";
import { ErrorMessage } from "../components/ErrorComponents";
import { Message } from "../components/ChatMassages";
import { IMessage, UserData } from "../interfaces";
import { useRef, useState } from "react";
import BoxMenu, { ButtonGeneric } from "../components/BoxMenu";
import { IconArrowUturnLeft } from "../components/Icons";
import { useAuth } from "../functions/contexts";

export default function DirectMessage() {
  const scrollRef = useRef<null | HTMLDivElement>(null);
  const { login42: t } = useParams<"login42">();
  const target_string = t || "";
  const { user: user_string } = useAuth();
  const { data: target, isSuccess: targetSuccess } = useUserData(target_string);
  const { data: user, isSuccess: userSuccess } = useUserData(user_string);
  // prettier-ignore
  const { data: messages, isLoading, isError } = useUserConvoMessages(user_string, target_string);

  // menu buttons
  const [buttonState, setButtonState] = useState<string>("UNSET");

  if (isLoading)
    return <LoadingSpinnerMessage message="Loading chat history ..." />;
  if (isError || !targetSuccess || !userSuccess) {
    //console.log("error this that");
    return <ErrorMessage message="Error fetching chat history" />;
  }

  return (
    <div className="relative flex h-full max-h-full min-h-0 w-full flex-grow-0 flex-col items-center">
      <BoxMenu
        resetBTN={() => setButtonState("UNSET")}
        heading={<LeaveConversationHeading user={target} />}
      >
        <ButtonGeneric
          icon={IconArrowUturnLeft}
          setBTNstate={setButtonState}
          buttonState={buttonState}
          checked="LEAVE"
        >
          <LeaveConversationUI user1={user_string} user2={target_string} />
        </ButtonGeneric>
      </BoxMenu>

      <div className="flex h-full min-h-0 w-full flex-col gap-1 overflow-auto bg-stone-100 p-3 px-10 pb-52 pt-56">
        {messages
          .sort(
            (m1, m2) =>
              new Date(m1.sentAt).getTime() - new Date(m2.sentAt).getTime(),
          )
          .map((m, i) => {
            const im: IMessage = { ...m, isBlocked: false };
            return (
              <Message
                sender={m.senderLogin42 === user_string ? user : target}
                message={im}
                left={m.senderLogin42 !== user_string}
                showIcon={
                  !(i < messages.length - 1)
                    ? true
                    : !(messages[i + 1].senderLogin42 === m.senderLogin42)
                }
                key={m.id}
              />
            );
          })}
        <div ref={scrollRef} className="h-1" />
      </div>
      <MessageInput scrollRef={scrollRef} user={user} target={target} />
    </div>
  );
}

function LeaveConversationHeading({ user }: { user: UserData }) {
  return (
    <div>
      <p className="text-left font-semibold">Converstaion with</p>
      <h1 className=" gradient-hightlight text-center text-5xl font-bold ">
        {user.name}
      </h1>
    </div>
  );
}

function LeaveConversationUI({
  user1,
  user2,
}: {
  user1: string;
  user2: string;
}) {
  const deletConvo = useMutDeleteUserDMs(user1, user2);
  const navigate = useNavigate();
  return (
    <>
      <div className="flex flex-col items-center justify-center gap-2 rounded-lg border-b-4 border-stone-200 bg-white p-3 pt-4 text-center shadow-xl">
        <p>
          Leave the conversation and delete all messages for <b>all</b> users,{" "}
          <br />
          this action is <b>permanent</b>.
        </p>
        <div className="flex items-center gap-2">
          <p className="text-rose-400">Think twice before you click!</p>
          <button
            onClick={() => {
              deletConvo.mutate({ user1, user2 });
              navigate("/message");
            }}
            className="h-10 rounded-lg border-b-2 border-stone-300 px-4 text-slate-500 transition-all duration-100 hover:border-b-4 hover:border-rose-400 hover:text-rose-500"
          >
            Leave
          </button>
        </div>
      </div>
    </>
  );
}

export function MessageInput({
  user,
  target,
  scrollRef,
}: {
  user: UserData;
  target: UserData;
  scrollRef: React.MutableRefObject<HTMLDivElement | null>;
}) {
  const [inputValue, setInputValue] = useState("");
  const addMessage = usePostUserConvoMessage(user.login42, target.login42);

  function sendMessage() {
    if (inputValue === "") return;
    addMessage.mutate({
      user1: user.login42,
      user2: target.login42,
      content: inputValue,
    });
    setInputValue("");
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <form
      className="absolute bottom-20 top-auto flex w-full justify-center px-20"
      onSubmit={(e) => {
        e.preventDefault();
        sendMessage();
      }}
      onKeyDown={(e) => {
        if (e.key == "Enter" && e.shiftKey == false) {
          e.preventDefault();
          sendMessage();
        }
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
