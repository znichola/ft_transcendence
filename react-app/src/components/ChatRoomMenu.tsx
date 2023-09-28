import { useQuery } from "@tanstack/react-query";
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
} from "./Icons";
import axios from "axios";
import { LoadingSpinnerMessage } from "./Loading";
import { Form } from "react-router-dom";
import { useState } from "react";

type btnStateType = "USERS" | "SETTINGS" | "ADDUSER" | "UNSET";
type chatRoomUser = {
  chatroomId: number;
  login42: string;
  role: string;
};

export default function ChatRoomMenu() {
  const [buttonState, setButtonState] = useState<btnStateType>("UNSET");

  return (
    <div className="px-3 pt-3">
      <div className="relative flex w-full flex-col items-center justify-between rounded-xl border-b-4 border-stone-200 bg-stone-50 py-2 pt-6 shadow-lg">
        <h1 className="text-spate-400 text-4xl font-semibold">
          Noobish Helpdesk
        </h1>
        <div className="h-4 bg-green-400" />
        <div className="flex gap-2">
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
              setButtonState(buttonState === "ADDUSER" ? "UNSET" : "ADDUSER")
            }
            buttonState={buttonState}
            checked="ADDUSER"
          >
            <AddUsersUI allUsers={fakeGeneralUsers} />
          </ButtonGeneric>
          <ButtonGeneric
            icon={IconGear}
            onButtonClick={() =>
              setButtonState(buttonState === "SETTINGS" ? "UNSET" : "SETTINGS")
            }
            buttonState={buttonState}
            checked="SETTINGS"
          >
            <SettingsButtonUI />
          </ButtonGeneric>
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
    <div className="flex">
      <input
        type="checkbox"
        checked={buttonState === checked}
        className="peer hidden"
      />
      <button
        onClick={onButtonClick}
        className="rounded-full border border-transparent hover:border hover:border-rose-400 hover:bg-rose-100 peer-checked:text-rose-500"
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

  // {data : chatroomUsers, isLoading, isError} useQuery({queryKey: ""})
  return (
    <>
      <ul className="flex flex-col justify-center gap-2 rounded-lg border-b-4 border-stone-200 bg-white p-3 pt-4 shadow-xl ">
        <div className="flex justify-center  ">
          <div className="max-w-md grow ">
            <UserSearch setSearchValue={(v: string) => setSearchvalue(v)}/>
          </div>
        </div>
        {channelUsers.map((u) => (
          u.login42.toLowerCase().startsWith(searchValue.toLowerCase()) ? //Ajouter la comparaison avec le nom du User
          <ManageUserCard key={u.login42} login42={u.login42} role={u.role} /> : <></>
        ))}
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
            <UserSearch setSearchValue={(v) => alert("Not implemented: " + v)}/>
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

// here!
function UserSearch({ setSearchValue }: { setSearchValue: (v: string) => void}) {
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
  const {
    data: user,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["UserData", login42],
    queryFn: () => axios.get<UserData>("/user/" + login42).then((r) => r.data),
  });

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
  const {
    data: user,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["UserData", login42],
    queryFn: () => axios.get<UserData>("/user/" + login42).then((r) => r.data),
  });

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
        className={`h-5 w-5 align-middle text-amber-400 ${canModify
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
        className={`h-5 w-5 align-middle text-slate-200 ${canModify
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
