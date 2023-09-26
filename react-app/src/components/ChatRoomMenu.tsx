import { useQuery } from "@tanstack/react-query";
import { UserData } from "../interfaces";
import {
  IconCheckBadge,
  IconCrown,
  IconGear,
  IconMinusCircle,
  IconSearch,
  IconUserGroup,
} from "./Icons";
import axios from "axios";
import { LoadingSpinnerMessage } from "./Loading";
import { Form } from "react-router-dom";

export default function ChatRoomMenu() {
  return (
    <div className="px-3 pt-3">
      <div className="relative flex w-full flex-col items-center justify-between rounded-xl border-b-4 border-stone-200 bg-stone-50 py-2 pt-6 shadow-lg">
        <h1 className="text-spate-400 text-4xl font-semibold">
          Noobish Helpdesk
        </h1>
        <div className="h-4 bg-green-400" />
        <div className="flex gap-2">
          <div className="flex">
            <input id="manage-user" type="checkbox" className="peer hidden" />
            <label
              htmlFor="manage-user"
              className="rounded-full border border-transparent peer-checked:text-rose-500 peer-hover:border peer-hover:border-rose-400 peer-hover:bg-rose-100"
            >
              <ManageUserButton />
            </label>
            <div className="invisible absolute left-0 min-w-full translate-y-5 p-3 opacity-0 transition-all duration-500 ease-in-out peer-checked:visible peer-checked:translate-y-10 peer-checked:opacity-100">
              <ManageUsersUI />
            </div>
          </div>
          <div className="flex">
            <input
              id="manage-settings"
              type="checkbox"
              className="peer hidden"
            />
            <label
              htmlFor="manage-settings"
              className="rounded-full border border-transparent peer-checked:text-rose-500 peer-hover:border peer-hover:border-rose-400 peer-hover:bg-rose-100"
            >
              <SettingsButton />
            </label>
            <div className="invisible absolute left-0 min-w-full translate-y-5 p-3 opacity-0 transition-all duration-500 ease-in-out peer-checked:visible peer-checked:translate-y-10 peer-checked:opacity-100">
              <SettingsButtonUI />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ManageUserButton() {
  return (
    <>
      <div className="flex h-8 w-8 items-center justify-center">
        <IconUserGroup />
      </div>
    </>
  );
}

function SettingsButton() {
  return (
    <>
      <div className="flex h-8 w-8 items-center justify-center">
        <IconGear />
      </div>
    </>
  );
}

function ManageUsersUI() {
  // {data : chatroomUsers, isLoading, isError} useQuery({queryKey: ""})
  return (
    <>
      <ul className="flex flex-col justify-center gap-2 rounded-lg border-b-4 border-stone-200 bg-white p-3 pt-4 shadow-xl ">
        <div className="flex justify-center  ">
          <div className="max-w-md grow ">
            <UserSearch />
          </div>
        </div>
        {chatroomUsers.map((u) => (
          <ManageUserCard key={u.login42} login42={u.login42} role={u.role} />
        ))}
      </ul>
    </>
  );
}

function SettingsButtonUI() {
  return (
    <>
      <div className="flex flex-col justify-center gap-2 rounded-lg border-b-4 border-stone-200 bg-white p-3 pt-4 shadow-xl ">
        <div className="h-14">

        </div>
      </div>
    </>
  );
}

function UserSearch() {
  return (
    <>
      <div className="rounded-xl border border-slate-300 p-2 focus-within:border-rose-500 ">
        <Form className="flex h-full w-full pl-3 ">
          <input
            className="focus: w-full outline-none  focus:border-none focus:ring-0"
            type="search"
            placeholder="search channel users"
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

<div className="relative rounded-2xl bg-white px-6 pb-8 pt-10 shadow-xl ring-1 ring-gray-900/5 sm:mx-auto sm:max-w-lg sm:px-10">
  <div className="mx-auto max-w-md">
    <form action="" className="relative mx-auto w-max">
      <input
        type="search"
        className="peer relative z-10 h-12 w-12 cursor-pointer rounded-full border bg-transparent pl-12 outline-none focus:w-full focus:cursor-text focus:border-lime-300 focus:pl-16 focus:pr-4"
      />
    </form>
  </div>
</div>;

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

const chatroomUsers = [
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
