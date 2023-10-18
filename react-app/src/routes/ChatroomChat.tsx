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
  IconCheckBadge,
  IconCrown,
  IconGear,
  IconMinusCircle,
  IconMute,
  IconPlusCircle,
  IconSearch,
  IconStop,
  IconStopCircle,
  IconUserGroup,
  iconType,
} from "../components/Icons";
import { useRef, useState } from "react";
import { Form, Link, useParams } from "react-router-dom";
import {
  useChatroom,
  useChatroomMemebers,
  useChatroomMessages,
  useChatroomBanned,
  useMutDeleteChatroomBan,
  useMutDeleteChatroomMember,
  useMutPostChatroomBan,
  useMutPostChatroomMember,
  useMutPostChatroomMessage,
  useMutPutChatroomRole,
  useUserData,
} from "../functions/customHook";
import { LoadingSpinnerMessage } from "../components/Loading";
import { UserIcon } from "../components/UserIcon";
import { ErrorMessage } from "../components/ErrorComponents";
import { Message } from "../components/ChatMassages";
import { useAuth } from "../functions/useAuth";
import { Heading, PreHeading } from "../components/FormComponents";
import { useQuery } from "@tanstack/react-query";
import { authApi } from "../Api-axios";
import {
  GenericActionBTN,
  IChatroomManageBTN,
  IGenericActionBTN,
  Pop,
  convertPerms,
} from "../components/ChatroomChatBTNs";
import { isMatch } from "../functions/utils";
// import ChatMessages from "../components/ChatMassages";

export default function ChatroomChat() {
  const scrollRef = useRef<null | HTMLDivElement>(null);
  const [buttonState, setButtonState] = useState<string>("UNSET");

  const { id } = useParams<"id">();
  const chatroomID = id || "";

  const { data: chatroom, isError, isLoading } = useChatroom(chatroomID);
  const {
    data: chatroomMembers,
    isLoading: isMemLoading,
    isError: isMemError,
  } = useChatroomMemebers(chatroomID);
  const {
    data: banned,
    isError: isBaErro,
    isLoading: isBaLoading,
  } = useChatroomBanned(chatroomID);

  const auAUth = useAuth();
  const { data: user, isSuccess } = useUserData(auAUth?.user);

  if (isLoading || isMemLoading || isBaLoading)
    return <LoadingSpinnerMessage message="Loading chatroom data ..." />;
  if (!isSuccess || isError || isMemError || isBaErro)
    return <ErrorMessage message="error loaidng current uer" />;
  const btnProps: IButtonsUI = {
    chatroom: chatroom,
    cuMember: chatroomMembers.find((u) => u.login42 == user.login42),
    chatroomMembers: chatroomMembers,
    bannedUsers: banned,
  };
  const menuBTNs = [
    {
      c: "MANAGE_USERS",
      i: IconUserGroup,
      f: <ManageUsersUI {...btnProps} />,
    },
    {
      c: "ADD_USERS",
      i: IconAddUser,
      f: <AddUsersUI {...btnProps} />,
    },
    {
      c: "SETTINGS",
      i: IconGear,
      f: <SettingsButtonUI {...btnProps} />,
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

interface IButtonsUI {
  chatroom: IChatroom;
  cuMember: IMember | undefined;
  bannedUsers: string[];
  chatroomMembers: IMember[];
}

function ManageUsersUI({ chatroom, cuMember, chatroomMembers }: IButtonsUI) {
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
          userMember={cuMember}
          isMember={
            chatroomMembers.find((m) => m.login42 === cuMember?.login42)
              ? true
              : false
          }
          id={chatroom.id + ""}
        />
      ))}
    </ul>
  );
}

function AddUsersUI({
  chatroom,
  chatroomMembers,
  cuMember,
  bannedUsers,
}: IButtonsUI) {
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
      {isLoading ? (
        <LoadingSpinnerMessage message="fetching users.." />
      ) : isError ? (
        <ErrorMessage message="error fething loading" />
      ) : (
        users.map((u) =>
          bannedUsers.find((b) => b === u) ? (
            <ManageBannedUsersCard
              searchValue={searchValue}
              key={u}
              cardLogin42={u}
              userMember={cuMember}
              id={chatroom.id + ""}
            />
          ) : (
            <AddUsersCard
              isMember={
                chatroomMembers.find((m) => m.login42 === u) ? true : false
              }
              key={u}
              login42={u}
              userRole={cuMember?.role}
              id={chatroom.id + ""}
            />
          ),
        )
      )}
    </ul>
  );
}

function SettingsButtonUI({ chatroom, cuMember, bannedUsers }: IButtonsUI) {
  const [searchValue, setSearchvalue] = useState("");

  console.log(bannedUsers);
  return (
    <ul className="flex flex-col justify-center gap-2 rounded-lg border-b-4 border-stone-200 bg-white p-3 pt-4 shadow-xl ">
      <div className="flex justify-center  ">
        <div className="max-w-md grow ">
          <UserSearch setSearchValue={(v: string) => setSearchvalue(v)} />
        </div>
      </div>
      <p className="text-center">All the banned user</p>
      {bannedUsers.map((u) => (
        <ManageBannedUsersCard
          searchValue={searchValue}
          key={u}
          cardLogin42={u}
          userMember={cuMember}
          id={chatroom.id + ""}
        />
      ))}
    </ul>
  );
}

function ManageBannedUsersCard({
  id,
  cardLogin42,
  userMember,
  searchValue,
}: {
  id: string;
  cardLogin42: string;
  userMember?: IMember;
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
        userMember={userMember}
        cardLogin42={cardLogin42}
        isMember={false}
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
  cardRole,
}: {
  login42: string;
  id: string;
  isMember: boolean;
  userRole?: TChatroomRole;
  cardRole?: TChatroomRole;
}) {
  const { data: user, isLoading, isError } = useUserData(login42);
  const mutMembers = useMutPostChatroomMember(id);
  const deleteMembers = useMutDeleteChatroomMember(id);

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
  userMember,
  isMember,
  searchValue,
}: {
  cardLogin42: string;
  id: string;
  isMember: boolean;
  userMember?: IMember;
  cardMember?: IMember;
  searchValue: string;
}) {
  const { data: user, isLoading, isError } = useUserData(cardLogin42);

  if (isLoading) return <LoadingSpinnerMessage message="loading user data" />;
  if (isError) return <div>error fetching user</div>;
  if (!isMatch(cardLogin42, searchValue, user.name)) return <></>;

  return (
    <li className="flex items-center gap-2 px-2 py-1">
      <UserIcon user={cardLogin42} />
      <div className="grow ">{user.name}</div>
      {/* <AdminButton userRole="ADMIN" cardRole={cardRole} /> */}
      <BanUserBTN
        id={id}
        cardMember={cardMember}
        userMember={userMember}
        cardLogin42={cardLogin42}
        isMember={isMember}
      />
      <AddRemoveUserBTN
        id={id}
        cardMember={cardMember}
        userMember={userMember}
        cardLogin42={cardLogin42}
        isMember={isMember}
      />
      <MuteUserBTN
        id={id}
        cardMember={cardMember}
        userMember={userMember}
        cardLogin42={cardLogin42}
        isMember={isMember}
      />
      <ManageAdminsBTN
        id={id}
        cardMember={cardMember}
        userMember={userMember}
        cardLogin42={cardLogin42}
        isMember={isMember}
      />
      <BlockUserBTN
        id={id}
        cardMember={cardMember}
        userMember={userMember}
        cardLogin42={cardLogin42}
        isMember={isMember}
      />
    </li>
  );
}

function AddRemoveUserBTN({
  cardMember,
  userMember,
  cardLogin42,
  isMember,
  id,
}: IChatroomManageBTN) {
  const mutMembers = useMutPostChatroomMember(id);
  const deleteMembers = useMutDeleteChatroomMember(id);

  const message = cardMember?.login42 == userMember?.login42 ? "Leave" : "Kick";

  return (
    <GenericActionBTN
      onChecked={() => deleteMembers.mutate(cardLogin42)}
      onUnChecked={() => mutMembers.mutate(cardLogin42)}
      value={isMember}
      actionPerms="ADMIN"
      viewPerms="MEMBER"
      checkedMessage={message}
      unCheckedMessage="Add user"
      cardRole={cardMember?.role}
      userRole={userMember?.role}
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
  userMember,
  cardLogin42,
  isMember,
  id,
}: IChatroomManageBTN) {
  const ban = useMutPostChatroomBan(id, cardLogin42);
  const unBan = useMutDeleteChatroomBan(id, cardLogin42);
  const canModify = convertPerms(userMember?.role) >= 2;
  return (
    <GenericActionBTN
      onChecked={() => ban.mutate()}
      onUnChecked={() => unBan.mutate()}
      value={isMember}
      actionPerms="ADMIN"
      viewPerms="MEMBER"
      checkedMessage="Ban"
      fixedUnCheckedMessage="Banned"
      unCheckedMessage="Un ban"
      cardRole={cardMember?.role}
      userRole={userMember?.role}
      checked={
        <IconStop
          className={`h-5 w-5 align-middle text-slate-200 ${
            canModify
              ? " hover:rounded-full  hover:bg-rose-200 hover:text-rose-400"
              : ""
          }`}
        />
      }
      unChecked={
        <IconStop
          className={`h-5 w-5 align-middle text-rose-400 ${
            canModify
              ? " hover:rounded-full hover:bg-rose-300 hover:text-rose-100"
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
  userMember,
  cardLogin42,
  isMember,
  id,
}: IChatroomManageBTN) {
  const mutMembers = useMutPostChatroomMember(id);
  const deleteMembers = useMutDeleteChatroomMember(id);

  return (
    <GenericActionBTN
      onChecked={() => console.log("user muted", cardLogin42)}
      onUnChecked={() => console.log("user unmuted", cardLogin42)}
      value={isMember}
      actionPerms="ADMIN"
      viewPerms="MEMBER"
      checkedMessage="Mute"
      unCheckedMessage="Un muted"
      cardRole={cardMember?.role}
      userRole={userMember?.role}
      checked={
        <IconMute className="h-5 w-5 align-middle text-slate-200 hover:rounded-full hover:bg-rose-100 hover:text-rose-300" />
      }
      unChecked={
        <IconMute className="h-5 w-5 align-middle text-slate-200 hover:rounded-full hover:bg-green-100 hover:text-green-300" />
      }
      fixedChecked={
        <IconMute className="h-5 w-5 bg-rose-100 align-middle text-rose-300" />
      }
    />
  );
}

function BlockUserBTN({
  cardMember,
  userMember,
  cardLogin42,
  isMember,
  id,
}: IChatroomManageBTN) {
  const mutMembers = useMutPostChatroomMember(id);
  const deleteMembers = useMutDeleteChatroomMember(id);

  if (cardMember?.login42 == userMember?.login42)
    return <div className="h-5 w-5 " />;

  return (
    <GenericActionBTN
      onChecked={() => console.log("user blocked", cardLogin42)}
      onUnChecked={() => console.log("user blocked", cardLogin42)}
      value={isMember}
      actionPerms="MEMBER"
      viewPerms="MEMBER"
      checkedMessage="Block"
      unCheckedMessage="Blocked"
      cardRole={cardMember?.role}
      userRole={userMember?.role}
      checked={
        <IconStopCircle className="h-5 w-5 align-middle text-slate-200 hover:rounded-full hover:bg-rose-100 hover:text-rose-300" />
      }
      unChecked={
        <IconStopCircle className="h-5 w-5 align-middle text-slate-200 hover:rounded-full hover:bg-green-100 hover:text-green-300" />
      }
      fixedChecked={
        <IconStopCircle className="h-5 w-5 bg-rose-100 align-middle text-rose-300" />
      }
    />
  );
}

function ManageAdminsBTN({
  cardMember,
  userMember,
  cardLogin42,
  isMember,
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
  const canModify = convertPerms(userMember?.role) >= 2;
  return (
    <GenericActionBTN
      onChecked={() => {
        mutRole.mutate("ADMIN");
        console.log("set as admin");
      }}
      onUnChecked={() => {
        mutRole.mutate("MEMBER");
        console.log("set as member");
      }}
      value={isMember}
      actionPerms="ADMIN"
      viewPerms="MEMBER"
      checkedMessage="Admin"
      unCheckedMessage="Remove admin"
      cardRole={cardMember?.role}
      userRole={userMember?.role}
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
