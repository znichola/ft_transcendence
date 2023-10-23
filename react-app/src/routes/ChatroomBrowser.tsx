import { ErrorMessage } from "../components/ErrorComponents";
import {
  IconAdd,
  IconBashShell,
  IconCrown,
  IconLock,
} from "../components/Icons";
import { LoadingSpinnerMessage } from "../components/Loading";
import {
  useChatroomList,
  useMutPostNewChatroom,
} from "../functions/customHook";
import { IChatroomPost, IChatroom } from "../interfaces";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import BoxMenu, { ButtonGeneric } from "../components/BoxMenu";
import { UserIcon } from "../components/UserIcon";
import { Heading, InputToggle, PreHeading } from "../components/FormComponents";
import { useAuth } from "../functions/useAuth";
import { SearchComponent } from "../components/UserBrowser";

interface ISettings {
  isPublic: boolean,
  isProtected: boolean,
}

function FilterSettings({
  settings: s,
  setSettings,
}: {
  settings: ISettings;
  setSettings: (s: ISettings) => void;
}) {
  return (
    <div className="flex items-center justify-center gap-2 rounded-lg border-b-4 border-stone-200 bg-white p-3 py-8 shadow-xl">
      <InputToggle
        onLable="Public"
        offLable="Public"
        value={s.isPublic}
        onToggle={() => setSettings({ isProtected: false, isPublic: !s.isPublic })}
      />
      <InputToggle
        onLable="Protected"
        offLable="Protected"
        value={s.isProtected}
        onToggle={() => setSettings({ isProtected: !s.isProtected, isPublic: false })}
      />
    </div>
  );
}

export default function ChatroomBrowser() {
  const [searchvalue, setSearchValue] = useState<string>("");
  const [settings, setSettings] = useState<ISettings>({isPublic: false, isProtected: false});
  const [buttonState, setButtonState] = useState<string>("UNSET");

  return (
    <div className="relative flex h-full max-h-full min-h-0 w-full flex-grow-0 flex-col items-center">
      <BoxMenu
        heading={<ChatroomBrowserHeading searchValue={searchvalue} settings={settings}/>}
        resetBTN={() => setButtonState("UNSET")}
      >
        <div className="flex flex-col items-center pb-5 trnasy">
          <SearchComponent
            searchValue={searchvalue}
            setSearchValue={setSearchValue}
            buttonState={buttonState}
            setButtonState={setButtonState}
            buttonClassName="translate-y-28"
          >
            <FilterSettings settings={settings} setSettings={setSettings}/>
          </SearchComponent>
          <ButtonGeneric
            icon={IconAdd}
            setBTNstate={setButtonState}
            buttonState={buttonState}
            checked={"NEW_CHAT"}
            className="translate-y-10"
          >
            <CreateChatroomUI />
          </ButtonGeneric>
        </div>
      </BoxMenu>
      <div className="flex flex-col h-screen w-screen overflow-hidden p-3">
        <div className={"transition-all duration-500 " + (buttonState == "filter-settings" ? "min-h-[28rem]" : "min-h-[21rem]")} />
        <ListingFiltered searchValue={searchvalue} settings={settings} />
      </div>
    </div>
  );
}

function CreateChatroomUI() {
  const [chName, setChName] = useState("");
  const [password, setpassword] = useState("");
  const [isPrivate, setIsPrivate] = useState(false);
  const navigate = useNavigate();
  const newChatroom = useMutPostNewChatroom();

  const foo = useAuth();
  const cu = foo?.user || "";

  const isProtected = !isPrivate && password !== "";
  const payload: IChatroomPost = {
    ownerLogin42: cu,
    name: chName,
    status: isPrivate ? "PRIVATE" : isProtected ? "PROTECTED" : "PUBLIC",
    password: isPrivate || password == "" ? undefined : password,
  };

  return (
    <div className="flex flex-col items-center justify-center gap-2 rounded-lg border-b-4 border-stone-200 bg-white p-3 pt-4 text-slate-600 shadow-xl">
      <h2 className="p-3 text-lg text-slate-500">
        Create a space to discuss pong, spin tactics and smurfing
      </h2>
      <form
        className="flex h-full w-[32rem] flex-col gap-6 pb-4"
        onSubmit={(e) => {
          e.preventDefault();
          newChatroom.mutate(payload, {
            onSuccess(data) {
              navigate(`/chatroom/${data.id}`);
            },
          });
        }}
      >
        <div>
          <label htmlFor="channel-name-input">
            <em className="font-semibold text-rose-600">* </em>
            Channel name
          </label>
          <div className="rounded-xl border border-slate-300 p-2 focus-within:border-rose-500 ">
            <input
              id="channel-name-input"
              className="w-full outline-none placeholder:text-slate-300 focus:border-none focus:ring-0 disabled:cursor-not-allowed disabled:text-slate-200"
              type="text"
              autoComplete="off"
              placeholder="Noobish Helpdesk"
              onChange={(e) => setChName(e.currentTarget.value)}
            />
          </div>
        </div>

        <div>
          <div className="flex ">
            <div className="relative flex w-32 flex-wrap items-center">
              <input
                className="peer relative h-10 w-5 cursor-pointer appearance-none rounded-full bg-stone-200 transition-colors after:absolute after:left-0 after:top-0 after:h-5 after:w-5 after:rounded-full after:bg-stone-400 after:transition-all checked:bg-rose-200 checked:after:top-5 checked:after:bg-rose-500 hover:bg-stone-300 after:hover:bg-stone-400 checked:hover:bg-rose-300 checked:after:hover:bg-rose-500 focus:outline-none focus-visible:outline-none"
                type="checkbox"
                defaultChecked={isPrivate}
                onClick={() => setIsPrivate(isPrivate ? false : true)}
                id="id-c01"
              />
              <label
                className="w-20 cursor-pointer pl-2 font-semibold peer-disabled:cursor-not-allowed peer-disabled:text-slate-300"
                htmlFor="id-c01"
              >
                {isPrivate ? "Private" : "Public"}
              </label>
            </div>
            <div className="grow">
              <label
                htmlFor="channel-password-input"
                className={`${isPrivate ? "text-slate-300" : ""}`}
              >
                Password, optional
              </label>
              <div
                className={`rounded-xl border p-2 focus-within:border-rose-500 ${
                  isPrivate ? "border-slate-200" : "border-slate-300"
                } `}
              >
                <input
                  id="channel-password-input"
                  className={`w-full outline-none focus:border-none focus:ring-0 disabled:cursor-not-allowed disabled:text-slate-200  ${
                    isPrivate
                      ? "placeholder:text-slate-100"
                      : "placeholder:text-slate-300"
                  }`}
                  type="password"
                  placeholder="secure password"
                  disabled={isPrivate}
                  onChange={(e) => setpassword(e.currentTarget.value)}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <ChatroomCreationDescription
            isPrivate={isPrivate}
            password={password}
            chName={chName}
          />
          <button
            type="submit"
            className="flex h-12 w-min items-center justify-center rounded-xl border-b-2 border-stone-300 bg-stone-200 px-5 py-2 font-semibold text-slate-500 transition-all duration-100 hover:border-b-4 hover:border-rose-400 hover:text-rose-500"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
}

function ListingFiltered({ searchValue, settings }:{ searchValue: string, settings: ISettings,}) {
  const { data: chatrooms, isLoading, isError } = useChatroomList();

  if (isLoading)
    return <LoadingSpinnerMessage message="Loading chatrooms ..." />;
  if (isError) return <ErrorMessage message="error loading chatroom" />;

   return (
    <ul className="flex flex-col overflow-auto items-center gap-5 p-3">
      {chatrooms.map((r) =>
        r.name.toLowerCase().startsWith(searchValue.toLowerCase())
          && (!settings.isPublic || r.status == 'PUBLIC')
          && (!settings.isProtected || r.status == 'PROTECTED') ? ( //Ajouter la comparaison avec le nom du User
          <ChatroomCard key={r.id} chatroom={r} />
        ) : (
          <></>
        ),
      )}
    </ul>
  );
}

function ChatroomBrowserHeading({ searchValue, settings }:{searchValue: string, settings: ISettings}) {
  return (
    <div>
      <PreHeading text={"Looking for a " + (settings.isPublic ? "public " : settings.isProtected ? "protected " : "") + "chatroom " + (searchValue.length == 0 ? "" : "starting with " + searchValue + " ") + "?"}/>
      <Heading title="Chatrooms" />
    </div>
  );
}

function ChatroomCard({ chatroom }: { chatroom: IChatroom }) {
  return (
    <nav className="flex cursor-pointer min-w-[30rem] w-fit h-fit px-4 py-2 bg-stone-50 rounded-xl shadow-md border-b-4 font-semibold text-xl">
      <Link
        to={"/chatroom/" + chatroom.id}
        className="flex flex-grow items-center gap-2"
      >
        {
          chatroom.status == "PUBLIC" ?
            <IconBashShell className="h-6 w-6"/>
          :
            <IconLock className="h-6 w-6"/>
        }
        <span className="grow text-center min-w-0 min-h-0 max-w-xs overflow-auto px-2"> {chatroom.name}</span>
        <IconCrown className="h-7 w-7 align-middle text-amber-400" />
        <UserIcon user={chatroom.ownerLogin42} size={12}/>
      </Link>
    </nav>
  );
}

function ChatroomCreationDescription({
  isPrivate,
  password,
  chName,
}: {
  isPrivate: boolean;
  password: string;
  chName: string;
}) {
  if (chName === "") return <p className="grow">Set a channel name.</p>;
  if (isPrivate)
    return (
      <p className="grow">
        Create a <b>private</b> channel called{" "}
        <b className="gradient-hightlight">{chName}</b>, visible to only those
        you invite, and no password can be set.
      </p>
    );
  if (password === "")
    return (
      <p className="grow">
        Create a <b>public</b> channel called{" "}
        <b className="gradient-hightlight">{chName}</b>, visible to everyone on
        the site and with <b>no password</b> set.
      </p>
    );
  return (
    <p className="grow">
      Create a <b>protected</b> channel called{" "}
      <b className="gradient-hightlight">{chName}</b>, visible to everyone on
      the site and with "<b>{password}</b>" set as the password.
    </p>
  );
}
