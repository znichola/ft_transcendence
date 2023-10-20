import { UserData } from "../interfaces";
import {
  iconType,
  IconAddUser,
  IconCheckBadge,
  IconCrown,
  IconGear,
  IconMinusCircle,
  IconSearch,
  IconUserGroup,
  IconPlusCircle,
  IconBin,
} from "./Icons";
import { LoadingSpinnerMessage } from "./Loading";
import { Form, useNavigate } from "react-router-dom";
import { RefObject, useState } from "react";
import { useRef, useEffect } from "react";
import { useMutDeleteUserDMs, useUserData } from "../functions/customHook";

type btnStateType = "USERS" | "SETTINGS" | "ADDUSER" | "UNSET";
type chatRoomUser = {
  chatroomId: number;
  login42: string;
  role: string;
};

export default function ChatRoomMenu({
  title,
  type,
}: {
  title: string;
  type: "dm" | "chatroom";
}) {
  const [buttonState, setButtonState] = useState<btnStateType>("UNSET");

  const wrapperRef = useRef<HTMLDivElement>(null);
  useOutsideAlerter(wrapperRef);

  function useOutsideAlerter(ref: RefObject<HTMLDivElement>) {
    useEffect(() => {
      /**
       * Alert if clicked on outside of element
       */
      function handleClickOutside(event: MouseEvent) {
        if (
          ref.current &&
          (!(event.target instanceof Node) ||
            !ref.current.contains(event.target))
        ) {
          setButtonState("UNSET");
        }
      }
      // Bind the event listener
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        // Unbind the event listener on clean up
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [ref]);
  }

  return (
    <div
      ref={wrapperRef}
      className="pointer-events-none absolute top-0 w-full bg-clip-content px-28 py-5"
    >
      <div className="absolute left-0 top-0 z-10 h-[160%] w-full bg-gradient-to-b from-stone-50 to-transparent"></div>
      <div className="pointer-events-auto relative z-20 flex w-full flex-col items-center justify-between rounded-xl border-b-4 border-stone-300 bg-stone-50 bg-size-200 pt-6 shadow-lg">
        <h1 className="bg-gradient-to-br from-fuchsia-600 to-orange-500 bg-clip-text text-center text-5xl font-semibold text-transparent">
          {title || "Noobish Helpdesk"}
        </h1>
        <div className="flex h-16 max-h-16 gap-2 overflow-visible pb-2 pt-3">
          {type == "chatroom" ? (
            <>
              <ButtonGeneric
                icon={IconUserGroup}
                onButtonClick={() =>
                  setButtonState(buttonState === "USERS" ? "UNSET" : "USERS")
                }
                buttonState={buttonState}
                checked="USERS"
              >
                <ManageUsersUI channelUsers={fakeChannelUsers} />
              </ButtonGeneric>
              <ButtonGeneric
                icon={IconAddUser}
                onButtonClick={() =>
                  setButtonState(
                    buttonState === "ADDUSER" ? "UNSET" : "ADDUSER",
                  )
                }
                buttonState={buttonState}
                checked="ADDUSER"
              >
                <AddUsersUI allUsers={fakeGeneralUsers} />
              </ButtonGeneric>
              <ButtonGeneric
                icon={IconGear}
                onButtonClick={() =>
                  setButtonState(
                    buttonState === "SETTINGS" ? "UNSET" : "SETTINGS",
                  )
                }
                buttonState={buttonState}
                checked="SETTINGS"
              >
                <SettingsButtonUI />
              </ButtonGeneric>
            </>
          ) : (
            <>
              <ButtonGeneric
                icon={IconBin}
                onButtonClick={() =>
                  setButtonState(
                    buttonState === "SETTINGS" ? "UNSET" : "SETTINGS",
                  )
                }
                buttonState={buttonState}
                checked="SETTINGS"
              >
                <LeaveConversationUI />
              </ButtonGeneric>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function ButtonGeneric({
  icon: Icon,
  onButtonClick,
  buttonState,
  checked,
  children,
}: {
  icon: iconType;
  onButtonClick: () => void;
  buttonState: btnStateType;
  checked: btnStateType;
  children?: JSX.Element[] | JSX.Element;
}) {
  return (
    <div>
      <input
        type="checkbox"
        checked={buttonState === checked}
        onChange={() => console.log("click")}
        className="peer hidden"
      />
      <button
        onClick={onButtonClick}
        className="flex h-10 w-10 items-center justify-center rounded-full border-b-2 border-stone-300 text-slate-500 transition-all duration-100 hover:border-b-4 peer-checked:border-rose-400 peer-checked:text-rose-500"
      >
        <div className="flex h-8 w-8 items-center justify-center">
          <Icon />
        </div>
      </button>
      <div className="invisible absolute left-0 min-w-full translate-y-5 p-3 opacity-0 transition-all duration-500 ease-in-out peer-checked:visible peer-checked:translate-y-10 peer-checked:opacity-100">
        {children}
      </div>
    </div>
  );
}

function ManageUsersUI({ channelUsers }: { channelUsers: chatRoomUser[] }) {
  const [searchValue, setSearchvalue] = useState("");
  return (
    <>
      <ul className="flex flex-col justify-center gap-2 rounded-lg border-b-4 border-stone-200 bg-white p-3 pt-4 shadow-xl ">
        <div className="flex justify-center  ">
          <div className="max-w-md grow ">
            <UserSearch setSearchValue={(v: string) => setSearchvalue(v)} />
          </div>
        </div>
        {channelUsers.map((u) =>
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

function AddUsersUI({ allUsers }: { allUsers: string[] }) {
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

function SettingsButtonUI() {
  return (
    <>
      <div className="flex flex-col justify-center gap-2 rounded-lg border-b-4 border-stone-200 bg-white p-3 pt-4 shadow-xl ">
        <div className="h-14">foobar, some settings and stuff</div>
      </div>
    </>
  );
}

function LeaveConversationUI() {
  const user1 = "default42";
  const user2 = "test";
  const deletConvo = useMutDeleteUserDMs(user1, user2);
  const navigate = useNavigate();
  return (
    <>
      <div className="flex flex-col items-center justify-center gap-2 rounded-lg border-b-4 border-stone-200 bg-white p-3 pt-4 text-center shadow-xl">
        <p>
          Leave the conversation and delete all messages for all users, <br />
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
        <img
          className={
            "h-5 w-5 rounded-full ring-2" + " " + statusColor(user.status)
          }
          src={user.avatar}
          alt={user.login42 || "undefined" + " profile image"}
        />
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
        <img
          className={
            "h-5 w-5 rounded-full ring-2" + " " + statusColor(user.status)
          }
          src={user.avatar}
          alt={user.login42 || "undefined" + " profile image"}
        />
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
