import {
  IconDownChevron,
  IconGroupChatBubble,
  IconHomeComputer,
  IconPeople,
  IconUser,
  IconAddPulse,
  IconWorld,
  IconUserGroup,
  IconMegaphone,
  IconHeart,
  IconBolt,
  IconBrain,
  IconFire,
  IconFingerPrint,
  IconGit,
} from "./Icons";
import { UserData } from "../interfaces";
import { LoadingSpinnerMessage } from "./Loading.tsx";
import Avatar from "../components/Avatar.tsx";
import { Link } from "react-router-dom";
import NavFriends from "./SideNaveFriendsList.tsx";
import ProfileElo from "./ProfileElo.tsx";
import { useCurrentUserData } from "../functions/customHook.tsx";
import NavConvos from "./SideMenuConvos.tsx";
import { useEffect, useState, useRef } from "react";
import NavChatRooms from "./SideMenuChatRooms.tsx";
import axios from "axios";
import { useAuth } from "../functions/useAuth.tsx";
import { io } from "socket.io-client";

type ExpendedLabel = "Messages" | "Chat Channels" | "Friends" | null;

export default function SideMenu({
  reference,
  hide,
  toggleHide,
}: {
  reference: React.RefObject<HTMLDivElement>;
  hide: boolean;
  toggleHide: () => void;
}) {
  const authContext = useAuth();

  const { data: currentUserData, isLoading, isError } = useCurrentUserData();
  const [expended, setExpended] = useState<ExpendedLabel>(null);

  if (isLoading)
    return <LoadingSpinnerMessage message="Fetching user profile" />;
  else if (isError) return <p>Error fetching data</p>;
  else
  {
    const socketOptions = {
      transportOptions: {
        polling: {
          extraHeaders: {
            User: currentUserData.login42,
          }
        }
      }
    };
    const socket = new io('http://localhost:3000/user', socketOptions);
    
    socket.on("connection", (arg: string[]) =>
    {
      console.log("current user list :");
      console.log(arg);
    })

    socket.on("updateUser", (arg: string) =>
    {
      console.log("user updated : ", arg);
    });

    socket.on("addUser", (arg: string) => 
    {
      console.log("new user logged in : ", arg);
    });

    socket.on("removeUser", (arg: string) =>
    {
      console.log("user logged out : ", arg);
    });

    socket.on("test", (arg: string) =>
    {
      console.log("test received : ", arg);
    })

  }
  return (
    <div
      ref={reference}
      className={
        "pointer-events-auto relative flex h-screen flex-grow flex-col rounded-tr-xl bg-white pb-5 pt-1 shadow-md transition-all duration-500 " +
        (hide ? "w-0 min-w-0" : "w-80 min-w-[19rem]")
      }
    >
      <button
        className={
          "absolute left-auto right-3 top-5 z-20 flex h-14 w-8 cursor-pointer rounded-xl border-slate-600 font-bold text-slate-700 transition-all duration-500 " +
          (hide ? " translate-x-14" : "")
        }
        onClick={toggleHide}
      >
        <IconDownChevron
          className={
            "pointer-events-none h-full w-full scale-125 transition-all duration-700 " +
            (hide ? "text-slate-500 " : " rotate-180 text-slate-200 ")
          }
          strokeWidth={2}
        />
      </button>
      <div className="flex h-full w-full overflow-hidden">
        <div className="flex w-full min-w-[17.5rem] flex-col overflow-hidden">
          <div className="h-fit w-full rounded-md border-b-2 border-stone-300 px-1 pb-1 shadow-md">
            <CurrentUserStats />
            <NavHighlight
              name="Play a game of Pong"
              to="/play"
              icon={IconHomeComputer}
            />
          </div>
          <div className="flex grow flex-col overflow-y-auto pl-3">
            <Category name="User" />
            <Nav
              name="My Profile"
              to={"/user/" + currentUserData.login42}
              icon={IconUser}
            />
            <Nav name="Global Ranking" to="/ranking" icon={IconWorld} />
            <Category name="Social" />
            <NavExpandable
              name="Messages"
              currentExpended={expended}
              setExpended={setExpended}
              icon={IconGroupChatBubble}
            >
              <Nav
                name="Start a new conversation"
                to="/message"
                icon={IconAddPulse}
              />
              <NavConvos currentUser={currentUserData} />
            </NavExpandable>
            <NavExpandable
              name="Chat Channels"
              currentExpended={expended}
              setExpended={setExpended}
              icon={IconUserGroup}
            >
              <Nav
                name="Join or create a chatroom"
                to="/chatroom"
                icon={IconAddPulse}
              />
              <NavChatRooms />
            </NavExpandable>
            <NavExpandable
              name="Friends"
              currentExpended={expended}
              setExpended={setExpended}
              icon={IconPeople}
            >
              <Nav name="Find new friends" to="friend" icon={IconAddPulse} />
              <NavFriends currentUser={currentUserData} />
            </NavExpandable>

            <Category name="Session Management" />
            <Nav
              name="Logout"
              to="/login"
              onClick={() => {
                  axios
                    .get<string>("/auth/logout")
                    .then((r) => {
                      r.data;
                      authContext?.logOut();
                    })
                    .catch(() => {
                      console.log("Cannot logout !")
                    })
                }
              }
              icon={IconFire}
            />

            <Category name="External Links" />
            <Nav
              name="Git repo"
              to="https://github.com/znichola/ft_transcendence_test"
              icon={IconGit}
            />
            <Nav name="Hart on github" icon={IconHeart} />
            <Category name="" />
            <TheMasterminds />
          </div>
        </div>
      </div>
    </div>
  );
}

function Category({ name }: { name: string }) {
  return (
    <div className="flex max-h-20 flex-1 grow items-center py-2 text-sm font-extralight text-slate-400">
      {name}
    </div>
  );
}

export function Nav({
  name,
  to,
  icon: Icon,
  onClick
}: {
  name: string;
  to?: string;
  icon: ({
    className,
    strokeSize,
  }: {
    className?: string;
    strokeSize?: number;
  }) => JSX.Element;
  onClick?: () => void
}) {
  return (
    <Link
      to={to || "#"}
      className="flex cursor-pointer items-center border-l-rose-600 px-4 py-2 text-sm font-medium text-slate-600 outline-none transition-all duration-100 ease-in-out hover:border-l-4 hover:border-l-rose-600 hover:text-rose-600 focus:border-l-4"
      onClick={onClick}
    >
      {Icon && <Icon />}
      <p className="pl-4">{name}</p>
    </Link>
  );
}

export function NavHighlight({
  name,
  to,
  icon: Icon,
}: {
  name: string;
  to?: string;
  icon: ({
    className,
    strokeSize,
  }: {
    className?: string;
    strokeSize?: number;
  }) => JSX.Element;
}) {
  return (
    <Link
      to={to || "#"}
      className="flex cursor-pointer items-center rounded-md bg-gradient-to-tl from-fuchsia-600 via-orange-500 to-purple-600 bg-size-200 px-4 py-2 text-sm font-medium text-slate-100 shadow-md outline-none transition-all duration-100 ease-in-out hover:bg-right-bottom focus:bg-right-bottom"
    >
      {Icon && <Icon />}
      <p className="py-1 pl-4">{name}</p>
    </Link>
  );
}

function NavExpandable({
  name,
  currentExpended,
  setExpended,
  icon: Icon,
  children,
}: {
  name: ExpendedLabel;
  currentExpended: ExpendedLabel;
  setExpended: React.Dispatch<React.SetStateAction<ExpendedLabel>>;
  icon: ({
    className,
    strokeSize,
  }: {
    className?: string;
    strokeSize?: number;
  }) => JSX.Element;
  children?: JSX.Element[];
}) {
  const [wantedHeight, setWantedHeight] = useState(0);
  const elementNumber = useRef<HTMLUListElement>(null);
  const isExpended: boolean = name == currentExpended;

  useEffect(() => {
    if (elementNumber.current) {
      setWantedHeight(elementNumber.current.childElementCount * 3);
    }
  });

  return (
    <div className="relative text-sm font-medium text-slate-600 transition">
      <button
        className={
          "relative flex w-full cursor-pointer items-center border-l-rose-600 transition-all duration-100 ease-in-out hover:border-l-4 hover:text-rose-600 " +
          (isExpended ? " border-l-4 " : "")
        }
        onClick={() => setExpended(isExpended ? null : name)}
      >
        <div className="item-center flex h-8 border-l-rose-600 px-4 py-2">
          {Icon && <Icon />}
          <p className="pl-4">{name}</p>
          <IconDownChevron
            className={
              "pointer-events-none absolute left-auto right-0 top-4 h-4 px-5 transition-all" +
              (isExpended ? " rotate-90 " : " -rotate-90 ")
            }
          />
        </div>
      </button>
      <ul
        ref={elementNumber}
        className={
          "m-2 flex flex-col overflow-y-auto rounded-xl bg-stone-50 font-medium shadow-inner transition-all duration-300"
        }
        style={{
          maxHeight:
            isExpended && children ? Math.min(wantedHeight, 24) + "rem" : "0",
        }}
      >
        {children}
      </ul>
    </div>
  );
}

function CurrentUserStats() {
  const { data: currentUserData, isLoading, isError } = useCurrentUserData();

  if (isLoading)
    return <LoadingSpinnerMessage message="Fetching user profile" />;
  if (isError) return <p>Error fetching data</p>;
  return (
    <div className="flex">
      <Avatar
        size="m-2 mb-3 mt-3 w-16 h-16"
        alt={currentUserData.name}
        status={currentUserData.status}
        img={currentUserData.avatar}
      />

      <div className="flex flex-col content-center justify-center ">
        <p className="font-semibold text-slate-700">{currentUserData.name}</p>
        <p className="text-slate-400">{"@" + currentUserData.login42}</p>
      </div>
    </div>
  );
}

function CurrentUserEloStats({ user }: { user: UserData }) {
  return (
    <div className="flex h-40 rounded-xl bg-stone-50 p-4 shadow-inner">
      <ProfileElo
        className="flex bg-green-200 "
        lineWidth={3}
        h={50}
        data={user.eloHistory.slice(-20)}
      />
    </div>
  );
}

function TheMasterminds() {
  return (
    <Link
      to="/"
      className="group mt-auto flex flex-col items-center justify-center px-4"
    >
      <IconBrain className="h-10 w-10 fill-slate-600 drop-shadow group-hover:fill-red-500" />
      <span className="italic text-slate-600 drop-shadow group-hover:text-red-500">
        les Masterminds
      </span>
    </Link>
  );
}
