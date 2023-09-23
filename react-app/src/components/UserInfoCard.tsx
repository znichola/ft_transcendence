import { Link } from "react-router-dom";
import { UserData } from "../interfaces";
import Avatar from "./Avatar";
import { IconAddUser, IconBolt, IconChatBubble } from "./Icons";
import { useQuery } from "@tanstack/react-query";
import { getCurrentUser } from "../Api-axios";

export default function UserInfoCard({ user: cardUser }: { user: UserData }) {
  const { data: user } = useQuery({
    queryKey: ["currentUser"],
    queryFn: getCurrentUser,
    initialData: "default42",
  });

  return (
    <div className="m-4 flex h-28 w-[430px] max-w-md justify-between bg-white shadow ">
      <div className="flex">
        <EloWinRate user={cardUser} />
        <AvatarName user={cardUser} />
      </div>

      <div className="flex flex-col py-2">
        <SideButton
          name={"Duel"}
          to={"/pong/" + user + "/vs/" + cardUser.login42}
          icon={IconBolt}
        />
        <SideButton
          name={"Chat"}
          to={"/message/" + cardUser.login42}
          icon={IconChatBubble}
        />
        <SideButtonFriend name={"Friend"} icon={IconAddUser} />
      </div>
    </div>
  );
}

function EloWinRate({ user }: { user: UserData }) {
  return (
    <div className="group relative w-20 items-center justify-center overflow-hidden border-r border-slate-200 ">
      <div className="absolute flex h-full w-full grow items-center justify-center overflow-hidden duration-500 group-hover:opacity-0">
        <div className="font-bold text-slate-500">{user.elo}</div>
      </div>
      <div className="flex h-full w-full items-center justify-start">
        <div className="duration-400 absolute flex h-full w-0 flex-col items-center justify-center overflow-hidden bg-stone-100 transition-all group-hover:w-20 group-hover:shadow-inner">
          <div className="font-bold text-green-400">{user.wins + "W"}</div>
          <div className=" text-slate-400">—</div>
          <div className=" text-red-300">{user.losses + "L"}</div>
        </div>
      </div>
    </div>
  );
}

function AvatarName({ user }: { user: UserData }) {
  return (
    <div className="flex items-center overflow-hidden">
      <Avatar
        size="m-2 mb-3 mt-3 w-20 h-20"
        alt={user.name}
        status={user.status}
        img={user.avatar}
      />
      <div className="flex flex-col content-center justify-center  ">
        <p className="font-semibold text-slate-700 ">{user.name}</p>
        <Link to={"/user/" + user.login42} className="text-slate-400">
          {"@" + user.login42}
        </Link>
      </div>
    </div>
  );
}

function SideButton({
  name,
  to,
  icon: Icon,
}: {
  name: string;
  to?: string;
  icon: ({
    className,
    strokeWidth,
  }: {
    className?: string;
    strokeWidth?: number;
  }) => JSX.Element;
}) {
  return (
    <>
      <Link
        to={to || "#"}
        className="felx-col group relative flex w-12 flex-1 items-center justify-end "
      >
        <div className="absolute h-full grow p-1 pr-2 text-slate-300 duration-300 group-hover:opacity-0">
          {<Icon strokeWidth={2} />}
        </div>
        <div className="duration-400 absolute flex h-full w-0 items-center justify-center overflow-hidden rounded-l-xl bg-gradient-to-tl from-fuchsia-600 to-orange-500 shadow-inner transition-all group-hover:w-12 ">
          <div className="text-xs font-bold text-slate-50">{name}</div>
        </div>
      </Link>
    </>
  );
}

function SideButtonFriend({
  name,
  icon: Icon,
}: {
  name: string;
  icon: ({
    className,
    strokeWidth,
  }: {
    className?: string;
    strokeWidth?: number;
  }) => JSX.Element;
}) {
  return (
    <>
      <button className="felx-col group relative flex w-12 flex-1 items-center justify-end ">
        <div className="absolute h-full grow p-1 pr-2 text-slate-300 duration-300 group-hover:opacity-0">
          {<Icon strokeWidth={2} />}
        </div>
        <div className="duration-400 absolute flex h-full w-0 items-center justify-center overflow-hidden rounded-l-xl bg-gradient-to-tl from-fuchsia-600 to-orange-500 shadow-inner transition-all group-hover:w-12 ">
          <div className="text-xs font-bold text-slate-50">{name}</div>
        </div>
      </button>
    </>
  );
}
