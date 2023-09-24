import { Link } from "react-router-dom";
import { UserData, UserFriends } from "../interfaces";
import Avatar from "./Avatar";
import { IconAddUser, IconBolt, IconChatBubble } from "./Icons";
import { useQuery } from "@tanstack/react-query";
import { getCurrentUser } from "../Api-axios";
import { LoadingDots } from "./Loading";
import axios from "axios";

export default function UserInfoCard({
  cardUser,
  currentUser,
}: {
  cardUser: UserData;
  currentUser: string;
}) {
  return (
    <div className="m-4 flex h-28 w-[430px] max-w-md justify-between bg-white shadow ">
      <div className="flex">
        <EloWinRate user={cardUser} />
        <AvatarName user={cardUser} />
      </div>

      <div className="flex flex-col py-2">
        <SideButton
          name={"Duel"}
          to={"/pong/" + currentUser + "/vs/" + cardUser.login42}
          icon={IconBolt}
        />
        <SideButton
          name={"Chat"}
          to={"/message/" + cardUser.login42}
          icon={IconChatBubble}
        />
        <SideButtonFriend currentUser={currentUser} cardUser={cardUser} />
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
  currentUser,
  cardUser,
}: {
  currentUser: string;
  cardUser: UserData;
}) {
  const {
    data: friends,
    isLoading,
    isError,
    refetch: fetchFriends,
  } = useQuery({
    queryKey: ["Friends"],
    refetchOnWindowFocus: false,
    enabled: false,
    queryFn: () =>
      axios
        .get<UserFriends>("/user/" + currentUser + "/friends")
        .then((res) => res.data),
  });
  console.log(currentUser, "current user");

  if (isLoading) return <div>loading...</div>;

  const isFriend = friends?.friends.find((f) => f.login42 === cardUser.login42);
  const isPending = friends?.pending.find(
    (f) => f.login42 === cardUser.login42,
  );
  const isRequensted = friends?.requests.find(
    (f) => f.login42 === cardUser.login42,
  );

  function handleFriendClick() {
    console.log("clicked add friend");
    fetchFriends();
  }
  return (
    <>
      <button
        className="felx-col group relative flex w-12 flex-1 items-center justify-end "
        onClick={handleFriendClick}
      >
        <div className="absolute h-full grow p-1 pr-2 text-slate-300">
          {<IconAddUser strokeWidth={2} />}
        </div>
        {/* css max transitions https://stackoverflow.com/questions/3508605/how-can-i-transition-height-0-to-height-auto-using-css/8331169#8331169 */}
        <div className="duration-400 absolute flex h-full max-w-0 items-center justify-center overflow-hidden rounded-l-xl bg-gradient-to-tl from-fuchsia-600 to-orange-500 shadow-inner transition-[max-width] group-hover:max-w-[200px] group-hover:p-2 ">
          <span className="text-xs font-bold text-slate-50">
            {isError
              ? "error fetching data"
              : isLoading
              ? "loading.."
              : isFriend
              ? "already freinds"
              : isPending
              ? "accept their request"
              : isRequensted
              ? "already set freind request"
              : "add freind"}
          </span>
        </div>
      </button>
    </>
  );
}
