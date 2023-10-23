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
  IconPasswordHide,
  IconPasswordShow,
  IconPlusCircle,
  IconSearch,
  IconStop,
  IconUserGroup,
} from "../components/Icons";
import { useRef, useState } from "react";
import { Form, Link, useParams } from "react-router-dom";
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
  useChatroomMember,
} from "../functions/customHook";
import { LoadingSpinnerMessage } from "../components/Loading";
import { UserIcon } from "../components/UserIcon";
import { ErrorMessage } from "../components/ErrorComponents";
import { Message } from "../components/ChatMassages";
import { useAuth } from "../functions/useAuth";
import { Heading, PreHeading } from "../components/FormComponents";
import { UseQueryResult, useQuery } from "@tanstack/react-query";
import { authApi } from "../Api-axios";
import {
  GenericActionBTN,
  IChatroomManageBTN,
  Pop,
  convertPerms,
} from "../components/ChatroomChatBTNs";
import { isMatch } from "../functions/utils";
import { AxiosError } from "axios";

function JoinChatRoom({id, login42, reload}:{id: string, login42: string, reload: () => void}) {
  const [responseMessage, setResponseMessage] = useState(undefined);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined);
  const {data: chatroomData, isLoading, isError} = useChatroom(id || "");

  async function handleSubmit(e) {
    e.preventDefault();
    let response_value: AxiosError<{message: string}> | undefined = await authApi.post("/chatroom/" + id + "/members/", {login42: login42, password: password})
    .catch(res => res)
    if (response_value?.status == 201) {
      console.log("All good !");
      reload();
    }
    else {
      console.log("Error 42 : ", response_value?.response?.data.message);
      setErrorMessage(response_value?.response?.data.message);
    }
  }

  if (isLoading) {
    return(
      <LoadingSpinnerMessage message="Loading chatroom data..."/>
    );
  }
  if (isError) {
    return(
      <ErrorMessage message="Loading chatroom data..."/>
    );
  }

  return(
      <form className="flex bg-stone-50 flex-col items-center gap-3 shadow-lg p-7 font-semibold rounded-xl border-b-4" onSubmit={handleSubmit}>
        <h1 className="text-3xl">{"You are about to join : " + chatroomData.name}</h1>
        <div className={"flex items-center " + (chatroomData.status == 'PROTECTED' ? "" : "hidden")}>
          <input className="p-2 rounded-full pr-8" type={showPassword ? "text" : "password"} onChange={(e) => setPassword(e.currentTarget.value)} value={password} placeholder="Enter room password"/>
          <div className="-translate-x-7" onClick={() => setShowPassword(!showPassword)}>
            {showPassword ? <IconPasswordHide /> : <IconPasswordShow/>}
          </div>
        </div>
        <h2 className="text-red-600">{errorMessage}</h2>
        <button className="bg-gradient-to-br text-2xl from-fuchsia-600 to-orange-500 rounded-lg p-2 text-white font-bold">Join</button>
      </form>
  );
}

export default function ChatroomManager() {
  const { id } = useParams<"id">();
  const chatroomID = id || "";
  const currentUser = useAuth()?.user || "";
  const [reload, setReload] = useState(false);
  function reloadComponent() {
    setReload(!reload);
  }

  const [errorCode, setErrorCode] = useState<number | undefined>(undefined);

  function handleError(axiosError: AxiosError) {
    setErrorCode(axiosError.response?.status);
  }

  const { isLoading, isError } = useChatroomMember(chatroomID, currentUser, handleError); //TODO: enlever quand can get user chatrooms

  if (currentUser == "" || isLoading) {
    return <LoadingSpinnerMessage message={"Loading your " + (isLoading ? "member" : "user") + " data..."}/>;
  }
  if (isError) {
    if (errorCode == 403) { //TODO changer dès que on a la liste des salles d'un user. Check si tout marche bien après (Reload automatique si fonctionne)
      return <JoinChatRoom id={chatroomID} login42={currentUser} reload={reloadComponent}/>;
    }
    return <ErrorMessage message={"Error: failed to load your member data"}/>;
  }
  return <ChatroomChat/>
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
  const currentMember = isMembersSuccess && currentUser != "" ? members?.find((m) => m.login42 == currentUser) : undefined
  const hasAdminRights: boolean = !!currentMember && currentMember.role != "MEMBER";
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
  if (!isSuccess || !currentMember) return <ErrorMessage message="error loading current user" />;
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
  ];
  const adminMenuBTNs = [
    {
      c: "ADD_USERS",
      i: IconAddUser,
      f: <AddUsersUI chatroom={chatroom} members={members} currentMember={currentMember} bannedUsersQuery={bannedUserQuery} />,
    },
    {
      c: "SETTINGS",
      i: IconGear,
      f: (
        <SettingsButtonUI
          chatroom={chatroom}
          currentMember={currentMember}
          bannedUsersQuery={bannedUserQuery}
        />
      ),
    },
  ];
  const usedButtons = hasAdminRights
    ? menuBTNs.concat(adminMenuBTNs)
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
      <MessageList cu={user} chatroomID={chatroomID} />
      <ChatroomMessageInput
        scrollRef={scrollRef}
        user={user}
        chatroomID={chatroomID}
      />
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
  if (isLoading) return <LoadingSpinnerMessage message="Loading user ..." />;
  if (isError) return <ErrorMessage message="Error fetching user" />;

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

interface IButtonsData {
  chatroom: IChatroom;
  currentMember: IMember;
  chatroomMembers: IMember[];
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
          userMember={currentMember}
          isMember={
            chatroomMembers.find((m) => m.login42 === currentMember?.login42)
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
              userMember={currentMember}
              id={chatroom.id + ""}
            />
          ) : (
            <AddUsersCard
              isMember={
                members.find((m) => m.login42 === u) ? true : false
              }
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

function SettingsButtonUI({
  chatroom,
  currentMember,
  bannedUsersQuery,
}: {
  chatroom: IChatroom;
  currentMember: IMember;
  bannedUsersQuery: UseQueryResult<string[], unknown>;
}) {
  const [searchValue, setSearchvalue] = useState("");

  return (
    <ul className="flex flex-col justify-center gap-2 rounded-lg border-b-4 border-stone-200 bg-white p-3 pt-4 shadow-xl ">
      <div className="flex justify-center  ">
        <div className="max-w-md grow ">
          <UserSearch setSearchValue={(v: string) => setSearchvalue(v)} />
        </div>
      </div>
      <p className="text-center">The list of banner users</p>
      {bannedUsersQuery.isLoading ? (
        <LoadingSpinnerMessage message="Loading banned users..." />
      ) : bannedUsersQuery.isError ? (
        <ErrorMessage message="Error loading banned users" />
      ) : bannedUsersQuery.data ? (
        bannedUsersQuery.data.map((u) => (
          <ManageBannedUsersCard
            searchValue={searchValue}
            key={u}
            cardLogin42={u}
            userMember={currentMember}
            id={chatroom.id + ""}
          />
        ))
      ) : (
        <></>
      )}
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
  id,
}: IChatroomManageBTN) {
  const mute = useMutChatroomMute(id, cardLogin42);
  const unMute = useMutDeleteChatroomMute(id, cardLogin42);

  console.log("mute:", cardMember);
  const canModify = convertPerms(userMember?.role) >= 2;

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
      userRole={userMember?.role}
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
