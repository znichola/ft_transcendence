import { useQuery } from "@tanstack/react-query";
import { UserData } from "../interfaces";
import {
  IconCheckBadge,
  IconCrown,
  IconGear,
  IconMinusCircle,
  IconUserGroup,
} from "./Icons";
import axios from "axios";
import { LoadingSpinnerMessage } from "./Loading";

export default function ChatRoomMenu() {
  return (
    <>
      <div className="flex h-28 w-full flex-col items-center justify-between bg-rose-100 py-2 ">
        <h1 className="text-4xl font-semibold">Noobish Helpdesk</h1>
        <div className="flex gap-2">
          <ManageUsers />
          <Setting />
        </div>
        <ManageUsersUI />
      </div>
    </>
  );
}

function ManageUsers() {
  return (
    <>
      <button className="flex h-8 w-8 items-center justify-center bg-amber-400 ">
        <IconUserGroup />
      </button>
    </>
  );
}

function Setting() {
  return (
    <>
      <button className="flex h-8 w-8 items-center justify-center bg-amber-400">
        <IconGear />
      </button>
    </>
  );
}

function ManageUsersUI() {
  // {data : chatroomUsers, isLoading, isError} useQuery({queryKey: ""})
  return (
    <>
      <ul className="flex flex-col gap-2 rounded-lg bg-white p-2 shadow">
        {chatroomUsers.map((u) => (
          <ManageUserCard key={u.login42} login42={u.login42} role={u.role} />
        ))}
      </ul>
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
        <div className="grow">{user.name}</div>
        <AdminButton userRole="OWNER" cardRole={role} />
        <KickUserButton userRole="OWNER" cardRole={role} />
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
    if (userRole === "MEMBER")
      return <div className="h-5 w-5 " />;
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
