import BoxMenu from "../components/BoxMenu";
import { IChatroom, IMessage, UserData } from "../interfaces";
import { ButtonGeneric } from "../components/BoxMenu";
import {
  IconAddUser,
  IconCheckBadge,
  IconCrown,
  IconGear,
  IconMinusCircle,
  IconPlusCircle,
  IconSearch,
  IconUserGroup,
} from "../components/Icons";
import { useRef, useState } from "react";
import { Form, Link, useParams } from "react-router-dom";
import {
  useChatroom,
  useChatroomMemebers,
  useChatroomMessages,
  useMutPostChatroomMessage,
  useUserData,
} from "../functions/customHook";
import { LoadingSpinnerMessage } from "../components/Loading";
import { UserIcon } from "../components/UserIcon";
import { ErrorMessage } from "../components/ErrorComponents";
import { Message } from "../components/ChatMassages";
import { useAuth } from "./AuthProvider";
import { Heading, PreHeading } from "../components/FormComponents";
// import ChatMessages from "../components/ChatMassages";

const fakeChannelUsers = [
  {
    chatroomId: 1,
    login42: "default42",
    role: "OWNER",
  },
  {
    chatroomId: 1,
    login42: "funnyuser6",
    role: "ADMIN",
  },
  {
    chatroomId: 1,
    login42: "funnyuser5",
    role: "ADMIN",
  },
  {
    chatroomId: 1,
    login42: "funnyuser3",
    role: "MEMBER",
  },
  {
    chatroomId: 1,
    login42: "test",
    role: "MEMBER",
  },
  {
    chatroomId: 1,
    login42: "rockstar88",
    role: "MEMBER",
  },
];

const fakeGeneralUsers = ["test", "default42", "znichola"];

export default function ChatroomChat() {
  const scrollRef = useRef<null | HTMLDivElement>(null);
  const [buttonState, setButtonState] = useState<string>("UNSET");

  const { id } = useParams<"id">();
  const chatroomID = id || "";

  const { data: chatroom, isError, isLoading } = useChatroom(chatroomID);

  const auAUth = useAuth();
  const { data: user, isSuccess } = useUserData(auAUth?.user);

  if (isLoading)
    return <LoadingSpinnerMessage message="Loading chatroom data ..." />;
  if (!isSuccess || isError)
    return <ErrorMessage message="error loaidng current uer" />;

  const menuBTNs = [
    {
      c: "MANAGE_USERS",
      i: IconUserGroup,
      f: <ManageUsersUI chatroom={chatroom} />,
    },
    {
      c: "ADD_USERS",
      i: IconAddUser,
      f: <AddUsersUI chatroom={chatroom} />,
    },
    {
      c: "SETTINGS",
      i: IconGear,
      f: <SettingsButtonUI chatroom={chatroom} />,
    },
  ];

  return (
    <div className="relative flex h-full max-h-full min-h-0 w-full flex-grow-0 flex-col items-center">
      <BoxMenu
        resetBTN={() => setButtonState("UNSET")}
        heading={<ChatroomHeading chatroom={chatroom} />}
      >
        {menuBTNs.map((b) => (
          <ButtonGeneric
            key={b.c}
            icon={b.i}
            setBTNstate={setButtonState}
            buttonState={buttonState}
            checked={b.c}
          >
            {b.f}
          </ButtonGeneric>
        ))}
      </BoxMenu>

      <div className="absolute bottom-0 left-0 h-[7%] w-full bg-gradient-to-t from-stone-50 to-transparent">
        <MessageList cu={user} chatroomID={chatroomID} />
        <ChatroomMessageInput
          scrollRef={scrollRef}
          user={user}
          chatroomID={chatroomID}
        />
      </div>
    </div>
  );
}

function MessageList({ cu, chatroomID }: { cu: UserData; chatroomID: string }) {
  const {
    data: messages,
    isLoading,
    isError,
  } = useChatroomMessages(chatroomID);
  const scrollRef = useRef<null | HTMLDivElement>(null);
  if (isLoading)
    return <LoadingSpinnerMessage message="Loading chat history ..." />;
  if (isError) return <ErrorMessage message="Error fetching chat history" />;
  return (
    <div className="flex h-full min-h-0 w-full flex-col gap-1 overflow-auto bg-stone-100 p-3 px-10 pb-52 pt-56">
      {messages
        .sort(
          (m1, m2) =>
            new Date(m1.sentAt).getTime() - new Date(m2.sentAt).getTime(),
        )
        .map((m) => (
          <MessageWrapper key={m.id} m={m} cu={cu} />
        ))}
      <div ref={scrollRef} className="h-1" />
    </div>
  );
}

function MessageWrapper({ m, cu }: { m: IMessage; cu: UserData }) {
  const { data: target, isLoading, isError } = useUserData(m.senderLogin42);
  if (isLoading)
    return <LoadingSpinnerMessage message="Loading chat history ..." />;
  if (isError) {
    console.log("error this that");
    return <ErrorMessage message="Error fetching chat history" />;
  }

  const sender = m.senderLogin42 === cu.login42 ? cu : target;
  const senderSelf = m.senderLogin42 === cu.login42;
  return <Message sender={sender} text={m.content} left={senderSelf} />;
}

export function ChatroomMessageInput({
  user,
  chatroomID,
  scrollRef,
}: {
  chatroomID: string;
  user: UserData;
  scrollRef: React.MutableRefObject<HTMLDivElement | null>;
}) {
  const [inputValue, setInputValue] = useState("");
  const addMessage = useMutPostChatroomMessage(chatroomID);

  function sendMessage() {
    if (inputValue === "") return;
    addMessage.mutate({
      senderLogin42: user.login42,
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

function ChatroomHeading({ chatroom }: { chatroom: IChatroom }) {
  return (
    <div>
      <PreHeading text={chatroom.status.toLocaleLowerCase() + " chatroom"} />
      <Heading title={chatroom.name} />
    </div>
  );
}

function ManageUsersUI({ chatroom }: { chatroom: IChatroom }) {
  const [searchValue, setSearchvalue] = useState("");
  const {
    data: channelMemebres,
    isLoading,
    isError,
  } = useChatroomMemebers(chatroom.id + "");
  if (isLoading)
    return <LoadingSpinnerMessage message="Loading chatroom memebers ..." />;
  if (isError)
    return <ErrorMessage message="Error fetching chatroom memebers" />;
  // {data : chatroomUsers, isLoading, isError} useQuery({queryKey: ""})
  console.log(channelMemebres);
  return (
    <>
      <ul className="flex flex-col justify-center gap-2 rounded-lg border-b-4 border-stone-200 bg-white p-3 pt-4 shadow-xl ">
        <div className="flex justify-center  ">
          <div className="max-w-md grow ">
            <UserSearch setSearchValue={(v: string) => setSearchvalue(v)} />
          </div>
        </div>
        {channelMemebres.map((u) =>
          u.login42.toLowerCase().startsWith(searchValue.toLowerCase()) ? ( //Ajouter la comparaison avec le nom du User
            <ManageUserCard key={u.login42} login42={u.login42} role={u.role} />
          ) : (
            <></>
          ),
        )}
      </ul>
    </>
  );
}

function AddUsersUI({ chatroom }: { chatroom: IChatroom }) {
  const allUsers = fakeGeneralUsers;
  return (
    <>
      <ul className="flex flex-col justify-center gap-2 rounded-lg border-b-4 border-stone-200 bg-white p-3 pt-4 shadow-xl ">
        <div className="flex justify-center  ">
          <div className="max-w-md grow ">
            <UserSearch
              setSearchValue={(v) => alert("Not implemented: " + v)}
            />
          </div>
        </div>
        {allUsers.map((u) => (
          <AddUsersCard key={u} login42={u} />
        ))}
      </ul>
    </>
  );
}

function SettingsButtonUI({ chatroom }: { chatroom: IChatroom }) {
  return (
    <>
      <div className="flex flex-col justify-center gap-2 rounded-lg border-b-4 border-stone-200 bg-white p-3 pt-4 shadow-xl ">
        <div className="h-14">foobar, some settings and stuff</div>
      </div>
    </>
  );
}

// here!
function UserSearch({
  setSearchValue,
}: {
  setSearchValue: (v: string) => void;
}) {
  return (
    <>
      <div className="rounded-xl border border-slate-300 p-2 focus-within:border-rose-500 ">
        <Form className="flex h-full w-full pl-3 ">
          <input
            className="focus: w-full outline-none  focus:border-none focus:ring-0"
            type="search"
            placeholder="search channel users"
            onChange={(e) => setSearchValue(e.currentTarget.value)}
          />
          <div className="border-l border-slate-300">
            <button className="flex h-full w-10 items-center justify-center  text-slate-300">
              <IconSearch />
            </button>
          </div>
        </Form>
      </div>
    </>
  );
}

function AddUsersCard({ login42 }: { login42: string }) {
  const { data: user, isLoading, isError } = useUserData(login42);

  if (isLoading) return <LoadingSpinnerMessage message="loading user data" />;
  if (isError) return <div>error fetching user</div>;
  return (
    <>
      <li className="flex items-center gap-2  px-2 py-1">
        <Link to={"/user/" + login42}>
          <UserIcon user={login42} />
        </Link>
        <div className="grow ">{user.name}</div>
        <IconPlusCircle className="h-5 w-5 align-middle text-slate-200 hover:rounded-full hover:bg-green-100 hover:text-green-300" />
      </li>
    </>
  );
}

// "MEMBER" | "ADMIN" | "OWNER"
function ManageUserCard({ login42, role }: { login42: string; role: string }) {
  const { data: user, isLoading, isError } = useUserData(login42);

  if (isLoading) return <LoadingSpinnerMessage message="loading user data" />;
  if (isError) return <div>error fetching user</div>;
  return (
    <>
      <li className="flex items-center gap-2  px-2 py-1">
        <UserIcon user={login42} />
        <div className="grow ">{user.name}</div>
        <AdminButton userRole="ADMIN" cardRole={role} />
        <KickUserButton userRole="ADMIN" cardRole={role} />
      </li>
    </>
  );
}

function AdminButton({
  userRole,
  cardRole,
}: {
  userRole: string;
  cardRole: string;
}) {
  const canModify = userRole == "ADMIN" || userRole === "OWNER";
  if (cardRole === "OWNER") {
    return <IconCrown className="h-5 w-5 align-middle text-amber-400" />;
  }
  if (cardRole === "ADMIN") {
    return (
      <IconCheckBadge
        className={`h-5 w-5 align-middle text-amber-400 ${
          canModify
            ? " hover:rounded-full hover:bg-amber-300 hover:text-amber-100"
            : ""
        }`}
      />
    );
  }
  if (cardRole === "MEMBER") {
    if (userRole === "MEMBER") return <div className="h-5 w-5 " />;
    return (
      <IconCheckBadge
        className={`h-5 w-5 align-middle text-slate-200 ${
          canModify
            ? " hover:rounded-full  hover:bg-amber-200 hover:text-amber-400"
            : ""
        }`}
      />
    );
  }
}

function KickUserButton({
  userRole,
  cardRole,
}: {
  userRole: string;
  cardRole: string;
}) {
  if (userRole === "MEMBER") {
    return <></>;
  }
  if (cardRole === "OWNER") {
    return <div className="h-5 w-5 " />;
  }
  if (userRole == "ADMIN" || userRole === "OWNER") {
    return (
      <IconMinusCircle className="h-5 w-5 align-middle text-slate-200 hover:rounded-full hover:bg-rose-100 hover:text-rose-300" />
    );
  }
  return <IconMinusCircle className="h-5 w-5 align-middle text-slate-200" />;
}

function statusColor(status: UserData["status"]) {
  switch (status) {
    case "ONLINE":
      return "ring-green-600";
    case "OFFLINE":
      return "ring-gray-300";
    case "INGAME":
      return "ring-blue-400";
    case "UNAVAILABLE":
      return "ring-red-500";
    default:
      return "ring-ping-700";
  }
}
