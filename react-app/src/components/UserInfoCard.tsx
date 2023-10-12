import { Link, useNavigate } from "react-router-dom";
import { FriendData, UserData, UserFriends } from "../interfaces";
import Avatar from "./Avatar";
import { IconBolt, IconChatBubble } from "./Icons";
import RelationActions, { FB1, FB2 } from "./UserInfoCardRelations";

export default function UserInfoCard({
  cardUser,
  currentUser,
  userFriends,
}: {
  cardUser: UserData;
  currentUser: string;
  userFriends: UserFriends;
}) {
  const ff = (f: FriendData) => f.login42 == cardUser.login42;
  const relationStatus = userFriends.friends.find(ff)
    ? "friends"
    : userFriends.pending.find(ff)
    ? "sent"
    : userFriends.requests.find(ff)
    ? "pending"
    : "none";
  return (
    <div className="p-2">
      <div
        className={`p-1 ${
          relationStatus === "friends"
            ? "bg-gradient-to-br from-fuchsia-600 to-orange-500"
            : ""
        }`}
      >
        <div className="flex h-28 w-[430px] max-w-md justify-between bg-white shadow ">
          <div className="flex">
            <EloWinRate user={cardUser} />
            <AvatarName user={cardUser} />
          </div>

          <div className="flex flex-col py-2">
            <SideButton2
              message={"Play pong"}
              a1={"classical"}
              a2={"special"}
              to1={"/pong/" + currentUser + "/vs/" + cardUser.login42 + "/classical"}
              to2={"/pong/" + currentUser + "/vs/" + cardUser.login42 + "/special"}
              icon={IconBolt}
            />
            <SideButton
              message={"Private chat"}
              action={"message"}
              to={"/message/" + cardUser.login42}
              icon={IconChatBubble}
            />
            <RelationActions
              currentUser={currentUser}
              cardUser={cardUser.login42}
              status={relationStatus}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export function EloWinRate({ user }: { user: UserData }) {
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
  message,
  action,
  to,
  icon: Icon,
}: {
  message: string;
  action: string;
  to?: string;
  icon: ({
    className,
    strokeWidth,
  }: {
    className?: string;
    strokeWidth?: number;
  }) => JSX.Element;
}) {
  const navigate = useNavigate();

  const nav = () => navigate(to || "#");

  return (
    <>
      <div
        // to={to || "#"}
        className="felx-col group relative flex w-12 flex-1 items-center justify-end "
      >
        <div className="absolute h-full grow p-1 pr-2 text-slate-300 duration-300">
          {<Icon strokeWidth={2} />}
        </div>
        <div className="duration-400 group-hover:order-slate-100 absolute flex h-full w-0 items-center justify-center overflow-hidden rounded-l-xl bg-white transition-all group-hover:w-max group-hover:border group-hover:p-2">
          <div className="text-xs font-semibold text-slate-500">
            <FB1 message={message} a1={action} a1btn={nav} />
          </div>
        </div>
      </div>
    </>
  );
}

function SideButton2({
  message,
  a1,
  a2,
  to1,
  to2,
  icon: Icon,
}: {
  message: string;
  a1: string;
  a2: string;
  to1?: string;
  to2?: string;
  icon: ({
    className,
    strokeWidth,
  }: {
    className?: string;
    strokeWidth?: number;
  }) => JSX.Element;
}) {
  const navigate = useNavigate();

  const nav1 = () => navigate(to1 || "#");
  const nav2 = () => navigate(to2 || "#");

  return (
    <>
      <div
        // to={to || "#"}
        className="felx-col group relative flex w-12 flex-1 items-center justify-end "
      >
        <div className="absolute h-full grow p-1 pr-2 text-slate-300 duration-300">
          {<Icon strokeWidth={2} />}
        </div>
        <div className="duration-400 absolute flex h-full w-0 items-center justify-center overflow-hidden rounded-l-xl bg-white transition-all group-hover:w-max group-hover:border group-hover:border-slate-100 group-hover:p-2">
          <div className="text-xs font-semibold text-slate-500">
            <FB2 message={message} a1={a1} a1btn={nav1} a2={a2} a2btn={nav2} />
          </div>
        </div>
      </div>
    </>
  );
}
