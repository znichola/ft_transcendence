import BoxMenu from "../components/BoxMenu";
import {
  IChatroom,
  IMember,
  IMessage,
  TChatroomRole,
  UserData,
} from "../interfaces";
import { ButtonGeneric } from "../components/BoxMenu";
import {
  IconAddUser,
  IconArrowUturnLeft,
  IconBolt,
  IconCheckBadge,
  IconCrown,
  IconMinusCircle,
  IconMute,
  IconPasswordHide,
  IconPasswordShow,
  IconPlusCircle,
  IconSearch,
  IconStop,
  IconTrash,
  IconUserGroup,
} from "../components/Icons";
import { useRef, useState } from "react";
import { Form, Link, useNavigate, useParams } from "react-router-dom";
import {
  useChatroom,
  useChatroomMembers,
  useChatroomMessages,
  useChatroomBanned,
  useMutDeleteChatroomBan,
  useMutDeleteChatroomMember,
  useMutPostChatroomBan,
  useMutPostChatroomMember,
  useMutPostChatroomMessage,
  useMutPutChatroomRole,
  useUserData,
  useMutChatroomMute,
  useMutDeleteChatroomMute,
  useUserChatrooms,
  useMutJoinChatroom,
  useMutDeleteChatroom,
} from "../api/apiHooks";
import { LoadingSpinnerMessage } from "../components/Loading";
import { UserIcon } from "../components/UserIcon";
import { ErrorMessage } from "../components/ErrorComponents";
import { Message } from "../components/ChatMassages";
import { useAuth } from "../functions/contexts";
import { Heading, PreHeading } from "../components/FormComponents";
import { UseQueryResult, useQuery } from "@tanstack/react-query";
import { authApi } from "../api/axios";
import {
  GenericActionBTN,
  IChatroomManageBTN,
  Pop,
} from "../components/ChatroomChatBTNs";
import { isMatch } from "../functions/utils";
import { convertPerms } from "../functions/utils";
import { SideButton2 } from "../components/UserInfoCard";
import { userSocket } from "../socket";

function JoinChatRoom({ id, login42 }: { id: string; login42: string }) {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { data: chatroomData, isLoading, isError } = useChatroom(id);
  const joinChatroom = useMutJoinChatroom();

  if (isLoading) {
    return <LoadingSpinnerMessage message="Loading chatroom data..." />;
  }
  if (isError) {
    return (
      <ErrorMessage message="Error, chat room does not exist or has been deleted" />
    );
  }

  return (
    <form
      className="flex flex-col items-center gap-3 rounded-xl border-b-4 bg-stone-50 p-7 font-semibold shadow-lg"
      onSubmit={(e) => {
        e.preventDefault();
        joinChatroom.mutate({
          chatroom: chatroomData,
          payload: { login42: login42, password: password },
        });
      }}
    >
      <h1 className="text-3xl">
        {"You are about to join : " + chatroomData.name}
      </h1>
      <div
        className={
          "flex items-center " +
          (chatroomData.status == "PROTECTED" ? "" : "hidden")
        }
      >
        <input
          className="rounded-full p-2 pr-8"
          type={showPassword ? "text" : "password"}
          onChange={(e) => setPassword(e.currentTarget.value)}
          value={password}
          placeholder="Enter room password"
        />
        <div
          className="-translate-x-7"
          onClick={() => setShowPassword(!showPassword)}
        >
          {showPassword ? <IconPasswordHide /> : <IconPasswordShow />}
        </div>
      </div>
      <button className="rounded-lg bg-gradient-to-br from-fuchsia-600 to-orange-500 p-2 text-2xl font-bold text-white">
        Join
      </button>
    </form>
  );
}

export default function ChatroomManager() {
  const { id } = useParams<"id">();
  const chatroomID = id || "";
  const currentUser = useAuth()?.user || "";
  const { data: chatrooms, isLoading, isError } = useUserChatrooms(currentUser);

  console.log("Username = ", currentUser);

  if (currentUser == "" || isLoading) {
    return (
      <LoadingSpinnerMessage
        message={"Loading your " + (isLoading ? "member" : "user") + " data..."}
      />
    );
  }
  if (isError) {
    return <ErrorMessage message={"Error: failed to load your member data"} />;
  }

  if (!chatrooms.find((c) => c.id.toString() == chatroomID)) {
    return <JoinChatRoom id={chatroomID} login42={currentUser} />;
  }
  return <ChatroomChat />;
}

//TODO peut passer le currentUser en paramètre
export function ChatroomChat() {
  const currentUser = useAuth()?.user || "";
  const scrollRef = useRef<null | HTMLDivElement>(null);
  const [buttonState, setButtonState] = useState<string>("UNSET");
  const { id } = useParams<"id">();
  const chatroomID = id || "";

  const {
    data: chatroom,
    isError: isChatError,
    isLoading: isChatLoading,
  } = useChatroom(chatroomID);

  const {
    data: members,
    isLoading: isMembersLoading,
    isError: isMembersError,
    isSuccess: isMembersSuccess,
  } = useChatroomMembers(chatroomID);

  //Pour test dev TODO enlever
  const currentMember =
    isMembersSuccess && currentUser != ""
      ? members?.find((m) => m.login42 == currentUser)
      : undefined;
  const hasAdminRights: boolean =
    !!currentMember && currentMember.role != "MEMBER";
  const bannedUserQuery = useChatroomBanned(hasAdminRights ? chatroomID : "");

  const auAUth = useAuth();
  const { data: user, isSuccess } = useUserData(auAUth?.user);

  //Loading cases
  if (isChatLoading)
    //TODO : should we display error directly if chatroomID = ""
    return <LoadingSpinnerMessage message="Loading chatroom data ..." />;
  if (isMembersLoading)
    return <LoadingSpinnerMessage message="Loading members data ..." />;

  //Error cases
  if (!isSuccess || !currentMember)
    return <ErrorMessage message="error loading current user" />;
  if (isChatError) return <ErrorMessage message="error loading Chatroom" />;
  if (isMembersError) return <ErrorMessage message="error loading Members" />;

  const buttonParams: IButtonsData = {
    chatroom: chatroom,
    currentMember: currentMember,
    chatroomMembers: members,
  };

  const menuBTNs = [
    {
      c: "MANAGE_USERS",
      i: IconUserGroup,
      f: <ManageUsersUI {...buttonParams} />,
    },
    {
      c: "LEAVE",
      i: IconArrowUturnLeft,
      f: <LeaveUI {...buttonParams} />,
    },
  ];
  const adminMenuBTNs = [
    {
      c: "ADD_USERS",
      i: IconAddUser,
      f: (
        <AddUsersUI
          chatroom={chatroom}
          members={members}
          currentMember={currentMember}
          bannedUsersQuery={bannedUserQuery}
        />
      ),
    },
    // {
    //   c: "SETTINGS",
    //   i: IconGear,
    //   f: (
    //     <SettingsButtonUI
    //       chatroom={chatroom}
    //       currentMember={currentMember}
    //       bannedUsersQuery={bannedUserQuery}
    //     />
    //   ),
    // },
  ];
  const ownerMenuBTN = [
    {
      c: "DELETE",
      i: IconTrash,
      f: <DeleteUI chatroom={chatroom} />,
    },
  ];
  const usedButtons = hasAdminRights
    ? currentMember.login42 == chatroom.ownerLogin42
      ? menuBTNs.concat(adminMenuBTNs, ownerMenuBTN)
      : menuBTNs.concat(adminMenuBTNs)
    : menuBTNs;

  return (
    <div className="relative flex h-full max-h-full min-h-0 w-full flex-grow-0 flex-col items-center">
      <BoxMenu
        resetBTN={() => setButtonState("UNSET")}
        heading={<ChatroomHeading chatroom={chatroom} />}
      >
        {usedButtons.map((b) => (
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
      <MessageList cu={user} chatroomID={chatroomID} scrollRef={scrollRef} />
      <ChatroomMessageInput
        scrollRef={scrollRef}
        user={user}
        chatroomID={chatroomID}
      />
    </div>
  );
}

function MessageList({
  cu,
  chatroomID,
  scrollRef,
}: {
  cu: UserData;
  chatroomID: string;
  scrollRef: React.MutableRefObject<HTMLDivElement | null>;
}) {
  const {
    data: messages,
    isLoading,
    isError,
  } = useChatroomMessages(chatroomID);
  if (isLoading)
    return <LoadingSpinnerMessage message="Loading chat history ..." />;
  if (isError) return <ErrorMessage message="Error fetching chat history" />;

  return (
    <div className="flex h-full min-h-0 w-full flex-col gap-1 overflow-auto bg-stone-100 p-3 px-28 pb-52 pt-56">
      {messages
        .sort(
          (m1, m2) =>
            new Date(m1.sentAt).getTime() - new Date(m2.sentAt).getTime(),
        )
        .map((m, i) => (
          <MessageWrapper
            key={m.id}
            m={m}
            cu={cu}
            showIcon={
              !(i < messages.length - 1)
                ? true
                : !(messages[i + 1].senderLogin42 === m.senderLogin42)
            }
          />
        ))}
      <div ref={scrollRef} className="h-1" />
    </div>
  );
}

function MessageWrapper({
  m,
  cu,
  showIcon,
}: {
  m: IMessage;
  cu: UserData;
  showIcon: boolean;
}) {
  const { data: target, isLoading, isError } = useUserData(m.senderLogin42);
  if (isLoading) return <LoadingSpinnerMessage message="Loading user ..." />;
  if (isError) return <ErrorMessage message="Error fetching user" />;

  const sender = m.senderLogin42 === cu.login42 ? cu : target;
  const senderSelf = m.senderLogin42 === cu.login42;
  return (
    <Message
      sender={sender}
      message={m}
      left={!senderSelf}
      showIcon={showIcon}
    />
  );
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
    console.log("Ref : ", scrollRef.current);
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

interface IButtonsData {
  chatroom: IChatroom;
  currentMember: IMember;
  chatroomMembers: IMember[];
}

function DeleteUI({ chatroom }: { chatroom: IChatroom }) {
  const deleteChatroom = useMutDeleteChatroom(chatroom.id.toString());
  const navigate = useNavigate();

  return (
    <div className="flex -translate-y-7 flex-col items-center justify-center gap-2 rounded-lg border-b-4 border-stone-200 bg-white p-3 pt-4 text-center shadow-xl">
      <p>{"Delete the chatroom (all messages will be lost forever !)"}</p>
      <div className="flex items-center gap-2">
        <p className="text-rose-400">Think twice before you click!</p>
        <button
          onClick={() => {
            deleteChatroom.mutate();
            navigate("/chatroom/");
          }}
          className="h-10 rounded-lg border-b-2 border-stone-300 px-4 text-slate-500 transition-all duration-100 hover:border-b-4 hover:border-rose-400 hover:text-rose-500"
        >
          {"Abandon chatroom and Leave"}
        </button>
      </div>
    </div>
  );
}

function LeaveUI({
  chatroom,
  currentMember,
}: {
  chatroom: IChatroom;
  currentMember: IMember;
}) {
  const leave = useMutDeleteChatroomMember(chatroom.id.toString());
  const isOwner = currentMember.login42 == chatroom.ownerLogin42;
  const navigate = useNavigate();

  return (
    <div className="flex -translate-y-7 flex-col items-center justify-center gap-2 rounded-lg border-b-4 border-stone-200 bg-white p-3 pt-4 text-center shadow-xl">
      <p>
        {"Leave the chat " +
          (isOwner
            ? "(ownership will be transferred to someone else)"
            : "(your messages will not be deleted)")}
      </p>
      <div className="flex items-center gap-2">
        {isOwner ? (
          <p className="text-rose-400">Think twice before you click!</p>
        ) : (
          <></>
        )}
        <button
          onClick={() => {
            leave.mutate({ login42: currentMember.login42, selfDelete: true });
            navigate("/chatroom/");
          }}
          className="h-10 rounded-lg border-b-2 border-stone-300 px-4 text-slate-500 transition-all duration-100 hover:border-b-4 hover:border-rose-400 hover:text-rose-500"
        >
          {isOwner ? "Abandon chatroom and Leave" : "Leave"}
        </button>
      </div>
    </div>
  );
}

function ManageUsersUI({
  chatroom,
  currentMember,
  chatroomMembers,
}: IButtonsData) {
  const [searchValue, setSearchvalue] = useState("");
  return (
    <ul className="flex flex-col justify-center gap-2 rounded-lg border-b-4 border-stone-200 bg-white p-3 pt-4 shadow-xl ">
      <div className="flex justify-center  ">
        <div className="max-w-md grow ">
          <UserSearch setSearchValue={(v: string) => setSearchvalue(v)} />
        </div>
      </div>
      {chatroomMembers.map((u) => (
        <ManageUserCard
          searchValue={searchValue}
          key={u.login42}
          cardLogin42={u.login42}
          cardMember={u}
          currentMember={currentMember}
          id={chatroom.id + ""}
        />
      ))}
    </ul>
  );
}

function AddUsersUI({
  chatroom,
  members,
  currentMember,
  bannedUsersQuery,
}: {
  chatroom: IChatroom;
  members: IMember[];
  currentMember: IMember;
  bannedUsersQuery: UseQueryResult<string[], unknown>;
}) {
  const [searchValue, setSearchvalue] = useState("");
  const searchParams = {
    name: searchValue != "" ? searchValue : undefined,
  };
  const {
    data: users,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["UserList", searchParams],
    queryFn: () =>
      authApi
        .get<string[]>("/user/", {
          params: { ...searchParams, page: 1 },
        })
        .then((res) => res.data),
    staleTime: 5 * (60 * 1000), // 5 mins
    cacheTime: 10 * (60 * 1000), // 10 mins
  });
  return (
    <ul className="flex flex-col justify-center gap-2 rounded-lg border-b-4 border-stone-200 bg-white p-3 pt-4 shadow-xl ">
      <div className="flex justify-center  ">
        <div className="max-w-md grow ">
          <UserSearch setSearchValue={(v: string) => setSearchvalue(v)} />
        </div>
      </div>
      {isLoading || bannedUsersQuery.isLoading ? (
        <LoadingSpinnerMessage
          message={"Loading " + isLoading ? "" : "banned" + " users data..."}
        />
      ) : isError || bannedUsersQuery.isError ? (
        <ErrorMessage
          message={
            "Error: failed to load " + isLoading ? "" : "banned " + "users data"
          }
        />
      ) : users.length == 0 ? (
        <p>there are no users</p>
      ) : (
        users.map((u) =>
          !!bannedUsersQuery.data &&
          bannedUsersQuery.data.find((b) => b === u) ? (
            <ManageBannedUsersCard
              searchValue={searchValue}
              key={u}
              cardLogin42={u}
              currentMember={currentMember}
              id={chatroom.id + ""}
            />
          ) : (
            <AddUsersCard
              isMember={members.find((m) => m.login42 === u) ? true : false}
              key={u}
              login42={u}
              userRole={currentMember?.role}
              id={chatroom.id + ""}
            />
          ),
        )
      )}
    </ul>
  );
}

// function SettingsButtonUI({
//   chatroom,
//   currentMember,
//   bannedUsersQuery,
// }: {
//   chatroom: IChatroom;
//   currentMember: IMember;
//   bannedUsersQuery: UseQueryResult<string[], unknown>;
// }) {
//   const [searchValue, setSearchvalue] = useState("");

//   return (
//     <ul className="flex flex-col justify-center gap-2 rounded-lg border-b-4 border-stone-200 bg-white p-3 pt-4 shadow-xl ">
//       <div className="flex justify-center  ">
//         <div className="max-w-md grow ">
//           <UserSearch setSearchValue={(v: string) => setSearchvalue(v)} />
//         </div>
//       </div>
//       <p className="text-center">The list of banner users</p>
//       {bannedUsersQuery.isLoading ? (
//         <LoadingSpinnerMessage message="Loading banned users..." />
//       ) : bannedUsersQuery.isError ? (
//         <ErrorMessage message="Error loading banned users" />
//       ) : bannedUsersQuery.data ? (
//         bannedUsersQuery.data.map((u) => (
//           <ManageBannedUsersCard
//             searchValue={searchValue}
//             key={u}
//             cardLogin42={u}
//             currentMember={currentMember}
//             id={chatroom.id + ""}
//           />
//         ))
//       ) : (
//         <></>
//       )}
//     </ul>
//   );
// }

function ManageBannedUsersCard({
  id,
  cardLogin42,
  currentMember,
  searchValue,
}: {
  id: string;
  cardLogin42: string;
  currentMember?: IMember;
  searchValue: string;
}) {
  const { data: user, isLoading, isError } = useUserData(cardLogin42);
  if (isLoading) return <LoadingSpinnerMessage message="loading user data" />;
  if (isError) return <LoadingSpinnerMessage message="error fetching user" />;
  if (!isMatch(cardLogin42, searchValue, user.name)) return <></>;
  return (
    <li className="flex items-center gap-2 px-2 py-1">
      <UserIcon user={cardLogin42} />
      <div className="grow ">{user.name}</div>
      <BanUserBTN
        id={id}
        cardMember={undefined}
        currentMember={currentMember}
        cardLogin42={cardLogin42}
      />
    </li>
  );
}

function UserSearch({
  setSearchValue,
}: {
  setSearchValue: (v: string) => void;
}) {
  return (
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
  );
}

function AddUsersCard({
  login42,
  id,
  isMember,
  userRole,
}: {
  login42: string;
  id: string;
  isMember: boolean;
  userRole?: TChatroomRole;
  cardRole?: TChatroomRole;
}) {
  const { data: user, isLoading, isError } = useUserData(login42);
  const mutMembers = useMutPostChatroomMember(id);

  if (isLoading) return <LoadingSpinnerMessage message="loading user data" />;
  if (isError) return <div>error fetching user</div>;
  return (
    <>
      <li className="flex items-center gap-2  px-2 py-1">
        <Link to={"/user/" + login42}>
          <UserIcon user={login42} />
        </Link>
        <div className="grow ">{user.name}</div>
        {isMember || userRole === undefined ? (
          <></>
        ) : (
          <button onClick={() => mutMembers.mutate(login42)}>
            <IconPlusCircle className="h-5 w-5 align-middle text-slate-200 hover:rounded-full hover:bg-green-100 hover:text-green-300" />
          </button>
        )}
      </li>
    </>
  );
}

// "MEMBER" | "ADMIN" | "OWNER"
function ManageUserCard({
  cardLogin42,
  id,
  cardMember,
  currentMember,
  searchValue,
}: {
  cardLogin42: string;
  id: string;
  currentMember?: IMember;
  cardMember?: IMember;
  searchValue: string;
}) {
  const { data: user, isLoading, isError } = useUserData(cardLogin42);

  if (isLoading) return <LoadingSpinnerMessage message="loading user data" />;
  if (isError) return <div>error fetching user</div>;
  if (!isMatch(cardLogin42, searchValue, user.name)) return <></>;

  return (
    <li className="flex items-center gap-2 px-2 py-1">
      <UserChallenge user={user} currentUser={currentMember?.login42} />
      <UserIcon user={cardLogin42} />
      <div className="grow ">{user.name}</div>
      <BanUserBTN
        id={id}
        cardMember={cardMember}
        currentMember={currentMember}
        cardLogin42={cardLogin42}
      />
      <AddRemoveUserBTN
        id={id}
        cardMember={cardMember}
        currentMember={currentMember}
        cardLogin42={cardLogin42}
      />
      <MuteUserBTN
        id={id}
        cardMember={cardMember}
        currentMember={currentMember}
        cardLogin42={cardLogin42}
      />
      <ManageAdminsBTN
        id={id}
        cardMember={cardMember}
        currentMember={currentMember}
        cardLogin42={cardLogin42}
      />
    </li>
  );
}

function UserChallenge({
  user,
  currentUser,
}: {
  user: UserData;
  currentUser?: string;
}) {
  return (
    <div className="flex h-8">
      <SideButton2
        message={"Play pong"}
        a1={"classical"}
        a2={"special"}
        to1={`/pong/${currentUser}/vs/${user.login42}/classical`}
        onClick1={() => {
          console.log("Challenge to classical");
          userSocket.emit("challenge", {
            invitedLogin: user.login42,
            special: false,
          });
        }}
        to2={`/pong/${currentUser}/vs/${user.login42}/special`}
        onClick2={() => {
          console.log("Challenge to special");
          userSocket.emit("challenge", {
            invitedLogin: user.login42,
            special: true,
          });
        }}
        icon={IconBolt}
      />
    </div>
  );
}

function AddRemoveUserBTN({
  cardMember,
  currentMember,
  cardLogin42,
  id,
}: IChatroomManageBTN) {
  const mutMembers = useMutPostChatroomMember(id);
  const deleteMembers = useMutDeleteChatroomMember(id);

  const message =
    cardMember?.login42 == currentMember?.login42 ? "Leave" : "Kick";

  return (
    <GenericActionBTN
      onChecked={() => deleteMembers.mutate({ login42: cardLogin42 })}
      onUnChecked={() => mutMembers.mutate(cardLogin42)}
      value={!!cardMember}
      actionPerms="ADMIN"
      viewPerms="MEMBER"
      checkedMessage={message}
      unCheckedMessage="Add user"
      cardRole={cardMember?.role}
      userRole={currentMember?.role}
      checked={
        <IconMinusCircle className="h-5 w-5 align-middle text-slate-200 hover:rounded-full hover:bg-rose-100 hover:text-rose-300" />
      }
      unChecked={
        <IconPlusCircle className="h-5 w-5 align-middle text-slate-200 hover:rounded-full hover:bg-green-100 hover:text-green-300" />
      }
    />
  );
}

function BanUserBTN({
  cardMember,
  currentMember,
  cardLogin42,
  id,
}: IChatroomManageBTN) {
  const ban = useMutPostChatroomBan(id, cardLogin42);
  const unBan = useMutDeleteChatroomBan(id, cardLogin42);
  const canModify =
    convertPerms(currentMember?.role) >= 2 &&
    (!cardMember || cardMember?.role != "ADMIN");
  return (
    <GenericActionBTN
      onChecked={() => unBan.mutate()}
      onUnChecked={() => ban.mutate()}
      value={!cardMember}
      actionPerms="ADMIN"
      viewPerms="ADMIN"
      checkedMessage="Un-ban"
      fixedUnCheckedMessage="Ban"
      unCheckedMessage="Ban"
      cardRole={cardMember?.role}
      userRole={currentMember?.role}
      checked={
        <IconStop
          className={`h-5 w-5 align-middle text-rose-400 ${
            canModify
              ? " hover:rounded-full hover:bg-rose-300 hover:text-rose-100"
              : ""
          }`}
        />
      }
      unChecked={
        <IconStop
          className={`h-5 w-5 align-middle text-slate-200 ${
            canModify
              ? " hover:rounded-full  hover:bg-rose-200 hover:text-rose-400"
              : ""
          }`}
        />
      }
      fixedUnChecked={
        <IconStop className="h-5 w-5 align-middle text-rose-400" />
      }
    />
  );
}

function MuteUserBTN({
  cardMember,
  currentMember,
  cardLogin42,
  id,
}: IChatroomManageBTN) {
  const mute = useMutChatroomMute(id, cardLogin42);
  const unMute = useMutDeleteChatroomMute(id, cardLogin42);
  const canModify = convertPerms(currentMember?.role) >= 2;

  return (
    <GenericActionBTN
      onChecked={() => unMute.mutate()}
      onUnChecked={() => mute.mutate(360)}
      value={cardMember?.isMuted || false}
      actionPerms="ADMIN"
      viewPerms="MEMBER"
      checkedMessage="Un-mute"
      unCheckedMessage="Mute"
      // fixedUnCheckedMessage="Muted"
      fixedCheckedMessage="Muted"
      cardRole={cardMember?.role}
      userRole={currentMember?.role}
      checked={
        <IconMute
          className={`h-5 w-5 align-middle text-rose-400 ${
            canModify
              ? " hover:rounded-full hover:bg-rose-300 hover:text-rose-100"
              : ""
          }`}
        />
      }
      unChecked={
        <IconMute
          className={`h-5 w-5 align-middle text-slate-200 ${
            canModify
              ? " hover:rounded-full  hover:bg-rose-200 hover:text-rose-400"
              : ""
          }`}
        />
      }
      fixedChecked={
        <IconMute className="h-5 w-5 rounded-full align-middle text-rose-400" />
      }
    />
  );
}

function ManageAdminsBTN({
  cardMember,
  currentMember,
  cardLogin42,
  id,
}: IChatroomManageBTN) {
  const mutRole = useMutPutChatroomRole(id, cardLogin42);

  if (cardMember?.role === "OWNER") {
    return (
      <Pop message="Owner">
        <IconCrown className="h-5 w-5 align-middle text-amber-400" />
      </Pop>
    );
  }
  const canModify = convertPerms(currentMember?.role) >= 2;
  return (
    <GenericActionBTN
      onUnChecked={() => {
        mutRole.mutate("ADMIN");
        console.log("set as admin");
      }}
      onChecked={() => {
        mutRole.mutate("MEMBER");
        console.log("set as member");
      }}
      value={cardMember?.role == "ADMIN" || false}
      actionPerms="ADMIN"
      viewPerms="MEMBER"
      checkedMessage="Unset Admin"
      unCheckedMessage="Set Admin"
      cardRole={cardMember?.role}
      userRole={currentMember?.role}
      checked={
        <IconCheckBadge
          className={`h-5 w-5 align-middle text-amber-400 ${
            canModify
              ? " hover:rounded-full hover:bg-amber-300 hover:text-amber-100"
              : ""
          }`}
        />
      }
      unChecked={
        <IconCheckBadge
          className={`h-5 w-5 align-middle text-slate-200 ${
            canModify
              ? " hover:rounded-full  hover:bg-amber-200 hover:text-amber-400"
              : ""
          }`}
        />
      }
    />
  );
}
