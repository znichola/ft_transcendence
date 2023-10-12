import BoxMenu from "../components/BoxMenu";
import { IChatroom, UserData } from "../interfaces";
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
import { useState } from "react";
import { Form, Link } from "react-router-dom";
import { useUserData } from "../functions/customHook";
import { LoadingSpinnerMessage } from "../components/Loading";
import { UserIcon } from "../components/UserIcon";
// import ChatMessages from "../components/ChatMassages";

const fakeChatroom: IChatroom = {
  id: 1,
  name: "123",
  ownerLogin42: "test",
  status: "PUBLIC",
};

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
  // menu buttons
  const [buttonState, setButtonState] = useState<string>("UNSET");

  const menuBTNs = [
    {
      c: "MANAGE_USERS",
      i: IconUserGroup,
      f: <ManageUsersUI chatroom={fakeChatroom} />,
    },
    {
      c: "ADD_USERS",
      i: IconAddUser,
      f: <AddUsersUI chatroom={fakeChatroom} />,
    },
    {
      c: "SETTINGS",
      i: IconGear,
      f: <SettingsButtonUI chatroom={fakeChatroom} />,
    },
  ];

  return (
    <div className="relative flex h-full max-h-full min-h-0 w-full flex-grow-0 flex-col items-center">
      <BoxMenu
        resetBTN={() => setButtonState("UNSET")}
        heading={<ChatroomHeading chatroom={fakeChatroom} />}
      >
        {menuBTNs.map((b) => (
          <ButtonGeneric
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
        {/* <Chat */}
      </div>
    </div>
  );
}

function ChatroomHeading({ chatroom }: { chatroom: IChatroom }) {
  return (
    <div>
      <p className="text-left font-semibold">
        {chatroom.status + " chatroom"}{" "}
      </p>
      <h1 className="bg-gradient-to-br from-fuchsia-600 to-orange-500 bg-clip-text text-center text-5xl font-semibold text-transparent">
        {chatroom.name}
      </h1>
    </div>
  );
}

function ManageUsersUI({ chatroom }: { chatroom: IChatroom }) {
  const [searchValue, setSearchvalue] = useState("");
  const channelUsers = fakeChannelUsers;
  // {data : chatroomUsers, isLoading, isError} useQuery({queryKey: ""})
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
